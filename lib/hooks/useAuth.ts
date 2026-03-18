'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { apiClient, loginRequest } from '@/lib/api';
import type { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const COOKIE_OPTS = {
  sameSite: 'Lax' as const,
  secure: true,
  domain: 'autoflowhub.space',
};

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>(() => {
    // Начальный стейт — из куки для мгновенного рендера без мигания
    const cached = Cookies.get('user');
    if (cached) {
      try {
        return { user: JSON.parse(cached), isLoading: true, error: null };
      } catch {
        return { user: null, isLoading: true, error: null };
      }
    }
    return { user: null, isLoading: true, error: null };
  });

  useEffect(() => {
    const token = Cookies.get('access_token');

    if (!token) {
      setState({ user: null, isLoading: false, error: null });
      return;
    }

    // Всегда идём на бэкенд за актуальными данными
    apiClient
      .get<User>('/auth/me')
      .then(({ data }) => {
        // Обновляем куку свежими данными с бэкенда
        Cookies.set('user', JSON.stringify(data), COOKIE_OPTS);
        setState({ user: data, isLoading: false, error: null });
      })
      .catch(() => {
        // Токен протух или невалиден — чистим всё
        Cookies.remove('access_token', { domain: 'autoflowhub.space' });
        Cookies.remove('refresh_token', { domain: 'autoflowhub.space' });
        Cookies.remove('user',          { domain: 'autoflowhub.space' });
        setState({ user: null, isLoading: false, error: null });
      });
  }, []);

  const login = useCallback(
    async (loginValue: string, password: string) => {
      setState((s) => ({ ...s, isLoading: true, error: null }));
      try {
        const data = await loginRequest(loginValue, password);
        const { access_token, refresh_token } = data.tokens;
        const user: User = data.user;

        Cookies.set('access_token',  access_token,          { ...COOKIE_OPTS, expires: 1 / 48 });
        Cookies.set('refresh_token', refresh_token,         { ...COOKIE_OPTS, expires: 7 });
        Cookies.set('user',          JSON.stringify(user),  { ...COOKIE_OPTS, expires: 7 });

        setState({ user, isLoading: false, error: null });
        router.push('/dashboard');
      } catch (err: any) {
        const detail = err.response?.data?.detail || 'Ошибка авторизации';
        setState({ user: null, isLoading: false, error: detail });
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    Cookies.remove('access_token',  { domain: 'autoflowhub.space' });
    Cookies.remove('refresh_token', { domain: 'autoflowhub.space' });
    Cookies.remove('user',          { domain: 'autoflowhub.space' });
    setState({ user: null, isLoading: false, error: null });
    router.push('/login');
  }, [router]);

  const updateUser = useCallback((updated: Partial<User>) => {
    setState((s) => {
      const newUser = s.user ? { ...s.user, ...updated } : null;
      if (newUser) {
        // Сразу синхронизируем куку при обновлении профиля
        Cookies.set('user', JSON.stringify(newUser), { ...COOKIE_OPTS, expires: 7 });
      }
      return { ...s, user: newUser };
    });
  }, []);

  return {
    user:            state.user,
    isLoading:       state.isLoading,
    error:           state.error,
    login,
    logout,
    updateUser,
    isAuthenticated: !!state.user,
  };
}

