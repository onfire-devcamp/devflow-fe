import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../features/auth/stores/authStore';

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return typeof payload.exp === 'number' && payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function PrivateRoute() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (!token || !user || isTokenExpired(token)) {
    if (token) logout();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
