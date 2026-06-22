import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../features/auth/stores/authStore';
import { useToastStore } from '../stores/toastStore';

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}

interface RefreshResponse {
  accessToken: string;
  user: { id: string; username: string; email: string };
}

// Check if the error is caused by a network disconnection or connection refusal
const isNetworkError = (error: AxiosError) =>
  !error.response ||
  ['ERR_NETWORK', 'ERR_CONNECTION_REFUSED'].includes(error.code as string) ||
  error.message?.includes('Network Error');

// Check if the server is temporarily unavailable (Bad Gateway or Service Unavailable)
const isServerUnavailable = (status?: number) =>
  status === 502 || status === 503;

let isRefreshing = false;
let failedRequestQueue: FailedRequest[] = [];

// Resolve all queued requests with the newly fetched access token
const drainQueue = (token: string) => {
  failedRequestQueue.forEach(({ resolve }) => resolve(token));
  failedRequestQueue = [];
};

// Reject all queued requests if the token refresh process fails
const rejectQueue = (error: AxiosError) => {
  failedRequestQueue.forEach(({ reject }) => reject(error));
  failedRequestQueue = [];
};

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const handleTokenRefresh = async (
  originalRequest: InternalAxiosRequestConfig & { _retry?: boolean },
) => {
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
    const axiosError = refreshError as AxiosError;
    rejectQueue(axiosError);

    const refreshStatus = axiosError.response?.status;
    if (!isNetworkError(axiosError) && !isServerUnavailable(refreshStatus)) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(axiosError);
  } finally {
    isRefreshing = false;
  }
};

// Request Interceptor: Attach the access token to every outgoing request
axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handle global errors, token expiration, and routing
axiosClient.interceptors.response.use(
  (response) => {
    useToastStore.getState().clearPersistentToasts();
    return response.data;
  },
  async (error: AxiosError) => {
    const toast = useToastStore.getState().pushToast;
    const status = error.response?.status;
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const isOfflineMode = typeof navigator !== 'undefined' && !navigator.onLine;
    // 1. Handle network failures, offline browser, or dead server scenarios
    if (isOfflineMode || isNetworkError(error) || isServerUnavailable(status)) {
      // Only show the toast if the browser thinks it's online to avoid overlapping with global offline listeners
      if (!isOfflineMode) {
        toast(
          'Unable to connect to the server. Please check your network or try again later.',
          'error',
          true,
          5_000,
        );
      }
      return Promise.reject(error);
    }
    // 2. Handle specific HTTP status codes centrally
    switch (status) {
      case 401: {
        const isRefreshEndpoint =
          originalRequest?.url?.includes('/auth/refresh');
        // Prevent infinite loops by ensuring we don't retry the refresh endpoint itself or already retried requests
        if (!isRefreshEndpoint && !originalRequest._retry) {
          return handleTokenRefresh(originalRequest);
        }
        break;
      }
      case 404: {
        toast('The requested resource was not found.', 'error', true, 5_000);
        window.location.href = '/404';
        break;
      }
      default: {
        // Unhandled 4xx (e.g., 400, 403, 422) or 5xx (e.g., 500) errors will fall through here.
        break;
      }
    }

    return Promise.reject(error);
  },
);
