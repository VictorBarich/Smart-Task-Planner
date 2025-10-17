import "./Task.css";

function Task({index, name, completed, checkboxActionFunction}) {

  return (
    <div className="Task">
        <h2>{index}.</h2> <h2>{name}</h2> <input type="checkbox" defaultChecked={completed} onChange={checkboxActionFunction}></input>
    </div>
  );
}

export default Task;
