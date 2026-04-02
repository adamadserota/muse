# How to Use This Template

## Prerequisites

Install these once on your machine before using the template:

- [Node.js 20+](https://nodejs.org) — for the frontend
- [Python 3.12+](https://python.org) — for the backend
- [uv](https://docs.astral.sh/uv/getting-started/installation/) — Python package manager (`curl -LsSf https://astral.sh/uv/install.sh | sh`)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — for containerized development

## Getting Started

1. **Clone or copy** this template folder and rename it to your project name
2. **Open it** with your AI coding tool (Claude Code, Cursor, Windsurf, Google AI Studio, etc.)
3. **The AI will ask you** "What is your app name?" — just answer and it scaffolds everything (frontend = your name, backend = your name + `api`)
4. **Start describing** what you want to build in plain language

No code to write, no config to edit. The AI creates the project structure, the code, and keeps documentation up to date.

## What the AI Does Automatically

### Agent Pipeline (for every non-trivial task)

When you ask for a feature, the AI follows this workflow automatically:

```
You: "Add a user management page"
         │
    ┌────▼─────────┐
    │ Task Planner  │  Breaks into small steps: models → API → service → UI → tests
    └────┬─────────┘
         │
    ┌────▼─────────┐
    │ Architect     │  Checks existing code, avoids duplication, proposes structure
    └────┬─────────┘
         │
    ┌────▼─────────┐
    │ Implement     │  Builds one step at a time, following rules + design system
    └────┬─────────┘
         │
    ┌────▼─────────┐
    │ Code Reviewer │  Validates against 11 quality rules (TypeScript, naming, a11y...)
    └────┬─────────┘
         │
    ┌────▼─────────┐
    │ Test Runner   │  Generates + runs tests (Vitest + pytest)
    └────┬─────────┘
         │
    ┌────▼─────────┐
    │ Architect     │  Updates ARCHITECTURE.md with what was built
    └──────────────┘
```

You just describe what you want. The AI handles planning, quality, testing, and documentation.

### What Gets Built for You

- **Design** — dark futuristic theme with cyan accents, consistent across everything
- **Code structure** — clean, organized files following best practices
- **Frontend + Backend** — the AI builds both sides when needed
- **Routing** — React Router with pages, protected routes, and 404 handling
- **Linting & formatting** — ESLint, Prettier (frontend), Ruff (backend)
- **Error handling** — error boundaries, API error handling, global exception handlers
- **Accessibility** — semantic HTML, ARIA, keyboard navigation, focus management
- **Testing setup** — Vitest + Testing Library (frontend), pytest + httpx (backend)
- **Docker** — containerized and ready to deploy
- **Architecture docs** — `ARCHITECTURE.md` maintained automatically
- **Security** — OWASP-aware security check skill available on demand

## What Happens on First Open

1. AI detects no project yet
2. Asks "What is your app name?" (e.g. `tracker`) — backend is automatically `trackerapi`
3. Creates both projects with correct structure, config, and Docker setup
4. Sets up routing, styling (Tailwind + design tokens), linting, formatting, and testing
5. Creates error handling boilerplate
6. Installs all dependencies (`npm install` + `uv sync`)
7. Creates `ARCHITECTURE.md` for each project
8. You're ready to build

## Example Prompts

### Starting a new app
- "I want to build a task management app where I can create projects and add tasks to them"
- "Build me a dashboard that shows analytics charts and a sidebar for navigation"
- "I need a contact form with name, email, message fields and it should save to a database"

### Adding features
- "Add a search bar at the top that filters the list of items"
- "I want users to be able to upload files and see them in a gallery"
- "Add a settings page where I can change my profile information"

### Changing things
- "Make the sidebar collapsible"
- "Add pagination to the list — show 10 items per page"
- "The form should show validation errors when fields are empty"

### Quality & security
- "Run a security check on my project"
- "Add tests for the item creation feature"
- "Review the API routes for best practices"

## Rules for You

- **Don't edit `.agents/`** — that's the AI agent system (rules, skills, agents)
- **Don't edit `CLAUDE.md`** — those are AI instructions (rename to `GEMINI.md` or `AGENTS.md` to switch AI tool)
- **Do describe what you want clearly** — the more specific, the better
- **Do ask for changes** — "move this here", "make this bigger", "change the layout"

## Switching AI Tool

This template is portable. The `.agents/` system works with any AI editor:

| Tool | Rename `CLAUDE.md` to |
|---|---|
| Claude Code | `CLAUDE.md` (default) |
| Gemini CLI | `GEMINI.md` |
| OpenAI Codex | `AGENTS.md` |
| Cursor | `.cursorrules` (copy content) |

The `.agents/` folder with all rules, skills, and agents stays the same.

## MCP Design System (Company)

When the centralized design system MCP server is available, set your token:

```bash
export TDW_DESIGN_TOKEN=your-employee-token
```

The `.mcp.json` is pre-configured — Claude will query the live design system automatically.

## Project Structure

After initialization:

```
your-project/
├── .agents/
│   ├── agents/              <- AI agent definitions
│   │   ├── task-planner.md   <- Breaks big tasks into steps
│   │   ├── architect.md      <- Plans structure, updates docs
│   │   ├── code-reviewer.md  <- Validates against rules
│   │   └── test-runner.md    <- Generates + runs tests
│   ├── rules/               <- Code quality rules (always active)
│   │   ├── accessibility.md
│   │   ├── api-routes.md
│   │   ├── architecture.md
│   │   ├── code-style.md
│   │   ├── database.md
│   │   ├── dependencies.md
│   │   ├── error-handling.md
│   │   ├── file-naming.md
│   │   ├── git-workflow.md
│   │   ├── state-management.md
│   │   └── testing.md
│   ├── skills/              <- Task-specific capabilities
│   │   ├── init/             <- Project scaffolding
│   │   ├── frontend/         <- React/Vite patterns
│   │   ├── backend/          <- FastAPI patterns
│   │   ├── design/           <- Design system (26 components)
│   │   ├── deployment/       <- Docker setup
│   │   ├── security-check/   <- Security audit
│   │   └── create-tests/     <- Test generation
│   └── references/          <- Shared templates + examples
├── .claude/
│   └── settings.json        <- Permissions (safe commands allowed, dangerous blocked)
├── .mcp.json                <- MCP server config (design system)
├── CLAUDE.md                <- AI instructions (don't touch)
├── README.md                <- This file
├── compose.yaml             <- Docker setup (auto-generated)
├── <name>/                  <- Frontend (created by AI)
│   ├── <name>/              <- Source code
│   │   ├── components/      <- UI components
│   │   ├── pages/           <- Route components
│   │   ├── contexts/        <- React contexts
│   │   ├── services/        <- API calls
│   │   ├── hooks/           <- Custom hooks
│   │   └── ...
│   ├── ARCHITECTURE.md      <- Frontend architecture (living doc)
│   └── compose.yaml
└── <name>api/               <- Backend (created by AI)
    ├── <name>api.py         <- API code
    ├── ARCHITECTURE.md      <- Backend architecture (living doc)
    └── compose.yaml
```
