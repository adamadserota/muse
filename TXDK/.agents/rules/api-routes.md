# API Route Rules

## URL Conventions

- **Base path:** `/api/v1/` for all routes (except `/health`)
- **Resources:** plural nouns, lowercase, hyphenated — `/api/v1/user-profiles`
- **Actions on resources:** use HTTP verbs, not URL verbs
  ```
  ✅ POST   /api/v1/users          (create)
  ✅ GET    /api/v1/users          (list)
  ✅ GET    /api/v1/users/{id}     (read)
  ✅ PUT    /api/v1/users/{id}     (replace)
  ✅ PATCH  /api/v1/users/{id}     (partial update)
  ✅ DELETE /api/v1/users/{id}     (delete)
  ❌ POST   /api/v1/create-user
  ❌ GET    /api/v1/get-user
  ```
- **Nested resources:** max 2 levels — `/api/v1/projects/{id}/tasks`
- **Query params** for filtering, sorting, pagination — `/api/v1/users?status=active&sort=-created_at&page=1&limit=20`

## Request/Response Format

### Standard Success Response
```python
# Single item
{"data": {...}}

# List with pagination
{"data": [...], "meta": {"page": 1, "limit": 20, "total": 100}}
```

### Standard Error Response
```python
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Human-readable description",
        "details": [{"field": "email", "message": "Invalid email format"}]
    }
}
```

### HTTP Status Codes
| Code | When |
|---|---|
| 200 | Success (GET, PUT, PATCH) |
| 201 | Created (POST) |
| 204 | No content (DELETE) |
| 400 | Bad request / validation error |
| 401 | Not authenticated |
| 403 | Not authorized |
| 404 | Resource not found |
| 409 | Conflict (duplicate, state conflict) |
| 422 | Unprocessable entity (valid JSON, invalid semantics) |
| 500 | Server error (never expose internals) |

## FastAPI Patterns

### Route Organization
```python
# Single-file (< 300 lines)
app = FastAPI()

@app.get("/health")
async def health(): ...

@app.get("/api/v1/items")
async def list_items(): ...

# Multi-file (> 300 lines) — use routers
# routes/items.py
router = APIRouter(prefix="/api/v1/items", tags=["items"])

@router.get("/")
async def list_items(): ...

# main.py
app.include_router(items_router)
```

### Request Validation
```python
from pydantic import BaseModel, Field

class CreateItemRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: str | None = Field(None, max_length=2000)
    price: float = Field(..., gt=0)

@app.post("/api/v1/items", status_code=201)
async def create_item(body: CreateItemRequest):
    # Pydantic validates automatically — no manual checks needed
    ...
```

### Response Models
```python
from datetime import datetime

class ItemResponse(BaseModel):
    id: int
    name: str
    description: str | None
    created_at: datetime

class ListResponse(BaseModel):
    data: list[ItemResponse]
    meta: dict

@app.get("/api/v1/items", response_model=ListResponse)
async def list_items(): ...
```

## Frontend Service Patterns

Always use `apiFetch` from `services/apiClient.ts` — never raw `fetch`. This ensures consistent auth headers, token refresh, and error handling.

```typescript
// services/items.ts
import { apiFetch } from "./apiClient";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function listItems(params?: { page?: number; limit?: number }) {
    const query = new URLSearchParams(params as Record<string, string>);
    return apiFetch<ListResponse>(`${API_BASE}/api/v1/items?${query}`);
}

export async function createItem(data: CreateItemRequest) {
    return apiFetch<{ data: ItemResponse }>(`${API_BASE}/api/v1/items`, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export async function updateItem(id: number, data: Partial<CreateItemRequest>) {
    return apiFetch<{ data: ItemResponse }>(`${API_BASE}/api/v1/items/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    });
}

export async function deleteItem(id: number) {
    return apiFetch<void>(`${API_BASE}/api/v1/items/${id}`, { method: "DELETE" });
}
```

## CORS

Always configure CORS in backend:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ORIGIN", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
