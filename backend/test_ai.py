import pytest
from tasks import Task, Tasks
from ai import ai_reordering


def test_basic_functionality():
    test_task_manager = Tasks()
    task1 = Task("Task 1", "This is the first task.")
    task2 = Task("Task 2", "This is the second task.", category="Work")
    task3 = Task("Task 3", "This is unimportant.")

    task1.__set_due_date__("2024-10-01")
    task2.__set_due_date__("2024-10-05")
    task2.__mark_complete__()

    test_task_manager.add_task(task1)
    test_task_manager.add_task(task2)
    test_task_manager.add_task(task3)


    reordered_task_manager = ai_reordering(test_task_manager)

    assert(len(reordered_task_manager.tasks) == 3)
    assert(reordered_task_manager.tasks[1].name == "Task 3")
    assert(reordered_task_manager.tasks[2].name == "Task 2")




