"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Building2 } from "lucide-react";
import { mockAccounts, type Account } from "@/lib/mock-data";

const BANKS = ["Сбербанк", "Тинькофф", "Альфа-Банк", "ВТБ", "Газпромбанк", "Открытие"];
const CURRENCIES = ["RUB", "USD", "EUR"] as const;

const BANK_COLORS: Record<string, string> = {
  Сбербанк: "from-[#21A038] to-[#1a8030]",
  Тинькофф: "from-[#FFD600] to-[#e6c200]",
  "Альфа-Банк": "from-[#EF3124] to-[#c42820]",
  ВТБ: "from-[#003087] to-[#002070]",
  Газпромбанк: "from-[#00529B] to-[#004080]",
  Открытие: "from-[#FF6600] to-[#d45500]",
};

type AccountFormData = Omit<Account, "id">;

const emptyForm: AccountFormData = {
  name: "",
  number: "",
  bank: "Сбербанк",
  currency: "RUB",
  balance: 0,
  isActive: true,
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AccountFormData>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (acc: Account) => {
    setEditingId(acc.id);
    setForm({
      name: acc.name,
      number: acc.number,
      bank: acc.bank,
      currency: acc.currency,
      balance: acc.balance,
      isActive: acc.isActive,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.number.trim()) return;
    if (editingId !== null) {
      setAccounts((prev) =>
        prev.map((a) => (a.id === editingId ? { ...form, id: editingId } : a))
      );
    } else {
      const newId = Math.max(...accounts.map((a) => a.id), 0) + 1;
      setAccounts((prev) => [...prev, { ...form, id: newId }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    setDeleteConfirm(null);
  };

  const toggleActive = (id: number) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  const totalBalance = accounts
    .filter((a) => a.isActive)
    .reduce((s, a) => s + a.balance, 0);

  const maskNumber = (n: string) =>
    n.length > 4 ? `${n.slice(0, 5)}...${n.slice(-4)}` : n;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-xs text-default-400 mb-1">
            <span>Dashboard</span>
            <span className="mx-1.5">/</span>
            <span className="text-foreground">Счета</span>
          </nav>
          <h1 className="text-3xl font-bold text-foreground">Счета</h1>
          <p className="text-sm text-default-500 mt-1">
            Общий баланс активных счетов:{" "}
            <span className="font-semibold text-[#00E5FF]">
              {totalBalance.toLocaleString("ru-RU")} ₽
            </span>
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0066FF] text-black text-sm font-semibold hover:opacity-90 transition-opacity shadow-glow"
        >
          <Plus className="w-4 h-4" />
          Добавить счет
        </button>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className={`glass-card rounded-2xl p-5 hover-lift transition-all ${
              !acc.isActive ? "opacity-60" : ""
            }`}
          >
            {/* Card top stripe */}
            <div
              className={`h-1.5 rounded-full bg-gradient-to-r ${
                BANK_COLORS[acc.bank] || "from-[#00E5FF] to-[#0066FF]"
              } mb-5`}
            />

            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-base truncate">
                  {acc.name}
                </p>
                <p className="text-xs text-default-400 mt-0.5 font-mono">
                  {maskNumber(acc.number)}
                </p>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => openEdit(acc)}
                  className="p-1.5 rounded-lg text-default-400 hover:text-foreground hover:bg-content2 transition-colors"
                  aria-label="Изменить"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(acc.id)}
                  className="p-1.5 rounded-lg text-default-400 hover:text-[#FF3366] hover:bg-[#FF3366]/10 transition-colors"
                  aria-label="Удалить"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-3.5 h-3.5 text-default-400" />
              <span className="text-xs text-default-500">{acc.bank}</span>
              <span className="text-xs text-default-400 ml-1 px-1.5 py-0.5 rounded bg-content2">
                {acc.currency}
              </span>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-default-400 mb-0.5">Текущий баланс</p>
                <p className="text-2xl font-bold text-foreground">
                  {acc.balance.toLocaleString("ru-RU")} ₽
                </p>
              </div>
              {/* Active toggle */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-medium ${
                    acc.isActive ? "text-[#00FFA3]" : "text-default-400"
                  }`}
                >
                  {acc.isActive ? "Активный" : "Архивный"}
                </span>
                <button
                  onClick={() => toggleActive(acc.id)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    acc.isActive ? "bg-[#00FFA3]" : "bg-content3"
                  }`}
                  role="switch"
                  aria-checked={acc.isActive}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      acc.isActive ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative glass-card rounded-2xl w-full max-w-md p-6 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-default-400 hover:text-foreground p-1 rounded-lg hover:bg-content2"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold mb-5">
              {editingId !== null ? "Редактировать счет" : "Добавить счет"}
            </h2>
            <div className="space-y-4">
              <Field label="Название счета">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Сбер Зарплатная"
                  className="input-field"
                />
              </Field>
              <Field label="Номер счета">
                <input
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                  placeholder="40817810900001234"
                  className="input-field font-mono"
                />
              </Field>
              <Field label="Банк">
                <select
                  value={form.bank}
                  onChange={(e) => setForm({ ...form, bank: e.target.value })}
                  className="input-field"
                >
                  {BANKS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Валюта">
                <select
                  value={form.currency}
                  onChange={(e) =>
                    setForm({ ...form, currency: e.target.value as Account["currency"] })
                  }
                  className="input-field"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="flex items-center justify-between py-3 border-t border-divider">
                <span className="text-sm font-medium">Активный счет</span>
                <button
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    form.isActive ? "bg-[#00FFA3]" : "bg-content3"
                  }`}
                  role="switch"
                  aria-checked={form.isActive}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      form.isActive ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 h-10 rounded-xl bg-content2 hover:bg-content3 transition-colors text-sm font-medium"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                className="flex-1 h-10 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#0066FF] text-black text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <div className="relative glass-card rounded-2xl w-full max-w-sm p-6 animate-scale-in">
            <h2 className="text-lg font-bold mb-2">Удалить счет?</h2>
            <p className="text-sm text-default-500 mb-5">
              Это действие нельзя отменить. Транзакции по счету останутся.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 h-10 rounded-xl bg-content2 hover:bg-content3 transition-colors text-sm font-medium"
              >
                Отмена
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 h-10 rounded-xl bg-[#FF3366] text-white text-sm font-semibold hover:bg-[#CC2952] transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-default-600">{label}</label>
      {children}
    </div>
  );
}
