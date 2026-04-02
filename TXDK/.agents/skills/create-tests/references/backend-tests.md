# Backend Test Patterns

## Setup

### conftest.py
```python
import pytest
from httpx import AsyncClient, ASGITransport

# Import your app — adjust the import to match your project
# from myapi import app

@pytest.fixture
async def client(app):
    """Async test client for the FastAPI app."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

@pytest.fixture
def sample_item():
    """Reusable test data."""
    return {
        "name": "Test Item",
        "description": "A test item",
        "price": 9.99,
    }
```

### pyproject.toml additions
```toml
[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["."]
```

## Endpoint Tests

### Happy Path (POST — Create)
```python
async def test_create_item_returns_201(client, sample_item):
    response = await client.post("/api/v1/items", json=sample_item)

    assert response.status_code == 201
    data = response.json()["data"]
    assert data["name"] == "Test Item"
    assert data["price"] == 9.99
    assert "id" in data

async def test_create_item_persists(client, sample_item):
    create_res = await client.post("/api/v1/items", json=sample_item)
    item_id = create_res.json()["data"]["id"]

    get_res = await client.get(f"/api/v1/items/{item_id}")
    assert get_res.status_code == 200
    assert get_res.json()["data"]["name"] == "Test Item"
```

### Happy Path (GET — List)
```python
async def test_list_items_returns_paginated(client):
    # Create some items first
    for i in range(3):
        await client.post("/api/v1/items", json={"name": f"Item {i}", "price": 1.0})

    response = await client.get("/api/v1/items?page=1&limit=2")

    assert response.status_code == 200
    body = response.json()
    assert len(body["data"]) == 2
    assert body["meta"]["total"] >= 3
    assert body["meta"]["page"] == 1
```

### Happy Path (PUT — Update)
```python
async def test_update_item_returns_200(client, sample_item):
    create_res = await client.post("/api/v1/items", json=sample_item)
    item_id = create_res.json()["data"]["id"]

    update_res = await client.put(f"/api/v1/items/{item_id}", json={
        "name": "Updated Item",
        "price": 19.99,
    })

    assert update_res.status_code == 200
    assert update_res.json()["data"]["name"] == "Updated Item"
```

### Happy Path (DELETE)
```python
async def test_delete_item_returns_204(client, sample_item):
    create_res = await client.post("/api/v1/items", json=sample_item)
    item_id = create_res.json()["data"]["id"]

    delete_res = await client.delete(f"/api/v1/items/{item_id}")
    assert delete_res.status_code == 204

    get_res = await client.get(f"/api/v1/items/{item_id}")
    assert get_res.status_code == 404
```

### Validation Errors
```python
async def test_create_item_empty_name_returns_422(client):
    response = await client.post("/api/v1/items", json={
        "name": "",
        "price": 9.99,
    })
    assert response.status_code == 422

async def test_create_item_negative_price_returns_422(client):
    response = await client.post("/api/v1/items", json={
        "name": "Item",
        "price": -1,
    })
    assert response.status_code == 422

async def test_create_item_missing_required_field_returns_422(client):
    response = await client.post("/api/v1/items", json={})
    assert response.status_code == 422
```

### Not Found
```python
async def test_get_nonexistent_item_returns_404(client):
    response = await client.get("/api/v1/items/99999")
    assert response.status_code == 404

async def test_update_nonexistent_item_returns_404(client):
    response = await client.put("/api/v1/items/99999", json={
        "name": "Ghost",
        "price": 0,
    })
    assert response.status_code == 404
```

### Edge Cases
```python
async def test_create_item_with_unicode_name(client):
    response = await client.post("/api/v1/items", json={
        "name": "Tête-à-tête café ☕",
        "price": 5.0,
    })
    assert response.status_code == 201
    assert response.json()["data"]["name"] == "Tête-à-tête café ☕"

async def test_list_items_empty_returns_empty_list(client):
    response = await client.get("/api/v1/items")
    assert response.status_code == 200
    assert response.json()["data"] == []

async def test_create_item_max_length_name(client):
    long_name = "A" * 200  # max allowed
    response = await client.post("/api/v1/items", json={
        "name": long_name,
        "price": 1.0,
    })
    assert response.status_code == 201

async def test_create_item_too_long_name_returns_422(client):
    too_long = "A" * 201  # over max
    response = await client.post("/api/v1/items", json={
        "name": too_long,
        "price": 1.0,
    })
    assert response.status_code == 422
```

## Business Logic Tests

```python
# Test pure functions separately from HTTP layer

def test_calculate_discount_percentage():
    assert calculate_discount(100, 20) == 80.0

def test_calculate_discount_zero():
    assert calculate_discount(100, 0) == 100.0

def test_calculate_discount_full():
    assert calculate_discount(100, 100) == 0.0

def test_calculate_discount_over_100_raises():
    with pytest.raises(ValueError, match="cannot exceed 100"):
        calculate_discount(100, 150)
```

## Database Tests

When testing with a real database, use fixtures for setup/teardown:

```python
@pytest.fixture
async def db():
    """Create a fresh test database."""
    conn = await asyncpg.connect("postgresql://test:test@localhost/testdb")
    await conn.execute("BEGIN")
    yield conn
    await conn.execute("ROLLBACK")  # undo all changes
    await conn.close()

async def test_insert_user(db):
    await db.execute(
        "INSERT INTO users (name, email) VALUES ($1, $2)",
        "Alice", "alice@test.com",
    )
    row = await db.fetchrow("SELECT * FROM users WHERE email = $1", "alice@test.com")
    assert row["name"] == "Alice"
```

## Health Check

```python
async def test_health_check(client):
    response = await client.get("/health")
    assert response.status_code == 200
```

## Anti-Patterns to Avoid

- **No mocking the framework** — test through the real FastAPI app (ASGI transport)
- **No testing Pydantic validation directly** — it works; test through your endpoints
- **No shared state between tests** — each test sets up its own data
- **No sleep in tests** — use async properly
- **No testing private functions** — test through the public API
