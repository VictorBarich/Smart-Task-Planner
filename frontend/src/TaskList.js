import { useState, useEffect } from "react";
import Task from "./Task";
import BackendConnectionWarning from "./BackendConnectionWarning";

const demoTasks = [
  {
    name: "Wash the Dishes",
    description: "Use the dish soap under the counter.",
    completed: false
  },
  {
    name: "Do the Laundry",
    description: "The hamper is full.",
    completed: false
  },
  {
    name: "Feed the Dog",
    description: "Sparky needs to be fed at 6:00 PM.",
    completed: true
  }
]

function TaskList() {
  const [tasks, setTasks] = useState([]);

  // Reactive states for showing the loading message and backend disconnected warning
  const [connectionWarningShowing, setConnectionWarningShowing] = useState(false);
  const [loadingScreenShowing, setLoadingScreenShowing] = useState(true);


  useEffect(() => {
    const fetchTaskList = async () => {
      try {
        // Attempt to fetch the task list from the backend
        const response = await fetch('http://localhost:8000/api/tasks/all');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setTasks(result);
      } catch (error) {
        console.log(`Error fetching task list: ${error}`);

        // Failed to connect; show the connection warning and use the demo task list
        setConnectionWarningShowing(true);
        setTasks(demoTasks);
      } finally {
        // Remove the loading text
        setLoadingScreenShowing(false);
      }
    };

    fetchTaskList();
  }, []);

  return (
    <div className="TaskList">
      <h2>Tasks</h2>
      {/* Show either the loading text or the task list depending on the state */}
      {
        loadingScreenShowing ? <h3>Loading...</h3> :
      <div>
      {/* Show the backend connection warning if the state is true */}
      {connectionWarningShowing && <BackendConnectionWarning />}
      <h3>To-Do:</h3>
      {tasks.map((task, i) => {
        const setTaskState = () => {
          //TODO: integrate with backend completion route when it is created
          setTasks(prev =>
            prev.map((task, ind) =>
              i === ind ? { ...task, completed: true } : task
            )
          );
        };
        if (!task.completed)
          // Use a 1-indexed task list
          return <Task index={i + 1} name={task.name} description={task.description} completed={task.completed} key={i} getTasks={tasks} checkboxActionFunction={setTaskState} />
        else
          return null;
      })}
      <hr></hr>
      <h3>Completed:</h3>
      {tasks.map((task, i) => {
        const setTaskState = () => {
          //TODO: integrate with backend completion route when it is created
          setTasks(prev =>
            prev.map((task, ind) =>
              i === ind ? { ...task, completed: false } : task
            )
          );
        };
        if (task.completed)
          // Use a 1-indexed task list
          return <Task index={i + 1} name={task.name} description={task.description} completed={task.completed} key={i} getTasks={tasks} checkboxActionFunction={setTaskState} />
        else
          return null;
      })}
    </div>
    }
    </div>
  );
}

export default TaskList;
