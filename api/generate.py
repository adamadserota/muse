"""Vercel Serverless Function — /api/generate

Gemini-only. Requires the client to send the user's key as `X-Gemini-API-Key`.
"""

import json
import sys
import os
from http.server import BaseHTTPRequestHandler

# Make _shared importable
sys.path.insert(0, os.path.dirname(__file__))

from _shared.prompts import PROMPTS
from _shared.parser import parse_full_response

VALID_MODES = {
    "lyrics", "theme_oneshot", "builder_oneshot",
}

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

        mode = body.get("mode", "")
        user_input = body.get("input", "")
        model = body.get("model", "gemini-3.1-pro-preview")

        if mode not in VALID_MODES:
            self._error(400, f"Invalid mode: {mode}")
            return
        if not user_input or len(user_input) > 10000:
            self._error(400, "Input must be 1-10000 characters")
            return

        system_prompt = PROMPTS.get(mode)
        if not system_prompt:
            self._error(400, f"Unknown mode: {mode}")
            return

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
            if "api key" in lowered or "401" in error_msg or "403" in error_msg:
                self._error(401, "Invalid Gemini API key")
                return
            if "429" in error_msg or "resource_exhausted" in lowered or "quota" in lowered or "rate limit" in lowered:
                self._error(429, "Gemini API quota exceeded — check your plan and billing")
                return
            self._error(502, f"Gemini API error: {error_msg}")
            return

        parsed = parse_full_response(raw_text)

        result = {
            "styles": parsed["styles"],
            "exclude_styles": parsed["exclude_styles"],
            "lyrics": parsed["lyrics"],
            "plain_lyrics": parsed["plain_lyrics"],
            "analysis": parsed["analysis"],
        }

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
