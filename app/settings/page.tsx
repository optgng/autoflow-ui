'use client';
import { useState, useEffect } from 'react';
import { User, Lock, Bell, Check, RefreshCw, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/lib/hooks/useAuth';
import Cookies from 'js-cookie';

type Tab = 'profile' | 'security' | 'notifications';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Профиль', icon: <User className="w-4 h-4" /> },
  { id: 'security', label: 'Безопасность', icon: <Lock className="w-4 h-4" /> },
  { id: 'notifications', label: 'Уведомления', icon: <Bell className="w-4 h-4" /> },
];

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState<Tab>('profile');

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

  // Заполняем форму данными пользователя
  useEffect(() => {
    if (user) {
      setName(user.username);
      setEmail(user.email);
      setFullName(user.full_name ?? '');
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setProfileError('');
    try {
      const res = await apiClient.patch('/users/me', {
        username: name,
        email,
        full_name: fullName || undefined,
      });
      updateUser(res.data);
      Cookies.set('user', JSON.stringify(res.data));
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (err: any) {
      setProfileError(err.response?.data?.detail || 'Ошибка сохранения');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPwd !== confirmPwd) { setPwdError('Пароли не совпадают'); return; }
    if (newPwd.length < 8) { setPwdError('Пароль минимум 8 символов'); return; }
    setPwdSaving(true);
    setPwdError('');
    try {
      await apiClient.post('/auth/change-password', {
        current_password: currentPwd,
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

  const initials = (user?.full_name ?? user?.username ?? 'AF')
    .split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <nav className="text-xs text-default-400 mb-1">
          <span>Dashboard</span><span className="mx-1.5">/</span><span className="text-foreground">Настройки</span>
        </nav>
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

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="glass-card rounded-2xl p-6 space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00FFA3] to-[#00C853] flex items-center justify-center">
              <span className="text-2xl font-bold text-black">{initials}</span>
            </div>
            <div>
              <p className="font-semibold text-foreground">{user?.full_name ?? user?.username}</p>
              <p className="text-sm text-default-400">{user?.email}</p>
            </div>
          </div>

          {profileError && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FF3366]/10 border border-[#FF3366]/30 text-sm text-[#FF3366]">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {profileError}
            </div>
          )}

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
            className="flex items-center gap-2 px-5 h-10 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0066FF] text-black text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60"
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
            className="flex items-center gap-2 px-5 h-10 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0066FF] text-black text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-60"
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
