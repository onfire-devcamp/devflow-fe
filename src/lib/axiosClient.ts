import axios from 'axios';
import { useAuthStore } from '../features/auth/stores/authStore';

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error?.config?.url ?? '';
    const isLoginRequest = requestUrl.includes('/user/login');

    if (error?.response?.status === 401 && !isLoginRequest) {
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);
