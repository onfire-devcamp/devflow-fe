import { create } from 'zustand';
import type { AuthUser, AuthStatus } from '../../../types/auth';

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  status: AuthStatus;
  // Called after a successful login / register / google-auth / refresh
  login: (accessToken: string, user: AuthUser) => void;
  // Clears in-memory state only. API call to revoke the cookie is handled separately.
  logout: () => void;
  // Used by the axios interceptor when a silent refresh succeeds
  setAccessToken: (token: string) => void;
  // Used by useAuthInit when the refresh attempt fails (no cookie, expired, etc.)
  markUnauthenticated: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  status: 'loading', // Stays 'loading' until useAuthInit resolves

  login: (accessToken, user) =>
    set({ accessToken, user, status: 'authenticated' }),

  logout: () =>
    set({ accessToken: null, user: null, status: 'unauthenticated' }),

  setAccessToken: (token) =>
    set({ accessToken: token, status: 'authenticated' }),

  markUnauthenticated: () =>
    set({ accessToken: null, user: null, status: 'unauthenticated' }),
}));
