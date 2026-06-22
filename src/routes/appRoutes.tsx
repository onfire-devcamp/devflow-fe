import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PATHS } from '../config/paths';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';
import { LoginPage } from '../features/auth/components/LoginPage';
import { Loading } from '../components/Loading';
import { NotFoundPage } from '../components/ui/NotFoundPage';
import RoadMapLayout from '../features/roadmap/index';
import LandingPage from '../features/landing_page/index';
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
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<PublicRoute />}>
          <Route path={PATHS.LOGIN} element={<LoginPage />} />
          <Route path={PATHS.REGISTER} element={<RegisterPage />} />
        </Route>
        <Route path="/" element={<LandingPage />} />
        <Route path="/404" element={<NotFoundPage />} />

        {/* PRIVATE ROUTES */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/project/:projectSlug" element={<ProjectDetailPage />} />
          <Route path="/workspace/:projectSlug" element={<RoadMapLayout />} />
        </Route>

        {/* Catch-all: show 404 for any unmatched route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
