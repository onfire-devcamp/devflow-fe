import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../features/auth/stores/authStore';

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}

interface RefreshResponse {
  accessToken: string;
  user: { id: string; username: string; email: string };
}

let isRefreshing = false;
let failedRequestQueue: FailedRequest[] = [];

const drainQueue = (token: string) => {
  failedRequestQueue.forEach(({ resolve }) => resolve(token));
  failedRequestQueue = [];
};

const rejectQueue = (error: AxiosError) => {
  failedRequestQueue.forEach(({ reject }) => reject(error));
  failedRequestQueue = [];
};

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const isRefreshEndpoint = originalRequest?.url?.includes('/auth/refresh');
    if (error.response?.status !== 401 || isRefreshEndpoint) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedRequestQueue.push({ resolve, reject });
      }).then((newToken) => {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const data = await axiosClient.post<RefreshResponse, RefreshResponse>(
        '/auth/refresh',
      );

      useAuthStore.getState().login(data.accessToken, data.user);
      drainQueue(data.accessToken);

      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return axiosClient(originalRequest);
    } catch (refreshError) {
      rejectQueue(refreshError as AxiosError);
      useAuthStore.getState().logout();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
