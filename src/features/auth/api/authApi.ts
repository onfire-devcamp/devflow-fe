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
  const response = await axiosClient.post<AuthResponse>(
    '/api/user/login',
    data,
  );
  return response.data;
};

export const register = async (
  data: RegisterPayload,
): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>('/api/user', data);
  return response.data;
};

export const googleAuth = async (
  accessToken: string,
): Promise<AuthResponse> => {
  const response = await axiosClient.post<AuthResponse>(
    '/api/user/google-auth',
    {
      accessToken,
    },
  );
  return response.data;
};

// Called by the axios interceptor — do not call directly from components
export const refreshTokens = async (): Promise<RefreshResponse> => {
  const response = await axiosClient.post<RefreshResponse>('/api/auth/refresh');
  return response.data;
};

// Revokes the refresh token cookie on the server, then call authStore.logout()
export const logoutUser = async (): Promise<void> => {
  await axiosClient.post('/api/auth/logout');
};
