import { Routes, Route, Navigate } from 'react-router-dom';
import { PATHS } from '../config/paths';
import { LoginPage } from '../features/auth/components/LoginPage';
import ProfilePage from '../features/profile/components/ProfilePage';

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path={PATHS.HOME}
        element={<Navigate to={PATHS.LOGIN} replace />}
      />
      <Route path={PATHS.LOGIN} element={<LoginPage />} />
      <Route path={PATHS.PROFILE} element={<ProfilePage />} />
    </Routes>
  );
}
