# Frontend Test Patterns

## Setup

### test-setup.ts
```typescript
import "@testing-library/jest-dom/vitest";
```

### Vitest Config
```typescript
// in vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "./test-setup.ts",
    },
});
```

## Component Tests

### Basic Rendering
```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { UserCard } from "./UserCard";

describe("UserCard", () => {
    it("renders user name and email", () => {
        render(<UserCard name="Alice" email="alice@test.com" />);

        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("alice@test.com")).toBeInTheDocument();
    });

    it("renders nothing when name is empty", () => {
        const { container } = render(<UserCard name="" email="" />);
        expect(container.firstChild).toBeNull();
    });
});
```

### User Interactions
```typescript
import userEvent from "@testing-library/user-event";

describe("LoginForm", () => {
    it("submits with email and password", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn();
        render(<LoginForm onSubmit={onSubmit} />);

        await user.type(screen.getByLabelText(/email/i), "alice@test.com");
        await user.type(screen.getByLabelText(/password/i), "password123");
        await user.click(screen.getByRole("button", { name: /sign in/i }));

        expect(onSubmit).toHaveBeenCalledWith({
            email: "alice@test.com",
            password: "password123",
        });
    });

    it("shows error when email is empty", async () => {
        const user = userEvent.setup();
        render(<LoginForm onSubmit={vi.fn()} />);

        await user.click(screen.getByRole("button", { name: /sign in/i }));

        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    it("disables button while submitting", async () => {
        const user = userEvent.setup();
        const onSubmit = vi.fn(() => new Promise(() => {})); // never resolves
        render(<LoginForm onSubmit={onSubmit} />);

        await user.type(screen.getByLabelText(/email/i), "test@test.com");
        await user.type(screen.getByLabelText(/password/i), "pass");
        await user.click(screen.getByRole("button", { name: /sign in/i }));

        expect(screen.getByRole("button", { name: /sign in/i })).toBeDisabled();
    });
});
```

### Async Data Loading
```typescript
import { vi } from "vitest";
import * as itemService from "../services/items";

describe("ItemList", () => {
    it("shows items after loading", async () => {
        vi.spyOn(itemService, "listItems").mockResolvedValue({
            data: [
                { id: 1, name: "Item A" },
                { id: 2, name: "Item B" },
            ],
        });

        render(<ItemList />);

        // Loading state
        expect(screen.getByText(/loading/i)).toBeInTheDocument();

        // Loaded state
        expect(await screen.findByText("Item A")).toBeInTheDocument();
        expect(screen.getByText("Item B")).toBeInTheDocument();
    });

    it("shows error message on fetch failure", async () => {
        vi.spyOn(itemService, "listItems").mockRejectedValue(
            new Error("Network error"),
        );

        render(<ItemList />);

        expect(await screen.findByText(/failed to load/i)).toBeInTheDocument();
    });

    it("shows empty state when no items", async () => {
        vi.spyOn(itemService, "listItems").mockResolvedValue({ data: [] });

        render(<ItemList />);

        expect(await screen.findByText(/no items/i)).toBeInTheDocument();
    });
});
```

## Service Tests

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { listItems, createItem } from "./items";

describe("items service", () => {
    beforeEach(() => {
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("fetches items with pagination", async () => {
        (fetch as any).mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ data: [{ id: 1 }], meta: { total: 1 } }),
        });

        const result = await listItems({ page: 1, limit: 10 });

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("/api/v1/items?"),
            expect.anything(),
        );
        expect(result.data).toHaveLength(1);
    });

    it("throws ApiError on failure", async () => {
        (fetch as any).mockResolvedValue({
            ok: false,
            status: 422,
            json: () => Promise.resolve({
                error: { code: "VALIDATION_ERROR", message: "Invalid data" },
            }),
        });

        await expect(createItem({ name: "" })).rejects.toThrow("Invalid data");
    });
});
```

## Query Selectors (Priority Order)

Use the most accessible selector available:

| Priority | Selector | When |
|---|---|---|
| 1 | `getByRole` | Buttons, links, headings, inputs with labels |
| 2 | `getByLabelText` | Form inputs |
| 3 | `getByPlaceholderText` | Inputs without visible labels |
| 4 | `getByText` | Non-interactive text content |
| 5 | `getByTestId` | Last resort — when nothing else works |

## Anti-Patterns to Avoid

- **No snapshot tests** — break on every style change, no meaningful assertion
- **No testing implementation details** — don't check useState values or internal methods
- **No testing third-party libraries** — trust that React, Vitest, etc. work
- **No exact string matching when partial works** — use `/regex/i` for flexibility
- **No `waitFor` with side effects** — use `findBy*` queries instead
