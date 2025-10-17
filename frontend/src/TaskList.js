import { useState } from "react";
import Task from "./Task";

const demoTasks = {
    "Wash the Dishes": {
        completed: false
    },
    "Do the Laundry": {
        completed: false
    },
    "Feed the Dog": {
        completed: true
    }
}

function TaskList() {
    const [tasks, setTasks] = useState(demoTasks);

  return (
    <div className="TaskList">
      <h2>Tasks</h2>
      <h3>To-Do:</h3>
        {Object.keys(tasks).map(function(task_name, i){
            const task = tasks[task_name];
            const setTaskState = ()=>{
              setTasks(prev => ({
                ...prev,
                [task_name]: { ...prev[task_name], completed: true }
              }));
            };
            if (!task.completed)
              // Use a 1-indexed task list
              return <Task index={i+1} name={task_name} completed={task.completed} key={i} getTasks={tasks} checkboxActionFunction={setTaskState} />
            else
              return null;
        })}
        <h3>Completed:</h3>
        {Object.keys(tasks).map(function(task_name, i){
            const task = tasks[task_name];
            const setTaskState = ()=>{
              setTasks(prev => ({
                ...prev,
                [task_name]: { ...prev[task_name], completed: false }
              }));
            };
            if (task.completed)
              // Use a 1-indexed task list
              return <Task index={i+1} name={task_name} completed={task.completed} key={i} getTasks={tasks} checkboxActionFunction={setTaskState} />
            else
              return null;
        })}
    </div>
  );
}

export default TaskList;
