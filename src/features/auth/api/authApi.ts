import { axiosClient } from '../../../lib/axiosClient';
import type { AuthUser } from '../../../types/auth';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  username: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface RefreshResponse {
  accessToken: string;
  user: AuthUser;
}

export const login = async (data: LoginPayload): Promise<AuthResponse> => {
  return await axiosClient.post<AuthResponse, AuthResponse>(
    '/user/login',
    data,
  );
};

export const register = async (
  data: RegisterPayload,
): Promise<AuthResponse> => {
  return await axiosClient.post<AuthResponse, AuthResponse>('/user', data);
};

export const googleAuth = async (
  accessToken: string,
): Promise<AuthResponse> => {
  return await axiosClient.post<AuthResponse, AuthResponse>(
    '/user/google-auth',
    {
      accessToken,
    },
  );
};

// Called by useAuthInit on app mount — do not call directly from other components
export const refreshTokens = async (): Promise<RefreshResponse> => {
  return await axiosClient.post<RefreshResponse, RefreshResponse>(
    '/auth/refresh',
  );
};

// Revokes the refresh token cookie on the server, then call authStore.logout()
export const logoutUser = async (): Promise<void> => {
  await axiosClient.post('/auth/logout');
};
