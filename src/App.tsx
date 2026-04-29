
import { useStore } from './store';
import SetupScreen from './components/SetupScreen';
import Dashboard from './components/Dashboard';

function App() {
  const { githubToken } = useStore();

  return (
    <div style={{ minHeight: '100vh', width: '100vw' }}>
      {!githubToken ? <SetupScreen /> : <Dashboard />}
    </div>
  );
}

export default App;
