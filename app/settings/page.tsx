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
