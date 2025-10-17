import "./Task.css";

function Task({index, name, completed}) {

  return (
    <div className="Task">
        <h2>{index}. &nbsp; {name}</h2> &nbsp; <input type="checkbox" defaultChecked={completed}></input>
    </div>
  );
}

export default Task;
