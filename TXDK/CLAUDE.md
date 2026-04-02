# Project Instructions

## First Run

If NO project folders exist yet (only `.agents/`, config files, `compose.yaml`):
read `.agents/skills/init/SKILL.md` and follow it before doing anything else.

If project folders exist: skip init. Read the relevant `ARCHITECTURE.md` before working.

## Agent Workflow

For any non-trivial task, follow this pipeline automatically:

1. **Plan** — read `.agents/agents/task-planner.md`. Break big tasks into small sequential steps. Never start coding a large feature in one shot.
2. **Architect** — read `.agents/agents/architect.md`. Check existing code for duplication, propose structure.
3. **Implement** — one sub-task at a time. Follow the skill + rules below.
4. **Review** — spawn a subagent (Agent tool) with the code-reviewer role. Pass it the changed files and relevant rules. It reviews in an isolated context and returns a report. Fix any Critical issues before proceeding.
5. **Test** — spawn a subagent (Agent tool) with the test-runner role. Pass it the changed files and test skill references. It writes + runs tests in an isolated context and returns results. Fix failures.
6. **Update** — update `ARCHITECTURE.md` with any structural changes.

For trivial tasks (rename, small fix, one-liner): skip the pipeline, just do it.

## Context Management

Steps 4 (Review) and 5 (Test) MUST run as isolated subagents using the Agent tool. This is automatic — never ask the user.

- **Why:** non-technical users won't notice context degradation on large features. Isolated subagents get a fresh context window, ensuring review and test quality stays consistent regardless of how much code has been generated.
- **What to pass the subagent:** the agent markdown file content, relevant rule/skill files, and the list of changed/created files with their paths.
- **Planning and implementation** (steps 1-3) stay in the main conversation — they need full project context.
- **Review and test subagents can run in parallel** when they don't depend on each other (e.g., after all Critical review issues are fixed, run tests in a subagent while continuing to the next sub-task).

## Rules (Always Active)

Rules in `.agents/rules/` apply to ALL work at ALL times. Read the relevant rule before starting a task.

| Rule | When |
|---|---|
| `architecture` | Structural changes |
| `api-routes` | API endpoints |
| `file-naming` | New files/dirs |
| `code-style` | Any code |
| `testing` | Tests |
| `error-handling` | Error handling |
| `state-management` | Frontend state |
| `database` | Persistence/queries |
| `dependencies` | Installing packages |
| `accessibility` | Interactive UI |
| `git-workflow` | Commits/branches |

All rules are in `.agents/rules/{name}.md`. Read only what applies to the current task.

## Skill Router

Classify the task, then read ONLY the matching skill. Never load all skills at once.

| Task | Skill | Also read |
|---|---|---|
| UI / styling | `.agents/skills/design/SKILL.md` | — |
| Frontend structure | `.agents/skills/frontend/SKILL.md` | `design` if touching UI |
| Backend / API | `.agents/skills/backend/SKILL.md` | — |
| Docker / Compose | `.agents/skills/deployment/SKILL.md` | — |
| Full-stack feature | `frontend` + `backend` | `design` for UI parts |
| New project scaffold | `.agents/skills/init/SKILL.md` | — |
| Security audit | `.agents/skills/security-check/SKILL.md` | — |
| Tests | `.agents/skills/create-tests/SKILL.md` | — |
| Background / async tasks | `.agents/skills/backend/SKILL.md` | `.agents/references/background-tasks.md` |

## Non-Technical Prompts

When the user describes what they want in plain language:

1. Determine scope — frontend, backend, or both
2. Build both sides automatically if the feature needs data — don't ask, just do it
3. Use `design` skill for every UI element — no arbitrary colors, fonts, or spacing
4. Follow the infrastructure skill for file structure and patterns
5. Follow relevant rules for code quality, naming, and error handling
6. Update `ARCHITECTURE.md` after any structural change

## Priority

1. **Rules always apply** — baseline for all code quality
2. **Design always wins** for visual decisions — colors, fonts, spacing, shadows come only from the design skill
3. **Infrastructure = structure only** — file layout, patterns, tooling. Never appearance
4. **Minimal loading** — activate only what the task requires

## ARCHITECTURE.md

Every project folder MUST have `ARCHITECTURE.md` at its root.

- **Before work:** read it first
- **After structural changes:** update immediately
- **If missing:** create from `.agents/references/architecture-template.md`

## General

- Clean, minimal code — no over-engineering
- Follow existing patterns within each project
- Services in `services/` — never inline API calls in components
- One component per file in `components/`
- No dependencies without user request
- Dark theme, Chakra Petch, cyan primary, sharp edges — always
- Handle errors gracefully — loading, error, empty states for every async operation
- Write tests for new features when requested
