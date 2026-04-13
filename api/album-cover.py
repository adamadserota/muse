"""Vercel Serverless Function — /api/album-cover

Gemini Imagen only. Requires the client to send the user's key as `X-Gemini-API-Key`.
"""

import json
import base64
import sys
import os
from http.server import BaseHTTPRequestHandler

sys.path.insert(0, os.path.dirname(__file__))

from _shared.prompts import ALBUM_COVER_PROMPT

ALLOWED_ORIGINS = {
    "https://muse.vercel.app",
    "http://localhost:5205",
}


def _sanitize_error(msg: str, api_key: str) -> str:
    if api_key and api_key in msg:
        msg = msg.replace(api_key, "[REDACTED]")
    return msg


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self._cors_headers()
        self.end_headers()

    def do_POST(self):
        api_key = (self.headers.get("X-Gemini-API-Key") or "").strip()
        if not api_key:
            self._error(401, "Gemini API key required")
            return

        try:
            content_length = int(self.headers.get("Content-Length", 0))
            body = json.loads(self.rfile.read(content_length))
        except Exception:
            self._error(400, "Invalid JSON body")
            return

        plain_lyrics = body.get("plain_lyrics", "")
        styles = body.get("styles", "")
        model = body.get("model", "imagen-4.0-ultra-generate-001")

        if not plain_lyrics or len(plain_lyrics) > 10000:
            self._error(400, "plain_lyrics must be 1-10000 characters")
            return

        prompt = ALBUM_COVER_PROMPT.format(
            plain_lyrics=plain_lyrics[:2000],
            styles=styles[:500] if styles else "cinematic, moody, atmospheric",
        )

        try:
            from google import genai

            client = genai.Client(api_key=api_key)
            response = client.models.generate_images(
                model=model,
                prompt=prompt,
                config=genai.types.GenerateImagesConfig(
                    number_of_images=1,
                    aspect_ratio="1:1",
                ),
            )

            if not response.generated_images:
                self._error(502, "No image was generated")
                return

            image = response.generated_images[0].image
            image_b64 = base64.b64encode(image.image_bytes).decode("utf-8")

            result = {
                "image_base64": image_b64,
                "mime_type": image.mime_type or "image/png",
            }

            self.send_response(200)
            self._cors_headers()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())

        except Exception as e:
            error_msg = _sanitize_error(str(e), api_key)
            lowered = error_msg.lower()
            if "api key" in lowered or "401" in error_msg or "403" in error_msg:
                self._error(401, "Invalid Gemini API key")
                return
            if "429" in error_msg or "resource_exhausted" in lowered or "quota" in lowered:
                self._error(429, "Gemini API quota exceeded — check your plan and billing")
                return
            self._error(502, f"Imagen API error: {error_msg}")

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
