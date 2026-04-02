# Testing Rules

## Philosophy

- Tests exist to catch regressions, not to prove code works
- Test behavior, not implementation — tests should survive refactoring
- Every bug fix gets a test that would have caught it
- Fast tests > slow tests > no tests

## Frontend Testing

### Stack
| Tool | Purpose |
|---|---|
| Vitest | Test runner (native Vite integration) |
| @testing-library/react | Component testing |
| @testing-library/user-event | User interaction simulation |
| jsdom | Browser environment |

### What to Test
| Priority | What | Example |
|---|---|---|
| **High** | User interactions | Click button → form submits |
| **High** | Conditional rendering | Error state shows error message |
| **High** | Service functions | API call returns expected data |
| **Medium** | Form validation | Invalid email shows error |
| **Medium** | State changes | Toggle updates UI |
| **Low** | Static rendering | Component renders without crashing |

### Pattern
```typescript
// UserProfile.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { UserProfile } from "./UserProfile";

describe("UserProfile", () => {
    it("displays user name", () => {
        render(<UserProfile name="Alice" />);
        expect(screen.getByText("Alice")).toBeInTheDocument();
    });

    it("calls onSave when form is submitted", async () => {
        const onSave = vi.fn();
        render(<UserProfile name="Alice" onSave={onSave} />);
        await userEvent.click(screen.getByRole("button", { name: /save/i }));
        expect(onSave).toHaveBeenCalledOnce();
    });
});
```

### Rules
- Test files next to source: `components/UserProfile.test.tsx`
- Use `screen.getByRole` over `getByTestId` — test like a user
- Mock services, never components
- No snapshot tests — they break on every change and catch nothing

## Backend Testing

### Stack
| Tool | Purpose |
|---|---|
| pytest | Test runner |
| httpx | Async HTTP client for FastAPI |
| pytest-asyncio | Async test support |

### What to Test
| Priority | What | Example |
|---|---|---|
| **High** | API endpoints (happy path) | POST /items returns 201 |
| **High** | API endpoints (error cases) | POST /items with bad data returns 422 |
| **High** | Business logic functions | Calculate discount returns correct value |
| **Medium** | Validation rules | Missing required field rejected |
| **Medium** | Edge cases | Empty list, max values, Unicode |
| **Low** | Health check | GET /health returns 200 |

### Pattern
```python
# test_items.py
import pytest
from httpx import AsyncClient, ASGITransport
from myapi import app

@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

@pytest.mark.asyncio
async def test_create_item(client):
    response = await client.post("/api/v1/items", json={
        "name": "Test Item",
        "price": 9.99
    })
    assert response.status_code == 201
    data = response.json()["data"]
    assert data["name"] == "Test Item"

@pytest.mark.asyncio
async def test_create_item_invalid(client):
    response = await client.post("/api/v1/items", json={
        "name": "",
        "price": -1
    })
    assert response.status_code == 422
```

### Rules
- Test files in project root: `test_<module>.py`
- One test file per module/router
- Use fixtures for client, test data, and database setup
- Test against the real app (ASGI transport), not mocked endpoints
- Clean up test data after each test

## Test Commands

Add to every project's `ARCHITECTURE.md`:

**Frontend:**
```bash
npm run test          # run all tests
npm run test:watch    # watch mode during development
npm run test:coverage # coverage report
```

**Backend:**
```bash
uv run pytest              # run all tests
uv run pytest -x           # stop on first failure
uv run pytest --cov=.      # coverage report
```

## Coverage Expectations

- New features: test the happy path + 1 error case minimum
- Bug fixes: test that reproduces the bug before fixing
- No hard coverage percentage targets — meaningful tests over metric chasing
