import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { apiClient, loginRequest } from '@/lib/api';
import type { User, TokenResponse } from '@/lib/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  // При монтировании — загружаем текущего пользователя
  useEffect(() => {
    const token = Cookies.get('access_token');
    if (!token) {
      setState({ user: null, isLoading: false, error: null });
      return;
    }
    apiClient
      .get<User>('/users/me')
      .then(({ data }) => {
        setState({ user: data, isLoading: false, error: null });
        Cookies.set('user', JSON.stringify(data)); // кешируем для AppShell
      })
      .catch(() => {
        setState({ user: null, isLoading: false, error: null });
      });
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setState((s) => ({ ...s, isLoading: true, error: null }));
      try {
        const tokens: TokenResponse = await loginRequest(email, password);

        // Сохраняем access_token (30 мин) и refresh_token (7 дней)
        Cookies.set('access_token', tokens.access_token, {
          expires: 1 / 48,
          sameSite: 'Lax',
          secure: process.env.NODE_ENV === 'production',
        });
        Cookies.set('refresh_token', tokens.refresh_token, {
          expires: 7,
          sameSite: 'Lax',
          secure: process.env.NODE_ENV === 'production',
        });

        // Получаем профиль сразу после логина
        const { data: user } = await apiClient.get<User>('/users/me');
        Cookies.set('user', JSON.stringify(user));
        setState({ user, isLoading: false, error: null });
        router.push('/dashboard');
      } catch (err: any) {
        const detail =
          err.response?.data?.detail || 'Ошибка авторизации';
        setState({ user: null, isLoading: false, error: detail });
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('user');
    setState({ user: null, isLoading: false, error: null });
    router.push('/login');
  }, [router]);

  const updateUser = useCallback((updated: Partial<User>) => {
    setState((s) => ({
      ...s,
      user: s.user ? { ...s.user, ...updated } : null,
    }));
  }, []);

  // Утилита для чтения закешированного пользователя (без запроса)
  const getCachedUser = (): User | null => {
    const raw = Cookies.get('user');
    return raw ? JSON.parse(raw) : null;
  };

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
    updateUser,
    getCachedUser,
    isAuthenticated: !!state.user,
  };
}
