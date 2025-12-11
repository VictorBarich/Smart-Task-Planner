import "./Task.css";

function Task({
  index,
  name,
  description,
  completed,
  checkboxActionFunction,
  deletionCallbackFunction
}) {
  return (
    <div className="task-card">
      <div className="task-header">
        <div className="task-title">
          <span className="task-index">{index}.</span>
          <span className="task-name">{name}</span>
        </div>

        <input
          type="checkbox"
          checked={completed}
          onChange={checkboxActionFunction}
          className="task-checkbox"
        />
      </div>

      <p className="task-description">{description}</p>

      <button className="task-delete" onClick={deletionCallbackFunction}>
        Delete
      </button>
    </div>
  );
}

export default Task;
