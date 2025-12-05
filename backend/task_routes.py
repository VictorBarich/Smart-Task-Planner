from fastapi import APIRouter, HTTPException
from tasks import Task, Tasks
from global_task_manager import task_manager
from pydantic import BaseModel
from datetime import datetime

class TaskCreate(BaseModel):
    name: str
    description: str

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

# Add a task (use json)
@router.post("/add")
def create_task(task: TaskCreate):
    new_task = Task(task.name, task.description)
    task_manager.add_task(new_task)
    return {"message": f"Task '{task.name}' added successfully"}

# List all tasks
@router.get("/all")
def get_all_tasks():
    return [
        {"name": task.name, "description": task.description, "completed": task.completed, "due_date": task.due_date}
        for task in task_manager.tasks
    ]

# Get a task by name
@router.get("/get/{task_name}")
def get_task(task_name: str):
    for task in task_manager.tasks:
        if task.name == task_name:
            return {
                "name": task.name, 
                "description": task.description,
                "completed": task.completed,
                "due_date": task.due_date
            }
    raise HTTPException(status_code=404, detail="Task not found")

# Mark a task as complete by name
@router.post("/complete/{task_name}")
def complete_task(task_name: str):
    for task in task_manager.tasks:
        if task.name == task_name:
            task_manager.mark_task_complete(task)
            return {"message": f"Task '{task_name}' marked as complete"}
    raise HTTPException(status_code=404, detail="Task not found")

# Mark a task as incomplete by name
@router.post("/incomplete/{task_name}")
def incomplete_task(task_name: str):
    for task in task_manager.tasks:
        if task.name == task_name:
            task_manager.mark_task_incomplete(task)
            return {"message": f"Task '{task_name}' marked as incomplete"}
    raise HTTPException(status_code=404, detail="Task not found")

# Delete a task by name
@router.delete("/delete/{task_name}")
def delete_task(task_name: str):
    for task in task_manager.tasks:
        if task.name == task_name:
            task_manager.remove_task(task)
            return {"message": f"Task '{task_name}' deleted successfully"}
    raise HTTPException(status_code=404, detail="Task not found")

@router.post("/active-since/{task_name}")
def update_active_since(task_name: str, active_since: datetime):
    """
    Example request:
    POST /api/tasks/active-since/MyTask?active_since=2025-11-14T10:30:00
    """
    for task in task_manager.tasks:
        if task.name == task_name:
            task.set_active_since(active_since)
            return {
                "message": f"Task '{task_name}' active_since updated",
                "name": task.name,
                "active_since": task.active_since.isoformat(),
            }
    raise HTTPException(status_code=404, detail="Task not found")