"use client";

import { X, Calendar, CreditCard, Tag, Hash, ArrowRightLeft } from "lucide-react";
import type { Transaction } from "@/lib/mock-data";

interface Props {
  tx: Transaction;
  onClose: () => void;
}

export default function TransactionDetailModal({ tx, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative glass-card rounded-2xl w-full max-w-md p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-default-400 hover:text-foreground transition-colors p-1 rounded-lg hover:bg-content2"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <p className="text-xs text-default-400 uppercase tracking-wide mb-1">Детали операции</p>
          <h2 className="text-xl font-bold text-foreground">{tx.merchant}</h2>
          <p
            className={`text-2xl font-bold mt-1 ${
              tx.amount > 0 ? "text-[#00FFA3]" : "text-[#FF3366]"
            }`}
          >
            {tx.amount > 0 ? "+" : ""}
            {tx.amount.toLocaleString("ru-RU")} ₽
          </p>
        </div>

        {/* Details grid */}
        <div className="space-y-3">
          <DetailRow
            icon={<Calendar className="w-4 h-4" />}
            label="Дата операции"
            value={`${tx.date} в ${tx.time}`}
          />
          <DetailRow
            icon={<Calendar className="w-4 h-4" />}
            label="Дата обработки"
            value={tx.processedDate}
          />
          <DetailRow
            icon={<Tag className="w-4 h-4" />}
            label="Категория"
            value={tx.category}
          />
          <DetailRow
            icon={<CreditCard className="w-4 h-4" />}
            label="Счет"
            value={tx.account}
          />
          <DetailRow
            icon={<ArrowRightLeft className="w-4 h-4" />}
            label="Баланс после операции"
            value={`${tx.balanceAfter.toLocaleString("ru-RU")} ₽`}
          />
          <DetailRow
            icon={<Hash className="w-4 h-4" />}
            label="Код авторизации"
            value={tx.authCode}
            mono
          />
        </div>

        {/* Change category button */}
        <div className="mt-6 pt-4 border-t border-divider">
          <button className="w-full h-10 rounded-xl bg-content2 hover:bg-content3 transition-colors text-sm font-medium text-foreground">
            Изменить категорию
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-divider/40 last:border-0">
      <div className="flex items-center gap-2.5 text-default-400">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span
        className={`text-sm font-medium text-foreground text-right ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
