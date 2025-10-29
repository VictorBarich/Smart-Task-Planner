import "./Task.css";

function Task({ index, name, description, completed, checkboxActionFunction }) {

  return (
    <div className="Task">
      <div className="TaskRow">
        <h2>{index}.</h2> <h2>{name}</h2> <input type="checkbox" defaultChecked={completed} onChange={checkboxActionFunction}></input>
      </div>
      <div className="TaskRow">
        <p>{description}</p>
      </div>
    </div>
  );
}

export default Task;
