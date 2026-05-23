import { Routes, Route, Navigate } from 'react-router-dom';
import { PATHS } from '../constants/paths';
import { LoginPage } from '../pages/auth/LoginPage';
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
        <Route path="/profile" element={<div>Trang cá nhân</div>} />
        <Route path="/dashboard" element={<div>Trang quản lý</div>} />
      </Route>
    </Routes>
  );
}
