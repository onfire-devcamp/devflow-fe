import { create } from 'zustand';

type ToastVariant = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  autoDismiss?: boolean;
  duration?: number;
}

type ToastState = {
  toasts: ToastItem[];
  pushToast: (
    message: string,
    variant: ToastVariant,
    autoDismiss?: boolean,
    duration?: number,
  ) => void;
  removeToast: (id: string) => void;
  clearPersistentToasts: () => void;
};

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  pushToast: (message, variant, autoDismiss = true, duration = 4_000) => {
    set((state) => {
      const alreadyExists = state.toasts.some(
        (toast) => toast.message === message && toast.variant === variant,
      );
      if (alreadyExists) {
        return state;
      }

      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      return {
        toasts: [
          ...state.toasts,
          { id, message, variant, autoDismiss, duration },
        ],
      };
    });
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
  clearPersistentToasts: () =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.autoDismiss),
    })),
}));
