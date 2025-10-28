import os
from tasks import Task, Tasks
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
API_KEY = os.getenv("API_KEY")


def ai_reordering(tasks_object):
    tasks = tasks_object.tasks

    # Generate prompt with description and tasks 
    prompt = """You are a task prioritizer and prioritize tasks based their names and descriptions. 
                Rearrange the given list of tasks in descending priority (most important task first),
                depending on the task name and description. Here are the tasks:\n"""
    for i in range(len(tasks)):
        prompt += f"{i}. Task Name: {tasks[i].name}. Task Description: {tasks[i].description}\n"

    prompt += """Remember to return the tasks in order of priority from most important to least important.
                Return only a numbered list of task names, nothing else. Do not repeat the prompt.
                Format exactly like this:
                1. Task 1
                2. Task 2
                3. Task 3"""



    # Call the API
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel("gemini-2.5-flash")
    raw_output = model.generate_content(prompt).text



    # Reformat the output and set it to the new tasks list
    # print(f"raw output: {raw_output}")
    list_ordered_names = [line.split(". ", 1)[1].strip() for line in raw_output.split("\n") if ". " in line]
    if (len(list_ordered_names) != len(tasks)):
        print(f"Provided {len(tasks)} to model but got only {len(list_ordered_names)} back")
        
    name_task_mapping = {task.name: task for task in tasks}
    tasks_object.tasks = [name_task_mapping[name] for name in list_ordered_names if name in name_task_mapping]

    return tasks_object