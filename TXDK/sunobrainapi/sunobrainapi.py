"""SunoBrain API — Suno v5.5 lyric optimization engine powered by Gemini."""

import base64
import logging
from contextlib import asynccontextmanager
from typing import Literal

from google import genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

from parser import parse_draft_response, parse_full_response
from prompts import PROMPTS, ALBUM_COVER_PROMPT

logger = logging.getLogger("sunobrainapi")
logging.basicConfig(level=logging.INFO)


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------

class GenerateRequest(BaseModel):
    mode: Literal[
        "lyrics", "theme_oneshot", "theme_draft", "optimize_draft",
        "builder_oneshot", "builder_draft",
    ]
    input: str = Field(..., min_length=1, max_length=10000)
    api_key: str = Field(..., min_length=1)
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


class AlbumCoverRequest(BaseModel):
    plain_lyrics: str = Field(..., min_length=1, max_length=10000)
    song_title: str = Field(default="UNTITLED")
    styles: str = Field(default="")
    api_key: str = Field(..., min_length=1)
    model: str = Field(default="imagen-4.0-ultra-generate-001")


class AlbumCoverResponse(BaseModel):
    image_base64: str
    mime_type: str


class ErrorDetail(BaseModel):
    field: str | None = None
    message: str


class ErrorBody(BaseModel):
    code: str
    message: str
    details: list[ErrorDetail] = []


# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("SunoBrain API starting on port 8094")
    yield
    logger.info("SunoBrain API shutting down")


app = FastAPI(
    title="SunoBrain API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5205"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    return {"status": "ok", "service": "sunobrainapi"}


@app.post("/api/generate", response_model=GenerateResponse)
async def generate(req: GenerateRequest):
    system_prompt = PROMPTS.get(req.mode)
    if not system_prompt:
        raise HTTPException(status_code=400, detail=f"Unknown mode: {req.mode}")

    try:
        client = genai.Client(api_key=req.api_key)
        response = client.models.generate_content(
            model=req.model,
            contents=req.input,
            config=genai.types.GenerateContentConfig(
                system_instruction=system_prompt,
            ),
        )
        raw_text = response.text
    except Exception as e:
        error_msg = str(e)
        if "API key" in error_msg or "401" in error_msg or "403" in error_msg:
            raise HTTPException(status_code=401, detail="Invalid Gemini API key")
        logger.error(f"Gemini API error: {e}", exc_info=True)
        raise HTTPException(status_code=502, detail=f"Gemini API error: {error_msg}")

    if req.mode in ("theme_draft", "builder_draft"):
        parsed = parse_draft_response(raw_text)
    else:
        parsed = parse_full_response(raw_text)

    return GenerateResponse(
        styles=parsed["styles"],
        exclude_styles=parsed["exclude_styles"],
        lyrics=parsed["lyrics"],
        plain_lyrics=parsed["plain_lyrics"],
        analysis=AnalysisOutput(**parsed["analysis"]),
    )


@app.post("/api/album-cover", response_model=AlbumCoverResponse)
async def album_cover(req: AlbumCoverRequest):
    prompt = ALBUM_COVER_PROMPT.format(
        plain_lyrics=req.plain_lyrics[:2000],
        styles=req.styles[:500] if req.styles else "cinematic, moody, atmospheric",
    )

    try:
        client = genai.Client(api_key=req.api_key)
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
        error_msg = str(e)
        if "API key" in error_msg or "401" in error_msg or "403" in error_msg:
            raise HTTPException(status_code=401, detail="Invalid Gemini API key")
        logger.error(f"Imagen API error: {e}", exc_info=True)
        raise HTTPException(status_code=502, detail=f"Imagen API error: {error_msg}")
