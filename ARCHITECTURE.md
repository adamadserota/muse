# Muse — Architecture

*Your muse, your music.* — a personal songwriting partner for Suno AI, built as a public app with bring-your-own Gemini API key.

## At a glance

- **Frontend** — React 19 + TypeScript + Vite + Material UI (Material Design 3). Single-page app with bottom-nav and three destinations: **Library / Create / Settings**.
- **Backend** — Python 3.12. Two shapes of the same logic:
  - `dev-server/` — FastAPI for local development (`uv run python server.py` on :8094).
  - `api/` — Vercel serverless functions (`BaseHTTPRequestHandler`) for production.
- **LLM** — Google Gemini (`google-genai`). Users supply their own API key; the backend is entirely stateless and holds no keys.
- **Storage** — Browser `localStorage` only. No database, no central cache.

## Directory map

```
muse/                                   (repo root — filesystem folder still named SunoBrain_Public)
├── api/                                Vercel serverless functions (prod)
│   ├── generate.py                     POST /api/generate → Gemini
│   ├── regenerate.py                   POST /api/regenerate → Gemini (per-section)
│   ├── album-cover.py                  POST /api/album-cover → Imagen
│   └── _shared/
│       ├── prompts.py                  System prompts per mode
│       └── parser.py                   Delimiter-based response parser
├── dev-server/                         FastAPI dev server (mirror of api/ logic)
│   ├── server.py                       All endpoints, Gemini calls
│   ├── prompts.py                      (identical to api/_shared/prompts.py)
│   ├── parser.py                       (identical to api/_shared/parser.py)
│   └── pyproject.toml                  uv-managed; single dep: google-genai
├── frontend/                           React app
│   ├── App.tsx                         Root: onboarding + bottom-nav + tab orchestration
│   ├── index.tsx                       ThemeModeProvider + ThemeProvider + CssBaseline
│   ├── index.html                      Minimal shell
│   ├── index.css                       Global reset + transitional --fui-* compat
│   ├── types.ts                        Shared types (SongEntry, GenerateResponse, etc.)
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── theme/
│   │   ├── theme.ts                    M3 light + dark theme factories
│   │   └── ThemeContext.tsx            system/light/dark mode state
│   ├── services/
│   │   └── apiClient.ts                fetch wrapper; injects X-Gemini-API-Key
│   ├── hooks/
│   │   ├── useGenerate.ts              generation state machine (one-shot only)
│   │   ├── useSongLibrary.ts           library: rolling 10 + unlimited pinned
│   │   ├── useSavedStyles.ts           reusable style-prompt presets
│   │   └── useLocalStorage.ts          tiny JSON wrapper
│   ├── utils/
│   │   └── songTitle.ts                extractSongTitle helper
│   └── components/
│       ├── WelcomeScreen.tsx           first-launch hero + feature cards
│       ├── ApiKeyModal.tsx             blocking dialog that collects Gemini key
│       ├── GuidedTour.tsx              popover-based 4-step walkthrough
│       ├── LibraryView.tsx             Pinned + Recent sections
│       ├── SongCard.tsx                clickable card with pin toggle
│       ├── SongDetailView.tsx          back + actions menu + OutputPanel
│       ├── SettingsView.tsx            theme / key / model / library / help
│       ├── InputPanel.tsx              TopModeToggle + Oneshot|Builder
│       ├── OneshotPanel.tsx            single textarea + Generate (MUI)
│       ├── BuilderPanel.tsx            Simple (idea + genre) + Advanced accordion (MUI)
│       ├── TopModeToggle.tsx           MUI ToggleButtonGroup
│       ├── LoadingView.tsx             full-viewport spinner + cycling messages
│       ├── OutputPanel.tsx             renders the generated blueprint (container: MUI)
│       ├── AlbumCover.tsx              on-demand Imagen cover (ephemeral client state)
│       ├── StyleOutput.tsx             style-prompt section with regenerate + save
│       ├── LyricsOutput.tsx
│       ├── ExcludeOutput.tsx
│       ├── AnalysisSection.tsx
│       ├── PlainLyricsOutput.tsx
│       ├── SongTitle.tsx               inline-editable title
│       ├── SavedStylesDrawer.tsx
│       ├── BuilderSection.tsx
│       ├── GenreSelector.tsx
│       ├── CharCount.tsx
│       ├── CollapsibleCard.tsx
│       ├── LoadingAnimation.tsx        (legacy, still used inside OutputPanel empty cases)
│       └── ErrorBoundary.tsx
├── CLAUDE.md                           AI assistant project instructions
├── README.md                           User-facing intro + quick start
├── ARCHITECTURE.md                     This file
├── vercel.json                         Build + rewrites + CORS
├── requirements.txt                    Vercel Python deps (just google-genai)
└── .vercel/                            Vercel project binding (needs regen for new project)
```

