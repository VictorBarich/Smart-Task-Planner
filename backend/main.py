from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from task_routes import router
from tasks import Task, Tasks
from global_task_manager import task_manager
from ai import ai_reordering

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

    # allow the frontend to access the backend

    origins = ["http://localhost:3000"]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    uvicorn.run(app, host="0.0.0.0", port=8000)
