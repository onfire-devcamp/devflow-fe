import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../features/auth/stores/authStore';

export function PublicRoute() {
  const status = useAuthStore((state) => state.status);

  // Redirect already-authenticated users away from login/register
  if (status === 'authenticated') return <Navigate to="/profile" replace />;

  // Show the form immediately while loading — if the user turns out to be
  // authenticated the redirect above will fire on the next render
  return <Outlet />;
}
