import axios from "axios";

// Теперь все запросы идут через Next.js proxy — браузер не знает адрес бэкенда
export const apiClient = axios.create({
  baseURL: "/api/proxy",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Interceptor для refresh — вызывает /api/auth/refresh (server-side handler)
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: string) => void; reject: (e: unknown) => void }> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve("")));
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes("auth")) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }))
          .then(() => apiClient(originalRequest));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        await fetch("/api/auth/refresh", { method: "POST" });
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export async function loginRequest(login: string, password: string) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, password }),
  });
  if (!response.ok) throw { response: { data: await response.json() } };
  return response.json();
}