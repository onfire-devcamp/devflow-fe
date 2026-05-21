import { Routes, Route, Navigate } from 'react-router-dom';
import { PATHS } from '../constants/paths';
import { LoginPage } from '../pages/auth/LoginPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path={PATHS.HOME}
        element={<Navigate to={PATHS.LOGIN} replace />}
      />
      <Route path={PATHS.LOGIN} element={<LoginPage />} />
    </Routes>
  );
}
