---
name: security-check
description: >
  Audit a project for security vulnerabilities — injection, auth bypass,
  exposed secrets, unsafe dependencies, CORS misconfig, XSS, and OWASP
  Top 10 issues. Use when the user asks for a security review, audit,
  or before deployment to production.
---

# Security Check

Audit the project against common vulnerability patterns. Read references for detailed checklists.

## Workflow

1. Read `references/server.md` — check backend security
2. Read `references/api-routes.md` — check API-level security
3. Read `references/frontend.md` — check frontend security
4. Scan all source files for issues
5. Report findings with severity and fix recommendations

## Report Format

```markdown
## Security Audit — {Project Name}

### Critical (fix immediately)
- [ ] Finding description → Fix: what to do

### High (fix before deploy)
- [ ] Finding description → Fix: what to do

### Medium (fix soon)
- [ ] Finding description → Fix: what to do

### Low (improve when possible)
- [ ] Finding description → Fix: what to do

### Passed Checks
- [x] Check that passed
```

## Quick Checklist

| Area | Check |
|---|---|
| Secrets | No hardcoded keys, passwords, tokens in source code |
| SQL | All queries parameterized |
| CORS | Origins restricted (not `*` in production) |
| Auth | Tokens validated server-side, not just client |
| Input | All user input validated (Pydantic, Zod) |
| Headers | Security headers present (CSP, HSTS, X-Frame) |
| Dependencies | No known vulnerabilities (`npm audit`, `uv run pip audit`) |
| Errors | No stack traces or internals exposed to clients |
| Files | No sensitive files in git (.env, credentials, keys) |
| HTTPS | Enforced in production |

## Rules

- **Be thorough** — check every file, not just the obvious ones
- **Prioritize by impact** — SQL injection > missing header
- **Provide fixes** — don't just point out problems
- **No false confidence** — if you can't verify something, say so
- **Check .gitignore** — ensure sensitive files are excluded
