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


def test_adding_dates_and_categories():
    test_task_manager = Tasks()
    task1 = Task("Task 1", "This is the first task.")
    task2 = Task("Task 2", "This is the second task.", category="Work")
    task3 = Task("Task 3", "This is unimportant.")
    task4 = Task("Task 4", "This is a task.", category="General")
    task5 = Task("Task 5", "This is a task.", category="Critical")
    task6 = Task("Task 6", "This is a task.")
    task7 = Task("Task 7", "This is a task.")

    task1.__set_due_date__("2024-10-01")
    task2.__set_due_date__("2024-10-05")
    task6.__set_due_date__("2026-10-01")
    task7.__set_due_date__("2028-10-05")
    task2.__mark_complete__()

    test_task_manager.add_task(task1)
    test_task_manager.add_task(task2)
    test_task_manager.add_task(task3)
    test_task_manager.add_task(task4)
    test_task_manager.add_task(task5)
    test_task_manager.add_task(task6)
    test_task_manager.add_task(task7)


    reordered_task_manager = ai_reordering(test_task_manager)

    assert(len(reordered_task_manager.tasks) == 7)
    print("Tasks:\n")
    reordered_task_manager.list_tasks()

    # testing categories
    general_index = reordered_task_manager.tasks.index(task4)
    critical_index = reordered_task_manager.tasks.index(task5)
    assert(critical_index < general_index)
    
    # testing due dates
    sooner_index = reordered_task_manager.tasks.index(task6)
    later_index = reordered_task_manager.tasks.index(task7)
    assert(sooner_index < later_index)



