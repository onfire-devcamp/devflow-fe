import { create } from 'zustand';

type AuthUser = {
  id: string;
  username: string;
  email: string;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
};

const readStoredAuth = () => {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }

  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  if (!token || !userString) {
    return { token: null, user: null };
  }

  try {
    const user = JSON.parse(userString) as AuthUser;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
};

export const useAuthStore = create<AuthState>((set) => {
  const initial = readStoredAuth();

  return {
    token: initial.token,
    user: initial.user,
    login: (token, user) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ token, user });
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ token: null, user: null });
    },
  };
});
