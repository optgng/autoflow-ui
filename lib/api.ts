import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

// ─── Константы ───────────────────────────────────────────────────────────────
const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

// ─── Основной клиент ─────────────────────────────────────────────────────────
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ─── Интерсептор запроса: добавляем токен ─────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Флаг чтобы не запускать refresh параллельно несколько раз ───────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

// ─── Интерсептор ответа: обработка 401 + refresh токен ───────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Если 401 и это не повторный запрос и не сам эндпоинт /auth/
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/')
    ) {
      if (isRefreshing) {
        // Ставим запрос в очередь пока идёт refresh
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = Cookies.get('refresh_token');

      if (!refreshToken) {
        // Нет refresh-токена — выходим
        clearAuthAndRedirect();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const newAccessToken: string = data.access_token;
        Cookies.set('access_token', newAccessToken, {
          expires: 1 / 48, // 30 минут
          sameSite: 'Lax',
          secure: process.env.NODE_ENV === 'production',
        });

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthAndRedirect();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ─── Вспомогательная функция очистки ─────────────────────────────────────────
function clearAuthAndRedirect() {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
  Cookies.remove('user');
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

// ─── Хелпер логина ───────────────────────────────────────────────────────────
export async function loginRequest(login: string, password: string) {
  const response = await apiClient.post('/auth/login', {
    login,
    password,
    // Content-Type: application/json — уже стоит по умолчанию в apiClient
  });
  return response.data; // { user: {...}, tokens: { access_token, refresh_token, token_type } }
}

