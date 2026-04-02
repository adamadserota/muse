---
name: deployment
description: >
  Docker and Docker Compose deployment setup. Use when creating or
  modifying Dockerfiles, compose files, container configuration,
  or environment variable setup.
---

# Deployment Spec

## Stack

| Tool | Detail |
|---|---|
| Docker | Containerized apps |
| Docker Compose | Orchestration |
| Compose files | Per-app `<name>.compose.yaml` + wrapper `compose.yaml` |

## Compose Pattern

Each project has two compose files:

```
<project>/
├── compose.yaml              # Wrapper — includes the app compose
└── <project>.compose.yaml    # Actual service definition
```

Wrapper includes the specific file:
```yaml
include:
  - <project>.compose.yaml
```

## Naming

- Service names match project directory names
- Compose files: `<project>.compose.yaml`
- Infrastructure compose: `infrastructure.compose.yaml` (shared services like DBs, caches)
- Env files: `infrastructure.compose.env`, `env.local`

## Frontend Dockerfile

Multi-stage: build with Node, serve with nginx.

```dockerfile
# <name>/<name>/Dockerfile

# ── Stage 1: build ──────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Stage 2: serve ──────────────────────────────────────────────
FROM nginx:alpine AS serve
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf` alongside the Dockerfile:
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # SPA fallback — all routes served by index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## Backend Dockerfile

```dockerfile
# <name>api/Dockerfile
FROM python:3.12-slim

# Non-root user for security
RUN useradd --create-home --shell /bin/bash app
WORKDIR /home/app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Install dependencies (cached layer)
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev

# Copy source
COPY --chown=app:app . .

USER app

EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

CMD ["uv", "run", "uvicorn", "<name>api:app", "--host", "0.0.0.0", "--port", "8000"]
```

Replace `<name>api:app` with the actual module name (e.g. `trackerapi:app`).

## Frontend Compose

```yaml
# <name>/<name>.compose.yaml
services:
  <name>:
    build:
      context: ./<name>
      dockerfile: Dockerfile
    ports:
      - "5173:80"
    environment:
      - VITE_API_URL=${VITE_API_URL:-http://localhost:8000}
    restart: unless-stopped
```

## Backend Compose

```yaml
# <name>api/<name>api.compose.yaml
services:
  <name>api:
    build:
      context: ./<name>api
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    env_file:
      - ./<name>api/env.local
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
```

## Infrastructure Compose (PostgreSQL)

When using PostgreSQL in production, add a shared infrastructure compose:

```yaml
# infrastructure.compose.yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${DB_NAME:-appdb}
      POSTGRES_USER: ${DB_USER:-app}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-devpassword}
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-app}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

Include from root `compose.yaml`:
```yaml
include:
  - infrastructure.compose.yaml
  - <name>/compose.yaml
  - <name>api/compose.yaml
```

## Rules

- One service per compose file
- Minimal images — `slim`/`alpine` bases only
- Non-root user in every backend Dockerfile (`USER app`)
- Env vars via env files, never hardcoded in compose
- Expose only necessary ports
- Healthcheck on every service — compose `depends_on` uses them for ordering
- `restart: unless-stopped` on all production services
