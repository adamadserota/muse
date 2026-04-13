"""Vercel Serverless Function — /api/regenerate

Gemini-only. Requires the client to send the user's key as `X-Gemini-API-Key`.
"""

import json
import sys
import os
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.dirname(__file__))

from _shared.prompts import PROMPTS
from _shared.parser import parse_single_section

VALID_SECTIONS = {"styles", "exclude_styles", "lyrics", "analysis"}

SECTION_TO_PROMPT = {
    "styles": "regen_styles",
    "exclude_styles": "regen_exclude",
    "lyrics": "regen_lyrics",
    "analysis": "regen_analysis",
}

ALLOWED_ORIGINS = {
    "https://muse.vercel.app",
    "http://localhost:5205",
}


def _sanitize_error(msg: str, api_key: str) -> str:
    if api_key and api_key in msg:
        msg = msg.replace(api_key, "[REDACTED]")
    return msg


def build_user_input(section: str, context: dict) -> str:
    analysis = context.get("analysis", {}) or {}
    analysis_text = (
        f"Vibe DNA: {analysis.get('vibe_dna', '')}\n"
        f"Phonetic Mapping: {analysis.get('phonetic_mapping', '')}\n"
        f"Semantic Weight: {analysis.get('semantic_weight', '')}"
    )

    if section == "styles":
        return (
            f"Current lyrics:\n{context.get('lyrics', '')}\n\n"
            f"Current analysis:\n{analysis_text}\n\n"
            f"Generate a fresh, alternative style prompt for this song."
        )
    if section == "exclude_styles":
        return (
            f"Current styles: {context.get('styles', '')}\n\n"
            f"Current lyrics:\n{context.get('lyrics', '')}\n\n"
            f"Generate fresh exclusion terms to protect this track's sonic identity."
        )
    if section == "lyrics":
        return (
            f"Current styles: {context.get('styles', '')}\n\n"
            f"Current excluded styles: {context.get('exclude_styles', '')}\n\n"
            f"Current analysis:\n{analysis_text}\n\n"
            f"Compose entirely new lyrics matching this sonic blueprint."
        )
    # analysis
    return (
        f"Current lyrics:\n{context.get('lyrics', '')}\n\n"
        f"Current styles: {context.get('styles', '')}\n\n"
        f"Perform a fresh, deep analysis of this song."
    )


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self._cors_headers()
        self.end_headers()

    def do_POST(self):
        api_key = (self.headers.get("X-Gemini-API-Key") or "").strip().strip('"').strip("'").strip()
        if not api_key:
            self._error(401, "Gemini API key required")
            return

        try:
            content_length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(content_length))
        except Exception:
            self._error(400, "Invalid JSON body")
            return

        section = body.get("section", "")
        context = body.get("context", {})
        model = body.get("model", "gemini-3.1-pro-preview")

        if section not in VALID_SECTIONS:
            self._error(400, f"Invalid section: {section}")
            return

        prompt_key = SECTION_TO_PROMPT[section]
        system_prompt = PROMPTS.get(prompt_key)
        if not system_prompt:
            self._error(400, f"No prompt for section: {section}")
            return

        user_input = build_user_input(section, context)

        try:
            from google import genai

            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(
                model=model,
                contents=user_input,
                config=genai.types.GenerateContentConfig(
                    system_instruction=system_prompt,
                ),
            )
            raw_text = response.text
        except Exception as e:
            error_msg = _sanitize_error(str(e), api_key)
            lowered = error_msg.lower()
            if (
                "api_key_invalid" in lowered
                or "api key not valid" in lowered
                or "invalid api key" in lowered
                or "unauthenticated" in lowered
                or "invalid authentication" in lowered
            ):
                self._error(401, "Invalid Gemini API key")
                return
            if "permission_denied" in lowered or "permission denied" in lowered or "not authorized" in lowered:
                self._error(
                    403,
                    "Your Gemini API key doesn't have access to this model. "
                    "Preview models (e.g. Gemini 3.1 Pro) may require allow-listed access — "
                    "try switching models in Settings. Details: " + error_msg,
                )
                return
            if "not_found" in lowered or "is not found for api version" in lowered or "not supported for" in lowered:
                self._error(
                    404,
                    f"Model unavailable for this API key. Try switching models in Settings. Details: {error_msg}",
                )
                return
            if "429" in error_msg or "resource_exhausted" in lowered or "quota" in lowered or "rate limit" in lowered:
                self._error(429, "Gemini API quota exceeded — check your plan and billing")
                return
            self._error(502, f"Gemini API error: {error_msg}")
            return

        result = parse_single_section(raw_text, section)

        self.send_response(200)
        self._cors_headers()
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(result).encode())

    def _cors_headers(self):
        origin = self.headers.get("Origin", "")
        if origin in ALLOWED_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
        self.send_header("Access-Control-Allow-Headers", "content-type, x-gemini-api-key")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")

    def _error(self, status: int, detail: str):
        self.send_response(status)
        self._cors_headers()
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({"detail": detail}).encode())
