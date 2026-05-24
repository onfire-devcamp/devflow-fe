import { axiosClient } from '../../../lib/axiosClient';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  username: string;
}

export const login = async (data: LoginPayload) => {
  const response = await axiosClient.post('/user/login', data);
  return response.data;
};

export const register = async (data: RegisterPayload) => {
  const response = await axiosClient.post('/user', data);
  return response.data;
};

export const googleAuth = async (accessToken: string) => {
  const response = await axiosClient.post('/user/google-auth', { accessToken });
  return response.data;
};
