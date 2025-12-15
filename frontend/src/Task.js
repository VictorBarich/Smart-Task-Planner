// Attribution: Claude helped with re-factoring this component so that it is more visually appealing
import "./Task.css";

function Task({
  index,
  name,
  description,
  category,
  completed,
  checkboxActionFunction,
  deletionCallbackFunction
}) {
  return (
    <div className={`task-card ${completed ? 'task-completed' : ''}`}>
      <div className="task-gradient-overlay" />
      
      <div className="task-content">
        <div className="task-main">
          {/* Custom styled checkbox */}
          <div className="task-checkbox-wrapper">
            <input
              type="checkbox"
              checked={completed}
              onChange={checkboxActionFunction}
              className="task-checkbox-input"
            />
            <div className={`task-checkbox-custom ${completed ? 'checked' : ''}`}>
              {completed && (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13 4L6 11L3 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </div>

          {/* Title section */}
          <div className="task-details">
            <div className="task-title-row">
              <span className="task-index">#{index}</span>
              <h3 className="task-name">{name}</h3>
            </div>
            
            {description && (
              <p className="task-description">{description}</p>
            )}

            {category && (
              <span className="task-category">{category}</span>
            )}
          </div>

          {/* Delete button */}
          <button
            onClick={deletionCallbackFunction}
            className="task-delete"
            aria-label="Delete task"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M5.5 4V2.5a1 1 0 011-1h3a1 1 0 011 1V4m1.5 0v9.5a1 1 0 01-1 1h-7a1 1 0 01-1-1V4h9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="task-delete-text">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Task;