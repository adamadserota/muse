---
name: init
description: >
  Scaffold a new full-stack project — create frontend (Vite + React + TS)
  and backend (FastAPI + Python) directories with Docker Compose setup,
  linting, formatting, testing, and error handling boilerplate.
  Use when the project has no app folders yet (only .agents/, .md files,
  and compose.yaml), or when the user asks to initialize or scaffold a
  new project.
---

# Project Initialization

Run this when NO project folders exist yet (only `.agents/`, `.md` files, and `compose.yaml`).

## Steps

1. **Ask the user one question:** "What is your app name?" (e.g. `dashboard`, `tracker`, `portal`)
   - Frontend = `<name>`
   - Backend = `<name>api`

2. **Create frontend** (`<name>/`) — read the `frontend` skill and follow its spec:
   - `<name>/<name>/` source root with `index.html`, `index.tsx`, `App.tsx`, `types.ts`
   - `components/`, `services/`, `hooks/`, `pages/`, `contexts/` directories
   - Read `references/frontend-boilerplate.md` for: package.json, vite config, routing, Tailwind setup, error handling
   - `<name>.compose.yaml` + wrapper `compose.yaml`
   - `ARCHITECTURE.md` from `.agents/references/architecture-template.md`

3. **Create backend** (`<name>api/`) — read the `backend` skill and follow its spec:
   - `<name>api.py` with FastAPI app (using `lifespan`), CORS, `/health` route, global exception handlers
   - Read `references/backend-boilerplate.md` for: pyproject.toml config, Ruff setup, error models
   - `env.local` template + `.env.example` with documented variables
   - `<name>api.compose.yaml` + wrapper `compose.yaml`
   - `ARCHITECTURE.md` from `.agents/references/architecture-template.md`

4. **Update root `compose.yaml`:**
   ```yaml
   include:
     - <name>/compose.yaml
     - <name>api/compose.yaml
   ```

5. **Install dependencies:**
   - Frontend: `npm install` (in `<name>/<name>/`)
   - Backend: `uv sync` (in `<name>api/`)

6. **Create `.env.example` files:**
   - Frontend: `VITE_API_URL=http://localhost:8000`
   - Backend: `CORS_ORIGIN=http://localhost:5173`, `DATABASE_URL=data.db`

7. **Mark done** — add `<!-- INITIALIZED: <name> / <name>api -->` at top of CLAUDE.md

If project folders already exist (besides `.agents/`), skip initialization entirely.