## Data model

```ts
SongEntry {
    id: string                          // crypto.randomUUID()
    mode: 'oneshot' | 'builder'
    oneshotInput?: string
    builderInputs?: BuilderInputs       // 5 fields (inspiration, genres, styleInfluences, lyricInput, exclusions)
    result: GenerateResponse            // lyrics, styles, exclude_styles, plain_lyrics, analysis
    songTitle?: string                  // extracted from [Title: ...] in lyrics
    pinned: boolean
    createdAt: string                   // ISO
    updatedAt?: string                  // ISO, set on edit or section regenerate
}
```

Album covers are **not** persisted. They're regenerated on demand from the SongDetailView.

## Backend contract

All three endpoints require the header `X-Gemini-API-Key: <user's key>`. Missing header → `401 Gemini API key required`. Keys are never logged server-side; they only flow from request → Gemini and back.

| Endpoint | Purpose |
|---|---|
| `POST /api/generate` | Generate a full song from theme/lyrics/builder input |
| `POST /api/regenerate` | Regenerate a single section (`styles`, `exclude_styles`, `lyrics`, `analysis`) |
| `POST /api/album-cover` | Generate a square album-cover image via Imagen |

Only one-shot modes exist: `lyrics`, `theme_oneshot`, `builder_oneshot`. The two-step draft-review flow was removed entirely.

## localStorage keys

| Key | Value | Set by |
|---|---|---|
| `muse-gemini-key` | User's Gemini API key | `ApiKeyModal`, `SettingsView` |
| `muse-model` | Selected Gemini variant | `SettingsView` |
| `muse-theme-mode` | `system` / `light` / `dark` | `ThemeContext` |
| `muse-onboarding-complete` | Boolean — has the user finished (or skipped) the tour | `App.tsx` |
| `muse-songs` | `SongEntry[]` | `useSongLibrary` |
| `muse-saved-styles` | `SavedStyle[]` (reusable style presets) | `useSavedStyles` |

## Design system

Material Design 3 via `@mui/material@^9`. Theme factory is in `frontend/theme/theme.ts`:

- Seed primary: cyan/teal (`#00696F` light, `#52D7DE` dark) — echoes the legacy brand.
- Typography: Roboto Flex Variable (self-hosted via `@fontsource-variable/roboto-flex`).
- Shape: `borderRadius: 12` (M3 medium).
- Light + dark surface/on-surface colors, all other tokens derived by MUI from primary.

Every component uses MUI theme tokens and the `sx` prop. There are no design tokens in `index.css` — only a reset + scrollbar styling. The legacy `--fui-*` compatibility layer was removed once all output components were migrated.

## Build & deploy

- Local dev: `cd frontend && npm run dev` (Vite on :5205) + `cd dev-server && uv run python server.py` (FastAPI on :8094).
- Production: Vercel project pointed at repo root. `vercel.json` builds from `frontend/` and exposes `api/*.py` as serverless functions.
- No environment variables required — keys come from the browser.
