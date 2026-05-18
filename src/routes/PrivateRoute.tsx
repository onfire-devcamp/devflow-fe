import { Navigate, Outlet } from 'react-router-dom';

export function PrivateRoute() {
  // 1. check token exist
  const token = localStorage.getItem('token');

  // 2. if not back to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
