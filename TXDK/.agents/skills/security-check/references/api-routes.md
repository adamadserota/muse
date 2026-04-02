# API Route Security Checklist

## Input Validation

- [ ] **All request bodies validated** with Pydantic models
  ```python
  # ✅ Validated
  class CreateUser(BaseModel):
      email: str = Field(..., pattern=r"^[\w.+-]+@[\w-]+\.[\w.]+$")
      name: str = Field(..., min_length=1, max_length=200)

  # ❌ Unvalidated
  @app.post("/users")
  async def create_user(request: Request):
      data = await request.json()  # raw, unvalidated
  ```

- [ ] **Path parameters validated** — type hints enforce int/UUID
- [ ] **Query parameters bounded** — `limit` has max value, `page` has min
  ```python
  @app.get("/api/v1/items")
  async def list_items(
      page: int = Query(1, ge=1),
      limit: int = Query(20, ge=1, le=100),
  ): ...
  ```

- [ ] **String lengths bounded** — prevent memory exhaustion
- [ ] **Enum values restricted** — use Literal types or Enum classes

## SQL Injection

- [ ] **All queries use parameters** — NEVER string interpolation
  ```python
  # ✅ Safe
  await conn.fetch("SELECT * FROM users WHERE id = $1", user_id)

  # ❌ Injectable
  await conn.fetch(f"SELECT * FROM users WHERE id = {user_id}")
  await conn.fetch("SELECT * FROM users WHERE id = " + user_id)
  ```

- [ ] **Search/filter inputs sanitized** — especially LIKE patterns
  ```python
  # Escape LIKE wildcards in user input
  search = search.replace("%", "\\%").replace("_", "\\_")
  await conn.fetch("SELECT * FROM items WHERE name LIKE $1", f"%{search}%")
  ```

- [ ] **No dynamic table/column names from user input** — whitelist allowed values

## Authentication Checks

- [ ] **Protected routes require auth** — every route that accesses user data
  ```python
  async def get_current_user(authorization: str = Header(...)) -> User:
      token = authorization.replace("Bearer ", "")
      try:
          payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
          return User(**payload)
      except jwt.JWTError:
          raise HTTPException(status_code=401, detail="Invalid token")

  @app.get("/api/v1/me")
  async def get_me(user: User = Depends(get_current_user)): ...
  ```

- [ ] **Authorization checked** — user can only access their own resources
  ```python
  @app.get("/api/v1/items/{item_id}")
  async def get_item(item_id: int, user: User = Depends(get_current_user)):
      item = await fetch_item(item_id)
      if item.owner_id != user.id:
          raise HTTPException(status_code=403, detail="Not authorized")
      return item
  ```

- [ ] **Admin routes protected** — role/permission checks
- [ ] **No auth logic in frontend only** — always enforce server-side

## Rate Limiting

- [ ] **Auth endpoints limited** — login, register, password reset (5-10/min)
- [ ] **API endpoints limited** — general endpoints (60-100/min per user)
- [ ] **Expensive operations limited** — file upload, export, search (5-10/min)
- [ ] **Public endpoints limited** — prevent scraping (30/min per IP)

## Error Responses

- [ ] **No stack traces in responses** — log server-side, return generic message
- [ ] **No database errors exposed** — catch and wrap all DB exceptions
- [ ] **No internal paths exposed** — file paths, server info, versions
- [ ] **Consistent error format** — same shape for all errors
  ```python
  # ❌ Exposes internals
  raise HTTPException(500, detail=str(e))

  # ✅ Safe
  logger.error(f"Database error: {e}", exc_info=True)
  raise HTTPException(500, detail="Internal server error")
  ```

## Data Exposure

- [ ] **Response models exclude sensitive fields** — never return password hashes, internal IDs
  ```python
  class UserResponse(BaseModel):
      id: int
      name: str
      email: str
      # No password_hash, no internal_notes, no admin_flags
  ```

- [ ] **List endpoints don't leak other users' data** — filter by current user
- [ ] **Pagination prevents full-table dumps** — enforce max limit
- [ ] **No mass assignment** — explicitly define which fields are updatable
