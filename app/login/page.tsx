"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Wallet, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1200));

    if (email === "user@autoflow.dev" && password === "password") {
      router.push("/dashboard");
    } else {
      setError("Неверный email или пароль. Попробуйте user@autoflow.dev / password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {/* Background glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,229,255,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00E5FF] to-[#0066FF] flex items-center justify-center shadow-glow mb-4">
            <Wallet className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold gradient-text-primary">AutoFlow Finance</h1>
          <p className="text-default-500 mt-1 text-sm">Персональная финансовая аналитика</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-xl font-bold mb-6 text-foreground">Войти в аккаунт</h2>

          {/* Error alert */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FF3366]/10 border border-[#FF3366]/30 mb-6">
              <AlertCircle className="w-5 h-5 text-[#FF3366] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#FF3366] leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-default-600" htmlFor="email">
                Email или имя пользователя
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@autoflow.dev"
                required
                className="w-full h-12 px-4 rounded-xl bg-content2 border border-divider text-foreground placeholder:text-default-400 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/40 transition-all text-sm"
              />
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-default-600" htmlFor="password">
                Пароль
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-12 px-4 pr-12 rounded-xl bg-content2 border border-divider text-foreground placeholder:text-default-400 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/40 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-default-400 hover:text-default-600 transition-colors p-1"
                  aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl font-semibold text-sm transition-all bg-gradient-to-r from-[#00E5FF] to-[#0066FF] text-black hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-glow mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Вход...
                </>
              ) : (
                "Войти"
              )}
            </button>
          </form>

          {/* Forgot password */}
          <div className="mt-5 text-center">
            <button className="text-sm text-[#00E5FF] hover:underline transition-all">
              Забыли пароль?
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-default-400 mt-6">
          Демо: user@autoflow.dev / password
        </p>
      </div>
    </div>
  );
}
