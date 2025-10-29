import './BackendConnectionWarning.css';

function BackendConnectionWarning() {
  return (
    <div className="BackendConnectionWarning">
      <h3>&#9888; Not connected to backend</h3>
      <p>The pictured task list is a demonstration and changes will not propagate.</p>
    </div>
  );
}

export default BackendConnectionWarning;
