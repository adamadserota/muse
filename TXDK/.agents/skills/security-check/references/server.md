# Server Security Checklist

## Environment & Secrets

- [ ] **No hardcoded secrets** — all sensitive values via environment variables
- [ ] **env.local is gitignored** — verify in `.gitignore`
- [ ] **No secrets in Docker compose** — use env files or Docker secrets, not inline values
- [ ] **Different secrets per environment** — dev/staging/prod have different keys
- [ ] **No secrets in logs** — check logging statements for accidental token/password output

### What to look for
```python
# ❌ Hardcoded secret
SECRET_KEY = "my-secret-key-123"
DB_PASSWORD = "admin123"

# ✅ Environment variable
SECRET_KEY = os.getenv("SECRET_KEY")
assert SECRET_KEY, "SECRET_KEY environment variable required"
```

## Dependencies

- [ ] **Run `npm audit`** (frontend) — check for known vulnerabilities
- [ ] **Run `uv run pip audit`** (backend) — check for known vulnerabilities
- [ ] **No wildcard versions** — pin exact versions in lock files
- [ ] **Review new dependencies** — check package reputation before installing

## Server Configuration

- [ ] **CORS restricted** — `allow_origins` should list specific domains, not `["*"]`
  ```python
  # ❌ Open to all origins
  allow_origins=["*"]

  # ✅ Restricted
  allow_origins=[os.getenv("CORS_ORIGIN", "http://localhost:5173")]
  ```

- [ ] **Rate limiting** — protect auth endpoints and expensive operations
  ```python
  from slowapi import Limiter
  limiter = Limiter(key_func=get_remote_address)

  @app.post("/api/v1/auth/login")
  @limiter.limit("5/minute")
  async def login(): ...
  ```

- [ ] **Request size limits** — prevent large payload attacks
- [ ] **Timeouts configured** — prevent slow-loris attacks
- [ ] **Debug mode OFF in production** — no debug=True, no verbose errors

## Security Headers

Add via middleware or reverse proxy:

```python
@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    # Add CSP and HSTS in production
    return response
```

## Authentication & Sessions

- [ ] **Passwords hashed with bcrypt** — never stored in plaintext
  ```python
  from passlib.hash import bcrypt
  hashed = bcrypt.hash(password)
  verified = bcrypt.verify(password, hashed)
  ```

- [ ] **JWT tokens have expiry** — short-lived access tokens (15-60 min)
- [ ] **Refresh tokens stored securely** — httpOnly cookies, not localStorage
- [ ] **Token validation on every protected route** — not just client-side
- [ ] **Logout invalidates tokens** — server-side blacklist or short expiry

## File Uploads

- [ ] **Validate file type** — check MIME type AND extension
- [ ] **Limit file size** — reject before reading into memory
- [ ] **Sanitize filenames** — strip path traversal (`../`), special characters
- [ ] **Store outside webroot** — never serve uploaded files directly from source directory
- [ ] **Virus scan** — for production systems handling user uploads

## Docker Security

- [ ] **Non-root user** in Dockerfile — `USER nonroot`
- [ ] **Minimal base images** — `python:3.12-slim`, `node:20-alpine`
- [ ] **No secrets in build args** — use runtime env vars or Docker secrets
- [ ] **Read-only filesystem** where possible — `read_only: true` in compose
- [ ] **Resource limits** — memory and CPU limits in compose
