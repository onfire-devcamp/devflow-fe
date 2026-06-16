import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../features/auth/stores/authStore';
import { PageLoader } from '../components/ui/PageLoader';

export function PrivateRoute() {
  const status = useAuthStore((state) => state.status);

  if (status === 'loading') return <PageLoader />;
  if (status === 'unauthenticated') return <Navigate to="/login" replace />;

  return <Outlet />;
}
