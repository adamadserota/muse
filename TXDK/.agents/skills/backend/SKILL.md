---
name: backend
description: >
  Backend project structure and patterns — Python 3.12+, FastAPI, Uvicorn,
  Pydantic v2, uv package manager. Use when creating API routes, Python
  modules, Pydantic models, or backend logic.
---

# Backend Spec

## Stack

| Tool | Detail |
|---|---|
| Python | 3.12+ |
| FastAPI | 0.135+ |
| Uvicorn | ASGI server |
| Pydantic | v2 — request/response validation |
| Package manager | `uv` (pyproject.toml + uv.lock) |
| Env loading | `python-dotenv` from `env.local` |
| Linting | Ruff (replaces black, isort, flake8) |
| Testing | pytest + httpx + pytest-asyncio |

## Project Structure

```
<api>/
├── <api>.py             # Main app — FastAPI, routes, middleware, error handlers
├── pyproject.toml       # Dependencies + ruff + pytest config
├── uv.lock              # Lockfile
├── env.local            # Local env vars (not committed)
├── compose.yaml         # Docker wrapper
├── <api>.compose.yaml   # App-specific compose
├── test_<api>.py        # Tests (when created)
└── *.py                 # Additional modules when needed
```

## Patterns

- **Single-file default:** one `<api>.py` file. Split at ~300 lines or clear domain boundaries
- **App init:** `app = FastAPI(lifespan=lifespan)` with async context manager for startup/shutdown
- **CORS:** always add `CORSMiddleware` with appropriate origins
- **Models:** Pydantic `BaseModel` for all request/response schemas
- **Env vars:** `os.getenv()` + `dotenv` for local dev
- **Naming:** snake_case everywhere (files, functions, variables, endpoints)
- **Errors:** global exception handler + HTTPException with error response model
- **Logging:** `logging.getLogger('uvicorn.error')`
- **Error responses:** standard `{"error": {"code": "...", "message": "...", "details": [...]}}` shape
- **Background tasks:** for long-running operations, follow `.agents/references/background-tasks.md` — return 202, poll for status, track progress 0-100

## Related Rules

Always follow these rules when working on backend code:

- **`rules/api-routes.md`** — URL conventions, HTTP methods, request/response format
- **`rules/code-style.md`** — Python conventions, Ruff config
- **`rules/error-handling.md`** — global exception handler, error response model
- **`rules/database.md`** — SQLite/PostgreSQL patterns, migrations, parameterized queries
- **`rules/file-naming.md`** — snake_case modules, PascalCase models
- **`rules/testing.md`** — pytest + httpx patterns
- **`rules/dependencies.md`** — approved packages, no unnecessary deps

## Rules

- No dependencies without explicit user request
- Minimal `pyproject.toml`
- No ORMs unless already in use — raw queries or simple clients preferred
- This spec covers structure only — no UI decisions
- Always include global exception handlers (see `rules/error-handling.md`)
- Always validate request bodies with Pydantic models
- Always use parameterized queries — never string interpolation in SQL

## ARCHITECTURE.md

Every backend project MUST have `ARCHITECTURE.md` at its root. Use `.agents/references/architecture-template.md` as the format. Read it before working, update it after any structural change.
