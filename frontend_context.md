# Структура и исходный код проекта
Сгенерировано: Thu Mar 26 04:09:02 PM UTC 2026

<document path="./postcss.config.mjs">
```mjs
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
```
</document>

<document path="./README.md">
```md
# autoflow-ui```
</document>

<document path="./tsconfig.json">
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```
</document>

<document path="./next-env.d.ts">
```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference path="./.next/types/routes.d.ts" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.
```
</document>

<document path="./tailwind.config.ts">
```ts
import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        finance: {
          income: "#00FFA3",
          "income-dark": "#00CC82",
          expense: "#FF3366",
          "expense-dark": "#CC2952",
          balance: "#3D7EFF",   // ← заменили cyan
          "balance-dark": "#2560E0",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        // ← Тёмная тема: зелёный градиент
        "gradient-primary": "linear-gradient(135deg, #3D7EFF 0%, #1644B8 100%)",
        "gradient-success": "linear-gradient(135deg, #00FFA3 0%, #00C853 100%)",
        "gradient-danger": "linear-gradient(135deg, #FF3366 0%, #F50057 100%)",
        "gradient-surface": "linear-gradient(135deg, #111113 0%, #1A1A1D 100%)",
        // ← Светлая тема: синий градиент
        "gradient-primary-light": "linear-gradient(135deg, #1A6EF5 0%, #003DAD 100%)",
        "gradient-surface-light": "linear-gradient(135deg, #F7F4F0 0%, #EDE8E1 100%)",
      },
      boxShadow: {
        // ← Все glow теперь зелёные для тёмной темы
        glow: "0 0 20px rgba(61, 126, 255, 0.5), 0 0 40px rgba(61, 126, 255, 0.25)",
        "glow-success": "0 0 20px rgba(0, 255, 163, 0.4)",
        "glow-danger": "0 0 20px rgba(255, 51, 102, 0.4)",
        "glow-sm": "0 0 10px rgba(61, 126, 255, 0.35)",
        "glass-light": "0 8px 32px rgba(120, 100, 80, 0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        counter: "counter 1.5s ease-out",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        // ← Зелёный glow pulse
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(61, 126, 255, 0.5)" },
          "50%": { boxShadow: "0 0 40px rgba(61, 126, 255, 0.75)" },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        dark: {
          colors: {
            background: "#0A0A0B",
            foreground: "#FFFFFF",
            primary: {
              50: "#EEF3FF",
              100: "#D5E2FF",
              200: "#AABFFF",
              300: "#7A9AFF",
              400: "#5486FF",
              500: "#3D7EFF",   // ← основной акцент
              600: "#2560E0",
              700: "#1644B8",
              800: "#0B2D8F",
              900: "#041866",
              DEFAULT: "#3D7EFF",
              foreground: "#FFFFFF",
            },
            success: { DEFAULT: "#00FFA3", foreground: "#0A0A0B" },
            danger: { DEFAULT: "#FF3366", foreground: "#FFFFFF" },
            warning: { DEFAULT: "#FFB800", foreground: "#0A0A0B" },
            content1: "#111113",
            content2: "#1A1A1D",
            content3: "#222227",
            content4: "#2A2A2F",
            default: {
              100: "#1A1A1D",
              200: "#222227",
              300: "#2A2A2F",
              DEFAULT: "#1A1A1D",
              foreground: "#FFFFFF",
            },
          },
        },
        light: {
          colors: {
            background: "#F5F0E8",
            foreground: "#1A1510",
            primary: {
              50: "#EEF4FF",
              100: "#D5E5FF",
              200: "#AACAFF",
              300: "#7AADFF",
              400: "#4D90FF",
              500: "#1A6EF5",   // светлая тема остаётся синей
              600: "#0052D4",
              700: "#003DAD",
              800: "#002A86",
              900: "#001A5F",
              DEFAULT: "#1A6EF5",
              foreground: "#FFFFFF",
            },
            success: { DEFAULT: "#00874A", foreground: "#FFFFFF" },
            danger: { DEFAULT: "#DC2626", foreground: "#FFFFFF" },
            warning: { DEFAULT: "#D97706", foreground: "#FFFFFF" },
            content1: "#EDE8DF",
            content2: "#E5DED3",
            content3: "#D9D0C4",
            content4: "#CFC5B7",
            default: {
              100: "#EDE8DF",
              200: "#E5DED3",
              300: "#D9D0C4",
              400: "#7A6A58",   // ← было #A1A1AA, теперь тёплый коричневый — читаем на бежевом
              500: "#5C4E3E",   // ← для text-default-500
              600: "#3D3228",
              DEFAULT: "#E5DED3",
              foreground: "#1A1510",
            },
          },
        },
      },
    }),
  ],
};

export default config;

```
</document>

<document path="./next.config.ts">
```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```
</document>

<document path="./middleware.ts">
```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login'];

// Пути, которые не трогаем (статика, api routes)
const IGNORED_PREFIXES = ['/_next', '/favicon', '/api', '/icons', '/images'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Пропускаем статику и api-роуты
  if (IGNORED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('access_token')?.value;
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname === p);

  // Не авторизован + закрытый роут → на логин
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    // Сохраняем куда шёл пользователь, чтобы после логина вернуть
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Авторизован + открытый роут (/login) → на дашборд
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```
</document>

<document path="./lib/api.ts">
```ts
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
}```
</document>

<document path="./lib/hooks/useDelayedSkeleton.ts">
```ts
import { useState, useEffect, useRef } from 'react';

/**
 * active=true  → запускает таймер на delay мс
 * До истечения таймера → show=false (ничего не показываем)
 * После delay мс без данных → show=true (показываем skeleton)
 * active=false → show=false (данные пришли, показываем контент)
 */
export function useDelayedSkeleton(active: boolean, delay = 2000) {
  const [show, setShow] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (active) {
      timerRef.current = setTimeout(() => setShow(true), delay);
    } else {
      setShow(false);
    }
    return () => clearTimeout(timerRef.current);
  }, [active, delay]);

  return show;
}
```
</document>

<document path="./lib/hooks/useAuth.ts">
```ts
// lib/hooks/useAuth.ts
"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";

// Облегчённый тип — только то, что безопасно хранить в JS
interface PublicUser {
  username: string;
  full_name: string | null;
  initials: string;
}

interface AuthState {
  user: PublicUser | null;
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

  useEffect(() => {
    // Читаем только публичные данные из localStorage (НЕ токены)
    const cached = typeof window !== "undefined"
      ? localStorage.getItem("user_public")
      : null;
    if (cached) {
      try {
        setState({ user: JSON.parse(cached), isLoading: false, error: null });
        return;
      } catch { }
    }
    // Проверяем сессию через proxy (токен читается server-side)
    fetch("/api/proxy/auth/me")
      .then((r) => {
        if (!r.ok) throw new Error("Unauthorized");
        return r.json();
      })
      .then((data: User) => {
        const pub: PublicUser = {
          username: data.username,
          full_name: data.full_name ?? null,
          initials: (data.full_name ?? data.username ?? "AF")
            .split(" ")
            .map((w: string) => w[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
        };
        localStorage.setItem("user_public", JSON.stringify(pub));
        setState({ user: pub, isLoading: false, error: null });
      })
      .catch(() => {
        localStorage.removeItem("user_public");
        setState({ user: null, isLoading: false, error: null });
      });
  }, []);

  const login = useCallback(
    async (loginValue: string, password: string) => {
      setState((s) => ({ ...s, isLoading: true, error: null }));
      try {
        // POST к /api/auth/login — Route Handler, не напрямую к FastAPI
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ login: loginValue, password }),
        });
        if (!res.ok) {
          const err = await res.json();
          setState({ user: null, isLoading: false, error: err.detail ?? "Ошибка входа" });
          return;
        }
        const data = await res.json();
        const pub: PublicUser = data.user;
        localStorage.setItem("user_public", JSON.stringify(pub));
        setState({ user: pub, isLoading: false, error: null });
        router.push("/dashboard");
      } catch {
        setState({ user: null, isLoading: false, error: "Ошибка сети" });
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user_public");
    setState({ user: null, isLoading: false, error: null });
    router.push("/login");
  }, [router]);

  const updateUser = useCallback((updated: Partial<PublicUser>) => {
    setState((s) => {
      const newUser = s.user ? { ...s.user, ...updated } : null;
      if (newUser) localStorage.setItem("user_public", JSON.stringify(newUser));
      return { ...s, user: newUser };
    });
  }, []);

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
    updateUser,
    isAuthenticated: !!state.user,
  };
}
```
</document>

<document path="./lib/hooks/useApi.ts">
```ts
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
```
</document>

<document path="./lib/hooks/useAnimatedMount.ts">
```ts
import { useEffect, useRef, useState } from 'react';

export function useAnimatedMount(visible: boolean, duration = 340) {
  const [mounted, setMounted] = useState(visible);
  const [animating, setAnimating] = useState(visible);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(timerRef.current);

    if (visible) {
      // React 18 батчит оба setState — один рендер, сразу enter-состояние
      setMounted(true);
      setAnimating(true);
    } else {
      setAnimating(false);
      timerRef.current = setTimeout(() => setMounted(false), duration);
    }

    return () => clearTimeout(timerRef.current);
  }, [visible, duration]);

  return { mounted, animating };
}
```
</document>

<document path="./lib/hooks/useCardNav.ts">
```ts
import { useState, useRef } from 'react';

export function useCardNav() {
  const [isEditing, setIsEditing] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  // ref обновляется синхронно — нет риска батч-рассинхронизации
  const animClassRef = useRef<'animate-tab-in' | 'animate-tab-back'>('animate-tab-in');

  const openEdit = () => {
    animClassRef.current = 'animate-tab-in';   // вид → форма: справа
    setAnimKey(k => k + 1);
    setIsEditing(true);
  };

  const closeEdit = () => {
    animClassRef.current = 'animate-tab-back'; // форма → вид: слева
    setAnimKey(k => k + 1);
    setIsEditing(false);
  };

  return {
    isEditing,
    animKey,
    animClass: animClassRef.current, // читается при каждом рендере — всегда актуален
    openEdit,
    closeEdit,
  };
}
```
</document>

<document path="./lib/hooks/usePolling.ts">
```ts
import { useEffect, useRef } from 'react';

export function usePolling(callback: () => void, intervalMs: number, enabled = true) {
  const savedCallback = useRef(callback);
  useEffect(() => { savedCallback.current = callback; }, [callback]);
  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => savedCallback.current(), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, enabled]);
}

```
</document>

<document path="./lib/types.ts">
```ts
// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  total_accounts: number;
  total_transactions: number;
}

// ─── Account ──────────────────────────────────────────────────────────────────
export type AccountType =
  | 'card'
  | 'bank_account'
  | 'cash'
  | 'investment'
  | 'crypto'
  | 'other';

export type Currency = 'RUB' | 'USD' | 'EUR' | 'GBP' | 'CNY' | 'BTC' | 'ETH';

export interface Account {
  id: number;
  name: string;
  account_type: 'card' | 'bank_account' | 'cash';
  currency: string;
  balance: string;
  bank_name?: string;
  last_four_digits?: string;
  is_active: boolean;
  include_in_total: boolean;
}

export interface AccountCreate {
  name: string;
  account_type: AccountType;
  currency: Currency;
  balance?: number;
  bank_name?: string;
  account_number?: string;
  last_four_digits?: string;
  icon?: string;
  color?: string;
  include_in_total?: boolean;
}

export interface AccountUpdate extends Partial<AccountCreate> {
  is_active?: boolean;
}

// ─── Category ─────────────────────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
  category_type: 'income' | 'expense';
  is_system: boolean;
  icon?: string | null;
  color?: string | null;
}

// ─── Transaction ──────────────────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
  category_type: 'income' | 'expense' | 'transfer'; // ← добавить
  icon?: string;
  color?: string;
}

export interface Transaction {
  id: number;
  transaction_type: 'income' | 'expense' | 'transfer';
  amount: string | number;
  transaction_date: string;
  category?: Category;
  account?: { id: number; name: string };
  target_account?: { id: number; name: string } | null;
  merchant?: string;
  description?: string;
  notes?: string;
}

export interface TransactionCreate {
  account_id: number;
  category_id?: number;
  target_account_id?: number;
  transaction_date: string; // YYYY-MM-DD
  amount: number;
  transaction_type: TransactionType;
  description?: string;
  merchant?: string;
  notes?: string;
}

// ─── Budget ───────────────────────────────────────────────────────────────────
export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Budget {
  id: number;
  user_id: number;
  category_id: number | null;
  name: string;
  amount: number;
  period_type: PeriodType;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
}

// ─── API Responses ────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface TotalResponse {
  total: number;
}

