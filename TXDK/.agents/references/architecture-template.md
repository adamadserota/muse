# Architecture — {Project Name}

> **This is a living document.** Update it after every structural change. AI agents and developers read this FIRST before touching any code.
>
> See `.agents/references/architecture-example.md` for a filled-in example.

## Overview

One-line description of what this project does.

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Language | TypeScript / Python | x.x |
| Framework | React / FastAPI | x.x |
| Build tool | Vite / uv | x.x |
| Runtime | Node / Uvicorn | x.x |
| Key libs | — | x.x |

## Project Structure

```
<project>/
├── file.ext          # What this file does
├── directory/        # What lives here
└── ...
```

## Patterns

- **Routing:** how routes/pages are organized
- **State:** how state is managed (React state, stores, context) — frontend only
- **API calls:** where and how external/internal APIs are called
- **Data flow:** request → processing → response path
- **Error handling:** how errors are caught and surfaced

## Key Decisions

| Decision | Why |
|---|---|
| — | — |

## Conventions

- **Naming:** snake_case (Python) / PascalCase components + camelCase functions (TypeScript)
- **File org:** one component per file, services separate from UI
- **Env vars:** how config is loaded
- **Testing:** approach and tools

## API Surface

| Method / Route | Purpose |
|---|---|
| `GET /health` | Health check |

## Change Log

| Date | Change | Why |
|---|---|---|
| {init date} | Project initialized | — |
