'use client';
import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Building2, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api';
import type { Account, AccountCreate, AccountUpdate, AccountType, Currency } from '@/lib/types';

const ACCOUNT_TYPES: { value: AccountType; label: string }[] = [
  { value: 'card', label: 'Карта' },
  { value: 'bank_account', label: 'Банковский счёт' },
  { value: 'cash', label: 'Наличные' },
  { value: 'investment', label: 'Инвестиции' },
  { value: 'crypto', label: 'Крипто' },
  { value: 'other', label: 'Другое' },
];
const CURRENCIES: Currency[] = ['RUB', 'USD', 'EUR', 'GBP', 'CNY'];

const emptyForm: AccountCreate = {
  name: '', account_type: 'card', currency: 'RUB', balance: 0,
  bank_name: '', account_number: '', include_in_total: true,
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AccountCreate>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const loadAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get('/accounts');
      setAccounts(res.data ?? []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadAccounts(); }, [loadAccounts]);

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setError(''); setModalOpen(true); };
  const openEdit = (acc: Account) => {
    setEditingId(acc.id);
    setForm({
      name: acc.name,
      account_type: acc.account_type,
      currency: acc.currency,
      balance: acc.balance,
      bank_name: acc.bank_name ?? '',
      account_number: acc.account_number ?? '',
      include_in_total: acc.include_in_total,
    });
    setError('');
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Название обязательно'); return; }
    setIsSaving(true);
    setError('');
    try {
      if (editingId !== null) {
        const update: AccountUpdate = {
          name: form.name,
          account_type: form.account_type,
          currency: form.currency,
          bank_name: form.bank_name || undefined,
          account_number: form.account_number || undefined,
          include_in_total: form.include_in_total,
        };
        await apiClient.patch(`/accounts/${editingId}`, update);
      } else {
        await apiClient.post('/accounts', form);
      }
      await loadAccounts();
      setModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`/accounts/${id}`);
      await loadAccounts();
    } catch (err: any) {
      console.error(err.response?.data?.detail);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const toggleActive = async (acc: Account) => {
    try {
      await apiClient.patch(`/accounts/${acc.id}`, { is_active: !acc.is_active });
      await loadAccounts();
    } catch (err) {
      console.error(err);
    }
  };

  const totalBalance = accounts
    .filter((a) => a.is_active && a.include_in_total)
    .reduce((s, a) => s + Number(a.balance), 0);

  const maskNumber = (n: string | null) =>
    n && n.length > 4 ? `${n.slice(0, 4)} •••• ${n.slice(-4)}` : n ?? '—';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-xs text-default-400 mb-1">
            <span>Dashboard</span><span className="mx-1.5">/</span><span className="text-foreground">Счета</span>
          </nav>
          <h1 className="text-3xl font-bold text-foreground">Счета и карты</h1>
          <p className="text-sm text-default-500 mt-1">
            Общий баланс: <span className="font-semibold text-[#00E5FF]">{totalBalance.toLocaleString('ru-RU')} ₽</span>
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0066FF] text-black text-sm font-semibold hover:opacity-90 transition-opacity shadow-glow"
        >
          <Plus className="w-4 h-4" /> Добавить счёт
        </button>
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array(3).fill(0).map((_, i) => <div key={i} className="glass-card rounded-2xl h-48 shimmer" />)}
        </div>
      ) : accounts.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-default-400 mb-4">У вас пока нет счетов</p>
          <button onClick={openAdd} className="px-4 py-2 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] text-sm font-medium">
            Добавить первый счёт
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className={`glass-card rounded-2xl p-5 hover-lift transition-all ${!acc.is_active ? 'opacity-60' : ''}`}
            >
              <div className="h-1.5 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#0066FF] mb-5" />
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-base truncate">{acc.name}</p>
                  <p className="text-xs text-default-400 mt-0.5 font-mono">{maskNumber(acc.account_number)}</p>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => openEdit(acc)}
                    className="p-1.5 rounded-lg text-default-400 hover:text-foreground hover:bg-content2 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(acc.id)}
                    className="p-1.5 rounded-lg text-default-400 hover:text-[#FF3366] hover:bg-[#FF3366]/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-3.5 h-3.5 text-default-400" />
                <span className="text-xs text-default-500">{acc.bank_name ?? '—'}</span>
                <span className="text-xs text-default-400 ml-1 px-1.5 py-0.5 rounded bg-content2">
                  {acc.currency}
                </span>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-default-400 mb-0.5">Баланс</p>
                  <p className="text-2xl font-bold text-foreground">
                    {Number(acc.balance).toLocaleString('ru-RU')} ₽
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${acc.is_active ? 'text-[#00FFA3]' : 'text-default-400'}`}>
                    {acc.is_active ? 'Активен' : 'Неактивен'}
                  </span>
                  <Toggle checked={acc.is_active} onChange={() => toggleActive(acc)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative glass-card rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-default-400 hover:text-foreground p-1 rounded-lg hover:bg-content2">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold mb-5">{editingId !== null ? 'Редактировать счёт' : 'Новый счёт'}</h2>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-[#FF3366]/10 border border-[#FF3366]/30 text-sm text-[#FF3366]">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <Field label="Название">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Моя карта" className="input-field" />
              </Field>
              <Field label="Тип счёта">
                <select value={form.account_type}
                  onChange={(e) => setForm({ ...form, account_type: e.target.value as AccountType })}
                  className="input-field">
                  {ACCOUNT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </Field>
              <Field label="Номер счёта / карты">
                <input value={form.account_number} onChange={(e) => setForm({ ...form, account_number: e.target.value })}
                  placeholder="4081 7810 9000 1234" className="input-field font-mono" />
              </Field>
              <Field label="Банк">
                <input value={form.bank_name} onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
                  placeholder="Сбербанк" className="input-field" />
              </Field>
              <Field label="Валюта">
                <select value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value as Currency })}
                  className="input-field">
                  {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              {editingId === null && (
                <Field label="Начальный баланс">
                  <input type="number" value={form.balance} min={0}
                    onChange={(e) => setForm({ ...form, balance: Number(e.target.value) })}
                    className="input-field" />
                </Field>
              )}
              <div className="flex items-center justify-between py-3 border-t border-divider">
                <span className="text-sm font-medium">Учитывать в общем балансе</span>
                <Toggle checked={form.include_in_total ?? true}
                  onChange={() => setForm({ ...form, include_in_total: !form.include_in_total })} />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setModalOpen(false)}
                className="flex-1 h-10 rounded-xl bg-content2 hover:bg-content3 transition-colors text-sm font-medium">
                Отмена
              </button>
              <button onClick={handleSave} disabled={isSaving}
                className="flex-1 h-10 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0066FF] text-black text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative glass-card rounded-2xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold mb-2">Удалить счёт?</h2>
            <p className="text-sm text-default-500 mb-5">Все транзакции по этому счёту также будут удалены. Это действие необратимо.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 h-10 rounded-xl bg-content2 hover:bg-content3 transition-colors text-sm font-medium">
                Отмена
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 h-10 rounded-xl bg-[#FF3366] text-white text-sm font-semibold hover:bg-[#CC2952] transition-colors">
                Удалить
              </button>
            </div>
          </div>
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
