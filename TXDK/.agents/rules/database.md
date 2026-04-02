# Database Rules

## Default Stack

| Environment | Database | Why |
|---|---|---|
| Local development | SQLite | Zero config, single file, fast |
| Production / Docker | PostgreSQL | Scalable, full-featured, industry standard |

**No ORM by default.** Use raw SQL or simple query helpers. Add SQLAlchemy/Tortoise only if the user requests it or the data model exceeds 5 tables with complex relationships.

## SQLite (Local Dev Default)

```python
import sqlite3
from contextlib import contextmanager

DATABASE = os.getenv("DATABASE_URL", "data.db")

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # dict-like access
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn

@contextmanager
def db_transaction():
    conn = get_db()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()
```

## PostgreSQL (Docker / Production)

Add to `infrastructure.compose.yaml`:
```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: ${DB_NAME:-appdb}
      POSTGRES_USER: ${DB_USER:-app}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-devpassword}
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Use `asyncpg` for async access with `lifespan`:
```python
import asyncpg
from contextlib import asynccontextmanager
from fastapi import Depends, Request

@asynccontextmanager
async def lifespan(app):
    app.state.pool = await asyncpg.create_pool(os.getenv("DATABASE_URL"))
    yield
    await app.state.pool.close()

app = FastAPI(lifespan=lifespan)

async def get_pool(request: Request) -> asyncpg.Pool:
    """FastAPI dependency for database pool access."""
    return request.app.state.pool

async def fetch_items(
    pool: asyncpg.Pool = Depends(get_pool),
    limit: int = 20,
    offset: int = 0,
) -> list[dict]:
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT * FROM items ORDER BY created_at DESC LIMIT $1 OFFSET $2",
            limit, offset,
        )
        return [dict(row) for row in rows]
```

## Migration Strategy

### Simple (< 5 tables): SQL files
```
migrations/
├── 001_create_users.sql
├── 002_create_items.sql
└── 003_add_items_status.sql
```

```python
# Run migrations on startup
import glob

async def run_migrations(conn):
    await conn.execute("""
        CREATE TABLE IF NOT EXISTS _migrations (
            name TEXT PRIMARY KEY,
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    applied = {r["name"] for r in await conn.fetch("SELECT name FROM _migrations")}
    for path in sorted(glob.glob("migrations/*.sql")):
        name = os.path.basename(path)
        if name not in applied:
            sql = open(path).read()
            await conn.execute(sql)
            await conn.execute("INSERT INTO _migrations (name) VALUES ($1)", name)
            logger.info(f"Applied migration: {name}")
```

### Complex (5+ tables): Alembic
Only when the user requests it or data model complexity justifies it.

## Query Patterns

### Parameterized Queries — ALWAYS
```python
# ✅ Safe — parameterized
await conn.fetch("SELECT * FROM users WHERE id = $1", user_id)

# ❌ DANGEROUS — SQL injection
await conn.fetch(f"SELECT * FROM users WHERE id = {user_id}")
```

### Pagination
```python
async def list_items(page: int = 1, limit: int = 20) -> dict:
    offset = (page - 1) * limit
    items = await conn.fetch(
        "SELECT * FROM items ORDER BY created_at DESC LIMIT $1 OFFSET $2",
        limit, offset,
    )
    total = await conn.fetchval("SELECT COUNT(*) FROM items")
    return {
        "data": [dict(r) for r in items],
        "meta": {"page": page, "limit": limit, "total": total},
    }
```

## Rules

1. **Always parameterize queries** — never interpolate user input into SQL
2. **Always use transactions** for multi-step writes
3. **Foreign keys ON** — enforce data integrity at the database level
4. **Migrations are forward-only** — never edit an applied migration, create a new one
5. **No database logic in route handlers** — extract to functions/modules
6. **Connection pooling** — never create a new connection per request in production
7. **Sensitive data** (passwords, tokens) — hash with bcrypt, never store plaintext
