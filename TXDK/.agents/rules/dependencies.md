# Dependency Rules

## Core Principle

**No dependency without explicit user request.** Every dependency is a liability — maintenance burden, security surface, bundle size. Use native language features first.

## Before Adding a Dependency

Ask these questions:
1. **Can the standard library do this?** (fetch, crypto, path, URL, Date)
2. **Is it < 20 lines to write ourselves?** → write it
3. **Does it pull in a large dependency tree?** → find a lighter alternative
4. **Is it actively maintained?** (last commit < 6 months, not archived)
5. **Does it have known vulnerabilities?** → check before installing

## Approved Defaults

These are pre-approved and included during init. No need to ask.

### Frontend
| Package | Purpose |
|---|---|
| react, react-dom | UI framework |
| react-router-dom | Client-side routing |
| typescript | Type safety |
| vite, @vitejs/plugin-react | Build tool |
| tailwindcss, @tailwindcss/vite | Styling |
| eslint, typescript-eslint, prettier | Code quality |
| vitest, @testing-library/react, @vitest/coverage-v8 | Testing |

### Backend
| Package | Purpose |
|---|---|
| fastapi | API framework |
| uvicorn | ASGI server |
| pydantic | Validation |
| python-dotenv | Env loading |
| ruff | Linting + formatting |
| pytest, httpx, pytest-asyncio | Testing |

## Common Requests and Approved Choices

When the user asks for these features, use these libraries (don't invent alternatives):

| Need | Frontend | Backend |
|---|---|---|
| Routing | react-router-dom | — |
| Charts | recharts | — |
| Data tables | @tanstack/react-table | — |
| Icons | lucide-react | — |
| Date handling | date-fns | python-dateutil |
| Form validation | (native + Zod if complex) | Pydantic (built-in) |
| File upload | (native FormData) | python-multipart |
| WebSocket | (native WebSocket) | websockets |
| Database | — | asyncpg (Postgres) or aiosqlite |
| Rate limiting | — | slowapi |
| HTTP client | (native fetch) | httpx |
| Markdown | react-markdown | markdown |

## Rules

1. **Lock versions** — always use exact versions in `package.json` and `pyproject.toml`
2. **Audit before install** — `npm audit` (frontend) / `uv run pip audit` (backend) after adding packages
3. **One library per concern** — don't install 3 date libraries
4. **Remove unused deps** — if a dependency is no longer imported, remove it
5. **No polyfills for modern targets** — we target Node 20+ and evergreen browsers
6. **Dev dependencies are separate** — testing/linting tools go in devDependencies
