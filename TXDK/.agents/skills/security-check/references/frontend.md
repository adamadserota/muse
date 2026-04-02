# Frontend Security Checklist

## Cross-Site Scripting (XSS)

- [ ] **No `dangerouslySetInnerHTML`** unless absolutely necessary
  ```typescript
  // ❌ XSS risk
  <div dangerouslySetInnerHTML={{ __html: userInput }} />

  // ✅ Safe — React auto-escapes
  <div>{userInput}</div>
  ```

- [ ] **If innerHTML is required** — sanitize with DOMPurify
  ```typescript
  import DOMPurify from "dompurify";
  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
  ```

- [ ] **No user input in `href` without validation** — prevent `javascript:` URLs
  ```typescript
  // ❌ XSS via javascript: protocol
  <a href={userProvidedUrl}>Link</a>

  // ✅ Validate protocol
  const safeUrl = url.startsWith("http") ? url : "#";
  <a href={safeUrl}>Link</a>
  ```

- [ ] **No user input in `eval()`, `Function()`, or `setTimeout(string)`** — ever

## Token & Secret Storage

- [ ] **No secrets in frontend code** — no API keys, no private tokens in JS bundles
- [ ] **Auth tokens in httpOnly cookies** (preferred) — not accessible to JS
- [ ] **If localStorage is used** — understand the XSS risk (any XSS steals tokens)
- [ ] **No tokens in URL parameters** — they leak in logs, referrer headers, browser history
- [ ] **Environment variables prefixed correctly** — only `VITE_` vars are bundled

```typescript
// ✅ Safe — only public config
const API_URL = import.meta.env.VITE_API_URL;

// ❌ Will NOT work (and shouldn't) — not prefixed
const SECRET = import.meta.env.SECRET_KEY; // undefined in browser
```

## Forms & User Input

- [ ] **All forms have validation** — both client-side (UX) and server-side (security)
- [ ] **File upload validates type and size** on frontend AND backend
- [ ] **Search inputs sanitized** — no raw SQL/regex patterns sent to backend
- [ ] **Auto-complete off for sensitive fields** — `autoComplete="off"` for passwords, tokens

## Third-Party Dependencies

- [ ] **Run `npm audit`** — check for known vulnerabilities
- [ ] **No CDN scripts** — all dependencies via npm, not `<script src="cdn...">`
- [ ] **Review bundle size** — unexpected large bundles may indicate unwanted transitive deps
- [ ] **No unused dependencies** — reduce attack surface

## Network Security

- [ ] **API base URL from environment** — not hardcoded
  ```typescript
  // ✅ Configurable
  const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // ❌ Hardcoded
  const API = "https://api.myapp.com";
  ```

- [ ] **HTTPS in production** — no mixed content
- [ ] **No sensitive data in query strings** — use POST body or headers
- [ ] **Fetch errors handled gracefully** — no leaked error details to UI

## Content Security

- [ ] **Images validate source** — don't load arbitrary URLs without proxy/validation
- [ ] **Downloads validate type** — don't auto-download unknown file types
- [ ] **iframes restricted** — `sandbox` attribute if iframes are used
- [ ] **No open redirects** — validate redirect URLs against whitelist

## Build & Deploy

- [ ] **Source maps disabled in production** — don't expose source code
  ```typescript
  // vite.config.ts
  export default defineConfig({
      build: { sourcemap: false },
  });
  ```

- [ ] **No console.log with sensitive data** — strip in production build
- [ ] **Environment-specific configs** — dev defaults never used in production
