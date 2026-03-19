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
