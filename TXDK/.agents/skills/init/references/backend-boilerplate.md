# Backend Boilerplate

## Ruff Config

Add to `pyproject.toml`:
```toml
[tool.ruff]
target-version = "py312"
line-length = 100

[tool.ruff.lint]
select = ["E", "W", "F", "I", "B", "UP"]
ignore = ["E501"]

[tool.ruff.format]
quote-style = "double"
indent-style = "space"

[tool.pytest.ini_options]
asyncio_mode = "auto"
```

Add dev dependencies:
```bash
uv add --dev ruff pytest httpx pytest-asyncio
```

## Error Handling

Add global exception handlers to `<name>api.py`:
```python
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled error: {exc}", exc_info=True)
    return JSONResponse(status_code=500, content={
        "error": {"code": "INTERNAL_ERROR", "message": "An unexpected error occurred"}
    })
```

Add standard error response model:
```python
class ErrorDetail(BaseModel):
    field: str | None = None
    message: str

class ErrorBody(BaseModel):
    code: str
    message: str
    details: list[ErrorDetail] = []
```
