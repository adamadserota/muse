# Muse

*Your muse, your music.*

A songwriting companion that makes [Suno AI](https://suno.com) match what's actually in your head. Describe a feeling, a genre, an artist you love, a verse you've already started — Muse turns it into Suno-ready prompts, lyrics, a style tag, and matching album art.

## What it does

1. **You describe** — a song idea in plain language, or picks from a genre menu, or paste some lyrics you're working on.
2. **Muse composes** — talks to Gemini with prompts tuned for Suno v5.5 and returns lyrics, a style string, an exclusion string, and song analysis.
3. **You iterate** — regenerate any section, pin songs you love, edit inputs and regenerate, or export to a text file. Album covers generate on demand.

## Quick start

```bash
git clone https://github.com/aserota/muse.git
cd muse

# Frontend
cd frontend
npm install
npm run dev

# Backend (new terminal)
cd ../dev-server
uv sync
uv run python server.py
```

Open http://localhost:5205 and follow the welcome flow.

## Bring your own Gemini key

Muse never stores API keys server-side. Your Gemini key lives in your browser's `localStorage` and is sent as an `X-Gemini-API-Key` header on each request. The backend forwards it to Google and never logs it.

Get a free Gemini API key at https://aistudio.google.com/apikey.

## Deploying

Designed for Vercel. Push to a repo connected to a Vercel project — the frontend builds from `frontend/` and the Python serverless functions in `api/` deploy together. No environment variables needed (keys come from the client).

## Tech

- **Frontend:** React 19, TypeScript, Vite, Material UI (Material Design 3)
- **Backend:** Python, FastAPI (dev) + Vercel serverless (prod)
- **LLM:** Google Gemini + Imagen
- **Storage:** browser `localStorage` only

## License

MIT