export interface TotalBalanceResponse {
  total_balance: number;
  currency: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface TokensPayload {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginResponse {
  user: User;
  tokens: TokensPayload;
}

// ─── UI-совместимые хелперы ───────────────────────────────────────────────────
// Конвертер дат: бэкенд ISO -> UI DD.MM.YYYY
export function formatDateUI(isoDate: string): string {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  return `${d}.${m}.${y}`;
}
// Конвертер дат: UI DD.MM.YYYY -> бэкенд ISO
export function formatDateAPI(ddmmyyyy: string): string {
  const [d, m, y] = ddmmyyyy.split('.');
  return `${y}-${m}-${d}`;
}
```
</document>

<document path="./lib/mock-data.ts">
```ts
// ─── Types ──────────────────────────────────────────────────────────────────

export interface Transaction {
  id: number;
  date: string; // "DD.MM.YYYY"
  time: string; // "HH:MM"
  processedDate: string;
  merchant: string;
  category: string;
  categoryIcon: string;
  account: string;
  amount: number;
  balanceAfter: number;
  authCode: string;
  type: "income" | "expense";
}

export interface Account {
  id: number;
  name: string;
  number: string;
  bank: string;
  currency: "RUB" | "USD" | "EUR";
  balance: number;
  isActive: boolean;
}

export interface ChartPoint {
  date: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryExpense {
  name: string;
  value: number;
  color: string;
}

// ─── Mock Transactions ───────────────────────────────────────────────────────

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    date: "09.03.2026",
    time: "14:32",
    processedDate: "10.03.2026",
    merchant: "YANDEX*GO",
    category: "Такси",
    categoryIcon: "Car",
    account: "Сбер Зарплатная",
    amount: -650,
    balanceAfter: 251800,
    authCode: "A49201",
    type: "expense",
  },
  {
    id: 2,
    date: "09.03.2026",
    time: "10:15",
    processedDate: "09.03.2026",
    merchant: "PYATEROCHKA",
    category: "Супермаркеты",
    categoryIcon: "ShoppingCart",
    account: "Сбер Зарплатная",
    amount: -2100,
    balanceAfter: 252450,
    authCode: "B31045",
    type: "expense",
  },
  {
    id: 3,
    date: "08.03.2026",
    time: "09:00",
    processedDate: "08.03.2026",
    merchant: "ООО Работодатель",
    category: "Зарплата",
    categoryIcon: "Briefcase",
    account: "Сбер Зарплатная",
    amount: 180000,
    balanceAfter: 254550,
    authCode: "SAL0308",
    type: "income",
  },
  {
    id: 4,
    date: "07.03.2026",
    time: "20:44",
    processedDate: "08.03.2026",
    merchant: "Кофейня на углу",
    category: "Кафе",
    categoryIcon: "Coffee",
    account: "Тинькофф Карта",
    amount: -380,
    balanceAfter: 18420,
    authCode: "C12839",
    type: "expense",
  },
  {
    id: 5,
    date: "07.03.2026",
    time: "18:30",
    processedDate: "07.03.2026",
    merchant: "OZON",
    category: "Покупки",
    categoryIcon: "Package",
    account: "Сбер Зарплатная",
    amount: -4350,
    balanceAfter: 74930,
    authCode: "OZ9381",
    type: "expense",
  },
  {
    id: 6,
    date: "06.03.2026",
    time: "11:00",
    processedDate: "06.03.2026",
    merchant: "МосЭнерго ЖКХ",
    category: "ЖКХ",
    categoryIcon: "Zap",
    account: "Тинькофф Карта",
    amount: -5200,
    balanceAfter: 18800,
    authCode: "ZH4401",
    type: "expense",
  },
  {
    id: 7,
    date: "06.03.2026",
    time: "09:22",
    processedDate: "06.03.2026",
    merchant: "YANDEX*GO",
    category: "Такси",
    categoryIcon: "Car",
    account: "Тинькофф Карта",
    amount: -480,
    balanceAfter: 24000,
    authCode: "A49202",
    type: "expense",
  },
  {
    id: 8,
    date: "05.03.2026",
    time: "15:10",
    processedDate: "05.03.2026",
    merchant: "PYATEROCHKA",
    category: "Супермаркеты",
    categoryIcon: "ShoppingCart",
    account: "Сбер Зарплатная",
    amount: -1850,
    balanceAfter: 79280,
    authCode: "B31046",
    type: "expense",
  },
  {
    id: 9,
    date: "04.03.2026",
    time: "19:45",
    processedDate: "05.03.2026",
    merchant: "Кино Парк",
    category: "Развлечения",
    categoryIcon: "Film",
    account: "Тинькофф Карта",
    amount: -900,
    balanceAfter: 24480,
    authCode: "ENT3922",
    type: "expense",
  },
  {
    id: 10,
    date: "03.03.2026",
    time: "12:00",
    processedDate: "03.03.2026",
    merchant: "Возврат OZON",
    category: "Возвраты",
    categoryIcon: "RefreshCcw",
    account: "Сбер Зарплатная",
    amount: 2500,
    balanceAfter: 81130,
    authCode: "REF1120",
    type: "income",
  },
  {
    id: 11,
    date: "02.03.2026",
    time: "08:45",
    processedDate: "02.03.2026",
    merchant: "Метро Транспорт",
    category: "Транспорт",
    categoryIcon: "Train",
    account: "Тинькофф Карта",
    amount: -150,
    balanceAfter: 25380,
    authCode: "TR0099",
    type: "expense",
  },
  {
    id: 12,
    date: "01.03.2026",
    time: "10:30",
    processedDate: "01.03.2026",
    merchant: "Spotify Premium",
    category: "Подписки",
    categoryIcon: "Music",
    account: "Тинькофф Карта",
    amount: -299,
    balanceAfter: 25530,
    authCode: "SPT7712",
    type: "expense",
  },
  {
    id: 13,
    date: "28.02.2026",
    time: "14:00",
    processedDate: "28.02.2026",
    merchant: "PYATEROCHKA",
    category: "Супермаркеты",
    categoryIcon: "ShoppingCart",
    account: "Сбер Зарплатная",
    amount: -3100,
    balanceAfter: 78630,
    authCode: "B31050",
    type: "expense",
  },
  {
    id: 14,
    date: "27.02.2026",
    time: "20:00",
    processedDate: "28.02.2026",
    merchant: "YANDEX*GO",
    category: "Такси",
    categoryIcon: "Car",
    account: "Сбер Зарплатная",
    amount: -750,
    balanceAfter: 81730,
    authCode: "A49220",
    type: "expense",
  },
  {
    id: 15,
    date: "25.02.2026",
    time: "13:30",
    processedDate: "25.02.2026",
    merchant: "Кофейня на углу",
    category: "Кафе",
    categoryIcon: "Coffee",
    account: "Тинькофф Карта",
    amount: -450,
    balanceAfter: 25829,
    authCode: "C12850",
    type: "expense",
  },
];

// ─── Mock Accounts ───────────────────────────────────────────────────────────

export const mockAccounts: Account[] = [
  {
    id: 1,
    name: "Сбер Зарплатная",
    number: "40817810900001234",
    bank: "Сбербанк",
    currency: "RUB",
    balance: 252450,
    isActive: true,
  },
  {
    id: 2,
    name: "Тинькофф Карта",
    number: "40817810200005678",
    bank: "Тинькофф",
    currency: "RUB",
    balance: 18620,
    isActive: true,
  },
  {
    id: 3,
    name: "Альфа Накопительный",
    number: "40817810600009012",
    bank: "Альфа-Банк",
    currency: "RUB",
    balance: 0,
    isActive: false,
  },
];

// ─── Chart Data ──────────────────────────────────────────────────────────────

export const mockChartData: ChartPoint[] = [
  { date: "01.03", income: 0, expense: 3100, balance: 74550 },
  { date: "02.03", income: 0, expense: 150, balance: 74400 },
  { date: "03.03", income: 2500, expense: 0, balance: 76900 },
  { date: "04.03", income: 0, expense: 900, balance: 76000 },
  { date: "05.03", income: 0, expense: 1850, balance: 74150 },
  { date: "06.03", income: 0, expense: 5680, balance: 68470 },
  { date: "07.03", income: 0, expense: 4730, balance: 63740 },
  { date: "08.03", income: 180000, expense: 0, balance: 243740 },
  { date: "09.03", income: 0, expense: 2750, balance: 241000 },
];

export const mockMonthlyData = [
  { month: "Окт", income: 160000, expense: 92000 },
  { month: "Ноя", income: 165000, expense: 98000 },
  { month: "Дек", income: 175000, expense: 115000 },
  { month: "Янв", income: 168000, expense: 88000 },
  { month: "Фев", income: 172000, expense: 83000 },
  { month: "Мар", income: 180000, expense: 87550 },
];

export const mockBalanceData = [
  { date: "01.03", balance: 74550 },
  { date: "02.03", balance: 74400 },
  { date: "03.03", balance: 76900 },
  { date: "04.03", balance: 76000 },
  { date: "05.03", balance: 74150 },
  { date: "06.03", balance: 68470 },
  { date: "07.03", balance: 63740 },
  { date: "08.03", balance: 243740 },
  { date: "09.03", balance: 241000 },
];

export const mockTopMerchants = [
  { merchant: "PYATEROCHKA", total: 7150 },
  { merchant: "YANDEX*GO", total: 1880 },
  { merchant: "OZON", total: 4350 },
  { merchant: "МосЭнерго ЖКХ", total: 5200 },
  { merchant: "Кофейня на углу", total: 830 },
  { merchant: "Кино Парк", total: 900 },
  { merchant: "Spotify Premium", total: 299 },
  { merchant: "Метро Транспорт", total: 150 },
];

export const mockCategoryExpenses: CategoryExpense[] = [
  { name: "Супермаркеты", value: 7150, color: "#00E5FF" },
  { name: "ЖКХ", value: 5200, color: "#0066FF" },
  { name: "Такси", value: 1880, color: "#FF3366" },
  { name: "Кафе", value: 830, color: "#FFB800" },
  { name: "Развлечения", value: 900, color: "#00FFA3" },
];

// ─── Legacy stats (kept for compatibility) ───────────────────────────────────

export const mockStats = [
  {
    label: "Общий баланс",
    value: "252 450 ₽",
    change: 12.5,
    trend: "up" as const,
    color: "primary" as const,
    icon: "wallet" as const,
  },
  {
    label: "Доходы",
    value: "180 000 ₽",
    change: 12,
    trend: "up" as const,
    color: "success" as const,
    icon: "trending-up" as const,
  },
  {
    label: "Расходы",
    value: "87 550 ₽",
    change: -8,
    trend: "down" as const,
    color: "danger" as const,
    icon: "trending-down" as const,
  },
];

export const mockBudgets = [
  { category: "Супермаркеты", spent: 7150, limit: 12000, color: "success" as const },
  { category: "Транспорт", spent: 1880, limit: 5000, color: "success" as const },
  { category: "Кафе", spent: 830, limit: 3000, color: "success" as const },
  { category: "Развлечения", spent: 900, limit: 3000, color: "warning" as const },
  { category: "ЖКХ", spent: 5200, limit: 6000, color: "warning" as const },
];
```
</document>

<document path="./app/providers.tsx">
```tsx
"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
```
</document>

<document path="./app/globals.css">
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --font-inter: "Inter", system-ui, sans-serif;
    --font-jetbrains: "JetBrains Mono", ui-monospace, monospace;
  }

  body {
    @apply text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
    min-height: 100vh;
    background-color: #0A0A0B;
    background-image:
      radial-gradient(ellipse 70% 60% at 15% 10%, rgba(61, 126, 255, 0.12) 0%, transparent 55%),
      radial-gradient(ellipse 60% 50% at 85% 5%, rgba(22, 68, 184, 0.09) 0%, transparent 50%),
      radial-gradient(ellipse 80% 70% at 90% 85%, rgba(255, 51, 102, 0.09) 0%, transparent 60%),
      radial-gradient(ellipse 65% 55% at 5% 90%, rgba(0, 255, 163, 0.07) 0%, transparent 55%),
      radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255, 184, 0, 0.05) 0%, transparent 45%);
    background-attachment: fixed;
  }

  html.light body {
    background-color: #EDE5D8;
    background-image:
      radial-gradient(ellipse 65% 55% at 10% 10%, rgba(26, 110, 245, 0.22) 0%, transparent 52%),
      radial-gradient(ellipse 55% 45% at 88% 8%, rgba(139, 60, 230, 0.16) 0%, transparent 48%),
      radial-gradient(ellipse 70% 60% at 85% 88%, rgba(220, 38, 38, 0.15) 0%, transparent 58%),
      radial-gradient(ellipse 60% 50% at 8% 88%, rgba(0, 168, 84, 0.15) 0%, transparent 52%),
      radial-gradient(ellipse 45% 35% at 50% 50%, rgba(217, 119, 6, 0.10) 0%, transparent 45%);
    background-attachment: fixed;
  }
}

@layer utilities {

  /* ─── Glass Dark ─── */
  .glass-card {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border: 1px solid rgba(255, 255, 255, 0.10);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.30),
      inset 0 1px 0 rgba(255, 255, 255, 0.10);
    transition: box-shadow 0.3s ease, transform 0.3s ease;
  }

  /* ─── Glass Light ─── */
  html.light .glass-card {
    background: rgba(255, 253, 248, 0.45);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.55);
    box-shadow:
      0 8px 32px rgba(80, 60, 30, 0.14),
      inset 0 1px 0 rgba(255, 255, 255, 0.80);
  }

  /* ─── Glass Nav ─── */
  .glass-nav {
    background: rgba(10, 10, 12, 0.82);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border-right: 1px solid rgba(255, 255, 255, 0.07);
  }

  html.light .glass-nav {
    background: rgba(245, 240, 232, 0.80);
    backdrop-filter: blur(24px) saturate(160%);
    -webkit-backdrop-filter: blur(24px) saturate(160%);
    border-right: 1px solid rgba(180, 155, 120, 0.20);
  }

  /* ─── Glass Dropdown ─── */
  .glass-dropdown {
    background: rgba(16, 16, 20, 0.88);
    backdrop-filter: blur(28px) saturate(200%);
    -webkit-backdrop-filter: blur(28px) saturate(200%);
    border: 1px solid rgba(255, 255, 255, 0.10);
    box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.55),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  html.light .glass-dropdown {
    background: rgba(248, 244, 237, 0.92);
    backdrop-filter: blur(28px) saturate(180%);
    -webkit-backdrop-filter: blur(28px) saturate(180%);
    border: 1px solid rgba(180, 155, 120, 0.25);
    box-shadow:
      0 20px 60px rgba(100, 80, 50, 0.18),
      inset 0 1px 0 rgba(255, 255, 255, 0.95);
  }

  /* ─── Gradient Text ─── */
  .gradient-text-primary {
    background: linear-gradient(135deg, #3D7EFF 0%, #a5c4ff 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  html.light .gradient-text-primary {
    /* Светлая тема: синий градиент */
    background: linear-gradient(135deg, #1a6ef5 0%, #003DAD 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .gradient-text-success {
    background: linear-gradient(135deg, #00ffa3 0%, #00c853 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  html.light .gradient-text-success {
    background: linear-gradient(135deg, #00874A 0%, #005c32 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .gradient-text-danger {
    background: linear-gradient(135deg, #ff3366 0%, #f50057 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* ─── Glow  ─── */
  .glow-primary {
    box-shadow: 0 0 20px rgba(61, 126, 255, 0.5), 0 0 40px rgba(61, 126, 255, 0.25);
  }

  html.light .glow-primary {
    box-shadow: 0 0 20px rgba(26, 110, 245, 0.28), 0 0 40px rgba(26, 110, 245, 0.12);
  }

  .glow-success {
    box-shadow: 0 0 20px rgba(0, 255, 163, 0.4);
  }

  html.light .glow-success {
    box-shadow: 0 0 20px rgba(0, 135, 74, 0.4);
  }

  .glow-danger {
    box-shadow: 0 0 20px rgba(255, 51, 102, 0.4);
  }

  /* ─── Адаптация хардкода в светлой теме ─── */
  html.light [class*="text-\\[#3D7EFF\\]"] {
    color: #1A6EF5 !important;
  }

  html.light [class*="bg-\\[#3D7EFF\\]"] {
    background-color: rgba(26, 110, 245, 0.12) !important;
  }

  html.light [class*="border-\\[#3D7EFF\\]"] {
    border-color: rgba(26, 110, 245, 0.35) !important;
  }

  /* ─── Hover Lift ─── */
  .hover-lift {
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
      box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .hover-lift:hover {
    transform: translateY(-4px);
  }

  /* ─── Card Hover Glow ─── */
  .card-hover-glow {
    position: relative;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .card-hover-glow::after {
    content: "";
    position: absolute;
    inset: -1px;
    background: linear-gradient(135deg, #3D7EFF, #1644B8);
    border-radius: inherit;
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
    filter: blur(20px);
  }

  .card-hover-glow:hover::after {
    opacity: 0.45;
  }

  html.light .card-hover-glow::after {
    background: linear-gradient(135deg, #1a6ef5, #003DAD);
  }

  html.light .card-hover-glow:hover::after {
    opacity: 0.18;
  }

  /* ─── Border Gradient ─── */
  .border-gradient {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
  }

  .border-gradient::before {
    content: "";
    position: absolute;
    inset: -2px;
    background: linear-gradient(135deg, #3D7EFF, #1644B8);
    border-radius: inherit;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .border-gradient:hover::before {
    opacity: 1;
  }

  html.light .border-gradient::before {
    background: linear-gradient(135deg, #1a6ef5, #003DAD);
  }

  /* ─── Scrollbar ─── */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 9999px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  html.light .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(140, 115, 80, 0.25);
  }

  html.light .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(140, 115, 80, 0.40);
  }

  /* ─── Shimmer ─── */
  .shimmer {
    background: linear-gradient(90deg,
        rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.06) 50%, rgba(255, 255, 255, 0) 100%);
    background-size: 200% 100%;
    animation: shimmer 1.8s infinite;
  }

  html.light .shimmer {
    background: linear-gradient(90deg,
        rgba(180, 155, 100, 0) 0%, rgba(180, 155, 100, 0.14) 50%, rgba(180, 155, 100, 0) 100%);
    background-size: 200% 100%;
    animation: shimmer 1.8s infinite;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }

    100% {
      background-position: 200% 0;
    }
  }

  /* ─── Recharts светлая тема ─── */
  html.light .recharts-cartesian-grid-horizontal line,
  html.light .recharts-cartesian-grid-vertical line {
    stroke: rgba(140, 115, 80, 0.12);
  }

  /* ═══ KEYFRAMES ═══════════════════════════════════════════════════ */
  @keyframes modal-in {
    from {
      opacity: 0;
      transform: scale(0.92) translateY(20px);
    }

    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes modal-out {
    from {
      opacity: 1;
      transform: scale(1) translateY(0);
    }

    to {
      opacity: 0;
      transform: scale(0.94) translateY(12px);
    }
  }

  @keyframes overlay-in {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes overlay-out {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }

  @keyframes dropdown-in {
    from {
      opacity: 0;
      transform: translateY(-12px) scaleY(0.90);
    }

    to {
      opacity: 1;
      transform: translateY(0) scaleY(1);
    }
  }

  @keyframes dropdown-out {
    from {
      opacity: 1;
      transform: translateY(0) scaleY(1);
    }

    to {
      opacity: 0;
      transform: translateY(-8px) scaleY(0.94);
    }
  }

  @keyframes stagger-in {
    from {
      opacity: 0;
      transform: translateY(22px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes tab-in-right {
    from {
      opacity: 0;
      transform: translateX(18px);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes tab-in-left {
    from {
      opacity: 0;
      transform: translateX(-18px);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Вход справа → центр */
  @keyframes tab-in {
    from {
      opacity: 0;
      transform: translateX(20px);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  /* Вход слева → центр (назад) */
  @keyframes tab-back {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes tooltip-in {
    from { opacity: 0; transform: scale(0.92) translateY(6px); }
    to   { opacity: 1; transform: scale(1)    translateY(0);   }
  }

  .recharts-tooltip-wrapper {
    /* Recharts управляет позицией через inline style — анимацию вешаем на wrapper */
    animation: tooltip-in 0.18s cubic-bezier(0.16, 1, 0.3, 1) both !important;
    /* Без этого Recharts иногда добавляет transition: none */
    transition: none !important;
  }

  /* ═══ MODAL ════════════════════════════════════════════════════════ */
  .animate-overlay-in {
    animation: overlay-in 0.40s ease both;
  }

  .animate-overlay-out {
    animation: overlay-out 0.32s ease both;
  }

  .animate-modal-overlay {
    animation: overlay-in 0.40s ease both;
  }

  .animate-modal-content {
    animation: modal-in 0.52s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .animate-modal-out {
    animation: modal-out 0.32s cubic-bezier(0.4, 0, 1, 1) both;
  }


  /* ═══ DROPDOWN ═════════════════════════════════════════════════════ */
  .animate-dropdown {
    animation: dropdown-in 0.38s cubic-bezier(0.16, 1, 0.3, 1) both;
    transform-origin: top center;
  }

  .animate-dropdown-out {
    animation: dropdown-out 0.26s cubic-bezier(0.4, 0, 1, 1) both;
    transform-origin: top center;
  }

  /* ═══ STAGGER ══════════════════════════════════════════════════════ */
  /* animation-fill-mode: both — элемент остаётся видимым после анимации */
  .stagger-container>* {
    animation: stagger-in 0.75s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .stagger-container>*:nth-child(1) {
    animation-delay: 0.07s;
  }

  .stagger-container>*:nth-child(2) {
    animation-delay: 0.16s;
  }

  .stagger-container>*:nth-child(3) {
    animation-delay: 0.25s;
  }

  .stagger-container>*:nth-child(4) {
    animation-delay: 0.34s;
  }

  .stagger-container>*:nth-child(5) {
    animation-delay: 0.42s;
  }

  .stagger-container>*:nth-child(6) {
    animation-delay: 0.49s;
  }

  .stagger-container>*:nth-child(7) {
    animation-delay: 0.55s;
  }

  .stagger-container>*:nth-child(n+8) {
    animation-delay: 0.60s;
  }


  /* ═══ TABS ══════════════════════════════════════════════════════════ */
  .animate-tab-in {
    animation: tab-in 0.75s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .animate-tab-back {
    animation: tab-back 0.75s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  /* ═══ GLASS MODAL — непрозрачнее glass-card ════════════════════════ */
  /* Blur вешаем на внешний fixed-контейнер, не на вложенный div */
  .modal-overlay {
    /* backdrop-filter на самом overlay-контейнере */
    backdrop-filter: blur(32px) saturate(140%);
    -webkit-backdrop-filter: blur(32px) saturate(140%);
    background: rgba(0, 0, 0, 0.75);
  }

  html.light .modal-overlay {
    backdrop-filter: blur(32px) saturate(140%);
    -webkit-backdrop-filter: blur(32px) saturate(140%);
    background: rgba(20, 15, 10, 0.75);
  }

  /* Карточка модала — больше opacity чем glass-card */
  .glass-modal {
    background: rgba(18, 18, 22, 0.99);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow:
      0 24px 64px rgba(0, 0, 0, 0.60),
      0 8px 24px rgba(0, 0, 0, 0.40),
      inset 0 1px 0 rgba(255, 255, 255, 0.10);
  }

  html.light .glass-modal {
    background: rgba(250, 247, 242, 0.99);
    border: 1px solid rgba(255, 255, 255, 0.70);
    box-shadow:
      0 24px 64px rgba(80, 60, 30, 0.22),
      0 8px 24px rgba(80, 60, 30, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.90);
  }
}

@layer components {
  .input-field {
    @apply w-full h-10 px-3 rounded-xl bg-content2 border border-divider text-foreground text-sm focus:outline-none focus:border-primary focus:ring-1 transition-all;
    --tw-ring-color: rgba(61, 126, 255, 0.30);
  }

  html.light .input-field {
    --tw-ring-color: rgba(26, 110, 245, 0.18);
    /* синий в светлой теме */
  }

  .page-transition {
    animation: pageIn 0.4s ease-out;
  }

  @keyframes pageIn {
    from {
      opacity: 0;
      transform: translateY(6px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .section-spacing {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }

  @media (min-width: 768px) {
    .section-spacing {
      padding-top: 3rem;
      padding-bottom: 3rem;
    }
  }

  @media (min-width: 1024px) {
    .section-spacing {
      padding-top: 4rem;
      padding-bottom: 4rem;
    }
  }

  .container-custom {
    margin-left: auto;
    margin-right: auto;
    max-width: 80rem;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  @media (min-width: 640px) {
    .container-custom {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
  }

  @media (min-width: 1024px) {
    .container-custom {
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }
}
```
</document>

<document path="./app/api/proxy/[...path]/route.ts">
```ts
/**
 * SEC-08: Server-side proxy — hides real backend URL from browser.
 * Reads httpOnly access_token cookie and forwards requests to backend.
 */
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL!;

async function handler(request: NextRequest, context: { params: Promise<{ path: string []}>  }) {
  const cookieStore = await cookies();
  const { path } = await context.params;
  const accessToken = cookieStore.get("access_token")?.value;

  const backendPath = path.join("/");
  const url = new URL(request.url);
  const backendUrl = `${BACKEND_URL}/api/v1/${backendPath}${url.search}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let body: string | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.text();
  }

  const res = await fetch(backendUrl, {
    method: request.method,
    headers,
    body,
  });

  const data = await res.text();
  return new NextResponse(data, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  });
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE, handler as OPTIONS };
```
</document>

<document path="./app/api/auth/login/route.ts">
```ts
/**
 * Server-side auth handler — sets httpOnly cookies.
 * Access token is NEVER sent to client JavaScript.
 */
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL; // server-side only, not NEXT_PUBLIC_

