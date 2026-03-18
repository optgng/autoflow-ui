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

  const [loginValue, setLoginValue]     = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError]     = useState<string | null>(null);
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
    const passErr  = !password ? 'Пароль не может быть пустым' : null;

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
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00E5FF] to-[#0066FF] flex items-center justify-center shadow-glow mb-4">
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
                className={`w-full h-12 px-4 rounded-xl bg-content2 border text-foreground placeholder:text-default-400 focus:outline-none focus:ring-1 transition-all text-sm ${
                  loginError
                    ? 'border-[#FF3366] focus:border-[#FF3366] focus:ring-[#FF3366]/40'
                    : 'border-divider focus:border-[#00E5FF] focus:ring-[#00E5FF]/40'
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
                  className={`w-full h-12 px-4 pr-12 rounded-xl bg-content2 border text-foreground placeholder:text-default-400 focus:outline-none focus:ring-1 transition-all text-sm ${
                    passwordError
                      ? 'border-[#FF3366] focus:border-[#FF3366] focus:ring-[#FF3366]/40'
                      : 'border-divider focus:border-[#00E5FF] focus:ring-[#00E5FF]/40'
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
              className="w-full h-12 rounded-xl font-semibold text-sm transition-all bg-gradient-to-r from-[#00E5FF] to-[#0066FF] text-black hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-glow mt-2"
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

