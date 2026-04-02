# Architecture Rules

These rules apply to EVERY project generated from this template. They are non-negotiable.

## Core Principles

1. **Read before write** — always read `ARCHITECTURE.md` before touching any code
2. **Update after change** — update `ARCHITECTURE.md` after every structural change (new routes, components, dependencies, patterns)
3. **Single responsibility** — each file does one thing well
4. **Explicit over implicit** — no magic, no hidden behavior, no clever tricks
5. **Minimal abstraction** — don't create abstractions until you have 3+ concrete uses

## Layer Separation

```
Frontend                          Backend
┌─────────────────────┐          ┌─────────────────────┐
│ Components (UI only) │          │ Routes (HTTP only)   │
│   ↓ calls            │          │   ↓ calls            │
│ Services (API calls) │  ←HTTP→  │ Handlers (logic)     │
│   ↓ uses             │          │   ↓ calls            │
│ Types (shared types) │          │ Models (data shapes)  │
└─────────────────────┘          └─────────────────────┘
```

- **Components** never make API calls directly — always through services
- **Routes** never contain business logic — delegate to handler functions
- **Types/Models** are the contract between layers — change them first when refactoring

## Project Structure Rules

- Every project has `ARCHITECTURE.md` at its root
- Frontend source lives in `<app>/<app>/` with `components/`, `services/`, `hooks/`
- Backend starts as single file, splits at ~300 lines or clear domain boundaries
- Shared types/models are the source of truth for data shapes
- Config via environment variables, never hardcoded values

## When to Split Files

| Signal | Action |
|---|---|
| File > 300 lines | Split into modules by domain |
| 3+ components share logic | Extract to a custom hook |
| 3+ routes share validation | Extract to middleware |
| Function does 2 unrelated things | Split into 2 functions |

## When NOT to Abstract

- Only 1-2 uses → keep it inline
- "Just in case" → don't build for hypothetical futures
- Wrapper adds no logic → call the original directly
- Helper is < 3 lines → inline it
