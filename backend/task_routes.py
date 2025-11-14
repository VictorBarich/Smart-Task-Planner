from fastapi import APIRouter, HTTPException
from tasks import Task, Tasks
from global_task_manager import task_manager
from pydantic import BaseModel

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
        {"name": task.name, "description": task.description}
        for task in task_manager.tasks
    ]

# Get a task by name
@router.get("/get/{task_name}")
def get_task(task_name: str):
    for task in task_manager.tasks:
        if task.name == task_name:
            return {
                "name": task.name, 
                "description": task.description
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

@router.post("/priority/{task_name}")
def update_priority(task_name: str, priority: int):
    for task in task_manager.tasks:
        if task.name == task_name:
            try:
                task.set_priority(priority)
            except ValueError as e:
                raise HTTPException(status_code=400, detail=str(e))
            return {
                "message": f"Task '{task_name}' priority updated",
                "name": task.name,
                "priority": task.priority,
            }
    raise HTTPException(status_code=404, detail="Task not found")