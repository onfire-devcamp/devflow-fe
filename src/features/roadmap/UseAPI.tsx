import { useState, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
export function useApi<TData, TArgs extends unknown[]>(
  apiFn: (...args: TArgs) => Promise<TData>,
) {
  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: TArgs) => {
      setState({ data: null, loading: true, error: null });
      try {
        const response = await apiFn(...args);
        setState({ data: response, loading: false, error: null });
        return response;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Something went wrong';
        setState({ data: null, loading: false, error: message });
        throw err;
      }
    },
    [apiFn],
  );

  return {
    ...state,
    execute,
    setData: (data: TData | null) => setState((prev) => ({ ...prev, data })),
  };
}
