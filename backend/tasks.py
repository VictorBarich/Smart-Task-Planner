
class Task:
    def __init__(self, name, description):
        self.name = name
        self.completed = False
        self.description = description

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
