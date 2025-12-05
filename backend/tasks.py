from datetime import datetime

class Task:
    def __init__(self, name, description):
        self.name = name
        self.completed = False
        self.description = description
        self.active_since = datetime.now()
        self.due_date = None

    def __repr__(self):
        return f"Task(name={self.name}, description={self.description}, completed={self.completed}, due_date={self.due_date})"

    def __mark_complete__(self):
        self.completed = True

    def __mark_incomplete__(self):
        self.completed = False

    def __set_due_date__(self, due_date: datetime):
        self.due_date = due_date

    def print_task(self):
        print(f"Task Name: {self.name}")
        print(f"Description: {self.description}")
        print(f"Completed: {self.completed}")
        print(f"Due Date: {self.due_date}")

    def set_active_since(self, new_time: datetime):
        if not isinstance(new_time, datetime):
            raise TypeError("new_time must be a datetime object")
        
        self.active_since = new_time

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
