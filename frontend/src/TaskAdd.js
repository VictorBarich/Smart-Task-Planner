import "./TaskAdd.css";
import { useState } from "react";
import { useToast } from "./ToastContext";


function TaskAdd({ callbackFunction }) {
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const { addToast } = useToast();

  const submit = () => {
    callbackFunction(taskName, taskDescription);
    setTaskName("");
    setTaskDescription("");
  };

  return (
    <div className="taskadd-card">
      <div className="taskadd-field">
        <label>Task Name</label>
        <input
          className="taskadd-input"
          placeholder="Write a letter"
          value={taskName}
          onChange={(event) => setTaskName(event.target.value)}
        />
      </div>

      <div className="taskadd-field">
        <label>Task Description</label>
        <textarea
          className="taskadd-textarea"
          placeholder="Use a ballpoint pen..."
          value={taskDescription}
          onChange={(event) => setTaskDescription(event.target.value)}
        />
      </div>

      <button className="taskadd-button" onClick={submit}>
        Add Task
      </button>
    </div>
  );
}

export default TaskAdd;
