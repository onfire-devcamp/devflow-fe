import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../features/auth/stores/authStore';

export function PrivateRoute() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
