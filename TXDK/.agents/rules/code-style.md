# Code Style Rules

## Frontend (TypeScript/React)

### Linting & Formatting
| Tool | Purpose | Config |
|---|---|---|
| ESLint | Code quality | `eslint.config.js` |
| Prettier | Formatting | `.prettierrc` |

### ESLint Config (included in init)
```js
// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            "react-hooks": reactHooks,
        },
        rules: {
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
            "no-console": ["warn", { allow: ["warn", "error"] }],
        },
    },
);
```

### Prettier Config (included in init)
```json
{
    "semi": true,
    "singleQuote": false,
    "tabWidth": 4,
    "trailingComma": "all",
    "printWidth": 100
}
```

### TypeScript Rules
- **Strict mode** enabled in `tsconfig.json`
- **No `any`** — use `unknown` and narrow, or define a type
- **Interfaces** for object shapes, **types** for unions/intersections
- **No enums** — use `as const` objects or union types
- **Explicit return types** on exported functions

### React Rules
- **Named exports** only — no `export default`
- **Function components** only — no class components
- **No inline styles** — Tailwind classes only
- **Destructure props** in function signature
- **Early returns** for guard clauses
- **Keep components under 150 lines** — extract sub-components if longer

```typescript
// ✅ Good
export function UserCard({ name, email, onEdit }: UserCardProps) {
    if (!name) return null;

    return (
        <div className="border border-white-20 p-4">
            <h3 className="text-sm font-bold uppercase">{name}</h3>
            <p className="text-xs text-white-60">{email}</p>
            <button onClick={onEdit} className="text-primary-100">Edit</button>
        </div>
    );
}

// ❌ Bad
export default function(props) {
    return <div style={{border: '1px solid gray'}}>{props.name}</div>
}
```

## Backend (Python)

### Linting & Formatting
| Tool | Purpose | Config |
|---|---|---|
| Ruff | Linting + formatting (replaces black, isort, flake8) | `pyproject.toml` |

### Ruff Config (included in init)
```toml
# In pyproject.toml
[tool.ruff]
target-version = "py312"
line-length = 100

[tool.ruff.lint]
select = [
    "E",    # pycodestyle errors
    "W",    # pycodestyle warnings
    "F",    # pyflakes
    "I",    # isort
    "B",    # flake8-bugbear
    "UP",   # pyupgrade
]
ignore = ["E501"]  # line length handled by formatter

[tool.ruff.format]
quote-style = "double"
indent-style = "space"
```

### Python Rules
- **Type hints** on all function signatures
- **Docstrings** on public functions (one-line for simple, multi-line for complex)
- **No mutable default arguments** — use `None` + assignment
- **No global state** — pass dependencies explicitly or use FastAPI's dependency injection
- **f-strings** for formatting — no `.format()` or `%`
- **Pathlib** over `os.path` for file operations

```python
# ✅ Good
async def get_user(user_id: int) -> UserResponse:
    """Fetch a user by ID. Raises 404 if not found."""
    user = await db.get("users", user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(**user)

# ❌ Bad
def get_user(id):
    user = db.get("users", id)
    return user
```

## Commands

**Frontend:**
```bash
npm run lint          # check for issues
npm run lint:fix      # auto-fix issues
npm run format        # format with Prettier
```

**Backend:**
```bash
uv run ruff check .          # check for issues
uv run ruff check . --fix    # auto-fix issues
uv run ruff format .         # format code
```

## Pre-commit (Optional)

When the user requests it, add pre-commit hooks:
```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.8.0
    hooks:
      - id: ruff
      - id: ruff-format
```
