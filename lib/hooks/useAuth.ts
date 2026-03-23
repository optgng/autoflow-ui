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
