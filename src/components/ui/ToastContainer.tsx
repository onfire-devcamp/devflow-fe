import { useEffect } from 'react';
import { useToastStore } from '../../stores/toastStore';

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  useEffect(() => {
    const timers = toasts.map((toast) =>
      window.setTimeout(() => removeToast(toast.id), 4_000),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [toasts, removeToast]);

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.variant}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
