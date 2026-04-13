# Muse

*Your muse, your music.*

A songwriting companion that makes [Suno AI](https://suno.com) match what's actually in your head. Describe a feeling, a genre, an artist you love, a verse you've already started — Muse turns it into Suno-ready prompts, lyrics, a style tag, and matching album art.

## What it does

1. **You describe** — a song idea in plain language, or picks from a genre menu, or paste some lyrics you're working on.
2. **Muse composes** — talks to Gemini with prompts tuned for Suno v5.5 and returns lyrics, a style string, an exclusion string, and song analysis.
3. **You iterate** — regenerate any section, pin songs you love, edit inputs and regenerate, or export to a text file. Album covers generate on demand.

## Quick start

```bash
git clone https://github.com/adamadserota/muse.git
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

## Deploying to Vercel

Muse is designed to deploy cleanly to Vercel with zero configuration beyond clicking through the import flow. Everything (frontend build, Python serverless functions, CORS, rewrites) is already described in `vercel.json`. **No environment variables are needed** — Gemini keys come from the client.

### Option A: Vercel dashboard (recommended, 2 minutes)

1. Go to **https://vercel.com/new** (sign in with your GitHub account if prompted).
2. Click **"Import Git Repository"** and select **`adamadserota/muse`**. If the repo doesn't appear, click *"Adjust GitHub App Permissions"* and grant access.
3. On the configuration screen Vercel should auto-detect:
   - **Framework preset:** Other (reads `vercel.json` directly — don't change)
   - **Root directory:** `./`
   - **Build command:** `cd frontend && npm run build` (pre-filled from `vercel.json`)
   - **Output directory:** `frontend/dist` (pre-filled from `vercel.json`)
   - **Install command:** `cd frontend && npm install` (pre-filled)
   - **Environment variables:** leave empty
4. Click **Deploy**. First build takes ~90 seconds (installs Node deps + Python runtime for the API functions).
5. When it finishes you'll get a URL like `muse-<hash>.vercel.app`. Click it — you should see the Welcome screen.

That's it. Every push to `main` from now on auto-deploys.

### Option B: Vercel CLI (if you prefer a terminal)

```bash
npm i -g vercel          # or use pnpm / brew etc.
cd /path/to/muse
vercel login             # opens browser
vercel link              # choose: create new project, name "muse", scope your personal account
vercel --prod            # first deploy
```

Vercel reads `vercel.json` and deploys. Subsequent `git push origin main` deploys happen automatically.

### Custom domain

After the first deploy, in the Vercel dashboard go to **Project → Settings → Domains** and add your domain. Vercel handles HTTPS certs automatically.

### Why no env vars?

Muse is **BYO-key** by design. The backend reads the Gemini key from an `X-Gemini-API-Key` request header on every call; it is not stored on the server side. When you visit the deployed app, you paste your own Gemini key once, it sits in your browser's localStorage, and travels with each request. Nothing is logged server-side. This means:

- The deploy needs zero secrets.
- Anyone who visits your deployment uses their own key, not yours.
- Cost and quota follow the visitor's Google AI Studio account, not yours.

If you later want a hosted mode (your key, restricted to allowed origins), that would require a small code change — speak up and we can add it.

## Tech

- **Frontend:** React 19, TypeScript, Vite, Material UI (Material Design 3)
- **Backend:** Python, FastAPI (dev) + Vercel serverless (prod)
- **LLM:** Google Gemini + Imagen
- **Storage:** browser `localStorage` only

## License

MIT
