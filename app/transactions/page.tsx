'use client';
import { useState, useEffect, useCallback } from 'react';
import { Search, X, ChevronUp, ChevronDown, ChevronsUpDown, FileSearch, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { formatDateUI } from '@/lib/types';
import type { Transaction, Category, TransactionType } from '@/lib/types';
import { TransactionDetailModal } from '@/components/dashboard/TransactionDetailModal';

const PAGE_SIZES = [10, 25, 50] as const;
type SortDir = 'asc' | 'desc';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(10);
  const [page, setPage] = useState(1);
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [modalTx, setModalTx] = useState<Transaction | null>(null);

  // Загрузка категорий (единожды)
  useEffect(() => {
    apiClient.get('/categories').then((r) => setCategories(r.data ?? []));
  }, []);

  // Загрузка транзакций при изменении фильтров/страницы
  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = {
        skip: (page - 1) * pageSize,
        limit: pageSize,
      };
      if (typeFilter !== 'all') params.transaction_type = typeFilter;
      if (categoryFilter) params.category_id = categoryFilter;
      if (search) params.search = search;

      const res = await apiClient.get('/transactions', { params });
      // Бэкенд возвращает массив; total берём из заголовка X-Total-Count если есть
      const data: Transaction[] = res.data ?? [];
      const totalCount = res.headers?.['x-total-count']
        ? Number(res.headers['x-total-count'])
        : data.length;
      setTransactions(data);
      setTotal(totalCount >= pageSize ? totalCount : (page - 1) * pageSize + data.length);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, typeFilter, categoryFilter, search]);

  useEffect(() => { load(); }, [load]);

  // Сброс страницы при смене фильтра
  const resetPage = () => setPage(1);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const sorted = [...transactions].sort((a, b) => {
    const av = new Date(a.transaction_date).getTime();
    const bv = new Date(b.transaction_date).getTime();
    return sortDir === 'asc' ? av - bv : bv - av;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-xs text-default-400 mb-1">
            <span>Dashboard</span><span className="mx-1.5">/</span><span className="text-foreground">Транзакции</span>
          </nav>
          <h1 className="text-3xl font-bold text-foreground">Транзакции</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-default-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPage(); }}
              placeholder="Поиск по описанию, продавцу..."
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-content2 border border-divider text-sm placeholder:text-default-400 focus:outline-none focus:border-[#00E5FF] transition-all"
            />
          </div>

          {/* Type filter */}
          <div className="flex rounded-xl overflow-hidden border border-divider h-10">
            {(['all', 'income', 'expense'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTypeFilter(t); resetPage(); }}
                className={`px-4 text-sm font-medium transition-colors ${typeFilter === t ? 'bg-content3 text-foreground' : 'bg-content2 text-default-400 hover:bg-content3'}`}
              >
                {t === 'all' ? 'Все' : t === 'income' ? 'Доходы' : 'Расходы'}
              </button>
            ))}
          </div>

          {/* Category select */}
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); resetPage(); }}
            className="h-10 px-3 rounded-xl bg-content2 border border-divider text-sm text-foreground focus:outline-none focus:border-[#00E5FF] transition-all"
          >
            <option value="">Все категории</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>{c.name}</option>
            ))}
          </select>

          {/* Reset */}
          <button
            onClick={() => { setSearch(''); setTypeFilter('all'); setCategoryFilter(''); resetPage(); }}
            className="flex items-center gap-1.5 px-3.5 h-10 rounded-xl bg-content2 border border-divider text-sm text-default-500 hover:text-foreground hover:bg-content3 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Сбросить
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-divider bg-content2/50">
                <th className="px-5 py-4 text-left">
                  <button
                    onClick={() => setSortDir((d) => d === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center gap-1.5 text-xs font-medium text-default-400"
                  >
                    Дата {sortDir === 'asc'
                      ? <ChevronUp className="w-3.5 h-3.5 text-[#00E5FF]" />
                      : <ChevronDown className="w-3.5 h-3.5 text-[#00E5FF]" />}
                  </button>
                </th>
                {['Категория', 'Описание', 'Счёт', 'Сумма', 'Тип'].map((h) => (
                  <th key={h} className="px-3 py-4 text-left text-xs font-medium text-default-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array(pageSize).fill(0).map((_, i) => (
                  <tr key={i} className="border-b border-divider/40">
                    {Array(6).fill(0).map((_, j) => (
                      <td key={j} className="px-3 py-3.5">
                        <div className="h-4 shimmer rounded w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : sorted.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <FileSearch className="w-12 h-12 text-default-300 mb-3" />
                      <p className="text-default-500 font-medium">Ничего не найдено</p>
                      <p className="text-sm text-default-400 mt-1">Попробуйте изменить фильтры</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sorted.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setModalTx(tx)}
                    className="border-b border-divider/40 hover:bg-content2/50 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5 text-default-400 whitespace-nowrap text-xs">
                      {formatDateUI(tx.transaction_date)}
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="px-2.5 py-0.5 rounded-lg bg-content2 text-xs font-medium text-default-600">
                        {tx.category?.name ?? '—'}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 font-medium text-foreground">
                      {tx.merchant ?? tx.description ?? '—'}
                    </td>
                    <td className="px-3 py-3.5 text-default-400 text-xs">
                      {tx.account?.name ?? '—'}
                    </td>
                    <td className={`px-3 py-3.5 font-semibold tabular-nums ${tx.transaction_type === 'income' ? 'text-[#00FFA3]' : 'text-[#FF3366]'}`}>
                      {tx.transaction_type === 'income' ? '+' : '-'}
                      {Number(tx.amount).toLocaleString('ru-RU')} ₽
                    </td>
                    <td className="px-3 py-3.5">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${tx.transaction_type === 'income'
                          ? 'bg-[#00FFA3]/10 text-[#00FFA3]'
                          : tx.transaction_type === 'expense'
                            ? 'bg-[#FF3366]/10 text-[#FF3366]'
                            : 'bg-[#00E5FF]/10 text-[#00E5FF]'
                        }`}>
                        {tx.transaction_type === 'income' ? 'Доход'
                          : tx.transaction_type === 'expense' ? 'Расход' : 'Перевод'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-divider">
          <div className="flex items-center gap-2 text-sm text-default-400">
            <span>Строк:</span>
            {PAGE_SIZES.map((s) => (
              <button
                key={s}
                onClick={() => { setPageSize(s); resetPage(); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${pageSize === s ? 'bg-content3 text-foreground' : 'hover:bg-content2 text-default-400'}`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-default-400 mr-2">
              {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} из {total}
            </span>
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded-lg hover:bg-content2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg hover:bg-content2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {modalTx && <TransactionDetailModal tx={modalTx} onClose={() => setModalTx(null)} />}
    </div>
  );
}
