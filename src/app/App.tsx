import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '../routes/appRoutes';
import { useAuthInit } from '../features/auth/hooks/useAuthInit';

function AppContent() {
  useAuthInit();
  return <AppRoutes />;
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
