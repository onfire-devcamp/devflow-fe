import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PATHS } from '../config/paths';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';
import { LoginPage } from '../features/auth/components/LoginPage';
import { PageLoader } from '../components/ui/PageLoader';
import RoadMapLayout from '../features/roadmap/index';

const RegisterPage = lazy(
  () => import('../features/auth/components/RegisterPage'),
);
const ProfilePage = lazy(
  () => import('../features/profile/components/ProfilePage'),
);
const DashboardPage = lazy(
  () => import('../features/dashboard/components/DashboardPage'),
);
const ProjectDetailPage = lazy(
  () => import('../features/projects/components/ProjectDetailPage'),
);

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<PublicRoute />}>
          <Route path={PATHS.LOGIN} element={<LoginPage />} />
          <Route path={PATHS.REGISTER} element={<RegisterPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* PRIVATE ROUTES */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/project/:projectSlug" element={<ProjectDetailPage />} />
          <Route path="/workspace/:projectSlug" element={<RoadMapLayout />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
