# Integration Test Patterns

Integration tests verify that frontend and backend work together correctly.

## When to Use

- After connecting a new frontend feature to a backend endpoint
- Before deployment to verify full flow
- When debugging issues that unit tests don't catch
- For critical user flows (auth, payment, data creation)

## API Contract Tests

Verify that the frontend's expected API shape matches the backend's actual response:

```typescript
// integration/api-contract.test.ts
import { describe, it, expect } from "vitest";

const API = "http://localhost:8000";

describe("API Contract", () => {
    it("GET /api/v1/items returns expected shape", async () => {
        const res = await fetch(`${API}/api/v1/items`);
        const body = await res.json();

        expect(res.status).toBe(200);
        expect(body).toHaveProperty("data");
        expect(body).toHaveProperty("meta");
        expect(body.meta).toHaveProperty("page");
        expect(body.meta).toHaveProperty("limit");
        expect(body.meta).toHaveProperty("total");
        expect(Array.isArray(body.data)).toBe(true);
    });

    it("POST /api/v1/items creates and returns item", async () => {
        const res = await fetch(`${API}/api/v1/items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Integration Test Item", price: 5.0 }),
        });
        const body = await res.json();

        expect(res.status).toBe(201);
        expect(body.data).toHaveProperty("id");
        expect(body.data.name).toBe("Integration Test Item");
    });

    it("POST /api/v1/items with invalid data returns error shape", async () => {
        const res = await fetch(`${API}/api/v1/items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "" }),
        });
        const body = await res.json();

        expect(res.status).toBe(422);
        expect(body).toHaveProperty("error");
        expect(body.error).toHaveProperty("code");
        expect(body.error).toHaveProperty("message");
    });
});
```

## Docker Compose Test Environment

```yaml
# test.compose.yaml
include:
  - compose.yaml

services:
  integration-tests:
    build:
      context: .
      dockerfile: Dockerfile.test
    depends_on:
      api:
        condition: service_healthy
    environment:
      API_URL: http://api:8000
```

## Full-Flow Test Pattern

Test a complete user journey in a single test to verify the sequential flow:

```typescript
describe("Item Management Flow", () => {
    it("completes full CRUD lifecycle", async () => {
        // Create
        const createRes = await fetch(`${API}/api/v1/items`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Flow Test", price: 10.0 }),
        });
        expect(createRes.status).toBe(201);
        const itemId = (await createRes.json()).data.id;

        // Read
        const readRes = await fetch(`${API}/api/v1/items/${itemId}`);
        expect(readRes.status).toBe(200);
        expect((await readRes.json()).data.name).toBe("Flow Test");

        // Update
        const updateRes = await fetch(`${API}/api/v1/items/${itemId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: "Updated Flow Test", price: 20.0 }),
        });
        expect(updateRes.status).toBe(200);
        expect((await updateRes.json()).data.name).toBe("Updated Flow Test");

        // Delete
        const deleteRes = await fetch(`${API}/api/v1/items/${itemId}`, {
            method: "DELETE",
        });
        expect(deleteRes.status).toBe(204);

        // Confirm deleted
        const goneRes = await fetch(`${API}/api/v1/items/${itemId}`);
        expect(goneRes.status).toBe(404);
    });
});
```

## Running Integration Tests

```bash
# Start services
docker compose up -d

# Wait for health
until curl -s http://localhost:8000/health > /dev/null; do sleep 1; done

# Run tests
npm run test:integration

# Cleanup
docker compose down -v
```

## Rules

- **Integration tests are slower** — run unit tests first, integration tests in CI or before deploy
- **Clean up test data** — don't leave artifacts that affect other tests
- **Test against real services** — no mocking in integration tests
- **Test the contract** — verify shapes and status codes, not exact values (timestamps change)
- **Keep it focused** — test critical paths, not every edge case (that's what unit tests are for)
