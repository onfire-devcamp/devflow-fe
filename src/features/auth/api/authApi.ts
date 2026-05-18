import { axiosClient } from '../../../lib/axiosClient';

export interface LoginPayload {
  email: string;
  password: string;
}

export const login = async (data: LoginPayload) => {
  const response = await axiosClient.post('/user/login', data);

  return response.data;
};
