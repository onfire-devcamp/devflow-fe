import { create } from 'zustand';

const STORAGE_KEY = 'devflow-offline-requests';

export type OfflineRequestMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface OfflineRequest {
  id: string;
  method: OfflineRequestMethod;
  url: string;
  data?: unknown;
  params?: Record<string, unknown>;
  addedAt: number;
}

interface OfflineSyncState {
  pendingRequests: OfflineRequest[];
  isSyncing: boolean;
  addPendingRequest: (request: OfflineRequest) => void;
  removePendingRequest: (id: string) => void;
  clearPendingRequests: () => void;
  setSyncing: (isSyncing: boolean) => void;
}

const loadPendingRequests = (): OfflineRequest[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OfflineRequest[]) : [];
  } catch {
    return [];
  }
};

const persistPendingRequests = (requests: OfflineRequest[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
};

export const useOfflineSyncStore = create<OfflineSyncState>((set) => ({
  pendingRequests: loadPendingRequests(),
  isSyncing: false,
  addPendingRequest: (request) =>
    set((state) => {
      const exists = state.pendingRequests.some(
        (pending) =>
          pending.method === request.method &&
          pending.url === request.url &&
          JSON.stringify(pending.data) === JSON.stringify(request.data) &&
          JSON.stringify(pending.params) === JSON.stringify(request.params),
      );

      if (exists) {
        return state;
      }

      const nextRequests = [...state.pendingRequests, request];
      persistPendingRequests(nextRequests);
      return { pendingRequests: nextRequests };
    }),
  removePendingRequest: (id) =>
    set((state) => {
      const nextRequests = state.pendingRequests.filter(
        (request) => request.id !== id,
      );
      persistPendingRequests(nextRequests);
      return { pendingRequests: nextRequests };
    }),
  clearPendingRequests: () => {
    persistPendingRequests([]);
    return { pendingRequests: [] };
  },
  setSyncing: (isSyncing) => ({ isSyncing }),
}));
