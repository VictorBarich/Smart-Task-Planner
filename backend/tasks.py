
class Task:
    def __init__(self, name, description):
        self.name = name
        self.description = description

    def __repr__(self):
        return f"Task(name={self.name}, description={self.description})"
    
    def print_task(self):
        print(f"Task Name: {self.name}")
        print(f"Description: {self.description}")

class Tasks:
    def __init__(self):
        self.tasks = []

    def add_task(self, task):
        self.tasks.append(task)

    def remove_task(self, task):
        self.tasks.remove(task)

    def list_tasks(self):
        for task in self.tasks:
            task.print_task()
            print("-----")