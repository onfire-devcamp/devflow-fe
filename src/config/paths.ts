export const PATHS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
  PROJECT_DETAIL: (slug: string) => `/project/${slug}`,
} as const;