export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json();
    return NextResponse.json(error, { status: res.status });
  }

  const data = await res.json();
  const { tokens, user } = data;
  const cookieStore = await cookies;

  const response = NextResponse.json({
    // SEC-05: only non-sensitive user fields sent to client
    user: {
      username: user.username,
      full_name: user.full_name,
      initials: (user.full_name ?? user.username ?? "AF")
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2),
    },
  });

  // SEC-05: httpOnly cookies — not accessible from JS
  const isProd = process.env.NODE_ENV === "production";
  cookieStore.set("access_token", tokens.access_token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24h
    path: "/",
  });
  cookieStore.set("refresh_token", tokens.refresh_token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7d
    path: "/",
  });

  return NextResponse.json({ user: { username, full_name, initials } });
}
```
</document>

<document path="./app/api/auth/logout/route.ts">
```ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.set("access_token", "", { maxAge: 0, httpOnly: true, path: "/" });
  cookieStore.set("refresh_token", "", { maxAge: 0, httpOnly: true, path: "/" });
  return NextResponse.json({ ok: true });
}
```
</document>

<document path="./app/api/auth/refresh/route.ts">
```ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL!;

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ detail: "No refresh token" }, { status: 401 });
  }

  const res = await fetch(`${BACKEND_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) {
    cookieStore.set("access_token", "", { maxAge: 0, httpOnly: true, path: "/" });
    cookieStore.set("refresh_token", "", { maxAge: 0, httpOnly: true, path: "/" });
    return NextResponse.json({ detail: "Refresh failed" }, { status: 401 });
  }

  const data = await res.json();
  const isProd = process.env.NODE_ENV === "production";

  cookieStore.set("access_token", data.access_token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return NextResponse.json({ ok: true });
}

```
</document>

<document path="./app/login/page.tsx">
```tsx
'use client';
import { useState } from 'react';
import { Eye, EyeOff, Wallet, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

// Те же regex что и на бэкенде
const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_\-]{3,100}$/;

function validateLogin(value: string): string | null {
  if (!value.trim()) return 'Поле не может быть пустым';
  if (value.includes('@')) {
    if (!EMAIL_REGEX.test(value.trim()))
      return 'Некорректный email. Ожидается формат: user@domain.com';
  } else {
    if (!USERNAME_REGEX.test(value.trim()))
      return 'Некорректный username. Допускаются буквы, цифры, _ и -';
  }
  return null;
}

export default function LoginPage() {
  const { login, isLoading, error } = useAuth();

  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleLoginBlur = () => {
    setLoginError(validateLogin(loginValue));
  };

  const handlePasswordBlur = () => {
    if (!password) setPasswordError('Пароль не может быть пустым');
    else setPasswordError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация перед отправкой
    const loginErr = validateLogin(loginValue);
    const passErr = !password ? 'Пароль не может быть пустым' : null;

    setLoginError(loginErr);
    setPasswordError(passErr);

    if (loginErr || passErr) return;

    await login(loginValue.trim().toLowerCase(), password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,229,255,0.06) 0%, transparent 70%)',
        }}
      />
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3D7EFF] to-[#1644B8] flex items-center justify-center shadow-glow mb-4">
            <Wallet className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold gradient-text-primary">AutoFlow Finance</h1>
          <p className="text-default-500 mt-1 text-sm">Управление личными финансами</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6 text-foreground">Вход в систему</h2>

          {/* Серверная ошибка */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FF3366]/10 border border-[#FF3366]/30 mb-6">
              <AlertCircle className="w-5 h-5 text-[#FF3366] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#FF3366] leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Login field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-default-600" htmlFor="login">
                Email или username
              </label>
              <input
                id="login"
                type="text"
                value={loginValue}
                onChange={(e) => {
                  setLoginValue(e.target.value);
                  if (loginError) setLoginError(validateLogin(e.target.value));
                }}
                onBlur={handleLoginBlur}
                placeholder="user@example.com или username"
                autoComplete="username"
                className={`w-full h-12 px-4 rounded-xl bg-content2 border text-foreground placeholder:text-default-400 focus:outline-none focus:ring-1 transition-all text-sm ${loginError
                  ? 'border-[#FF3366] focus:border-[#FF3366] focus:ring-[#FF3366]/40'
                  : 'border-divider focus:border-primary focus:ring-[#00E5FF]/40'
                  }`}
              />
              {loginError && (
                <p className="text-xs text-[#FF3366] flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {loginError}
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-default-600" htmlFor="password">
                Пароль
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError && e.target.value) setPasswordError(null);
                  }}
                  onBlur={handlePasswordBlur}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full h-12 px-4 pr-12 rounded-xl bg-content2 border text-foreground placeholder:text-default-400 focus:outline-none focus:ring-1 transition-all text-sm ${passwordError
                    ? 'border-[#FF3366] focus:border-[#FF3366] focus:ring-[#FF3366]/40'
                    : 'border-divider focus:border-primary focus:ring-[#00E5FF]/40'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-default-400 hover:text-default-600 transition-colors p-1"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  {showPassword
                    ? <EyeOff className="w-5 h-5" />
                    : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordError && (
                <p className="text-xs text-[#FF3366] flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl font-semibold text-sm transition-all bg-gradient-to-r from-[#3D7EFF] to-[#1644B8] text-black hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-glow mt-2"
            >
              {isLoading
                ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                : 'Войти'
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

```
</document>

<document path="./app/layout.tsx">
```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import AppShell from "@/components/layout/AppShell";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AutoFlow Finance — Персональный финансовый дашборд",
  description:
    "Аналитика доходов и расходов, управление счетами и бюджетом в одном месте.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          {/* ← Ambient background для glassmorphism */}
          <div className="ambient-bg" aria-hidden="true" />
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}

```
</document>

<document path="./app/dashboard/page.tsx">
```tsx
'use client';
import { useEffect, useState, useRef } from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ChevronDown, ArrowUpRight } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { formatDateUI } from '@/lib/types';
import type { Transaction } from '@/lib/types';
import TransactionDetailModal from '@/components/dashboard/TransactionDetailModal';
import { useAnimatedMount } from '@/lib/hooks/useAnimatedMount';
import { useDelayedSkeleton } from '@/lib/hooks/useDelayedSkeleton';
import { ChartTooltip } from '@/components/ui/ChartTooltip';

// totalBalance убран — теперь balances хранится отдельно по валютам
interface DashboardStats { totalIncome: number; totalExpense: number; }
interface ChartPoint { date: string; income: number; expense: number; }
interface CategoryStat { name: string; value: number; color: string; }

const CHART_COLORS = ['#3D7EFF', '#FF3366', '#00FFA3', '#FFB800', '#A855F7', '#FF6600'];
const PERIODS = [7, 14, 30, 90] as const;

/**
 * Перевод между своими счетами — не доход и не расход.
 * Сбер присылает их как income/expense, но с category_type === 'transfer'.
 */
function isInternalTransfer(tx: Transaction): boolean {
  return (
    tx.transaction_type === 'transfer' ||
    tx.category?.category_type === 'transfer'
  );
}

function SkeletonCard() { return <div className="glass-card rounded-2xl p-5 shimmer h-32" />; }
function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`glass-card rounded-2xl shimmer ${className}`} />;
}

export default function DashboardPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== 'light';

  const C = {
    income: isDark ? '#00FFA3' : '#00874A',
    expense: isDark ? '#FF3366' : '#DC2626',
    primary: isDark ? '#3D7EFF' : '#1A6EF5',
    grid: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(100,80,50,0.10)',
    tick: isDark ? '#9CA3AF' : '#7A6A58',
    tooltip: {
      bg: isDark ? '#111113' : '#FAF7F2',
      border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(180,155,120,0.3)',
      color: isDark ? '#fff' : '#1A1510',
    },
  };
  const tooltipStyle = {
    background: C.tooltip.bg, border: `1px solid ${C.tooltip.border}`,
    borderRadius: 12, fontSize: 12, color: C.tooltip.color,
  };

  const [period, setPeriod] = useState<(typeof PERIODS)[number]>(30);
  const [periodOpen, setPeriodOpen] = useState(false);
  const periodRef = useRef<HTMLDivElement>(null);
  const { mounted: dropMounted, animating: dropAnimating } = useAnimatedMount(periodOpen, 160);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (periodRef.current && !periodRef.current.contains(e.target as Node)) setPeriodOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const [stats, setStats] = useState<DashboardStats>({ totalIncome: 0, totalExpense: 0 });
  // Балансы по каждой валюте отдельно — USD-наличные не суммируются с RUB
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryStat[]>([]);
  const [recentTx, setRecentTx] = useState<Transaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const showSkeleton = useDelayedSkeleton(isLoading && isInitialLoad, 2000);
  const fadeOnUpdate = `transition-opacity duration-500 ${isLoading && !isInitialLoad ? 'opacity-50' : 'opacity-100'}`;

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const now = new Date();
        const dateTo = now.toISOString().split('T')[0];
        const dateFrom = new Date(now.getTime() - period * 86_400_000).toISOString().split('T')[0];

        const [txRes, balanceRes] = await Promise.all([
          apiClient.get('/transactions', {
            params: { date_from: dateFrom, date_to: dateTo, page_size: 500, page: 1 },
          }),
          // Новый эндпоинт: { balances: { RUB: "102000.00", USD: "500.00" } }
          apiClient.get('/accounts/balances-by-currency'),
        ]);

        const allTx: Transaction[] = txRes.data.items ?? [];

        // Переводы исключаем из расчётов доходов/расходов,
        // но оставляем в списке последних операций для отображения
        const operationalTx = allTx.filter(tx => !isInternalTransfer(tx));

        let totalIncome = 0, totalExpense = 0;
        for (const tx of operationalTx) {
          if (tx.transaction_type === 'income') totalIncome += Number(tx.amount);
          if (tx.transaction_type === 'expense') totalExpense += Number(tx.amount);
        }
        setStats({ totalIncome, totalExpense });

        // Парсим балансы по валютам из нового эндпоинта
        const rawBalances: Record<string, string> = balanceRes.data?.balances ?? {};
        const numericBalances: Record<string, number> = {};
        for (const [cur, val] of Object.entries(rawBalances)) {
          numericBalances[cur] = Number(val);
        }
        setBalances(numericBalances);

        // Последние 5 — из всех транзакций, включая переводы
        setRecentTx(allTx.slice(0, 5));

        // Pie chart — только реальные расходы без категорий-переводов
        const catMap: Record<string, number> = {};
        for (const tx of operationalTx) {
          if (tx.transaction_type !== 'expense') continue;
          const name = tx.category?.name ?? 'Прочее';
          catMap[name] = (catMap[name] ?? 0) + Number(tx.amount);
        }
        setCategoryData(
          Object.entries(catMap)
            .sort(([, a], [, b]) => b - a)
            .map(([name, value], i) => ({ name, value, color: CHART_COLORS[i % CHART_COLORS.length] }))
        );

        // Линейный график — без переводов, с правильной сортировкой по дате
        const byDate: Record<string, { income: number; expense: number }> = {};
        for (const tx of operationalTx) {
          const d = formatDateUI(tx.transaction_date);
          if (!byDate[d]) byDate[d] = { income: 0, expense: 0 };
          if (tx.transaction_type === 'income') byDate[d].income += Number(tx.amount);
          if (tx.transaction_type === 'expense') byDate[d].expense += Number(tx.amount);
        }
        const sortedDays = Object.entries(byDate)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, v]) => ({ date, ...v }));
        // Для коротких периодов показываем все дни, для длинных — последние 14
        setChartData(period <= 14 ? sortedDays : sortedDays.slice(-14));
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };
    load();
  }, [period]);

  // Чистый денежный поток за период (не путать с балансом счетов)
  const netFlow = stats.totalIncome - stats.totalExpense;
  const savedPct = stats.totalIncome > 0
    ? Math.max(0, Math.round((netFlow / stats.totalIncome) * 100))
    : 0;

  const rubBalance = balances.RUB ?? 0;
  const otherCurrencies = Object.entries(balances).filter(([cur]) => cur !== 'RUB');

  return (
    <div className="space-y-8">

      {/* Header — всегда виден */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Обзор финансов</h1>
          <p className="text-default-500 text-sm mt-1">
            Актуальные данные за последние{' '}
            <span className="text-foreground font-medium">{period} дней</span>
            {isLoading && !isInitialLoad && (
              <span className="ml-2 inline-block w-3 h-3 rounded-full border-2
                               border-primary border-t-transparent animate-spin align-middle" />
            )}
          </p>
        </div>

        <div ref={periodRef} className="relative">
          <button
            onClick={() => setPeriodOpen(v => !v)}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-content2
                       border border-divider text-sm font-medium hover:bg-content3
                       transition-colors disabled:opacity-60"
          >
            За {period} дней
            <ChevronDown className={`w-4 h-4 text-default-400 transition-transform duration-300
                                      ${periodOpen ? 'rotate-180' : ''}`} />
          </button>
          {dropMounted && (
            <div className={`absolute right-0 mt-2 w-44 glass-dropdown rounded-xl py-1 z-50
                             ${dropAnimating ? 'animate-dropdown' : 'animate-dropdown-out'}`}>
              {PERIODS.map(p => (
                <button key={p}
                  onClick={() => { setPeriod(p); setPeriodOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors
                              ${period === p ? 'text-primary font-medium' : 'text-foreground'}`}
                >
                  {p} дней
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Metric Cards ── */}
      {isInitialLoad ? (
        showSkeleton ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : null
      ) : (
        <div key={`metrics-${period}`}
          className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 stagger-container ${fadeOnUpdate}`}>

          {/* Баланс — мультивалютный снимок счетов, не зависит от периода */}
          <div className="glass-card rounded-2xl p-5 hover-lift">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-default-500 font-medium uppercase tracking-wide">Баланс</p>
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary
                              flex items-center justify-center flex-shrink-0">
                <Wallet className="w-6 h-6" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {rubBalance.toLocaleString('ru-RU')} ₽
            </p>
            {otherCurrencies.length > 0
              ? otherCurrencies.map(([cur, val]) => (
                <p key={cur} className="text-xs text-default-400 mt-0.5">
                  {val.toLocaleString('ru-RU')} {cur}
                </p>
              ))
              : <p className="text-xs text-default-400 mt-0.5">на счетах</p>
            }
          </div>

          <MetricCard
            label="Доходы"
            value={stats.totalIncome.toLocaleString('ru-RU')}
            sub={`за ${period} дней`}
            icon={<TrendingUp className="w-6 h-6" />}
            iconBg="bg-success/10 text-success"
          />
          <MetricCard
            label="Расходы"
            value={stats.totalExpense.toLocaleString('ru-RU')}
            sub={`за ${period} дней`}
            icon={<TrendingDown className="w-6 h-6" />}
            iconBg="bg-danger/10 text-danger"
          />

          {/* Чистый поток = доходы − расходы за период, без переводов */}
          <div className="glass-card rounded-2xl p-5 hover-lift">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-default-500 font-medium uppercase tracking-wide">
                  Чистый поток
                </p>
                <p className={`text-2xl font-bold mt-1
                               ${netFlow < 0 ? 'text-danger' : 'text-foreground'}`}>
                  {netFlow < 0 ? '−' : ''}{Math.abs(netFlow).toLocaleString('ru-RU')} ₽
                </p>
                <p className="text-xs text-default-400 mt-0.5">{savedPct}% от доходов</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-warning/10 text-warning
                              flex items-center justify-center flex-shrink-0">
                <PiggyBank className="w-6 h-6" />
              </div>
            </div>
            <div className="h-2 bg-content3 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700
                            ${netFlow >= 0 ? 'bg-warning' : 'bg-danger'}`}
                style={{ width: `${Math.min(savedPct, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Charts ── */}
      {isInitialLoad ? (
        showSkeleton ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <SkeletonBlock className="lg:col-span-3 h-80" />
            <SkeletonBlock className="lg:col-span-2 h-80" />
          </div>
        ) : null
      ) : (
        <div key={`charts-${period}`}
          className={`grid grid-cols-1 lg:grid-cols-5 gap-5 stagger-container ${fadeOnUpdate}`}>
          <div className="glass-card rounded-2xl p-6 lg:col-span-3">
            <h2 className="text-base font-semibold mb-5 text-foreground">Доходы и расходы</h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
                <XAxis dataKey="date" tick={{ fill: C.tick, fontSize: 11 }}
                  axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.tick, fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `${(v / 1000).toFixed(0)}k`} width={36} />
                <Tooltip contentStyle={tooltipStyle}
                  formatter={(v: number) => `${v.toLocaleString('ru-RU')} ₽`} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                <Line type="monotone" dataKey="income" name="Доходы"
                  stroke={C.income} strokeWidth={2} dot={{ r: 3, fill: C.income }} />
                <Line type="monotone" dataKey="expense" name="Расходы"
                  stroke={C.expense} strokeWidth={2} dot={{ r: 3, fill: C.expense }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card rounded-2xl p-6 lg:col-span-2">
            <h2 className="text-base font-semibold mb-5 text-foreground">Категории расходов</h2>
            {categoryData.length === 0 ? (
              <p className="text-center text-default-400 py-12 text-sm">Нет расходов за период</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%"
                      innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                      {categoryData.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                    </Pie>
                    <Tooltip content={<ChartTooltip style={tooltipStyle} />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-3">
                  {categoryData.map((c, i) => {
                    const total = categoryData.reduce((s, x) => s + x.value, 0);
                    return (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ background: c.color }} />
                          <span className="text-default-500">{c.name}</span>
                        </div>
                        <span className="font-medium text-foreground">
                          {Math.round((c.value / total) * 100)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Recent Transactions ── */}
      {isInitialLoad ? (
        showSkeleton ? (
          <div className="glass-card rounded-2xl p-6">
            <div className="h-6 shimmer rounded-lg w-48 mb-5" />
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => <div key={i} className="h-12 shimmer rounded-xl" />)}
            </div>
          </div>
        ) : null
      ) : (
        <div className={`glass-card rounded-2xl p-6 ${fadeOnUpdate}`}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-foreground">Последние транзакции</h2>
            <Link href="/transactions"
              className="flex items-center gap-1 text-xs text-primary hover:underline font-medium">
              Все <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentTx.length === 0 ? (
            <p className="text-center text-default-400 py-8 text-sm">Транзакций пока нет</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-divider">
                    {['Дата', 'Категория', 'Описание', 'Сумма'].map(h => (
                      <th key={h}
                        className="text-left text-xs text-default-400 font-medium pb-3 pr-4 last:text-right">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentTx.map((tx, idx) => {
                    const transfer = isInternalTransfer(tx);
                    const amountColor = transfer
                      ? 'text-primary'
                      : tx.transaction_type === 'income' ? 'text-success' : 'text-danger';
                    const amountPrefix = transfer
                      ? '⇄ '
                      : tx.transaction_type === 'income' ? '+' : '−';
                    return (
                      <tr key={tx.id}
                        onClick={() => setSelectedTx(tx)}
                        className="border-b border-divider/40 hover:bg-content2/50 transition-colors cursor-pointer"
                        style={{
                          animation: 'stagger-in 0.65s cubic-bezier(0.16,1,0.3,1) both',
                          animationDelay: `${0.05 + idx * 0.07}s`,
                        }}
                      >
                        <td className="py-3.5 pr-4 text-default-400 whitespace-nowrap text-xs">
                          {formatDateUI(tx.transaction_date)}
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium
                            ${transfer
                              ? 'bg-primary/10 text-primary'
                              : 'bg-content2 text-default-500'
                            }`}>
                            {tx.category?.name ?? '—'}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 font-medium text-foreground">
                          {tx.merchant ?? tx.description ?? '—'}
                        </td>
                        <td className={`py-3.5 text-right font-semibold tabular-nums ${amountColor}`}>
                          {amountPrefix}{Number(tx.amount).toLocaleString('ru-RU')} ₽
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <TransactionDetailModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
    </div>
  );
}

