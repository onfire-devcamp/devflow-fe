import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '../routes/appRoutes';
import { useAuthInit } from '../features/auth/hooks/useAuthInit';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { useErrorStore } from '../stores/errorStore';
import { ErrorPage } from '../components/ui/ErrorPage';
import { useEffect } from 'react';

function AppContent() {
  useAuthInit();
  const globalError = useErrorStore((s) => s.globalError);
  const setGlobalError = useErrorStore((s) => s.setGlobalError);
  const clearGlobalError = useErrorStore((s) => s.clearGlobalError);

  useEffect(() => {
    function handleOffline() {
      setGlobalError('Network offline: please check your internet connection.');
    }

    function handleOnline() {
      clearGlobalError();
    }

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [setGlobalError, clearGlobalError]);

  if (globalError) return <ErrorPage />;

  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
