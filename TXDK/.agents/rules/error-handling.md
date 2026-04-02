# Error Handling Rules

## Backend Error Handling

### Global Exception Handler
Every FastAPI app MUST have a global exception handler:

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import logging

logger = logging.getLogger("uvicorn.error")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred",
            }
        },
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.detail if isinstance(exc.detail, str) else "ERROR",
                "message": str(exc.detail),
            }
        },
    )
```

### Error Response Model
```python
class ErrorDetail(BaseModel):
    field: str | None = None
    message: str

class ErrorResponse(BaseModel):
    code: str
    message: str
    details: list[ErrorDetail] = []
```

### Error Codes
Use UPPER_SNAKE_CASE codes that are machine-readable:
- `VALIDATION_ERROR` — request data invalid
- `NOT_FOUND` — resource doesn't exist
- `ALREADY_EXISTS` — duplicate resource
- `UNAUTHORIZED` — not authenticated
- `FORBIDDEN` — not authorized
- `RATE_LIMITED` — too many requests
- `INTERNAL_ERROR` — server error (never expose internals)

### Rules
- **Never expose stack traces** to clients — log them server-side
- **Never return raw exception messages** — they may leak internals
- **Always log errors** with context (request path, user ID if available)
- **Use specific HTTP codes** — don't use 400 for everything
- **Validate at the boundary** — Pydantic models handle this for request bodies

## Frontend Error Handling

### Error Boundary
Every app MUST have a root error boundary:

```typescript
// components/ErrorBoundary.tsx
import { Component, type ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
    state: State = { error: null };

    static getDerivedStateFromError(error: Error) {
        return { error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error("Uncaught error:", error, info);
    }

    render() {
        if (this.state.error) {
            return (
                <div className="flex h-screen items-center justify-center bg-neutral-100">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-white-100">Something went wrong</h1>
                        <p className="mt-2 text-sm text-white-60">{this.state.error.message}</p>
                        <button
                            onClick={() => this.setState({ error: null })}
                            className="mt-4 bg-primary-20 px-4 py-2 text-sm font-bold uppercase text-white-100"
                        >
                            Try again
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
```

### API Error Handling in Services
```typescript
// services/apiClient.ts
export class ApiError extends Error {
    constructor(
        public status: number,
        public code: string,
        message: string,
        public details: Array<{ field?: string; message: string }> = [],
    ) {
        super(message);
        this.name = "ApiError";
    }
}

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const error = body.error || {};
        throw new ApiError(
            res.status,
            error.code || "UNKNOWN_ERROR",
            error.message || `Request failed with status ${res.status}`,
            error.details || [],
        );
    }

    return res.json();
}
```

### Loading/Error/Success State Pattern
```typescript
// Standard state shape for async operations
interface AsyncState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

// Usage in components
function ItemList() {
    const [state, setState] = useState<AsyncState<Item[]>>({
        data: null, loading: true, error: null,
    });

    useEffect(() => {
        listItems()
            .then((res) => setState({ data: res.data, loading: false, error: null }))
            .catch((err) => setState({ data: null, loading: false, error: err.message }));
    }, []);

    if (state.loading) return <Skeleton />;
    if (state.error) return <ErrorMessage message={state.error} />;
    if (!state.data?.length) return <EmptyState />;
    return <ul>{state.data.map(item => <ItemCard key={item.id} item={item} />)}</ul>;
}
```

### Rules
- **Always handle loading, error, and empty states** — never show a blank screen
- **Show user-friendly messages** — never show raw error codes or JSON
- **Errors are recoverable by default** — offer a retry button
- **Log errors** to console in development
- **Services throw, components catch** — error handling happens in the UI layer