function MetricCard({ label, value, sub, icon, iconBg }: {
  label: string; value: string; sub?: string; icon: React.ReactNode; iconBg: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-5 hover-lift">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-default-500 font-medium uppercase tracking-wide">{label}</p>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value} ₽</p>
      {sub && <p className="text-xs text-default-400 mt-1">{sub}</p>}
    </div>
  );
}
```
</document>

<document path="./app/template.tsx">
```tsx
'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Только сдвиг — opacity отдаём stagger-контейнерам
    el.animate(
      [
        { transform: 'translateY(10px)' },
        { transform: 'translateY(0)' },
      ],
      { duration: 260, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
    );
  }, [pathname]);

  return <div ref={ref}>{children}</div>;
}
```
</document>

<document path="./app/transactions/page.tsx">
```tsx
'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, ChevronUp, ChevronDown, FileSearch, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { formatDateUI } from '@/lib/types';
import type { Transaction, Category, TransactionType } from '@/lib/types';
import TransactionDetailModal from '@/components/dashboard/TransactionDetailModal';
import { useAnimatedMount } from '@/lib/hooks/useAnimatedMount';
import { useDelayedSkeleton } from '@/lib/hooks/useDelayedSkeleton';

const PAGE_SIZES = [10, 25, 50] as const;
type SortDir = 'asc' | 'desc';

