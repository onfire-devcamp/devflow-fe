export const PATHS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
  PROJECT_DETAIL: (id: string) => `/projects/${id}`,
} as const;
