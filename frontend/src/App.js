import './App.css';
import TaskList from "./TaskList";
import { ToastProvider } from "./ToastContext";
import STP_Logo from './STP_Logo.png';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img style={{maxHeight: '10em'}} src={STP_Logo} alt="Logo Image"></img>
        <ToastProvider>
          <TaskList />
        </ToastProvider>
      </header>
    </div>
  );
}

export default App;
