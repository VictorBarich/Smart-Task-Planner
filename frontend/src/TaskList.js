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
      <h1>Tasks</h1>
        {Object.keys(tasks).map(function(task_name, i){
            const task = tasks[task_name];
            // Use a 1-indexed task list
            return <Task index={i+1} name={task_name} completed={task.completed} key={i}/>
        })}
    </div>
  );
}

export default TaskList;
