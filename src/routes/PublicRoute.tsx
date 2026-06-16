import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../features/auth/stores/authStore';

export function PublicRoute() {
  const status = useAuthStore((state) => state.status);

  if (status === 'authenticated') return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