function TableSkeleton({ rows }: { rows: number }) {
  return (
    <>
      {Array(rows).fill(0).map((_, i) => (
        <tr key={i} className="border-b border-divider/40">
          {Array(6).fill(0).map((_, j) => (
            <td key={j} className="px-3 py-3.5">
              <div className="h-4 shimmer rounded w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [modalTx, setModalTx] = useState<Transaction | null>(null);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(10);
  const [page, setPage] = useState(1);
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // isInitialLoad — skeleton только при первом открытии
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // skeleton появляется только если начальная загрузка идёт дольше 2с
  const showSkeleton = useDelayedSkeleton(isLoading && isInitialLoad, 2000);

  // При смене фильтров старые данные остаются, opacity уменьшается
  const fadeOnUpdate = `transition-opacity duration-500 ${isLoading && !isInitialLoad ? 'opacity-50' : 'opacity-100'}`;

  // Category dropdown
  const [categoryOpen, setCategoryOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const { mounted: catMounted, animating: catAnimating } = useAnimatedMount(categoryOpen, 160);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node))
        setCategoryOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Загрузка категорий — единожды
  useEffect(() => {
    apiClient.get('/categories').then((r: { data: any }) => setCategories(r.data ?? []));
  }, []);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = { page, page_size: pageSize };
      if (typeFilter !== 'all') params.transaction_type = typeFilter;
      if (categoryFilter) params.category_id = categoryFilter;
      if (search) params.search = search;

      const res = await apiClient.get('/transactions', { params });
      setTransactions(res.data.items ?? []);
      setTotal(res.data.total ?? 0);
      setTotalPages(res.data.total_pages ?? 1);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, [page, pageSize, typeFilter, categoryFilter, search]);

  useEffect(() => { load(); }, [load]);

  const resetPage = () => setPage(1);

  const sorted = [...transactions].sort((a, b) => {
    const av = new Date(a.transaction_date).getTime();
    const bv = new Date(b.transaction_date).getTime();
    return sortDir === 'asc' ? av - bv : bv - av;
  });

  return (
    <div className="space-y-6">

      {/* Header — всегда виден */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Транзакции</h1>
      </div>

      {/* Filters — всегда видны */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-default-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); resetPage(); }}
              placeholder="Поиск по описанию, продавцу..."
              className="input-field pl-9"
            />
          </div>

          {/* Type filter */}
          <div className="flex rounded-xl overflow-hidden border border-divider h-10">
            {(['all', 'income', 'expense'] as const).map(t => (
              <button key={t}
                onClick={() => { setTypeFilter(t); resetPage(); }}
                className={`px-4 text-sm font-medium transition-colors
                  ${typeFilter === t
                    ? 'bg-content3 text-foreground'
                    : 'bg-content2 text-default-400 hover:bg-content3'}`}
              >
                {t === 'all' ? 'Все' : t === 'income' ? 'Доходы' : 'Расходы'}
              </button>
            ))}
          </div>

          {/* Category dropdown */}
          <div ref={categoryRef} className="relative">
            <button
              onClick={() => setCategoryOpen(v => !v)}
              className="flex items-center gap-2 px-4 h-10 rounded-xl bg-content2
                         border border-divider text-sm font-medium hover:bg-content3 transition-colors"
            >
              {categoryFilter
                ? categories.find(c => String(c.id) === categoryFilter)?.name
                : 'Все категории'}
              <ChevronDown className={`w-4 h-4 text-default-400 transition-transform duration-300
                                        ${categoryOpen ? 'rotate-180' : ''}`} />
            </button>
            {catMounted && (
              <div className={`absolute left-0 mt-2 w-56 glass-dropdown rounded-xl py-1 z-50
                               ${catAnimating ? 'animate-dropdown' : 'animate-dropdown-out'}`}>
                <button
                  onClick={() => { setCategoryFilter(''); setCategoryOpen(false); resetPage(); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors
                              ${!categoryFilter ? 'text-primary font-medium' : 'text-foreground'}`}
                >
                  Все категории
                </button>
                {categories.map(c => (
                  <button key={c.id}
                    onClick={() => { setCategoryFilter(String(c.id)); setCategoryOpen(false); resetPage(); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors
                                ${categoryFilter === String(c.id) ? 'text-primary font-medium' : 'text-foreground'}`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset */}
          <button
            onClick={() => { setSearch(''); setTypeFilter('all'); setCategoryFilter(''); resetPage(); }}
            className="flex items-center gap-1.5 px-3.5 h-10 rounded-xl bg-content2 border border-divider
                       text-sm text-default-500 hover:text-foreground hover:bg-content3 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Сбросить
          </button>
        </div>
      </div>

      {/* Table
          isInitialLoad && !showSkeleton → ничего (данные идут быстро)
          isInitialLoad &&  showSkeleton → skeleton
         !isInitialLoad                  → реальный контент
      */}
      {isInitialLoad ? (
        showSkeleton ? (
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-divider bg-content2/50">
                    {['Дата', 'Категория', 'Описание', 'Счёт', 'Сумма', 'Тип'].map(h => (
                      <th key={h} className="px-3 py-4 text-left text-xs font-medium text-default-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody><TableSkeleton rows={pageSize} /></tbody>
              </table>
            </div>
            {/* Skeleton pagination */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-divider">
              <div className="h-4 shimmer rounded w-32" />
              <div className="h-4 shimmer rounded w-24" />
            </div>
          </div>
        ) : null
      ) : (
        <div className={`glass-card rounded-2xl overflow-hidden ${fadeOnUpdate}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-divider bg-content2/50">
                  <th className="px-5 py-4 text-left">
                    <button
                      onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
                      className="flex items-center gap-1.5 text-xs font-medium text-default-400"
                    >
                      Дата {sortDir === 'asc'
                        ? <ChevronUp className="w-3.5 h-3.5 text-primary" />
                        : <ChevronDown className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  </th>
                  {['Категория', 'Описание', 'Счёт', 'Сумма', 'Тип'].map(h => (
                    <th key={h} className="px-3 py-4 text-left text-xs font-medium text-default-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* При смене фильтров показываем skeleton поверх старых данных */}
                {isLoading ? (
                  <TableSkeleton rows={pageSize} />
                ) : sorted.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <FileSearch className="w-12 h-12 text-default-300 mb-3" />
                        <p className="text-default-500 font-medium">Ничего не найдено</p>
                        <p className="text-sm text-default-400 mt-1">Попробуйте изменить фильтры</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sorted.map((tx, idx) => (
                    <tr
                      key={tx.id}
                      onClick={() => setModalTx(tx)}
                      className="border-b border-divider/40 hover:bg-content2/50 transition-colors cursor-pointer"
                      style={{
                        animation: 'stagger-in 0.75s cubic-bezier(0.16,1,0.3,1) both',
                        animationDelay: `${Math.min(idx * 0.05, 0.5)}s`,
                      }}
                    >
                      <td className="px-5 py-3.5 text-default-400 whitespace-nowrap text-xs">
                        {formatDateUI(tx.transaction_date)}
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-lg bg-content2 text-xs font-medium text-default-500">
                          {tx.category?.name ?? '—'}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 font-medium text-foreground">
                        {tx.merchant ?? tx.description ?? '—'}
                      </td>
                      <td className="px-3 py-3.5 text-default-400 text-xs">
                        {tx.account?.name ?? '—'}
                      </td>
                      <td className={`px-3 py-3.5 font-semibold tabular-nums
                                      ${tx.transaction_type === 'income' ? 'text-success' : 'text-danger'}`}>
                        {tx.transaction_type === 'income' ? '+' : '-'}
                        {Number(tx.amount).toLocaleString('ru-RU')} ₽
                      </td>
                      <td className="px-3 py-3.5">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium
                          ${tx.transaction_type === 'income'
                            ? 'bg-success/10 text-success'
                            : tx.transaction_type === 'expense'
                              ? 'bg-danger/10 text-danger'
                              : 'bg-primary/10 text-primary'}`}>
                          {tx.transaction_type === 'income' ? 'Доход'
                            : tx.transaction_type === 'expense' ? 'Расход' : 'Перевод'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-divider">
            <div className="flex items-center gap-2 text-sm text-default-400">
              <span>Строк:</span>
              {PAGE_SIZES.map(s => (
                <button key={s}
                  onClick={() => { setPageSize(s); resetPage(); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors
                    ${pageSize === s ? 'bg-content3 text-foreground' : 'hover:bg-content2 text-default-400'}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-default-400 mr-2">
                {total === 0 ? '0' : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)}`} из {total}
              </span>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="p-1.5 rounded-lg hover:bg-content2 disabled:opacity-40
                           disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                className="p-1.5 rounded-lg hover:bg-content2 disabled:opacity-40
                           disabled:cursor-not-allowed transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <TransactionDetailModal tx={modalTx} onClose={() => setModalTx(null)} />
    </div>
  );
}
```
</document>

<document path="./app/page.tsx">
```tsx
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
}
```
</document>

<document path="./app/accounts/page.tsx">
```tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import {
  Plus, Pencil, CreditCard, Landmark, Wallet,
  X, Check, RefreshCw, AlertCircle, Trash2,
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import SelectField from '@/components/ui/SelectField';
import ModalPortal from '@/components/ui/ModalPortal';
import { useAnimatedMount } from '@/lib/hooks/useAnimatedMount';
import { useDelayedSkeleton } from '@/lib/hooks/useDelayedSkeleton';
import { useCardNav } from '@/lib/hooks/useCardNav';

// ─── Типы ────────────────────────────────────────────────────────────────────

type AccountType = 'card' | 'bank_account' | 'cash';
type BankAccountType = 'card' | 'bank_account';

interface Account {
  id: number;
  name: string;
  account_type: AccountType;
  currency: string;
  balance: string;
  bank_name?: string;
  last_four_digits?: string;
  is_active: boolean;
  include_in_total: boolean;
}

// ─── Константы ───────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<AccountType, string> = {
  card: 'Карта', bank_account: 'Счёт', cash: 'Наличные',
};
const TYPE_ICONS: Record<AccountType, React.ReactNode> = {
  card: <CreditCard className="w-5 h-5" />,
  bank_account: <Landmark className="w-5 h-5" />,
  cash: <Wallet className="w-5 h-5" />,
};

const CURRENCIES = ['RUB', 'USD', 'EUR', 'GBP', 'CNY'] as const;
const CURRENCY_OPTIONS = CURRENCIES.map(c => ({ value: c, label: c }));
const ACCOUNT_TYPE_OPTIONS = [
  { value: 'card', label: 'Карта' },
  { value: 'bank_account', label: 'Счёт в банке' },
];

// ─── Хелперы ─────────────────────────────────────────────────────────────────

function formatBalance(balance: string, currency: string) {
  return (parseFloat(balance) || 0).toLocaleString('ru-RU', { style: 'currency', currency });
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function AccountSkeleton() {
  return (
    <div className="space-y-3">
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl shimmer" />
              <div className="space-y-2">
                <div className="h-4 shimmer rounded w-32" />
                <div className="h-3 shimmer rounded w-20" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-5 shimmer rounded w-24" />
              <div className="flex gap-1">
                <div className="w-8 h-8 shimmer rounded-lg" />
                <div className="w-8 h-8 shimmer rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── AccountCard ─────────────────────────────────────────────────────────────

function AccountCard({
  acc,
  onSaved,
  onDeleteRequest,
}: {
  acc: Account;
  onSaved: (updated: Account) => void;
  onDeleteRequest: (id: number) => void;
}) {
  const { isEditing, animKey, animClass, openEdit, closeEdit } = useCardNav();

  // Локальные поля формы — инициализируются из acc при открытии редактирования
  const [editName, setEditName] = useState('');
  const [editBank, setEditBank] = useState('');
  const [editType, setEditType] = useState<BankAccountType>('card');
  const [editCurrency, setEditCurrency] = useState('RUB');
  const [editBalance, setEditBalance] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleOpenEdit = () => {
    setEditName(acc.name);
    setEditBank(acc.bank_name ?? '');
    setEditType(acc.account_type !== 'cash' ? acc.account_type : 'card');
    setEditCurrency(acc.currency);
    setEditBalance(acc.balance);
    setError('');
    openEdit();
  };

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      const payload: Record<string, unknown> = {
        name: editName || undefined, currency: editCurrency || undefined,
      };
      if (acc.account_type !== 'cash') {
        payload.bank_name = editBank || undefined;
        payload.account_type = editType;
      }
      if (acc.account_type === 'cash') {
        const bal = parseFloat(editBalance);
        if (!isNaN(bal)) payload.balance = String(bal);
      }
      const res = await apiClient.patch(`/accounts/${acc.id}`, payload);
      onSaved(res.data);
      closeEdit(); // ← анимация назад
    } catch (err: unknown) {
      setError((err as any)?.response?.data?.detail || 'Ошибка сохранения');
    } finally { setSaving(false); }
  };

  return (
    <div className="glass-card rounded-2xl p-5">
      {/*
        key меняется при каждом openEdit/closeEdit → React пересоздаёт узел
        animClass уже обновлён через ref к моменту рендера
      */}
      <div key={animKey} className={animClass}>
        {isEditing ? (
          <div className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 text-sm text-danger">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-default-400">Название</label>
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  className="input-field h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-default-400">Валюта</label>
                <SelectField value={editCurrency} onChange={setEditCurrency} options={CURRENCY_OPTIONS} />
              </div>
              {acc.account_type === 'cash' && (
                <div className="space-y-1.5">
                  <label className="text-xs text-default-400">Баланс</label>
                  <input type="number" value={editBalance}
                    onChange={e => setEditBalance(e.target.value)}
                    placeholder="0" className="input-field h-9 text-sm" />
                </div>
              )}
              {acc.account_type !== 'cash' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs text-default-400">Банк</label>
                    <input value={editBank} onChange={e => setEditBank(e.target.value)}
                      placeholder="Сбербанк" className="input-field h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-default-400">Тип</label>
                    <SelectField value={editType}
                      onChange={v => setEditType(v as BankAccountType)}
                      options={ACCOUNT_TYPE_OPTIONS} />
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-1.5 px-4 h-9 rounded-xl
                           bg-gradient-to-r from-[#3D7EFF] to-[#1644B8]
                           text-white text-sm font-semibold disabled:opacity-60
                           hover:opacity-90 transition-opacity">
                {saving
                  ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  : <Check className="w-3.5 h-3.5" />}
                Сохранить
              </button>
              <button onClick={closeEdit}
                className="flex items-center gap-1.5 px-4 h-9 rounded-xl
                           bg-content2 border border-divider text-sm
                           text-default-400 hover:text-foreground transition-colors">
                <X className="w-3.5 h-3.5" /> Отмена
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {TYPE_ICONS[acc.account_type]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{acc.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-content2 text-default-400">
                    {TYPE_LABELS[acc.account_type]}
                  </span>
                  {acc.bank_name && (
                    <span className="text-xs text-default-400">{acc.bank_name}</span>
                  )}
                </div>
                {acc.last_four_digits
                  ? <p className="text-xs text-default-400 mt-0.5">•••• {acc.last_four_digits} · {acc.currency}</p>
                  : <p className="text-xs text-default-400 mt-0.5">{acc.currency}</p>
                }
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-lg font-bold text-foreground">
                {formatBalance(acc.balance, acc.currency)}
              </p>
              <div className="flex items-center gap-1">
                <button onClick={handleOpenEdit}
                  className="p-2 rounded-lg text-default-400 hover:text-foreground
                             hover:bg-content2 transition-all" aria-label="Редактировать">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => onDeleteRequest(acc.id)}
                  className="p-2 rounded-lg text-default-400 hover:text-danger
                             hover:bg-danger/10 transition-all" aria-label="Удалить">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [error, setError] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const showSkeleton = useDelayedSkeleton(isLoading && isInitialLoad, 2000);

  const [showCreate, setShowCreate] = useState(false);
  const [cashName, setCashName] = useState('');
  const [cashCurrency, setCashCurrency] = useState('RUB');
  const [creating, setCreating] = useState(false);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { mounted: createMounted, animating: createAnimating } = useAnimatedMount(showCreate, 220);
  const { mounted: deleteMounted, animating: deleteAnimating } = useAnimatedMount(deleteId !== null, 220);

  // Сохраняем аккаунт для удаления во время exit-анимации модала
  const deleteAccRef = useRef<Account | undefined>(undefined);
  const deleteAcc = accounts.find(a => a.id === deleteId);
  if (deleteAcc) deleteAccRef.current = deleteAcc;
  const displayDeleteAcc = deleteAccRef.current;

  useEffect(() => { fetchAccounts(); }, []);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/accounts');
      setAccounts(res.data);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  const handleCreate = async () => {
    setCreating(true); setError('');
    try {
      const res = await apiClient.post('/accounts', {
        name: cashName, account_type: 'cash', currency: cashCurrency,
      });
      setAccounts(prev => [...prev, res.data]);
      setShowCreate(false); setCashName(''); setCashCurrency('RUB');
    } catch (err: unknown) {
      setError((err as any)?.response?.data?.detail || 'Ошибка создания');
    } finally { setCreating(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true); setError('');
    try {
      await apiClient.delete(`/accounts/${deleteId}`);
      setAccounts(prev => prev.filter(a => a.id !== deleteId));
      setDeleteId(null);
    } catch (err: unknown) {
      setError((err as any)?.response?.data?.detail || 'Ошибка удаления');
    } finally { setDeleting(false); }
  };

  return (
    <div className="space-y-6 max-w-3xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Счета</h1>
        <button
          onClick={() => { setShowCreate(true); setError(''); }}
          className="flex items-center gap-2 px-4 h-10 rounded-xl
                     bg-gradient-to-r from-[#3D7EFF] to-[#1644B8]
                     text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Наличный счёт
        </button>
      </div>

      {/* Подсказка */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20
                      text-sm text-default-400">
        <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        Банковские карты и счета добавляются автоматически при загрузке выписки
        через Telegram бота. Вручную можно добавить только счёт наличных.
      </div>

      {/* Список */}
      {isInitialLoad ? (
        showSkeleton ? <AccountSkeleton /> : null
      ) : accounts.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center space-y-2 animate-tab-in">
          <Wallet className="w-12 h-12 mx-auto mb-3 text-default-300" />
          <p className="font-medium text-foreground">Счета не найдены</p>
          <p className="text-sm text-default-400">
            Загрузите выписку через Telegram бота — счета появятся автоматически
          </p>
        </div>
      ) : (
        <div className="space-y-3 stagger-container">
          {accounts.map(acc => (
            <AccountCard
              key={acc.id}
              acc={acc}
              onSaved={updated =>
                setAccounts(prev => prev.map(a => a.id === updated.id ? updated : a))
              }
              onDeleteRequest={id => { setDeleteId(id); setError(''); }}
            />
          ))}
        </div>
      )}

      {/* Модал создания */}
      {createMounted && (
        <ModalPortal>
          <div
            className={`fixed inset-0 z-[100] flex items-center justify-center px-4 modal-overlay
                        ${createAnimating ? 'animate-overlay-in' : 'animate-overlay-out'}`}
            onClick={() => { setShowCreate(false); setError(''); }}
          >
            <div
              className={`relative glass-modal rounded-2xl p-6 w-full max-w-sm space-y-4
                          ${createAnimating ? 'animate-modal-content' : 'animate-modal-out'}`}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Новый счёт (наличные)</h2>
                <button onClick={() => setShowCreate(false)}
                  className="text-default-400 hover:text-foreground p-1 rounded-lg
                             hover:bg-white/5 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {error && (
                <p className="text-sm text-danger flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> {error}
                </p>
              )}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-default-500">Название</label>
                  <input value={cashName} onChange={e => setCashName(e.target.value)}
                    placeholder="Кошелёк" className="input-field" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-default-500">Валюта</label>
                  <SelectField value={cashCurrency} onChange={setCashCurrency} options={CURRENCY_OPTIONS} />
                </div>
              </div>
              <button onClick={handleCreate} disabled={creating || !cashName.trim()}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-[#3D7EFF] to-[#1644B8]
                           text-white text-sm font-semibold disabled:opacity-60
                           flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                {creating ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Создать'}
              </button>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* Модал удаления */}
      {deleteMounted && displayDeleteAcc && (
        <ModalPortal>
          <div
            className={`fixed inset-0 z-[100] flex items-center justify-center px-4 modal-overlay
                        ${deleteAnimating ? 'animate-overlay-in' : 'animate-overlay-out'}`}
            onClick={() => { setDeleteId(null); setError(''); }}
          >
            <div
              className={`relative glass-modal rounded-2xl p-6 w-full max-w-sm space-y-4
                          ${deleteAnimating ? 'animate-modal-content' : 'animate-modal-out'}`}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Удалить счёт?</h2>
                <button onClick={() => setDeleteId(null)}
                  className="text-default-400 hover:text-foreground p-1 rounded-lg
                             hover:bg-white/5 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {error && (
                <p className="text-sm text-danger flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> {error}
                </p>
              )}
              <div className="p-4 rounded-xl bg-content2 space-y-1">
                <p className="font-medium text-foreground">{displayDeleteAcc.name}</p>
                {displayDeleteAcc.last_four_digits && (
                  <p className="text-xs text-default-400">•••• {displayDeleteAcc.last_four_digits}</p>
                )}
              </div>
              <p className="text-sm text-default-400">
                {displayDeleteAcc.account_type !== 'cash'
                  ? 'Банковский счёт будет деактивирован. История транзакций сохранится.'
                  : 'Счёт наличных и все связанные данные будут удалены безвозвратно.'}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 h-10 rounded-xl bg-content2 hover:bg-content3
                             transition-colors text-sm font-medium">
                  Отмена
                </button>
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 h-10 rounded-xl bg-danger hover:bg-danger/80
                             text-white text-sm font-semibold transition-colors
                             disabled:opacity-60 flex items-center justify-center gap-2">
                  {deleting
                    ? <RefreshCw className="w-4 h-4 animate-spin" />
                    : displayDeleteAcc.account_type !== 'cash' ? 'Деактивировать' : 'Удалить'}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

    </div>
  );
}
```
</document>

<document path="./app/settings/page.tsx">
```tsx
'use client';
import { useState, useEffect, SetStateAction } from 'react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  User, Lock, Bell, Check, RefreshCw, AlertCircle,
  Eye, EyeOff, ExternalLink, Send, CheckCircle,
  Unlink, Copy, CheckCheck,
} from 'lucide-react';

type Tab = 'profile' | 'security' | 'notifications' | 'integrations';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Профиль', icon: <User className="w-4 h-4" /> },
  { id: 'security', label: 'Безопасность', icon: <Lock className="w-4 h-4" /> },
  { id: 'notifications', label: 'Уведомления', icon: <Bell className="w-4 h-4" /> },
  { id: 'integrations', label: 'Telegram', icon: <Send className="w-4 h-4" /> },
];

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<Tab>('profile');
  const [prevTab, setPrevTab] = useState<Tab>('profile');
  const TAB_ORDER: Tab[] = ['profile', 'security', 'notifications', 'integrations'];

  // Profile
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Security
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdSaved, setPwdSaved] = useState(false);
  const [pwdError, setPwdError] = useState('');

  // Notifications (локальные настройки в cookies)
  const [notifEmail, setNotifEmail] = useState(false);
  const [notifPush, setNotifPush] = useState(true);


  // Telegram
  const [tgStatus, setTgStatus] = useState<{ is_linked: boolean; telegram_username?: string } | null>(null);
  const [tgLoading, setTgLoading] = useState(false);
  const [tgLinkData, setTgLinkData] = useState<{ deep_link: string; expires_at: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Заполняем форму данными пользователя
  useEffect(() => {
    apiClient.get("auth/me").then(r => {
      setName(r.data.username);
      setEmail(r.data.email);
      setFullName(r.data.full_name ?? "");
    });
  }, []);


  useEffect(() => {
    if (!mounted) return;
    apiClient.get('/telegram/status')
      .then((r: { data: SetStateAction<{ is_linked: boolean; telegram_username?: string; } | null>; }) => setTgStatus(r.data))
      .catch(() => setTgStatus({ is_linked: false }));
  }, [mounted]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mounted && tgStatus && !tgStatus.is_linked && tgLinkData) {
      interval = setInterval(() => {
        apiClient.get('/telegram/status').then((r: { data: { is_linked: any; telegram_username: any; }; }) => {
          if (r.data.is_linked) {
            setTgStatus({ is_linked: true, telegram_username: r.data.telegram_username });
            setTgLinkData(null);
            clearInterval(interval);
          }
        }).catch(() => { });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [mounted, tgStatus?.is_linked, tgLinkData]);

  const handleTabChange = (newTab: Tab) => {
    setPrevTab(tab);
    setTab(newTab);
  };

  const isForward = TAB_ORDER.indexOf(tab) >= TAB_ORDER.indexOf(prevTab);

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setProfileError('');
    try {
      const res = await apiClient.patch('/users/me', {
        username: name || undefined,
        email: email || undefined,
        full_name: fullName || undefined,
      });

      // updateUser сам обновит стейт + куку
      updateUser(res.data);

      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (err: any) {
      setProfileError(err.response?.data?.detail || 'Ошибка сохранения');
    } finally {
      setProfileSaving(false);
    }
  };

  // Бэкенд ожидает old_password, не current_password
  const handleChangePassword = async () => {
    if (newPwd !== confirmPwd) { setPwdError('Пароли не совпадают'); return; }
    if (newPwd.length < 8) { setPwdError('Минимум 8 символов'); return; }
    setPwdSaving(true);
    setPwdError('');
    try {
      await apiClient.post('/auth/change-password', {
        old_password: currentPwd,   // ← было current_password
        new_password: newPwd,
      });
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
      setPwdSaved(true);
      setTimeout(() => setPwdSaved(false), 2000);
    } catch (err: any) {
      setPwdError(err.response?.data?.detail || 'Ошибка смены пароля');
    } finally {
      setPwdSaving(false);
    }
  };
  // Инициалы — только после монтирования
  const initials = mounted
    ? (user?.full_name ?? user?.username ?? 'AF')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : 'AF'

  // Генерация deep link:
  const handleGenerateLink = async () => {
    setTgLoading(true);
    try {
      const res = await apiClient.post('/telegram/generate-link');
      setTgLinkData(res.data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setTgLoading(false);
    }
  };

  // Копировать ссылку:
  const handleCopy = async () => {
    if (!tgLinkData) return;
    await navigator.clipboard.writeText(tgLinkData.deep_link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Отвязать Telegram:
  const handleUnlink = async () => {
    setTgLoading(true);
    try {
      await apiClient.delete('/telegram/unlink');
      setTgStatus({ is_linked: false });
      setTgLinkData(null);
    } catch (err: any) {
      console.error(err);
    } finally {
      setTgLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Настройки</h1>
      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 p-1 glass-card rounded-xl">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? 'bg-content3 text-foreground' : 'text-default-400 hover:text-foreground hover:bg-content2'
              }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <div
        key={tab}   // ← key вызывает ремонтирование при смене таба
        className={isForward ? 'animate-tab-in' : 'animate-tab-back'}
      >
        {/* Profile Tab */}
        {tab === 'profile' && (
          <div className="glass-card rounded-2xl p-6 space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00FFA3] to-[#00C853] flex items-center justify-center">
                {/* suppressHydrationWarning подавляет предупреждение для этого элемента */}
                <span
                  className="text-2xl font-bold text-black"
                  suppressHydrationWarning
                >
                  {initials}
                </span>
              </div>
              <div>
                <p
                  className="font-semibold text-foreground"
                  suppressHydrationWarning
                >
                  {mounted ? (user?.full_name ?? user?.username) : ''}
                </p>
                <p
                  className="text-sm text-default-400"
                  suppressHydrationWarning
                >
                  {mounted ? user?.email : ''}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-divider">
              <Field label="Имя пользователя">
                <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
              </Field>
              <Field label="Полное имя">
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Иван Иванов" className="input-field" />
              </Field>
              <Field label="Email">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
              </Field>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={profileSaving}
              className="flex items-center gap-2 px-5 h-10 rounded-xl bg-gradient-to-r from-[#3D7EFF] to-[#1644B8] text-black text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60"
            >
              {profileSaving ? <RefreshCw className="w-4 h-4 animate-spin" />
                : profileSaved ? <><Check className="w-4 h-4" /> Сохранено!</>
                  : 'Сохранить'}
            </button>
          </div>
        )}

        {/* Security Tab */}
        {tab === 'security' && (
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-semibold">Смена пароля</h2>

            {pwdError && (
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FF3366]/10 border border-[#FF3366]/30 text-sm text-[#FF3366]">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {pwdError}
              </div>
            )}

            <div className="space-y-4">
              <Field label="Текущий пароль">
                <div className="relative">
                  <input type={showPwd ? 'text' : 'password'} value={currentPwd}
                    onChange={(e) => setCurrentPwd(e.target.value)} className="input-field pr-10" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-default-400">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>
              <Field label="Новый пароль">
                <input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className="input-field" />
              </Field>
              <Field label="Подтвердите пароль">
                <input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} className="input-field" />
              </Field>
            </div>

            <button
              onClick={handleChangePassword}
              disabled={pwdSaving || !currentPwd || !newPwd || !confirmPwd}
              className="flex items-center gap-2 px-5 h-10 rounded-xl bg-gradient-to-r from-[#3D7EFF] to-[#1644B8] text-black text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60"
            >
              {pwdSaving ? <RefreshCw className="w-4 h-4 animate-spin" />
                : pwdSaved ? <><Check className="w-4 h-4" /> Изменён!</>
                  : 'Изменить пароль'}
            </button>
          </div>
        )}

        {/* Notifications Tab */}
        {tab === 'notifications' && (
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold mb-2">Уведомления</h2>
            {[
              { label: 'Email-уведомления', sub: 'Ежедневные сводки на почту', value: notifEmail, set: setNotifEmail },
              { label: 'Push-уведомления', sub: 'Уведомления в браузере', value: notifPush, set: setNotifPush },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-4 border-b border-divider last:border-0">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-default-400 mt-0.5">{item.sub}</p>
                </div>
                <Toggle checked={item.value} onChange={() => item.set(!item.value)} />
              </div>
            ))}
          </div>
        )}
        {/* Integrations Tab */}
        {tab === 'integrations' && (
          <div className="glass-card rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Send className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Telegram</h2>
                <p className="text-sm text-default-400">
                  Привязка бота для загрузки банковских выписок
                </p>
              </div>
            </div>

            {tgStatus === null ? (
              // Загрузка статуса
              <div className="flex items-center gap-2 text-sm text-default-400">
                <RefreshCw className="w-4 h-4 animate-spin" /> Загрузка...
              </div>
            ) : tgStatus.is_linked ? (
              // Привязан
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-success/10 border border-success/30">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-success">Telegram привязан</p>
                    {tgStatus.telegram_username && (
                      <p className="text-xs text-default-400 mt-0.5">
                        @{tgStatus.telegram_username}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleUnlink}
                  disabled={tgLoading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-content2 border border-divider text-sm text-default-500 hover:text-[#FF3366] hover:border-[#FF3366]/50 transition-all disabled:opacity-50"
                >
                  <Unlink className="w-4 h-4" />
                  Отвязать Telegram
                </button>
              </div>
            ) : !tgLinkData ? (
              // Не привязан — показываем кнопку генерации
              <div className="space-y-3">
                <p className="text-sm text-default-400 leading-relaxed">
                  Привяжите Telegram бота чтобы загружать банковские выписки прямо
                  из мессенджера. Транзакции будут импортироваться автоматически.
                </p>
                <button
                  onClick={handleGenerateLink}
                  disabled={tgLoading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/40 text-sm text-primary hover:bg-[#00E5FF]/20 transition-all disabled:opacity-50"
                >
                  {tgLoading
                    ? <span className="w-4 h-4 border-2 border-[#00E5FF]/30 border-t-[#00E5FF] rounded-full animate-spin" />
                    : <Send className="w-4 h-4" />
                  }
                  Привязать Telegram
                </button>
              </div>
            ) : (
              // Deep link сгенерирован
              <div className="space-y-3">
                <p className="text-sm text-default-400">
                  Ссылка действительна{' '}
                  <span className="text-foreground font-medium">10 минут</span>.
                  Нажмите кнопку чтобы открыть бота.
                </p>
                <a
                  href={tgLinkData.deep_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-gradient-to-r from-[#3D7EFF] to-[#1644B8] text-black text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <ExternalLink className="w-4 h-4" />
                  Открыть Telegram бота
                </a>
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-content2 border border-divider text-sm text-default-500 hover:text-foreground hover:bg-content3 transition-all"
                >
                  {copied
                    ? <><Check className="w-4 h-4 text-success" /><span className="text-success">Скопировано</span></>
                    : <><Copy className="w-4 h-4" />Скопировать ссылку</>
                  }
                </button>
                <button
                  onClick={() => setTgLinkData(null)}
                  className="text-xs text-default-400 hover:text-default-600 transition-colors w-full text-center pt-1"
                >
                  Сгенерировать новую ссылку
                </button>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-default-600">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} role="switch" aria-checked={checked}
      className={`relative inline-flex w-10 h-6 rounded-full transition-colors flex-shrink-0 focus:outline-none ${checked ? 'bg-[#00FFA3]' : 'bg-content3'}`}>
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
    </button>
  );
}
```
</document>

<document path="./app/analytics/page.tsx">
```tsx
'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { TrendingUp, TrendingDown, BarChart2, RefreshCw, ChevronDown } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { useTheme } from 'next-themes';
import { apiClient } from '@/lib/api';
import type { Transaction } from '@/lib/types';
import { useAnimatedMount } from '@/lib/hooks/useAnimatedMount';
import { useDelayedSkeleton } from '@/lib/hooks/useDelayedSkeleton';
import { ChartTooltip } from '@/components/ui/ChartTooltip';

interface CategoryStat { category_name: string; total: number; color?: string; }
// isPartial — месяц попадает в период частично (первый или последний)
interface MonthlyPoint { month: string; income: number; expense: number; balance: number; isPartial: boolean; }
interface TopMerchant { merchant: string; total: number; count: number; }

const CHART_COLORS = ['#3D7EFF', '#FF3366', '#00FFA3', '#FFB800', '#A855F7', '#FF6600', '#06B6D4', '#1ABC9C'];

const PERIODS = [
  { label: '7 дней', days: 7 },
  { label: '30 дней', days: 30 },
  { label: '90 дней', days: 90 },
  { label: '180 дней', days: 180 },
  { label: 'Год', days: 365 },
] as const;

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`shimmer rounded-xl ${className}`} />;
}

function getDateRange(days: number) {
  const now = new Date();
  const dateTo = now.toISOString().split('T')[0];
  const dateFrom = new Date(now.getTime() - days * 86_400_000).toISOString().split('T')[0];
  return { dateFrom, dateTo };
}

function formatMonth(yyyymm: string) {
  const [y, m] = yyyymm.split('-');
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  return `${months[Number(m) - 1]} ${y}`;
}

/**
 * Перевод между своими счетами — не доход и не расход.
 * Сбер присылает их как income/expense, но с category_type === 'transfer'.
 */
function isInternalTransfer(tx: Transaction): boolean {
  return (
    tx.transaction_type === 'transfer' ||
    tx.category?.category_type === 'transfer'
  );
}

/**
 * Месяц попадает в период частично, если:
 * - это первый месяц и период начинается не с 1-го числа
 * - это последний месяц и период заканчивается не в последний день
 */
function isPartialMonth(month: string, dateFrom: string, dateTo: string): boolean {
  const startMonth = dateFrom.slice(0, 7);
  const endMonth = dateTo.slice(0, 7);
  if (month === startMonth && new Date(dateFrom).getDate() > 1) return true;
  if (month === endMonth) {
    const dt = new Date(dateTo);
    const lastDay = new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate();
    if (dt.getDate() < lastDay) return true;
  }
  return false;
}

export default function AnalyticsPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== 'light';

  const C = {
    income: isDark ? '#00FFA3' : '#00874A',
    expense: isDark ? '#FF3366' : '#DC2626',
    primary: isDark ? '#3D7EFF' : '#1A6EF5',
    grid: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(100,80,50,0.10)',
    tick: isDark ? '#9CA3AF' : '#7A6A58',
    tooltip: {
      bg: isDark ? '#111113' : '#FAF7F2',
      border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(180,155,120,0.3)',
      color: isDark ? '#fff' : '#1A1510',
    },
  };
  const tooltipStyle = {
    background: C.tooltip.bg, border: `1px solid ${C.tooltip.border}`,
    borderRadius: 12, fontSize: 12, color: C.tooltip.color,
  };

  const [periodIdx, setPeriodIdx] = useState(1);
  const [periodOpen, setPeriodOpen] = useState(false);
  const periodRef = useRef<HTMLDivElement>(null);
  const { mounted: dropMounted, animating: dropAnimating } = useAnimatedMount(periodOpen, 160);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (periodRef.current && !periodRef.current.contains(e.target as Node)) setPeriodOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const [expenseByCategory, setExpenseByCategory] = useState<CategoryStat[]>([]);
  const [incomeByCategory, setIncomeByCategory] = useState<CategoryStat[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyPoint[]>([]);
  const [topMerchants, setTopMerchants] = useState<TopMerchant[]>([]);
  // balance убран — заменён на netFlow (income − expense за период без переводов)
  const [totals, setTotals] = useState({ income: 0, expense: 0, netFlow: 0 });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const showSkeleton = useDelayedSkeleton(isLoading && isInitialLoad, 2000);
  const fadeOnUpdate = `transition-opacity duration-500 ${isLoading && !isInitialLoad ? 'opacity-50' : 'opacity-100'}`;

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const { dateFrom, dateTo } = getDateRange(PERIODS[periodIdx].days);

      // /accounts/total-balance убран — текущий снимок счетов не относится к периоду
      const txRes = await apiClient.get('/transactions', {
        params: { date_from: dateFrom, date_to: dateTo, page_size: 500, page: 1 },
      });

      const allTx: Transaction[] = txRes.data.items ?? [];

      // Переводы исключаем из всех расчётов
      const operationalTx = allTx.filter(tx => !isInternalTransfer(tx));

      let income = 0, expense = 0;
      for (const tx of operationalTx) {
        if (tx.transaction_type === 'income') income += Number(tx.amount);
        if (tx.transaction_type === 'expense') expense += Number(tx.amount);
      }
      setTotals({ income, expense, netFlow: income - expense });

      // Категории — только реальные операции, без переводов
      const expCatMap: Record<string, number> = {};
      const incCatMap: Record<string, number> = {};
      for (const tx of operationalTx) {
        const name = tx.category?.name ?? 'Прочее';
        if (tx.transaction_type === 'expense') expCatMap[name] = (expCatMap[name] ?? 0) + Number(tx.amount);
        if (tx.transaction_type === 'income') incCatMap[name] = (incCatMap[name] ?? 0) + Number(tx.amount);
      }
      setExpenseByCategory(
        Object.entries(expCatMap).sort(([, a], [, b]) => b - a)
          .map(([name, total], i) => ({ category_name: name, total, color: CHART_COLORS[i % CHART_COLORS.length] }))
      );
      setIncomeByCategory(
        Object.entries(incCatMap).sort(([, a], [, b]) => b - a)
          .map(([name, total], i) => ({ category_name: name, total, color: CHART_COLORS[i % CHART_COLORS.length] }))
      );

      // Помесячная динамика — без переводов, с пометкой частичных месяцев
      const byMonth: Record<string, { income: number; expense: number }> = {};
      for (const tx of operationalTx) {
        const month = tx.transaction_date.slice(0, 7);
        if (!byMonth[month]) byMonth[month] = { income: 0, expense: 0 };
        if (tx.transaction_type === 'income') byMonth[month].income += Number(tx.amount);
        if (tx.transaction_type === 'expense') byMonth[month].expense += Number(tx.amount);
      }
      setMonthlyData(
        Object.entries(byMonth)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([month, v]) => ({
            month,
            income: v.income,
            expense: v.expense,
            balance: v.income - v.expense,
            isPartial: isPartialMonth(month, dateFrom, dateTo),
          }))
      );

      // Топ-5 трат — только операционные расходы
      const merchantMap: Record<string, { total: number; count: number }> = {};
      for (const tx of operationalTx) {
        if (tx.transaction_type !== 'expense' || !tx.merchant) continue;
        if (!merchantMap[tx.merchant]) merchantMap[tx.merchant] = { total: 0, count: 0 };
        merchantMap[tx.merchant].total += Number(tx.amount);
        merchantMap[tx.merchant].count += 1;
      }
      setTopMerchants(
        Object.entries(merchantMap)
          .map(([merchant, v]) => ({ merchant, ...v }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 5)
      );
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка загрузки');
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, [periodIdx]);

  useEffect(() => { load(); }, [load]);

  const maxMerchant = Math.max(...topMerchants.map(m => m.total), 1);
  const hasPartialMonths = monthlyData.some(p => p.isPartial);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Аналитика</h1>
          <p className="text-default-500 text-sm mt-1">
            Статистика за период:{' '}
            <span className="text-foreground font-medium">{PERIODS[periodIdx].label}</span>
            {isLoading && !isInitialLoad && (
              <span className="ml-2 inline-block w-3 h-3 rounded-full border-2
                               border-primary border-t-transparent animate-spin align-middle" />
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} disabled={isLoading}
            className="p-2.5 rounded-xl bg-content2 border border-divider text-default-400
                       hover:text-foreground hover:bg-content3 transition-colors disabled:opacity-40">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <div ref={periodRef} className="relative">
            <button
              onClick={() => setPeriodOpen(v => !v)}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-content2
                         border border-divider text-sm font-medium hover:bg-content3
                         transition-colors disabled:opacity-60"
            >
              {PERIODS[periodIdx].label}
              <ChevronDown className={`w-4 h-4 text-default-400 transition-transform duration-300
                                        ${periodOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropMounted && (
              <div className={`absolute right-0 mt-2 w-44 glass-dropdown rounded-xl py-1 z-50
                               ${dropAnimating ? 'animate-dropdown' : 'animate-dropdown-out'}`}>
                {PERIODS.map((p, i) => (
                  <button key={i}
                    onClick={() => { setPeriodIdx(i); setPeriodOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/5
                                ${periodIdx === i ? 'text-primary font-medium' : 'text-foreground'}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-sm text-danger">
          {error}
        </div>
      )}

      {/* ── Totals ── */}
      {isInitialLoad ? (
        showSkeleton ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-28" />)}
          </div>
        ) : null
      ) : (
        <div key={`totals-${periodIdx}`}
          className={`grid grid-cols-1 sm:grid-cols-3 gap-5 stagger-container ${fadeOnUpdate}`}>
          {[
            { label: 'Доходы', value: totals.income, color: C.income, Icon: TrendingUp },
            { label: 'Расходы', value: totals.expense, color: C.expense, Icon: TrendingDown },
            // Чистый поток = доходы − расходы за период; знак влияет на цвет
            { label: 'Чистый поток', value: totals.netFlow, color: totals.netFlow >= 0 ? C.income : C.expense, Icon: BarChart2 },
          ].map(({ label, value, color, Icon }) => (
            <div key={label} className="glass-card rounded-2xl p-5 hover-lift">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-default-500 font-medium uppercase tracking-wide">{label}</p>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}18`, color }}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {value < 0 ? '−' : ''}{Math.abs(value).toLocaleString('ru-RU')} ₽
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── Monthly chart ── */}
      {isInitialLoad ? (
        showSkeleton ? <Skeleton className="h-80" /> : null
      ) : (
        <div key={`monthly-${periodIdx}`}
          className={`glass-card rounded-2xl p-6 ${fadeOnUpdate}`}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-foreground">Помесячная динамика</h2>
            {/* Подсказка о неполных месяцах — только когда они есть */}
            {hasPartialMonths && (
              <span className="text-xs text-default-400">* — неполный месяц</span>
            )}
          </div>
          {monthlyData.length === 0 ? (
            <p className="text-center text-default-400 py-16 text-sm">Нет данных за период</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
                <XAxis
                  dataKey="month"
                  tickFormatter={(month) => {
                    const point = monthlyData.find(p => p.month === month);
                    return point?.isPartial ? `${formatMonth(month)}*` : formatMonth(month);
                  }}
                  tick={{ fill: C.tick, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fill: C.tick, fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `${(v / 1000).toFixed(0)}k`} width={36} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: number) => `${v.toLocaleString('ru-RU')} ₽`}
                  labelFormatter={(month) => {
                    const point = monthlyData.find(p => p.month === month);
                    return point?.isPartial
                      ? `${formatMonth(month)} (неполный)`
                      : formatMonth(month);
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                <Bar dataKey="income" name="Доходы" fill={C.income} radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Расходы" fill={C.expense} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* ── Categories ── */}
      {isInitialLoad ? (
        showSkeleton ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        ) : null
      ) : (
        <div key={`categories-${periodIdx}`}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-5 stagger-container ${fadeOnUpdate}`}>

          {/* Расходы по категориям */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-base font-semibold mb-5 text-foreground">Расходы по категориям</h2>
            {expenseByCategory.length === 0 ? (
              <p className="text-center text-default-400 py-12 text-sm">Нет данных</p>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={expenseByCategory} dataKey="total" nameKey="category_name"
                      cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3}>
                      {expenseByCategory.map((c, i) => (
                        <Cell key={i} fill={c.color ?? CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip style={tooltipStyle} />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2.5 w-full">
                  {expenseByCategory.map((c, i) => {
                    const total = expenseByCategory.reduce((s, x) => s + x.total, 0);
                    const pct = total > 0 ? Math.round((c.total / total) * 100) : 0;
                    const color = c.color ?? CHART_COLORS[i % CHART_COLORS.length];
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ background: color }} />
                            <span className="text-default-500">{c.category_name || 'Прочее'}</span>
                          </div>
                          <span className="font-medium text-foreground">
                            {c.total.toLocaleString('ru-RU')} ₽ · {pct}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-content3 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, background: color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Доходы по категориям */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-base font-semibold mb-5 text-foreground">Доходы по категориям</h2>
            {incomeByCategory.length === 0 ? (
              <p className="text-center text-default-400 py-12 text-sm">Нет данных</p>
            ) : (
              <div className="space-y-3">
                {incomeByCategory.map((c, i) => {
                  const total = incomeByCategory.reduce((s, x) => s + x.total, 0);
                  const pct = total > 0 ? Math.round((c.total / total) * 100) : 0;
                  const color = c.color ?? CHART_COLORS[i % CHART_COLORS.length];
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                          <span className="text-default-500">{c.category_name || 'Прочее'}</span>
                        </div>
                        <span className="font-medium text-foreground">
                          {c.total.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                      <div className="h-1.5 bg-content3 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Top merchants ── */}
      {isInitialLoad ? (
        showSkeleton ? (
          <div className="glass-card rounded-2xl p-6">
            <div className="h-5 shimmer rounded-lg w-32 mb-5" />
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-10" />)}
            </div>
          </div>
        ) : null
      ) : (
        <div key={`merchants-${periodIdx}`}
          className={`glass-card rounded-2xl p-6 ${fadeOnUpdate}`}>
          <h2 className="text-base font-semibold mb-5 text-foreground">Топ-5 трат</h2>
          {topMerchants.length === 0 ? (
            <p className="text-center text-default-400 py-10 text-sm">Нет данных о продавцах</p>
          ) : (
            <div className="space-y-3 stagger-container">
              {topMerchants.map((m, i) => {
                const pct = Math.round((m.total / maxMerchant) * 100);
                return (
                  <div key={i} className="flex items-center gap-4">
                    <span className="w-5 text-xs text-default-400 text-right flex-shrink-0">#{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-foreground">{m.merchant}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-default-400">{m.count} операций</span>
                          <span className="font-semibold tabular-nums text-danger">
                            {m.total.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-content3 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: `linear-gradient(90deg, ${C.expense}, #FF6600)`,
                          }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Balance trend ── */}
      {!isInitialLoad && monthlyData.length > 1 && (
        <div key={`trend-${periodIdx}`}
          className={`glass-card rounded-2xl p-6 ${fadeOnUpdate}`}>
          <h2 className="text-base font-semibold mb-5 text-foreground">Тренд чистого потока</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
              <XAxis
                dataKey="month"
                tickFormatter={(month) => {
                  const point = monthlyData.find(p => p.month === month);
                  return point?.isPartial ? `${formatMonth(month)}*` : formatMonth(month);
                }}
                tick={{ fill: C.tick, fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fill: C.tick, fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v / 1000).toFixed(0)}k`} width={36} />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v: number) => `${v.toLocaleString('ru-RU')} ₽`}
                labelFormatter={(month) => {
                  const point = monthlyData.find(p => p.month === month);
                  return point?.isPartial
                    ? `${formatMonth(month)} (неполный)`
                    : formatMonth(month);
                }}
              />
              <Line type="monotone" dataKey="balance" name="Чистый поток"
                stroke={C.primary} strokeWidth={2}
                dot={{ r: 4, fill: C.primary }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  );
}
```
</document>

<document path="./components/dashboard/StatCard.tsx">
```tsx
"use client";

import { Card, CardBody } from "@heroui/react";
import { Wallet, TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

// Маппинг строковых идентификаторов на компоненты иконок
const iconMap: Record<string, LucideIcon> = {
  wallet: Wallet,
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
};

interface StatCardProps {
  label: string;
  value: string;
  change: number;
  trend: "up" | "down";
  icon: "wallet" | "trending-up" | "trending-down";  // ← Строка, а не компонент
  color: "primary" | "success" | "danger";
}

export default function StatCard({
  label,
  value,
  change,
  trend,
  icon,
  color,
}: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Получаем компонент иконки из маппинга
  const Icon = iconMap[icon];

  const colorClasses = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    danger: "text-[#FF3366] bg-[#FF3366]/10",
  };

  const glowClasses = {
    primary: "glow-primary",
    success: "glow-success",
    danger: "glow-danger",
  };

  return (
    <Card
      className={`glass-card hover-lift card-hover-glow transition-all ${isVisible ? "animate-scale-in" : "opacity-0"
        }`}
    >
      <CardBody className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-default-500 mb-1">{label}</p>
            <h3 className="text-3xl font-bold mb-2">{value}</h3>
            <div className="flex items-center gap-1">
              {trend === "up" ? (
                <span className="text-success text-sm font-medium">
                  ↗ +{Math.abs(change)}%
                </span>
              ) : (
                <span className="text-[#FF3366] text-sm font-medium">
                  ↘ {change}%
                </span>
              )}
              <span className="text-xs text-default-400 ml-1">за месяц</span>
            </div>
          </div>
          <div
            className={`w-14 h-14 rounded-xl ${colorClasses[color]} flex items-center justify-center ${glowClasses[color]}`}
          >
            <Icon className="w-7 h-7" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
```
</document>

<document path="./components/dashboard/TransactionList.tsx">
```tsx
"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

interface Transaction {
  id: number;
  date: string;
  merchant: string;
  amount: number;
  category: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({
  transactions,
}: TransactionListProps) {
  return (
    <Card className="glass-card animate-slide-up">
      <CardHeader>
        <h2 className="text-2xl font-bold">Последние транзакции</h2>
      </CardHeader>
      <CardBody>
        <Table
          removeWrapper
          aria-label="Таблица транзакций"
          classNames={{
            base: "bg-transparent",
            th: "bg-content2 text-default-600 font-semibold",
            td: "text-default-700 dark:text-default-300",
          }}
        >
          <TableHeader>
            <TableColumn>ДАТА</TableColumn>
            <TableColumn>КОНТРАГЕНТ</TableColumn>
            <TableColumn>КАТЕГОРИЯ</TableColumn>
            <TableColumn align="end">СУММА</TableColumn>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} className="hover:bg-content2 transition-colors">
                <TableCell>{tx.date}</TableCell>
                <TableCell className="font-medium">{tx.merchant}</TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat">
                    {tx.category}
                  </Chip>
                </TableCell>
                <TableCell>
                  <span
                    className={`font-semibold ${tx.amount > 0
                        ? "text-success"
                        : "text-[#FF3366]"
                      }`}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {Math.abs(tx.amount).toLocaleString("ru-RU")} ₽
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
```
</document>

<document path="./components/dashboard/TransactionDetailModal.tsx">
```tsx
'use client';
import { useRef } from 'react';
import { X, Calendar, CreditCard, Tag, Hash, ArrowRightLeft } from 'lucide-react';
import type { Transaction } from '@/lib/types';
import { formatDateUI } from '@/lib/types';
import ModalPortal from '@/components/ui/ModalPortal';
import { useAnimatedMount } from '@/lib/hooks/useAnimatedMount';

interface Props {
  tx: Transaction | null;
  onClose: () => void;
}

export default function TransactionDetailModal({ tx, onClose }: Props) {
  // Сохраняем последнюю транзакцию — нужна во время exit-анимации
  const lastTxRef = useRef<Transaction | null>(null);
  if (tx) lastTxRef.current = tx;

  const { mounted, animating } = useAnimatedMount(!!tx, 220);

  // Размонтируемся только после завершения exit-анимации
  if (!mounted) return null;

  const displayTx = lastTxRef.current!;
  const amount = Number(displayTx.amount);
  const isIncome = displayTx.transaction_type === 'income';
  const isExpense = displayTx.transaction_type === 'expense';
  const amountColor = isIncome ? 'text-success' : isExpense ? 'text-danger' : 'text-primary';

  return (
    <ModalPortal>
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center p-4
                  modal-overlay
                  ${animating ? 'animate-overlay-in' : 'animate-overlay-out'}`}
        onClick={onClose}
      >
        <div
          className={`relative glass-modal rounded-2xl w-full max-w-md p-6
                    ${animating ? 'animate-modal-content' : 'animate-modal-out'}`}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-default-400
                       hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6 pr-8">
            <p className="text-xs text-default-400 uppercase tracking-wide mb-1">
              {displayTx.category?.name ?? 'Без категории'}
            </p>
            <h2 className="text-xl font-bold text-foreground">
              {displayTx.merchant ?? displayTx.description ?? '—'}
            </h2>
            <p className={`text-2xl font-bold mt-1 ${amountColor}`}>
              {isIncome ? '+' : isExpense ? '-' : ''}
              {Math.abs(amount).toLocaleString('ru-RU')} ₽
            </p>
          </div>

          <div>
            <DetailRow icon={<Calendar className="w-4 h-4" />} label="Дата" value={formatDateUI(displayTx.transaction_date)} />
            <DetailRow icon={<Tag className="w-4 h-4" />} label="Категория" value={displayTx.category?.name ?? '—'} />
            <DetailRow icon={<CreditCard className="w-4 h-4" />} label="Счёт" value={displayTx.account?.name ?? '—'} />
            {displayTx.external_id && (
              <DetailRow icon={<Hash className="w-4 h-4" />} label="Код авторизации" value={displayTx.external_id} mono />
            )}
            <DetailRow
              icon={<ArrowRightLeft className="w-4 h-4" />}
              label="Источник"
              value={displayTx.import_source === 'sber_pdf' ? 'Выписка Сбер' : 'Ручной ввод'}
            />
            {displayTx.description && (
              <DetailRow icon={<ArrowRightLeft className="w-4 h-4" />} label="Описание" value={displayTx.description} />
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-divider/40">
            <button
              onClick={onClose}
              className="w-full h-10 rounded-xl transition-colors text-sm font-medium
                         text-default-500 hover:text-foreground
                         bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10
                         border border-black/10 dark:border-white/10"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

function DetailRow({ icon, label, value, mono }: {
  icon: React.ReactNode; label: string; value: string; mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-divider/40 last:border-0">
      <div className="flex items-center gap-2.5 text-default-400">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className={`text-sm font-medium text-foreground text-right max-w-[55%] truncate
                        ${mono ? 'font-mono text-xs text-default-500' : ''}`}>
        {value}
      </span>
    </div>
  );
}
```
</document>

<document path="./components/dashboard/BudgetProgress.tsx">
```tsx
"use client";

import { Card, CardBody, CardHeader, Progress } from "@heroui/react";

interface BudgetItem {
  category: string;
  spent: number;
  limit: number;
  color: "success" | "warning" | "danger";
}

interface BudgetProgressProps {
  budgets: BudgetItem[];
}

export default function BudgetProgress({ budgets }: BudgetProgressProps) {
  return (
    <Card className="glass-card animate-slide-up">
      <CardHeader>
        <h2 className="text-2xl font-bold">Бюджет по категориям</h2>
      </CardHeader>
      <CardBody className="space-y-6">
        {budgets.map((budget, idx) => {
          const percentage = (budget.spent / budget.limit) * 100;
          return (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{budget.category}</span>
                <span className="text-sm text-default-500">
                  {budget.spent.toLocaleString("ru-RU")} ₽ /{" "}
                  {budget.limit.toLocaleString("ru-RU")} ₽
                </span>
              </div>
              <Progress
                value={percentage}
                color={budget.color}
                size="md"
                className="w-full"
                classNames={{
                  indicator: percentage > 90 ? "animate-glow-pulse" : "",
                }}
              />
              <div className="flex justify-between items-center text-xs text-default-400">
                <span>{percentage.toFixed(0)}% использовано</span>
                <span>
                  Осталось: {(budget.limit - budget.spent).toLocaleString("ru-RU")} ₽
                </span>
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
```
</document>

<document path="./components/layout/AppShell.tsx">
```tsx
'use client';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

const NO_SIDEBAR_ROUTES = ['/login'];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hasSidebar = !NO_SIDEBAR_ROUTES.includes(pathname);

  if (!hasSidebar) return <>{children}</>;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      {/* ← bg-background убран, main прозрачный → видно ambient через glass-card */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="container-custom section-spacing page-transition">
          {children}
        </div>
      </main>
    </div>
  );
}

```
</document>

<document path="./components/layout/Sidebar.tsx">
```tsx
"use client";

import {
  LayoutDashboard,
  TrendingUp,
  Receipt,
  Settings,
  Wallet,
  Building2,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useAuth } from '@/lib/hooks/useAuth';

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: TrendingUp, label: "Аналитика", href: "/analytics" },
  { icon: Receipt, label: "Транзакции", href: "/transactions" },
  { icon: Building2, label: "Счета", href: "/accounts" },
  { icon: Settings, label: "Настройки", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();
  useEffect(() => { setMounted(true); }, []);

  const initials = mounted
    ? (user?.full_name ?? user?.username ?? 'AF')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    : 'AF';
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="glass-nav fixed left-0 top-0 h-screen w-64 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-divider">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3D7EFF] to-[#1644B8] flex items-center justify-center shadow-glow flex-shrink-0">
            <Wallet className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text-primary">AutoFlow</h1>
            <p className="text-xs text-default-500">Finance Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-0.5 custom-scrollbar overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all ${isActive
                ? "bg-primary/10 text-primary font-semibold"
                : "text-default-500 hover:text-foreground hover:bg-content2 font-normal"
                }`}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-primary" : "text-default-400"
                  }`}
              />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-divider space-y-2">
        {/* Theme Switcher */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-default-500 hover:text-foreground hover:bg-content2 transition-all font-normal"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 flex-shrink-0 text-default-400" />
            ) : (
              <Moon className="w-5 h-5 flex-shrink-0 text-default-400" />
            )}
            <span>{theme === "dark" ? "Светлая тема" : "Тёмная тема"}</span>
          </button>
        )}

        {/* User Profile */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-content2 hover:bg-content3 transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00FFA3] to-[#00C853] flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-black" suppressHydrationWarning>
              {initials}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" suppressHydrationWarning>
              {mounted ? (user?.full_name ?? user?.username ?? 'AutoFlow User') : ''}
            </p>
            <p className="text-xs text-default-500 truncate" suppressHydrationWarning>
              {mounted ? (user?.email ?? '') : ''}
            </p>
          </div>
          <button
            onClick={logout}
            aria-label="Выйти"
            className="text-default-400 hover:text-[#FF3366] transition-colors p-1 flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
```
</document>

<document path="./components/ui/ChartTooltip.tsx">
```tsx
interface ChartTooltipProps {
  active?:  boolean;
  payload?: Array<{ name: string; value: number; color?: string }>;
  label?:   string;
  style:    React.CSSProperties;
  formatter?: (value: number) => string;
}

export function ChartTooltip({ active, payload, label, style, formatter }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  const fmt = formatter ?? ((v: number) => `${v.toLocaleString('ru-RU')} ₽`);

  return (
    <div style={style} className="px-3 py-2 rounded-xl text-xs pointer-events-none">
      {/* label (название категории / дата) */}
      {label && (
        <p className="font-medium mb-1" style={{ color: style.color }}>
          {label}
        </p>
      )}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          {/* цветная точка — особенно полезна для Pie */}
          {p.color && (
            <span className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: p.color }} />
          )}
          <span style={{ color: style.color, opacity: 0.7 }}>{p.name}</span>
          <span className="ml-auto pl-3 font-semibold tabular-nums"
            style={{ color: style.color }}>
            {fmt(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

```
</document>

<document path="./components/ui/SelectField.tsx">
```tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useAnimatedMount } from '@/lib/hooks/useAnimatedMount';

interface SelectOption { value: string; label: string; }
interface Props {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
}

export default function SelectField({ value, onChange, options, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { mounted, animating } = useAnimatedMount(open, 160);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full h-9 px-3 rounded-xl bg-content2 border border-divider
                   text-foreground text-sm flex items-center justify-between
                   hover:bg-content3 focus:outline-none focus:border-primary
                   focus:ring-1 transition-all"
      >
        <span>{selected?.label ?? value}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-default-400 transition-transform duration-200
                                  ${open ? 'rotate-180' : ''}`} />
      </button>

      {mounted && (
        <div className={`absolute left-0 right-0 mt-1.5 glass-dropdown rounded-xl py-1
                         z-50 overflow-hidden
                         ${animating ? 'animate-dropdown' : 'animate-dropdown-out'}`}>
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm
                         hover:bg-white/5 transition-colors"
            >
              <span className={value === opt.value
                ? 'text-primary font-medium'
                : 'text-foreground'}>
                {opt.label}
              </span>
              {value === opt.value && <Check className="w-3.5 h-3.5 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```
</document>

<document path="./components/ui/ModalPortal.tsx">
```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ModalPortal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;
  // Рендерим прямо в document.body — вне любых transform-контейнеров
  return createPortal(children, document.body);
}

```
</document>

