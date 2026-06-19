import { create } from 'zustand';

type ErrorState = {
  globalError: string | null;
  setGlobalError: (message: string) => void;
  clearGlobalError: () => void;
};

export const useErrorStore = create<ErrorState>((set) => ({
  globalError: null,
  setGlobalError: (message) => set({ globalError: message }),
  clearGlobalError: () => set({ globalError: null }),
}));
