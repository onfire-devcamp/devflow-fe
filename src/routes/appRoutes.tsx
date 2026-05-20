import { Routes, Route, Navigate } from 'react-router-dom';
<<<<<<< HEAD
import { PATHS } from '../config/paths';
import { LoginPage } from '../features/auth/components/LoginPage';
import ProfilePage from '../features/profile/components/ProfilePage';
import { PrivateRoute } from './PrivateRoute';
export function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC ROUTES*/}
      <Route path={PATHS.LOGIN} element={<LoginPage />} />
      <Route path={PATHS.REGISTER} element={<div>Trang đăng ký</div>} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      {/*  PRIVATE ROUTES */}
      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<div>Trang quản lý</div>} />
      </Route>
    </Routes>
  );
}
=======
import { PATHS } from '../constants/paths';
import LoginPage from '../pages/auth/LoginPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path={PATHS.HOME}
        element={<Navigate to={PATHS.LOGIN} replace />}
      />
      <Route path={PATHS.LOGIN} element={<LoginPage />} />
    </Routes>
  );
};
>>>>>>> 7e22f49 (fix: seperating routing logic and extract path strings into shared constant file)
