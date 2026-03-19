'use client';
import { X, Calendar, CreditCard, Tag, Hash, ArrowRightLeft } from 'lucide-react';
import type { Transaction } from '@/lib/types';
import { formatDateUI } from '@/lib/types';
import ModalPortal from '@/components/ui/ModalPortal';
import { useAnimatedMount } from '@/lib/hooks/useAnimatedMount';

interface Props {
  tx: Transaction | null;
  onClose: () => void;
}

export default function TransactionDetailModal({ tx, onClose }: Props) {
  const { mounted, animating } = useAnimatedMount(!!tx, 200);

  if (!mounted || !tx) return null;

  const amount = Number(tx.amount);
  const isIncome = tx.transaction_type === 'income';
  const isExpense = tx.transaction_type === 'expense';
  const amountColor = isIncome ? 'text-success' : isExpense ? 'text-danger' : 'text-primary';

  return (
    <ModalPortal>
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center p-4
                    ${animating ? 'animate-overlay-in' : 'animate-overlay-out'}`}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />

        <div
          className={`relative glass-card rounded-2xl w-full max-w-md p-6
                      ${animating ? 'animate-modal-content' : 'animate-modal-out'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-default-400
                       hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6 pr-8">
            <p className="text-xs text-default-400 uppercase tracking-wide mb-1">
              {tx.category?.name ?? 'Без категории'}
            </p>
            <h2 className="text-xl font-bold text-foreground">
              {tx.merchant ?? tx.description ?? '—'}
            </h2>
            <p className={`text-2xl font-bold mt-1 ${amountColor}`}>
              {isIncome ? '+' : isExpense ? '-' : ''}
              {Math.abs(amount).toLocaleString('ru-RU')} ₽
            </p>
          </div>

          <div>
            <DetailRow icon={<Calendar className="w-4 h-4" />} label="Дата" value={formatDateUI(tx.transaction_date)} />
            <DetailRow icon={<Tag className="w-4 h-4" />} label="Категория" value={tx.category?.name ?? '—'} />
            <DetailRow icon={<CreditCard className="w-4 h-4" />} label="Счёт" value={tx.account?.name ?? '—'} />
            {tx.external_id && (
              <DetailRow icon={<Hash className="w-4 h-4" />} label="Код авторизации" value={tx.external_id} mono />
            )}
            <DetailRow
              icon={<ArrowRightLeft className="w-4 h-4" />}
              label="Источник"
              value={tx.import_source === 'sber_pdf' ? 'Выписка Сбер' : 'Ручной ввод'}
            />
            {tx.description && (
              <DetailRow icon={<ArrowRightLeft className="w-4 h-4" />} label="Описание" value={tx.description} />
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-divider/40">
            <button
              onClick={onClose}
              className="w-full h-10 rounded-xl transition-colors text-sm font-medium
                         text-default-500 hover:text-foreground
                         bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10
                         border border-black/10 dark:border-white/10"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

function DetailRow({ icon, label, value, mono }: {
  icon: React.ReactNode; label: string; value: string; mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-divider/40 last:border-0">
      <div className="flex items-center gap-2.5 text-default-400">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <span className={`text-sm font-medium text-foreground text-right max-w-[55%] truncate
                        ${mono ? 'font-mono text-xs text-default-500' : ''}`}>
        {value}
      </span>
    </div>
  );
}
