import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../features/auth/stores/authStore';
import { Loading } from '../components/Loading';

export function PrivateRoute() {
  const status = useAuthStore((state) => state.status);

  if (status === 'loading') return <Loading />;
  if (status === 'unauthenticated') return <Navigate to="/login" replace />;

  return <Outlet />;
}
