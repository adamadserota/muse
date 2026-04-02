# Architecture — Dashboard

> **This is a living document.** Update it after every structural change. AI agents and developers read this FIRST before touching any code.

## Overview

Internal analytics dashboard showing real-time metrics, user management, and system health.

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Language | TypeScript | 5.8 |
| Framework | React | 19.1 |
| Build tool | Vite | 6.2 |
| Runtime | Node | 22 |
| Styling | Tailwind CSS | 4.1 |
| Routing | React Router | 7.5 |
| Charts | Recharts | 2.15 |
| Testing | Vitest + Testing Library | 3.1 |

## Project Structure

```
dashboard/dashboard/
├── index.html              # HTML entry
├── index.tsx               # React root + BrowserRouter
├── index.css               # Tailwind + design tokens
├── App.tsx                 # Route definitions
├── types.ts                # Shared TypeScript types
├── components/
│   ├── ErrorBoundary.tsx   # Global error boundary
│   ├── MetricCard.tsx      # KPI display card
│   ├── DataTable.tsx       # Sortable data table
│   └── Sidebar.tsx         # Navigation sidebar
├── pages/
│   ├── HomePage.tsx        # Dashboard overview with charts
│   ├── UsersPage.tsx       # User management CRUD
│   └── SettingsPage.tsx    # App configuration
├── services/
│   ├── apiClient.ts        # apiFetch wrapper + ApiError class
│   ├── metricsService.ts   # GET /api/v1/metrics endpoints
│   └── usersService.ts     # CRUD /api/v1/users endpoints
├── hooks/
│   ├── useMetrics.ts       # Fetch + cache metrics data
│   └── useUsers.ts         # Fetch + cache user data
└── contexts/
    └── ThemeContext.tsx     # Theme state (dark/light)
```

## Patterns

- **Routing:** React Router with `<Routes>` in App.tsx. Pages in `pages/`, each maps to one route.
- **State:** useState for local UI, Context for shared state, custom hooks for server data.
- **API calls:** All through `services/apiClient.ts` → typed service functions → consumed by hooks.
- **Data flow:** Component → hook → service → apiClient → backend → response → hook state → component re-render.
- **Error handling:** ErrorBoundary wraps App. Services throw ApiError. Components show loading/error/empty states.

## Key Decisions

| Decision | Why |
|---|---|
| Custom hooks over React Query | Small scope, no complex caching needs yet |
| Recharts for charts | Lightweight, React-native, good dark theme support |
| No global state library | Small scope, Context is enough for shared state |
| Services layer | Keeps API logic out of components, easy to mock for tests |

## Conventions

- **Naming:** PascalCase components, camelCase functions/hooks, UPPER_CASE env vars
- **File org:** one component per file, services separate from UI, hooks wrap services
- **Env vars:** `VITE_API_URL` from `.env.local`, accessed via `import.meta.env`
- **Testing:** Vitest + Testing Library. Tests co-located: `Component.test.tsx` next to `Component.tsx`

## API Surface

| Route | Page |
|---|---|
| `/` | HomePage — dashboard overview |
| `/users` | UsersPage — user management |
| `/settings` | SettingsPage — app config |

## Change Log

| Date | Change | Why |
|---|---|---|
| 2026-03-25 | Project initialized | — |
| 2026-03-25 | Added MetricCard + chart integration | KPI display requirement |
| 2026-03-26 | Added UsersPage with CRUD | User management feature |
| 2026-03-27 | Added ThemeContext + dark/light toggle | User preference support |
