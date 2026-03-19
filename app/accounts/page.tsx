'use client';
import { useState, useEffect } from 'react';
import {
  Plus, Pencil, CreditCard, Landmark, Wallet,
  X, Check, RefreshCw, AlertCircle, Trash2,  // ← добавить Trash2
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import SelectField from '@/components/ui/SelectField';
import ModalPortal from '@/components/ui/ModalPortal';

// ─── Типы ────────────────────────────────────────────────────────────────────

// Точное соответствие AccountType из схемы бэкенда
type AccountType = 'card' | 'bank_account' | 'cash';

// Типы, которые можно переключать между собой
type BankAccountType = 'card' | 'bank_account';

interface Account {
  id: number;
  name: string;
  account_type: AccountType;
  currency: string;
  balance: string;   // Decimal с бэкенда приходит как строка
  bank_name?: string;
  last_four_digits?: string;
  is_active: boolean;
  include_in_total: boolean;
}

// ─── Константы ───────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<AccountType, string> = {
  card: 'Карта',
  bank_account: 'Счёт',
  cash: 'Наличные',
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

/** Безопасно форматирует баланс — Decimal с бэкенда приходит как строка */
function formatBalance(balance: string, currency: string): string {
  const num = parseFloat(balance) || 0;
  return num.toLocaleString('ru-RU', { style: 'currency', currency });
}

// ─── Компонент ───────────────────────────────────────────────────────────────

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState('');

  // Форма редактирования
  const [editName, setEditName] = useState('');
  const [editBank, setEditBank] = useState('');
  const [editType, setEditType] = useState<BankAccountType>('card');
  const [editCurrency, setEditCurrency] = useState('RUB');
  const [saving, setSaving] = useState(false);
  const [editBalance, setEditBalance] = useState('');

  // Форма создания наличных
  const [cashName, setCashName] = useState('');
  const [cashCurrency, setCashCurrency] = useState('RUB');
  const [creating, setCreating] = useState(false);

  // Удаление счетов
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchAccounts(); }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/accounts');
      setAccounts(res.data);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (acc: Account) => {
    setEditId(acc.id);
    setEditName(acc.name);
    setEditBank(acc.bank_name ?? '');
    // Для cash editType не используется, ставим заглушку
    setEditType(acc.account_type !== 'cash' ? acc.account_type : 'card');
    setEditCurrency(acc.currency);
    setEditBalance(acc.balance);
    setError('');
  };

  const handleSave = async (acc: Account) => {
    setSaving(true);
    setError('');
    try {
      const payload: Record<string, unknown> = {
        name: editName || undefined,
        currency: editCurrency || undefined,
      };
      // bank_name и account_type — только для card/bank_account
      if (acc.account_type !== 'cash') {
        payload.bank_name = editBank || undefined;
        payload.account_type = editType; // 'card' | 'bank_account'
      }
      if (acc.account_type === 'cash') {
        const bal = parseFloat(editBalance);
        if (!isNaN(bal)) payload.balance = String(bal);
      }
      const res = await apiClient.patch(`/accounts/${acc.id}`, payload);
      setAccounts(prev => prev.map(a => a.id === acc.id ? res.data : a));
      setEditId(null);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail;
      setError(msg || 'Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    setError('');
    try {
      const res = await apiClient.post('/accounts', {
        name: cashName,
        account_type: 'cash',
        currency: cashCurrency,
      });
      setAccounts(prev => [...prev, res.data]);
      setShowCreate(false);
      setCashName('');
      setCashCurrency('RUB');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail;
      setError(msg || 'Ошибка создания');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    setError('');
    try {
      await apiClient.delete(`/accounts/${deleteId}`);
      // Soft delete для card/bank_account — бэкенд деактивирует, не удаляет
      // Убираем из списка в обоих случаях
      setAccounts(prev => prev.filter(a => a.id !== deleteId));
      setDeleteId(null);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })
        ?.response?.data?.detail;
      setError(msg || 'Ошибка удаления');
    } finally {
      setDeleting(false);
    }
  };
  return (
    <div className="space-y-6 max-w-3xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <nav className="text-xs text-default-400 mb-1">
            <span>Dashboard</span><span className="mx-1.5">/</span>
            <span className="text-foreground">Счета</span>
          </nav>
          <h1 className="text-3xl font-bold text-foreground">Счета</h1>
        </div>
        <button
          onClick={() => { setShowCreate(true); setError(''); }}
          className="flex items-center gap-2 px-4 h-10 rounded-xl bg-gradient-to-r from-[#3D7EFF] to-[#1644B8] text-black text-sm font-semibold hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" /> Наличный счёт
        </button>
      </div>

      {/* Подсказка */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-[#00E5FF]/5 border border-[#00E5FF]/20 text-sm text-default-400">
        <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        Банковские карты и счета добавляются автоматически при загрузке выписки
        через Telegram бота. Вручную можно добавить только счёт наличных.
      </div>

      {/* Список */}
      {loading ? (
        <div className="flex justify-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-default-400" />
        </div>
      ) : accounts.length === 0 ? (
        <div className="glass-card rounded-2xl p-6 w-full max-w-sm space-y-4 animate-modal-content">
          <Wallet className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">Счета не найдены</p>
          <p className="text-sm mt-1">
            Загрузите выписку через Telegram бота — счета появятся автоматически
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {accounts.map(acc => (
            <div key={acc.id} className="glass-card rounded-2xl p-5 transition-all duration-300">
              {editId === acc.id ? (
                /* ── Режим редактирования ── */
                <div className="space-y-4 animate-tab-in">
                  {error && (
                    <div className="flex items-center gap-2 text-sm text-[#FF3366]">
                      <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-default-400">Название</label>
                      <input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="input-field h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-default-400">Валюта</label>
                      <SelectField
                        value={editCurrency}
                        onChange={setEditCurrency}
                        options={CURRENCY_OPTIONS}
                      />
                    </div>
                    {acc.account_type === 'cash' && (
                      <div className="space-y-1.5">
                        <label className="text-xs text-default-400">Баланс</label>
                        <input
                          type="number"
                          value={editBalance}
                          onChange={e => setEditBalance(e.target.value)}
                          placeholder="0"
                          className="input-field h-9 text-sm"
                        />
                      </div>
                    )}
                    {acc.account_type !== 'cash' && (
                      <>
                        <div className="space-y-1.5">
                          <label className="text-xs text-default-400">Банк</label>
                          <input
                            value={editBank}
                            onChange={e => setEditBank(e.target.value)}
                            placeholder="Сбербанк"
                            className="input-field h-9 text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-default-400">Тип</label>
                          <SelectField
                            value={editType}
                            onChange={(v) => setEditType(v as BankAccountType)}
                            options={ACCOUNT_TYPE_OPTIONS}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSave(acc)}
                      disabled={saving}
                      className="flex items-center gap-1.5 px-4 h-9 rounded-xl bg-gradient-to-r from-[#3D7EFF] to-[#1644B8] text-black text-sm font-semibold disabled:opacity-60"
                    >
                      {saving
                        ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        : <Check className="w-3.5 h-3.5" />
                      }
                      Сохранить
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="flex items-center gap-1.5 px-4 h-9 rounded-xl bg-content2 border border-divider text-sm text-default-400 hover:text-foreground"
                    >
                      <X className="w-3.5 h-3.5" /> Отмена
                    </button>
                  </div>
                </div>
              ) : (
                /* ── Режим просмотра ── */
                <div className="flex items-center justify-between animate-tab-in">
                  {/* Левая часть — иконка + текст */}
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
                      {acc.last_four_digits ? (
                        <p className="text-xs text-default-400 mt-0.5">
                          •••• {acc.last_four_digits} · {acc.currency}
                        </p>
                      ) : (
                        <p className="text-xs text-default-400 mt-0.5">{acc.currency}</p>
                      )}
                    </div>
                  </div> {/* ← конец левой части */}

                  {/* Правая часть — баланс + кнопки */}
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-bold text-foreground">
                      {formatBalance(acc.balance, acc.currency)}
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(acc)}
                        className="p-2 rounded-lg text-default-400 hover:text-foreground hover:bg-content2 transition-all"
                        aria-label="Редактировать"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setDeleteId(acc.id); setError(''); }}
                        className="p-2 rounded-lg text-default-400 hover:text-[#FF3366] hover:bg-[#FF3366]/10 transition-all"
                        aria-label="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div> {/* ← конец правой части */}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Модал создания наличных ── */}
      {showCreate && (
        <ModalPortal>
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            onClick={() => { setShowCreate(false); setError(''); }}
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md animate-modal-overlay" />
            <div
              className="relative glass-card rounded-2xl p-6 w-full max-w-sm space-y-4 animate-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Новый счёт (наличные)</h2>
                <button onClick={() => setShowCreate(false)} className="text-default-400 hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {error && (
                <p className="text-sm text-[#FF3366] flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> {error}
                </p>
              )}
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-default-600">Название</label>
                  <input
                    value={cashName}
                    onChange={(e) => setCashName(e.target.value)}
                    placeholder="Кошелёк"
                    className="input-field"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-default-600">Валюта</label>
                  <SelectField
                    value={cashCurrency}
                    onChange={setCashCurrency}
                    options={CURRENCY_OPTIONS}
                  />
                </div>
              </div>
              <button
                onClick={handleCreate}
                disabled={creating || !cashName.trim()}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-[#3D7EFF] to-[#1644B8]
			   text-black text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {creating ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Создать'}
              </button>
            </div>
          </div>
        </ModalPortal>
      )}
      {/* ── Модал подтверждения удаления ── */}
      {deleteId !== null && (() => {
        const acc = accounts.find(a => a.id === deleteId);
        const isBankAcc = acc?.account_type !== 'cash';
        return (
          <ModalPortal>
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center px-4"
              onClick={() => { setDeleteId(null); setError(''); }}
            >
              <div className="absolute inset-0 bg-black/50 backdrop-blur-md animate-modal-overlay" />
              <div
                className="relative glass-card rounded-2xl p-6 w-full max-w-sm space-y-4 animate-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-foreground">Удалить счёт?</h2>
                  <button onClick={() => setDeleteId(null)} className="text-default-400 hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {error && (
                  <p className="text-sm text-[#FF3366] flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </p>
                )}
                <div className="p-4 rounded-xl bg-content2 space-y-1">
                  <p className="font-medium text-foreground">{acc?.name}</p>
                  {acc?.last_four_digits && (
                    <p className="text-xs text-default-400">•••• {acc.last_four_digits}</p>
                  )}
                </div>
                <p className="text-sm text-default-400">
                  {isBankAcc
                    ? 'Банковский счёт будет деактивирован. История транзакций сохранится.'
                    : 'Счёт наличных и все связанные данные будут удалены безвозвратно.'
                  }
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteId(null)}
                    className="flex-1 h-10 rounded-xl bg-content2 hover:bg-content3 transition-colors text-sm font-medium"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 h-10 rounded-xl bg-[#FF3366] hover:bg-[#CC2952] text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {deleting
                      ? <RefreshCw className="w-4 h-4 animate-spin" />
                      : isBankAcc ? 'Деактивировать' : 'Удалить'
                    }
                  </button>
                </div>
              </div>
            </div>
          </ModalPortal>
        );
      })()}

    </div>
  );

