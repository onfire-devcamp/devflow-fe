import { type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../features/auth/stores/authStore';
import {
  useOfflineSyncStore,
  type OfflineRequest,
  type OfflineRequestMethod,
} from '../stores/offlineSyncStore';

const STORAGE_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const buildFullUrl = (
  url: string | undefined,
  baseURL: string | undefined,
): string | null => {
  if (!url) return null;

  try {
    if (/^https?:\/\//.test(url)) {
      return url;
    }

    const base = baseURL || STORAGE_BASE_URL || window.location.origin;
    return new URL(url, base).toString();
  } catch {
    return null;
  }
};

const appendParamsToUrl = (
  url: string,
  params?: Record<string, unknown>,
): string => {
  if (!params || Object.keys(params).length === 0) return url;

  const uri = new URL(url);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      uri.searchParams.set(key, String(value));
    }
  });

  return uri.toString();
};

export const queueOfflineRequest = (
  config: InternalAxiosRequestConfig | undefined,
) => {
  if (!config?.url || !config.method) return;

  const method = config.method.toString().toUpperCase() as OfflineRequestMethod;
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) return;

  if (!config.data && !config.params) return;

  const fullUrl = buildFullUrl(config.url, config.baseURL ?? STORAGE_BASE_URL);
  if (!fullUrl) return;

  const urlWithParams = appendParamsToUrl(
    fullUrl,
    config.params as Record<string, unknown> | undefined,
  );

  const request: OfflineRequest = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    method,
    url: urlWithParams,
    data: config.data,
    params: config.params as Record<string, unknown> | undefined,
    addedAt: Date.now(),
  };

  useOfflineSyncStore.getState().addPendingRequest(request);
};

export const syncOfflineRequests = async () => {
  const pendingRequests = useOfflineSyncStore.getState().pendingRequests;
  if (!pendingRequests.length) return;

  useOfflineSyncStore.getState().setSyncing(true);

  const token = useAuthStore.getState().accessToken;
  const requestsToSync = [...pendingRequests];

  await Promise.all(
    requestsToSync.map(async (request) => {
      try {
        const response = await fetch(request.url, {
          method: request.method,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: request.data ? JSON.stringify(request.data) : undefined,
        });

        if (!response.ok) {
          throw new Error(`Sync failed with status ${response.status}`);
        }

        useOfflineSyncStore.getState().removePendingRequest(request.id);
      } catch (err) {
        console.error('Offline sync request failed', request.url, err);
      }
    }),
  );

  useOfflineSyncStore.getState().setSyncing(false);
};
