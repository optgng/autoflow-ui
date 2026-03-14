import { useState, useEffect, useCallback, useRef } from 'react';
import { AxiosError } from 'axios';

interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  // Предотвращает setState на размонтированном компоненте
  const mountedRef = useRef(true);
  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  const load = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const data = await fetcher();
      if (mountedRef.current) {
        setState({ data, isLoading: false, error: null });
      }
    } catch (err) {
      if (mountedRef.current) {
        const message =
          err instanceof AxiosError
            ? err.response?.data?.detail || err.message
            : 'Неизвестная ошибка';
        setState({ data: null, isLoading: false, error: message });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { load(); }, [load]);

  return { ...state, refetch: load };
}
