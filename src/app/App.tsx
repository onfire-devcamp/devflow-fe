import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '../routes/appRoutes';
import { useAuthInit } from '../features/auth/hooks/useAuthInit';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { useErrorStore } from '../stores/errorStore';
import { ToastContainer } from '../components/ui/ToastContainer';
import { useToastStore } from '../stores/toastStore';
import { ErrorPage } from '../components/ui/ErrorPage';
import { useEffect } from 'react';

function AppContent() {
  useAuthInit();
  const globalError = useErrorStore((s) => s.globalError);
  const clearGlobalError = useErrorStore((s) => s.clearGlobalError);
  const pushToast = useToastStore((s) => s.pushToast);
  const clearPersistentToasts = useToastStore((s) => s.clearPersistentToasts);

  useEffect(() => {
    function handleOffline() {
      pushToast(
        'You are currently offline. Some features may be unavailable.',
        'error',
      );
    }

    async function handleOnline() {
      clearGlobalError();
      clearPersistentToasts();
      pushToast('Internet restored!', 'success');
    }

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [clearGlobalError, pushToast, clearPersistentToasts]);

  if (globalError) return <ErrorPage />;

  return (
    <>
      <ToastContainer />
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </>
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
