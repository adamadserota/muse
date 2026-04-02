# Background Tasks Pattern

Pattern for long-running operations that should not block API responses.

## When to Use

- Data processing, import/export operations
- External API calls that take > 2 seconds
- Batch operations (bulk update, bulk delete)
- Report generation, file conversion
- Any operation where the user should not wait for completion

## Architecture

```
Client                    API                        Task System
  │                        │                            │
  ├── POST /tasks ────────►│                            │
  │                        ├── create task record ──────►│
  │◄── 202 { task_id } ───┤                            │
  │                        │      run in background ────►│
  │                        │                            │
  ├── GET /tasks/{id} ────►│                            │
  │◄── { status, progress }┤                            │
  │                        │                            │
  │    ... poll or SSE ... │                            │
  │                        │                            │
  ├── GET /tasks/{id} ────►│                            │
  │◄── { status: done,     │                            │
  │      result: {...} }   │                            │
```

## Backend Pattern (FastAPI + asyncio)

### Task Model

```python
from enum import Enum
from pydantic import BaseModel
from datetime import datetime


class TaskStatus(str, Enum):
    pending = "pending"
    running = "running"
    completed = "completed"
    failed = "failed"


class TaskResponse(BaseModel):
    id: str
    status: TaskStatus
    progress: int  # 0-100
    message: str
    result: dict | None = None
    error: str | None = None
    created_at: datetime
    updated_at: datetime
```

### In-Memory Task Store (Simple)

For local dev and single-instance apps. Replace with database/Redis for production.

```python
import asyncio
import uuid
from datetime import datetime, timezone

# In-memory store — replace with DB table for production
_tasks: dict[str, dict] = {}


def create_task(task_type: str) -> str:
    task_id = str(uuid.uuid4())
    _tasks[task_id] = {
        "id": task_id,
        "type": task_type,
        "status": "pending",
        "progress": 0,
        "message": "Queued",
        "result": None,
        "error": None,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    return task_id


def update_task(task_id: str, **kwargs) -> None:
    if task_id in _tasks:
        _tasks[task_id].update(kwargs, updated_at=datetime.now(timezone.utc))


def get_task(task_id: str) -> dict | None:
    return _tasks.get(task_id)
```

### Background Runner

```python
async def run_in_background(task_id: str, coro):
    """Wrap an async task with status tracking."""
    update_task(task_id, status="running", message="Processing")
    try:
        result = await coro
        update_task(
            task_id,
            status="completed",
            progress=100,
            message="Done",
            result=result,
        )
    except Exception as e:
        logger.error("Task %s failed: %s", task_id, e)
        update_task(
            task_id,
            status="failed",
            message="Failed",
            error=str(e),
        )
```

### API Routes

```python
@app.post("/api/v1/tasks", status_code=202)
async def start_task(request: StartTaskRequest):
    task_id = create_task(request.task_type)

    # Launch background work — does NOT block the response
    asyncio.create_task(
        run_in_background(task_id, do_the_work(task_id, request))
    )

    return {"data": {"task_id": task_id}}


@app.get("/api/v1/tasks/{task_id}")
async def get_task_status(task_id: str):
    task = get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"data": task}
```

### Progress Updates Inside a Task

```python
async def do_the_work(task_id: str, request: StartTaskRequest):
    items = await fetch_items(request)
    total = len(items)

    for i, item in enumerate(items):
        await process_item(item)
        progress = int(((i + 1) / total) * 100)
        update_task(task_id, progress=progress, message=f"Processing {i+1}/{total}")

    return {"processed": total}
```

## Frontend Pattern

### Task Hook

```typescript
import { useState, useEffect, useCallback, useRef } from "react";
import { apiFetch } from "../services/apiClient";

type TaskStatus = "pending" | "running" | "completed" | "failed";

interface TaskState {
  id: string | null;
  status: TaskStatus | null;
  progress: number;
  message: string;
  result: Record<string, unknown> | null;
  error: string | null;
}

const POLL_INTERVAL = 2000; // ms

export function useBackgroundTask() {
  const [task, setTask] = useState<TaskState>({
    id: null,
    status: null,
    progress: 0,
    message: "",
    result: null,
    error: null,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const pollTask = useCallback(
    async (taskId: string) => {
      try {
        const data = await apiFetch(`/api/v1/tasks/${taskId}`);
        setTask({
          id: taskId,
          status: data.data.status,
          progress: data.data.progress,
          message: data.data.message,
          result: data.data.result,
          error: data.data.error,
        });

        if (data.data.status === "completed" || data.data.status === "failed") {
          stopPolling();
        }
      } catch {
        stopPolling();
        setTask((prev) => ({
          ...prev,
          status: "failed",
          error: "Lost connection to task",
        }));
      }
    },
    [stopPolling],
  );

  const startTask = useCallback(
    async (taskType: string, payload?: Record<string, unknown>) => {
      stopPolling();
      const data = await apiFetch("/api/v1/tasks", {
        method: "POST",
        body: JSON.stringify({ task_type: taskType, ...payload }),
      });

      const taskId = data.data.task_id;
      setTask({
        id: taskId,
        status: "pending",
        progress: 0,
        message: "Starting...",
        result: null,
        error: null,
      });

      intervalRef.current = setInterval(() => pollTask(taskId), POLL_INTERVAL);
    },
    [stopPolling, pollTask],
  );

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  return { task, startTask, stopPolling };
}
```

### Usage in Component

```tsx
function ImportPage() {
  const { task, startTask } = useBackgroundTask();

  const handleImport = async (file: File) => {
    await startTask("import", { filename: file.name });
  };

  return (
    <div>
      <button onClick={() => handleImport(selectedFile)}>Import</button>

      {task.status === "running" && (
        <ProgressBar value={task.progress} label={task.message} />
      )}
      {task.status === "completed" && (
        <Toast variant="success" message="Import complete" />
      )}
      {task.status === "failed" && (
        <Toast variant="error" message={task.error ?? "Import failed"} />
      )}
    </div>
  );
}
```

## Database Table (when persistence is needed)

```sql
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    progress INTEGER NOT NULL DEFAULT 0,
    message TEXT NOT NULL DEFAULT 'Queued',
    result TEXT,       -- JSON string
    error TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_type ON tasks(type);
```

## Rules

- **Always return 202 Accepted** for task creation — never block the response
- **Always provide a polling endpoint** — `GET /api/v1/tasks/{id}`
- **Progress must be 0-100** — normalized, never raw counts
- **Tasks must be idempotent** — restarting a failed task should not duplicate work
- **Clean up old tasks** — delete completed/failed tasks older than 24h (configurable)
- **Log task lifecycle** — log start, progress milestones (25/50/75/100), completion, and failure
- **Error messages must be user-friendly** — no stack traces in the `error` field
- **Frontend polls at 2s intervals** — not faster (server load), not slower (UX lag)
- **Stop polling on terminal states** — completed or failed = stop
- **Show progress bar for running tasks** — use the progress component with design tokens
- **Show toast on completion/failure** — use the toast component
