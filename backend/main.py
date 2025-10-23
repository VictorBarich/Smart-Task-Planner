from fastapi import FastAPI
from task_routes import router
from tasks import Task, Tasks
from global_task_manager import task_manager

def main():

    task1 = Task("Task 1", "This is the first task.")
    task2 = Task("Task 2", "This is the second task.")

    task_manager.add_task(task1)
    task_manager.add_task(task2)

    print("Listing all tasks:")
    task_manager.list_tasks()

    task_manager.remove_task(task1)
    print("After removing Task 1:")
    task_manager.list_tasks()

if __name__ == "__main__":
    import uvicorn

    main() # Example task_manager manipulation

    app = FastAPI()
    app.include_router(router)
    uvicorn.run(app, host="0.0.0.0", port=8000)