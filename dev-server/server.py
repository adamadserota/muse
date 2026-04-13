"""Muse API — local development server.

All requests require an X-Gemini-API-Key header. The key is provided per-request
by the client (stored in the user's browser localStorage). No server-side key store.
"""

from __future__ import annotations

import base64
import logging
from contextlib import asynccontextmanager
from typing import Literal, Optional

from google import genai
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from parser import parse_full_response, parse_single_section
from prompts import PROMPTS, ALBUM_COVER_PROMPT

logger = logging.getLogger("muse-server")
logging.basicConfig(level=logging.INFO)


# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------

class GenerateRequest(BaseModel):
    mode: Literal[
        "lyrics", "theme_oneshot", "builder_oneshot",
    ]
    input: str = Field(..., min_length=1, max_length=10000)
    model: str = Field(default="gemini-3.1-pro-preview")


class AnalysisOutput(BaseModel):
    vibe_dna: str = ""
    phonetic_mapping: str = ""
    semantic_weight: str = ""


class GenerateResponse(BaseModel):
    styles: str = ""
    exclude_styles: str = ""
    lyrics: str = ""
    plain_lyrics: str = ""
    analysis: AnalysisOutput = AnalysisOutput()


class RegenerateContext(BaseModel):
    styles: str = ""
    exclude_styles: str = ""
    lyrics: str = ""
    plain_lyrics: str = ""
    analysis: AnalysisOutput = AnalysisOutput()


class RegenerateRequest(BaseModel):
    section: Literal["styles", "exclude_styles", "lyrics", "analysis"]
    context: RegenerateContext
    model: str = Field(default="gemini-3.1-pro-preview")


class RegenerateResponse(BaseModel):
    styles: Optional[str] = None
    exclude_styles: Optional[str] = None
    lyrics: Optional[str] = None
    plain_lyrics: Optional[str] = None
    analysis: Optional[AnalysisOutput] = None


class AlbumCoverRequest(BaseModel):
    plain_lyrics: str = Field(..., min_length=1, max_length=10000)
    song_title: str = Field(default="UNTITLED")
    styles: str = Field(default="")
    model: str = Field(default="imagen-4.0-ultra-generate-001")


class AlbumCoverResponse(BaseModel):
    image_base64: str
    mime_type: str


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Muse API starting on port 8094")
    yield
    logger.info("Muse API shutting down")


app = FastAPI(
    title="Muse API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5205"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["content-type", "x-gemini-api-key"],
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _require_api_key(api_key: Optional[str]) -> str:
    """Validate the X-Gemini-API-Key header is present and non-empty.

    Strips whitespace AND any surrounding single/double quotes — a common copy-paste
    artifact that otherwise causes Google to reject the key as invalid.
    """
    if not api_key:
        raise HTTPException(status_code=401, detail="Gemini API key required")
    cleaned = api_key.strip().strip('"').strip("'").strip()
    if not cleaned:
        raise HTTPException(status_code=401, detail="Gemini API key required")
    return cleaned


def _sanitize_error(msg: str, api_key: str) -> str:
    """Remove the user's API key from any error message text."""
    if api_key and api_key in msg:
        msg = msg.replace(api_key, "[REDACTED]")
    return msg


def _handle_llm_error(e: Exception, api_key: str) -> HTTPException:
    """Map a Gemini exception to an HTTPException with a user-friendly message."""
    error_msg = _sanitize_error(str(e), api_key)
    lowered = error_msg.lower()

    # Auth failure — must be a specific signal, not just the phrase "api key" appearing somewhere.
    if (
        "api_key_invalid" in lowered
        or "api key not valid" in lowered
        or "invalid api key" in lowered
        or "unauthenticated" in lowered
        or "invalid authentication" in lowered
    ):
        return HTTPException(status_code=401, detail="Invalid Gemini API key")

    # Permission denied — the key works but can't access this model/feature.
    if "permission_denied" in lowered or "permission denied" in lowered or "not authorized" in lowered:
        logger.error(f"Gemini permission error: {error_msg}", exc_info=True)
        return HTTPException(
            status_code=403,
            detail=(
                "Your Gemini API key doesn't have access to this model. "
                "Preview models (e.g. Gemini 3.1 Pro) may require allow-listed access — "
                "try switching models in Settings. Details: " + error_msg
            ),
        )

    # Model not found / unsupported.
    if "not_found" in lowered or "is not found for api version" in lowered or "not supported for" in lowered:
        logger.error(f"Gemini model error: {error_msg}", exc_info=True)
        return HTTPException(
            status_code=404,
            detail=f"Model unavailable for this API key. Try switching models in Settings. Details: {error_msg}",
        )

    if "429" in error_msg or "resource_exhausted" in lowered or "quota" in lowered or "rate limit" in lowered:
        return HTTPException(
            status_code=429,
            detail="Gemini API quota exceeded — check your plan and billing at https://ai.dev",
        )
    logger.error(f"Gemini API error: {error_msg}", exc_info=True)
    return HTTPException(status_code=502, detail=f"Gemini API error: {error_msg}")


def call_gemini(model: str, system_prompt: str, user_input: str, api_key: str) -> str:
    """Call Gemini generate_content with the user-supplied API key."""
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model=model,
        contents=user_input,
        config=genai.types.GenerateContentConfig(
            system_instruction=system_prompt,
        ),
    )
    return response.text


