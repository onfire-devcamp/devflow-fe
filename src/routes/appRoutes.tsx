import { Routes, Route, Navigate } from 'react-router-dom';
import { PATHS } from '../config/paths';
import { LoginPage } from '../features/auth/components/LoginPage';
import ProfilePage from '../features/profile/components/ProfilePage';
import RoadMapLayout from '../features/roadmap/index';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';

export function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC ROUTES*/}
      <Route element={<PublicRoute />}>
        <Route path={PATHS.LOGIN} element={<LoginPage />} />
        <Route path={PATHS.REGISTER} element={<div>Register page</div>} />
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
      {/*  PRIVATE ROUTES */}
      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<div>Dashboard page</div>} />
        <Route path="/roadmap" element={<RoadMapLayout />} />
      </Route>
    </Routes>
  );
}
