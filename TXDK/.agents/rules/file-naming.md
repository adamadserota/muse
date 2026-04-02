# File Naming Rules

## Frontend (TypeScript/React)

| Type | Convention | Example |
|---|---|---|
| Components | `PascalCase.tsx` | `UserProfile.tsx`, `SearchBar.tsx` |
| Services | `camelCase.ts` | `userService.ts`, `apiClient.ts` |
| Hooks | `camelCase.ts` prefixed `use` | `useAuth.ts`, `useItems.ts` |
| Types | `types.ts` (shared) or co-located | `types.ts`, inline in component |
| Utils | `camelCase.ts` | `formatDate.ts`, `validators.ts` |
| Constants | `camelCase.ts` | `config.ts`, `routes.ts` |
| Test files | `*.test.tsx` / `*.test.ts` | `UserProfile.test.tsx` |

### Directory Names
- All **lowercase**, hyphenated if multi-word
- `components/`, `services/`, `hooks/`, `utils/`, `tests/`

### Exports
- Components: **named exports** (not default) — `export function UserProfile()`
- Services: **named exports** — `export async function getUsers()`
- Types: **named exports** — `export interface User {}`
- One primary export per file

## Backend (Python)

| Type | Convention | Example |
|---|---|---|
| Modules | `snake_case.py` | `user_routes.py`, `auth_middleware.py` |
| Main app | `<projectname>.py` | `trackerapi.py` |
| Classes | `PascalCase` | `class UserResponse(BaseModel)` |
| Functions | `snake_case` | `def get_user_by_id()` |
| Variables | `snake_case` | `current_user`, `db_connection` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_RETRIES`, `DEFAULT_PAGE_SIZE` |
| Endpoints | `snake_case` paths | `/api/v1/user-profiles` (hyphenated URLs) |
| Test files | `test_*.py` | `test_users.py`, `test_auth.py` |

## Docker / Config

| File | Name |
|---|---|
| App compose | `<project>.compose.yaml` |
| Wrapper compose | `compose.yaml` |
| Infrastructure compose | `infrastructure.compose.yaml` |
| Environment (local) | `env.local` |
| Environment (infra) | `infrastructure.compose.env` |
| Architecture doc | `ARCHITECTURE.md` |

## General Rules

- **No spaces** in file or directory names — ever
- **No abbreviations** unless universally understood (`id`, `url`, `api`, `auth`)
- **Match the domain** — `UserProfile`, not `Component1` or `ProfileWidget`
- **Be specific** — `emailValidator.ts`, not `utils.ts` with 20 unrelated functions
- **Test files mirror source files** — `UserProfile.tsx` → `UserProfile.test.tsx`
