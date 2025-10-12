from tasks import Task, Tasks
from ai import ai_reordering

def main():
    task_manager = Tasks()

    task1 = Task("Task 1", "This is the first task.")
    task2 = Task("Task 2", "This is the second task.")

    task_manager.add_task(task1)
    task_manager.add_task(task2)

    print("Listing all tasks:")
    task_manager.list_tasks()

    task_manager.remove_task(task1)
    print("After removing Task 1:")
    task_manager.list_tasks()


    print("Testing AI reordering")
    task_manager.add_task(Task("Task 66", "This task is not very important."))
    task_manager.add_task(Task("Task 67", "This task is critical."))
    task_manager.list_tasks()

    ai_reordering(task_manager)

    print("After AI reordering:")
    task_manager.list_tasks()


if __name__ == "__main__":
    main()