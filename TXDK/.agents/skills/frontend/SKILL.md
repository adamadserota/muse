---
name: frontend
description: >
  Frontend project structure and patterns — Vite 6, React 19, TypeScript,
  Tailwind CSS. Use when creating a new frontend app, adding React
  components, setting up routing, services, or types. For UI styling,
  also activate the design skill.
---

# Frontend Spec

## Stack

| Tool | Version |
|---|---|
| Vite | 6.x |
| React | 19.x |
| React Router | 7.x |
| TypeScript | 5.8+ |
| Tailwind CSS | 4.x via `@tailwindcss/vite` + design system tokens |
| Plugin | `@vitejs/plugin-react` |
| Linting | ESLint 9+ (`typescript-eslint`) |
| Formatting | Prettier 3+ |
| Testing | Vitest + Testing Library |

## Project Structure

```
<app>/
├── <app>/              # Source root
│   ├── index.html
│   ├── index.css        # Tailwind imports + design tokens (@theme)
│   ├── index.tsx        # Renders <App /> with BrowserRouter
│   ├── App.tsx          # Root component (ErrorBoundary + Routes)
│   ├── components/      # One component per file, PascalCase
│   │   ├── ErrorBoundary.tsx  # Always present
│   ├── pages/           # Route components, PascalCase
│   │   └── HomePage.tsx
│   ├── contexts/        # React contexts
│   ├── services/        # API calls — never inline in components
│   │   └── apiClient.ts # Shared fetch wrapper with error handling
│   ├── hooks/           # Custom hooks (useItems, etc.)
│   ├── types.ts         # Shared TypeScript types
│   ├── vite.config.ts   # Build + test config (includes @tailwindcss/vite)
│   ├── tsconfig.json
│   ├── eslint.config.js # Linting rules
│   ├── .prettierrc      # Formatting rules
│   ├── .env.example     # Documented env vars
│   ├── test-setup.ts    # Test environment setup
│   └── package.json
├── compose.yaml         # Docker wrapper
└── <app>.compose.yaml   # App-specific compose
```

## Routing

- **Router:** `react-router-dom` with `<BrowserRouter>` wrapping `<App />` in `index.tsx`
- **Pages:** route components in `pages/`, PascalCase — one per route
- **Layout:** shared layout component wrapping `<Outlet />` for persistent nav/sidebar
- **Navigation:** use `<Link>` and `useNavigate()`, never `<a href>` for internal links
- **404 handling:** add a catch-all `<Route path="*" element={<NotFoundPage />} />` route

## Patterns

- **Components:** one per file in `components/`, PascalCase, named exports
- **Pages:** route-level components in `pages/`, PascalCase, one per route
- **Services:** API calls isolated in `services/`, using `apiClient.ts` — never inline in components
- **Hooks:** reusable logic in `hooks/`, prefixed with `use`
- **Contexts:** shared state in `contexts/`, one context per domain
- **Types:** shared in `types.ts`, component-local types co-located
- **Config:** env vars via `import.meta.env`, local overrides in `env.local`
- **No CSS files** — Tailwind utility classes only (per design system), tokens defined via `@theme` in `index.css`
- **Imports:** absolute paths via Vite alias when configured
- **Error handling:** ErrorBoundary at root, loading/error/empty states for all async operations
- **Toast notifications:** use toast component (see design skill) for CRUD action feedback — success on create/update/delete, error on failure
- **Background tasks:** for long-running operations, use `useBackgroundTask` hook pattern from `.agents/references/background-tasks.md` — poll status, show progress bar, toast on completion

## Related Rules

Always follow these rules when working on frontend code:

- **`rules/code-style.md`** — TypeScript conventions, ESLint, Prettier
- **`rules/error-handling.md`** — ErrorBoundary, ApiError, loading/error/success states
- **`rules/state-management.md`** — useState vs context vs hooks decision tree
- **`rules/file-naming.md`** — PascalCase components, camelCase services/hooks
- **`rules/testing.md`** — Vitest + Testing Library patterns
- **`rules/accessibility.md`** — semantic HTML, ARIA, keyboard navigation, focus management
- **`rules/dependencies.md`** — approved packages, no unnecessary deps

## Rules

- No dependencies without explicit user request
- Minimal `package.json` — no utility libs for things JS does natively
- All styling follows the `design` skill — this spec covers structure only
- Named exports only — no `export default`
- Function components only — no class components (except ErrorBoundary)
- Destructure props in function signatures
- Keep components under 150 lines — extract sub-components if longer

## ARCHITECTURE.md

Every frontend project MUST have `ARCHITECTURE.md` at its root. Use `.agents/references/architecture-template.md` as the format. Read it before working, update it after any structural change.
