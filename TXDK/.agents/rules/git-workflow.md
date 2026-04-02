# Git Workflow Rules

## Commit Messages

Format: `<type>: <description>`

```
feat: add user profile page
fix: correct date parsing for UTC timestamps
refactor: extract auth middleware from main app
test: add tests for item creation endpoint
docs: update ARCHITECTURE.md with new routes
style: format code with prettier
chore: update dependencies
```

### Types
| Type | When |
|---|---|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or updating tests |
| `docs` | Documentation changes |
| `style` | Formatting, linting fixes (no code change) |
| `chore` | Maintenance (deps, config, build) |

### Rules
- **Lowercase**, no period at end
- **Imperative mood** — "add feature" not "added feature" or "adds feature"
- **Under 72 characters** for the first line
- **Body optional** — add when the "why" isn't obvious from the code

## Branching

```
main              ← production-ready, always deployable
  └── feat/xxx    ← feature branches, short-lived
  └── fix/xxx     ← bug fix branches
```

- **Branch from main**, merge back to main
- **Short-lived branches** — merge within days, not weeks
- **Delete branches** after merging

## When to Commit

- After completing a logical unit of work (one feature, one fix)
- After passing tests
- Before switching to a different task
- **Never commit broken code** to main
- **Never commit secrets** (keys, passwords, tokens)

## .gitignore Essentials

Already included in template:
```
node_modules/
dist/
*.log
.env
env.local
__pycache__/
.venv/
venv/
.DS_Store
.idea/
.vscode/
*.db
```

## Rules

1. **Commit early, commit often** — small commits are easier to review and revert
2. **One concern per commit** — don't mix a bug fix with a feature
3. **Never force push to main** — history is sacred
4. **Review diffs before committing** — no accidental files
5. **Keep main deployable** — if it's on main, it works
