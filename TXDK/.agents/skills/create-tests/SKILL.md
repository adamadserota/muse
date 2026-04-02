---
name: create-tests
description: >
  Generate and run tests for frontend (Vitest + Testing Library) and
  backend (pytest + httpx). Use when the user asks to add tests, improve
  coverage, or when creating features that need validation.
---

# Create Tests

Generate meaningful tests that catch real bugs, not tests that pass trivially.

## Workflow

1. **Identify what to test** — read the code, understand the behavior
2. **Read the appropriate reference:**
   - Frontend → `references/frontend-tests.md`
   - Backend → `references/backend-tests.md`
   - End-to-end → `references/integration-tests.md`
3. **Write tests** following the patterns
4. **Run tests** and fix any failures
5. **Update ARCHITECTURE.md** with test setup info if this is the first test

## Test Priority

Focus on high-value tests first:

| Priority | What | Why |
|---|---|---|
| 1 | API endpoint happy paths | Validates core functionality |
| 2 | API endpoint error cases | Catches unhandled errors |
| 3 | Business logic functions | Complex logic is bug-prone |
| 4 | User interactions (click, submit) | Validates UX flows |
| 5 | Edge cases (empty, max, Unicode) | Catches boundary bugs |
| 6 | Component rendering | Low value, catches little |

## Test Structure

Every test follows **Arrange → Act → Assert**:
```
1. Arrange — set up the test data and context
2. Act — perform the action being tested
3. Assert — verify the expected outcome
```

## Naming Convention

```
test_<what>_<condition>_<expected_result>

# Examples:
test_create_item_with_valid_data_returns_201
test_create_item_with_empty_name_returns_422
test_login_with_wrong_password_returns_401
```

For frontend:
```
it("displays error message when form is submitted with empty name")
it("calls onSave with updated data when save button is clicked")
it("disables submit button while loading")
```

## Rules

- **Test behavior, not implementation** — tests should survive refactoring
- **No snapshot tests** — they break on every change and catch nothing meaningful
- **No testing internal state** — test what the user sees or what the API returns
- **One assertion per concept** — multiple asserts are fine if they verify one thing
- **Fast tests** — mock external services, use in-memory databases
- **Independent tests** — no test depends on another test's state
- **Run all tests after writing** — fix failures before moving on

## Setup Commands

**Frontend (if not yet configured):**
```bash
npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Add to `vite.config.ts`:
```typescript
export default defineConfig({
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "./test-setup.ts",
    },
});
```

Add to `package.json`:
```json
{
    "scripts": {
        "test": "vitest run",
        "test:watch": "vitest",
        "test:coverage": "vitest run --coverage"
    }
}
```

**Backend (if not yet configured):**
```bash
uv add --dev pytest httpx pytest-asyncio
```

Add to `pyproject.toml`:
```toml
[tool.pytest.ini_options]
asyncio_mode = "auto"
```
