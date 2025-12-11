import { useState, useEffect } from "react";
import Task from "./Task";
import BackendConnectionWarning from "./BackendConnectionWarning";
import TaskAdd from "./TaskAdd";
import './TaskList.css';
import { useToast } from "./ToastContext";

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

  const { addToast } = useToast();

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

  // Initial fetch of the task list
  useEffect(() => {
    fetchTaskList();
  }, []);

  const AddTask = async (taskName, taskDescription) => {
    // create a GET request to the backend to see if a task with the same name already exists
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/get/${taskName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Error if we get a successful response back (found a task), we want a 404
      if (response.status !== 404) {
        throw new Error(`Successful Response: ${response.status}`);
      }

    } catch (error) {
      // If task already exists, alert the user
      addToast('Error creating task: Task already exists or you may not be connected to the backend.', "error");
      return;
    }


    // create a POST request to the backend with the task name and description
    try {
      const response = await fetch('http://localhost:8000/api/tasks/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: taskName, description: taskDescription }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // If successful, alert the user and re-fetch the task list
      addToast(`Success: ${data.message}`, "success");
      fetchTaskList();
    } catch (error) {
      // If unsuccessful, alert the user
      addToast('Error creating task', "error");
    }
  };

  const DeleteTask = async (taskName) => {
    // create a DELETE request to the backend with the task name
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/delete/${taskName}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // If successful, alert the user and re-fetch the task list
      addToast(`Success: ${data.message}`, "success");
      fetchTaskList();
    } catch (error) {
      // If unsuccessful, alert the user
      addToast('Error deleting task. Note that task deletion is only available if connected to the backend.', "error");
    }
  };

  const PostTaskCompletionStatus = async (taskName, completed) => {
    // create a DELETE request to the backend with the task name
    try {
      const response = await fetch(`http://localhost:8000/api/tasks/${completed ? '' : 'in'}complete/${taskName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // If successful, alert the user and re-fetch the task list
      addToast(`Success: ${data.message}`, "success");
      fetchTaskList();
    } catch (error) {
      // If unsuccessful, alert the user
      addToast("Task completion status change not retained. Note that retaining task completion status is only available if connected to the backend.", "error");
    }
  };

  // Attribution: ChatGPT helped to refactor this code to display messages when there are no pending tasks
  return (
  <div className="TaskList">

    <div className="tasklist-container">

      {loadingScreenShowing ? (
        <h3 className="loading">Loading...</h3>
      ) : (
        <>
          {connectionWarningShowing && <BackendConnectionWarning />}

          <div className="grid">
            {/* TO-DO LIST */}
            <div className="card">
              <h3 className="section-title">To-Do</h3>
              {tasks.some(t => !t.completed) ? (
                tasks.map((task, i) => {
                  if (!task.completed) {
                    const setTaskState = () => {
                      setTasks(prev =>
                        prev.map((t, ind) =>
                          ind === i ? { ...t, completed: true } : t
                        )
                      );
                      PostTaskCompletionStatus(task.name, true);
                    };

                    return (
                      <Task
                        key={i}
                        index={i + 1}
                        name={task.name}
                        description={task.description}
                        completed={task.completed}
                        getTasks={tasks}
                        checkboxActionFunction={setTaskState}
                        deletionCallbackFunction={() => DeleteTask(task.name)}
                      />
                    );
                  }
                  return null;
                })
              ) : (
                <p className="empty">No pending tasks</p>
              )}
            </div>

            {/* COMPLETED LIST */}
            <div className="card">
              <h3 className="section-title">Completed</h3>
              {tasks.some(t => t.completed) ? (
                tasks.map((task, i) => {
                  if (task.completed) {
                    const setTaskState = () => {
                      setTasks(prev =>
                        prev.map((t, ind) =>
                          ind === i ? { ...t, completed: false } : t
                        )
                      );
                      PostTaskCompletionStatus(task.name, false);
                    };

                    return (
                      <Task
                        key={i}
                        index={i + 1}
                        name={task.name}
                        description={task.description}
                        completed={task.completed}
                        getTasks={tasks}
                        checkboxActionFunction={setTaskState}
                        deletionCallbackFunction={() => DeleteTask(task.name)}
                      />
                    );
                  }
                  return null;
                })
              ) : (
                <p className="empty">No completed tasks</p>
              )}
            </div>
          </div>

          {/* ADD NEW TASK */}
          <div className="card create-task-card">
            <h3 className="section-title">Create a Task</h3>
            <TaskAdd callbackFunction={AddTask} />
          </div>
        </>
      )}
    </div>
  </div>
);
}

export default TaskList;
