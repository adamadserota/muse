# Muse

Your muse, your music — a personal songwriting partner that makes Suno AI match what's actually in your head.

## Stack

- **`frontend/`** — React 19 + TypeScript + Vite + Material UI (Material Design 3)
- **`dev-server/`** — FastAPI, local development only (run via `uv run python server.py`)
- **`api/`** — Python serverless functions deployed on Vercel (mirror of `dev-server/` logic)
- **LLM** — Google Gemini. Users supply their own API key; it's never stored server-side.

## Architecture at a glance

- Frontend sends the user's Gemini key as `X-Gemini-API-Key` header on every request.
- Backend reads the header per request and forwards to Google. No server-side key store, no fallback.
- All persisted state lives in the user's browser `localStorage` under `muse-*` keys.
- No database, no central image storage. Album covers are ephemeral client-side state.

See `ARCHITECTURE.md` for the full structural map (kept in sync with the code).

## Working locally

```bash
# Frontend
cd frontend
npm install
npm run dev          # http://localhost:5205

# Backend (separate terminal)
cd dev-server
uv sync
uv run python server.py   # http://localhost:8094
```

Open the frontend, paste a Gemini API key when prompted (get one at https://aistudio.google.com/apikey), and start creating.

## Conventions

- **Exports:** named exports only, no `export default`.
- **Components:** one per file, function components, props destructured in the signature.
- **State:** `useState` for local, custom hooks wrapping `useLocalStorage` for persisted.
- **Styling:** Material UI theme tokens only. No inline hex colors, font stacks, or spacing values.
- **API:** all network calls go through `frontend/services/apiClient.ts`. Never inline `fetch` in components.
- **Errors:** every async operation shows loading, error, and empty states.
- **Security:** keep the API key on the client. Never log request headers. Never return the key in responses.

## Localstorage keys

| Key | Purpose |
|-----|---------|
| `muse-gemini-key` | User's Gemini API key |
| `muse-model` | Selected Gemini model variant |
| `muse-theme-mode` | `system` / `light` / `dark` |
| `muse-onboarding-complete` | Tour completion flag |
| `muse-songs` | Song library (rolling 10 + pinned favorites) |
| `muse-saved-styles` | Saved style presets |

## Backend contract

All three endpoints require `X-Gemini-API-Key` header. 401 if missing.

- `POST /api/generate` — main generation (oneshot or builder mode)
- `POST /api/regenerate` — regenerate a single section (styles, exclude_styles, lyrics, analysis)
- `POST /api/album-cover` — generate album artwork via Imagen
