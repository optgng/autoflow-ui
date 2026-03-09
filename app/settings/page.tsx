"use client";

import { useState } from "react";
import {
  User,
  Lock,
  Link2,
  Bell,
  Camera,
  Copy,
  Check,
  Download,
  FileText,
  Send,
  Trash2,
  ExternalLink,
} from "lucide-react";

type Tab = "profile" | "security" | "integrations" | "notifications";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "Профиль", icon: <User className="w-4 h-4" /> },
  { id: "security", label: "Безопасность", icon: <Lock className="w-4 h-4" /> },
  { id: "integrations", label: "Интеграции", icon: <Link2 className="w-4 h-4" /> },
  { id: "notifications", label: "Уведомления", icon: <Bell className="w-4 h-4" /> },
];

const SESSIONS = [
  { id: 1, device: "Chrome / macOS", location: "Москва, RU", active: true, lastSeen: "Сейчас" },
  { id: 2, device: "Safari / iPhone", location: "Москва, RU", active: false, lastSeen: "2 часа назад" },
  { id: 3, device: "Firefox / Windows", location: "Санкт-Петербург, RU", active: false, lastSeen: "3 дня назад" },
];

const WEBHOOK_URL = "https://autoflow.dev/api/webhook/abc123xyz789";

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("profile");

  // Profile
  const [name, setName] = useState("AutoFlow User");
  const [email, setEmail] = useState("user@autoflow.dev");
  const [profileSaved, setProfileSaved] = useState(false);

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sessions, setSessions] = useState(SESSIONS);

  // Integrations
  const [telegramConnected] = useState(false);
  const [copied, setCopied] = useState(false);

  // Notifications
  const [notifTelegram, setNotifTelegram] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);
  const [notifPush, setNotifPush] = useState(true);

  const handleSaveProfile = () => {
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(WEBHOOK_URL).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const terminateSession = (id: number) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <nav className="text-xs text-default-400 mb-1">
          <span>Dashboard</span>
          <span className="mx-1.5">/</span>
          <span className="text-foreground">Настройки</span>
        </nav>
        <h1 className="text-3xl font-bold text-foreground">Настройки</h1>
      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 p-1 glass-card rounded-xl">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-content3 text-foreground"
                : "text-default-400 hover:text-foreground hover:bg-content2"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === "profile" && (
        <div className="glass-card rounded-2xl p-6 space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00FFA3] to-[#00C853] flex items-center justify-center">
                <span className="text-2xl font-bold text-black">AF</span>
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-content3 border border-divider flex items-center justify-center hover:bg-content2 transition-colors">
                <Camera className="w-3.5 h-3.5 text-default-400" />
              </button>
            </div>
            <div>
              <p className="font-semibold text-foreground">{name}</p>
              <p className="text-sm text-default-400">{email}</p>
            </div>
          </div>

          <div className="space-y-4 pt-2 border-t border-divider">
            <Field label="Имя пользователя">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </Field>
            <Field label="Telegram ID">
              <input
                value="@autoflow_user"
                readOnly
                className="input-field opacity-60 cursor-not-allowed"
              />
            </Field>
          </div>

          <button
            onClick={handleSaveProfile}
            className="flex items-center gap-2 px-5 h-10 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0066FF] text-black text-sm font-semibold hover:opacity-90 transition-all"
          >
            {profileSaved ? (
              <>
                <Check className="w-4 h-4" />
                Сохранено
              </>
            ) : (
              "Сохранить изменения"
            )}
          </button>
        </div>
      )}

      {/* Security Tab */}
      {tab === "security" && (
        <div className="space-y-5">
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold">Изменить пароль</h2>
            <Field label="Текущий пароль">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
              />
            </Field>
            <Field label="Новый пароль">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Минимум 8 символов"
                className="input-field"
              />
            </Field>
            <Field label="Подтверждение пароля">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
              />
            </Field>
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-[#FF3366]">Пароли не совпадают</p>
            )}
            <button
              disabled={
                !currentPassword ||
                !newPassword ||
                newPassword.length < 8 ||
                newPassword !== confirmPassword
              }
              className="px-5 h-10 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0066FF] text-black text-sm font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Изменить пароль
            </button>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold">Активные сессии</h2>
            <div className="space-y-3">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between py-3 border-b border-divider/40 last:border-0"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{s.device}</p>
                      {s.active && (
                        <span className="px-2 py-0.5 rounded-full bg-[#00FFA3]/10 text-[#00FFA3] text-xs font-medium">
                          Текущая
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-default-400 mt-0.5">
                      {s.location} — {s.lastSeen}
                    </p>
                  </div>
                  {!s.active && (
                    <button
                      onClick={() => terminateSession(s.id)}
                      className="p-1.5 rounded-lg text-default-400 hover:text-[#FF3366] hover:bg-[#FF3366]/10 transition-colors"
                      aria-label="Завершить сессию"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {tab === "integrations" && (
        <div className="space-y-5">
          {/* Telegram */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#229ED9]/10 text-[#229ED9] flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Telegram бот</p>
                  <p className="text-xs text-default-400">Загрузка выписок и уведомления</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  telegramConnected
                    ? "bg-[#00FFA3]/10 text-[#00FFA3]"
                    : "bg-content3 text-default-400"
                }`}
              >
                {telegramConnected ? "Подключен" : "Не подключен"}
              </span>
            </div>
            {!telegramConnected && (
              <button className="flex items-center gap-2 px-4 h-10 rounded-xl bg-[#229ED9]/10 border border-[#229ED9]/30 text-[#229ED9] text-sm font-medium hover:bg-[#229ED9]/20 transition-colors">
                <ExternalLink className="w-4 h-4" />
                Подключить Telegram
              </button>
            )}
            {telegramConnected && (
              <p className="text-xs text-default-400">
                Последняя загрузка: 09.03.2026 в 14:30
              </p>
            )}
          </div>

          {/* Webhook */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div>
              <p className="font-semibold text-foreground mb-1">Webhook URL</p>
              <p className="text-xs text-default-400">
                Используйте этот URL для автоматической загрузки выписок
              </p>
            </div>
            <div className="flex gap-2">
              <input
                value={WEBHOOK_URL}
                readOnly
                className="input-field font-mono text-xs flex-1 opacity-70 cursor-not-allowed"
              />
              <button
                onClick={handleCopyWebhook}
                className="px-4 h-10 rounded-xl bg-content2 hover:bg-content3 transition-colors text-sm font-medium flex items-center gap-2 flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#00FFA3]" />
                    <span className="text-[#00FFA3]">Скопировано</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Копировать
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Export */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <p className="font-semibold text-foreground">Экспорт данных</p>
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 h-10 rounded-xl bg-content2 hover:bg-content3 transition-colors text-sm font-medium">
                <Download className="w-4 h-4 text-[#00FFA3]" />
                Экспорт транзакций в CSV
              </button>
              <button className="flex items-center gap-2 px-4 h-10 rounded-xl bg-content2 hover:bg-content3 transition-colors text-sm font-medium">
                <FileText className="w-4 h-4 text-[#FF3366]" />
                Экспорт отчета в PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {tab === "notifications" && (
        <div className="glass-card rounded-2xl p-6 space-y-1">
          <h2 className="text-base font-semibold mb-4">Уведомления</h2>
          <NotifRow
            label="Уведомления в Telegram о новых транзакциях"
            description="Получайте мгновенные уведомления о каждой операции"
            value={notifTelegram}
            onChange={setNotifTelegram}
          />
          <NotifRow
            label="Еженедельный отчет по email"
            description="Сводка доходов и расходов каждый понедельник"
            value={notifEmail}
            onChange={setNotifEmail}
          />
          <NotifRow
            label="Push-уведомления в браузере"
            description="Уведомления прямо в браузере без Telegram"
            value={notifPush}
            onChange={setNotifPush}
          />
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

function NotifRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-divider/40 last:border-0">
      <div className="pr-4">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-default-400 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
          value ? "bg-[#00FFA3]" : "bg-content3"
        }`}
        role="switch"
        aria-checked={value}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            value ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
