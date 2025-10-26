import "./TaskAdd.css";
import './Task.css';
import { useState } from "react";

function TaskAdd({ callbackFunction }) {
    const [taskName, setTaskName] = useState(''); 
    const [taskDescription, setTaskDescription] = useState(''); 

    return (
        <div className="Task">
            <div className="TaskRow">
                <p>Task Name: <input placeholder="Write a letter" value={taskName} onChange={(event)=>setTaskName(event.target.value)}></input></p>
            </div>
            <div className="TaskRow">
                <p>Task Description: <textarea placeholder="Use a ballpoint pen..." value={taskDescription} onChange={(event)=>setTaskDescription(event.target.value)}></textarea></p>
            </div>
            <div className="TaskRow">
                <button className="TaskAddButton" onClick={()=>callbackFunction(taskName, taskDescription)}>Add</button>
            </div>
        </div>
    );
}

export default TaskAdd;
