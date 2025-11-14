
class Task:
    def __init__(self, name, description, priority: int = 5):
        self.name = name
        self.completed = False
        self.description = description

        if not (1 <= priority <= 10):
            raise ValueError("priority must be between 1 and 10")
        self.priority = priority

    def __repr__(self):
        return f"Task(name={self.name}, description={self.description}, completed={self.completed})"
    
    def __mark_complete__(self):
        self.completed = True

    def __mark_incomplete__(self):
        self.completed = False

    def print_task(self):
        print(f"Task Name: {self.name}")
        print(f"Description: {self.description}")
        print(f"Completed: {self.completed}")

    def set_priority(self, new_priority: int):
        if not (1 <= new_priority <= 10):
            raise ValueError("new_priority must be between 1 and 10")
        self.priority = new_priority

class Tasks:
    def __init__(self):
        self.tasks = []

    def add_task(self, task):
        self.tasks.append(task)

    def remove_task(self, task):
        self.tasks.remove(task)

    def mark_task_complete(self, task):
        task.__mark_complete__()

    def mark_task_incomplete(self, task):
        task.__mark_incomplete__()

    def list_tasks(self):
        for task in self.tasks:
            task.print_task()
            print("-----")