# ---------------------------------------------------------------------------
# Exception handlers
# ---------------------------------------------------------------------------

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"error": {"code": "INTERNAL_ERROR", "message": "An unexpected error occurred"}},
    )


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/health")
async def health():
    return {"status": "ok", "service": "muse-server"}


@app.post("/api/generate", response_model=GenerateResponse)
async def generate(
    req: GenerateRequest,
    x_gemini_api_key: Optional[str] = Header(default=None, alias="x-gemini-api-key"),
):
    api_key = _require_api_key(x_gemini_api_key)

    system_prompt = PROMPTS.get(req.mode)
    if not system_prompt:
        raise HTTPException(status_code=400, detail=f"Unknown mode: {req.mode}")

    try:
        raw_text = call_gemini(req.model, system_prompt, req.input, api_key)
    except HTTPException:
        raise
    except Exception as e:
        raise _handle_llm_error(e, api_key)

    parsed = parse_full_response(raw_text)

    return GenerateResponse(
        styles=parsed["styles"],
        exclude_styles=parsed["exclude_styles"],
        lyrics=parsed["lyrics"],
        plain_lyrics=parsed["plain_lyrics"],
        analysis=AnalysisOutput(**parsed["analysis"]),
    )


@app.post("/api/regenerate", response_model=RegenerateResponse)
async def regenerate(
    req: RegenerateRequest,
    x_gemini_api_key: Optional[str] = Header(default=None, alias="x-gemini-api-key"),
):
    api_key = _require_api_key(x_gemini_api_key)

    section_to_prompt = {
        "styles": "regen_styles",
        "exclude_styles": "regen_exclude",
        "lyrics": "regen_lyrics",
        "analysis": "regen_analysis",
    }

    prompt_key = section_to_prompt.get(req.section)
    system_prompt = PROMPTS.get(prompt_key)
    if not system_prompt:
        raise HTTPException(status_code=400, detail=f"Unknown section: {req.section}")

    ctx = req.context
    analysis_text = (
        f"Vibe DNA: {ctx.analysis.vibe_dna}\n"
        f"Phonetic Mapping: {ctx.analysis.phonetic_mapping}\n"
        f"Semantic Weight: {ctx.analysis.semantic_weight}"
    )

    if req.section == "styles":
        user_input = (
            f"Current lyrics:\n{ctx.lyrics}\n\n"
            f"Current analysis:\n{analysis_text}\n\n"
            f"Generate a fresh, alternative style prompt for this song."
        )
    elif req.section == "exclude_styles":
        user_input = (
            f"Current styles: {ctx.styles}\n\n"
            f"Current lyrics:\n{ctx.lyrics}\n\n"
            f"Generate fresh exclusion terms to protect this track's sonic identity."
        )
    elif req.section == "lyrics":
        user_input = (
            f"Current styles: {ctx.styles}\n\n"
            f"Current excluded styles: {ctx.exclude_styles}\n\n"
            f"Current analysis:\n{analysis_text}\n\n"
            f"Compose entirely new lyrics matching this sonic blueprint."
        )
    else:  # analysis
        user_input = (
            f"Current lyrics:\n{ctx.lyrics}\n\n"
            f"Current styles: {ctx.styles}\n\n"
            f"Perform a fresh, deep analysis of this song."
        )

    try:
        raw_text = call_gemini(req.model, system_prompt, user_input, api_key)
    except HTTPException:
        raise
    except Exception as e:
        raise _handle_llm_error(e, api_key)

    result = parse_single_section(raw_text, req.section)
    return RegenerateResponse(**result)


@app.post("/api/album-cover", response_model=AlbumCoverResponse)
async def album_cover(
    req: AlbumCoverRequest,
    x_gemini_api_key: Optional[str] = Header(default=None, alias="x-gemini-api-key"),
):
    api_key = _require_api_key(x_gemini_api_key)

    prompt = ALBUM_COVER_PROMPT.format(
        plain_lyrics=req.plain_lyrics[:2000],
        styles=req.styles[:500] if req.styles else "cinematic, moody, atmospheric",
    )

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_images(
            model=req.model,
            prompt=prompt,
            config=genai.types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio="1:1",
            ),
        )

        if not response.generated_images:
            raise HTTPException(status_code=502, detail="No image was generated")

        image = response.generated_images[0].image
        image_b64 = base64.b64encode(image.image_bytes).decode("utf-8")

        return AlbumCoverResponse(
            image_base64=image_b64,
            mime_type=image.mime_type or "image/png",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise _handle_llm_error(e, api_key)


# ---------------------------------------------------------------------------
# Dev entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8094)
