'use client';
import { useEffect, useState, useRef } from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ChevronDown, ArrowUpRight } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
} from 'recharts';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { formatDateUI } from '@/lib/types';
import type { Transaction } from '@/lib/types';
import TransactionDetailModal from '@/components/dashboard/TransactionDetailModal';
import { useAnimatedMount } from '@/lib/hooks/useAnimatedMount';
import { useDelayedSkeleton } from '@/lib/hooks/useDelayedSkeleton';
import { ChartTooltip } from '@/components/ui/ChartTooltip';

// totalBalance убран — теперь balances хранится отдельно по валютам
interface DashboardStats { totalIncome: number; totalExpense: number; }
interface ChartPoint { date: string; income: number; expense: number; }
interface CategoryStat { name: string; value: number; color: string; }

const CHART_COLORS = ['#3D7EFF', '#FF3366', '#00FFA3', '#FFB800', '#A855F7', '#FF6600'];
const PERIODS = [7, 14, 30, 90] as const;

/**
 * Перевод между своими счетами — не доход и не расход.
 * Сбер присылает их как income/expense, но с category_type === 'transfer'.
 */
function isInternalTransfer(tx: Transaction): boolean {
  return (
    tx.transaction_type === 'transfer' ||
    tx.category?.category_type === 'transfer'
  );
}

function SkeletonCard() { return <div className="glass-card rounded-2xl p-5 shimmer h-32" />; }
function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`glass-card rounded-2xl shimmer ${className}`} />;
}

export default function DashboardPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== 'light';

  const C = {
    income: isDark ? '#00FFA3' : '#00874A',
    expense: isDark ? '#FF3366' : '#DC2626',
    primary: isDark ? '#3D7EFF' : '#1A6EF5',
    grid: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(100,80,50,0.10)',
    tick: isDark ? '#9CA3AF' : '#7A6A58',
    tooltip: {
      bg: isDark ? '#111113' : '#FAF7F2',
      border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(180,155,120,0.3)',
      color: isDark ? '#fff' : '#1A1510',
    },
  };
  const tooltipStyle = {
    background: C.tooltip.bg, border: `1px solid ${C.tooltip.border}`,
    borderRadius: 12, fontSize: 12, color: C.tooltip.color,
  };

  const [period, setPeriod] = useState<(typeof PERIODS)[number]>(30);
  const [periodOpen, setPeriodOpen] = useState(false);
  const periodRef = useRef<HTMLDivElement>(null);
  const { mounted: dropMounted, animating: dropAnimating } = useAnimatedMount(periodOpen, 160);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (periodRef.current && !periodRef.current.contains(e.target as Node)) setPeriodOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const [stats, setStats] = useState<DashboardStats>({ totalIncome: 0, totalExpense: 0 });
  // Балансы по каждой валюте отдельно — USD-наличные не суммируются с RUB
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryStat[]>([]);
  const [recentTx, setRecentTx] = useState<Transaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const showSkeleton = useDelayedSkeleton(isLoading && isInitialLoad, 2000);
  const fadeOnUpdate = `transition-opacity duration-500 ${isLoading && !isInitialLoad ? 'opacity-50' : 'opacity-100'}`;

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const now = new Date();
        const dateTo = now.toISOString().split('T')[0];
        const dateFrom = new Date(now.getTime() - period * 86_400_000).toISOString().split('T')[0];

        const [txRes, balanceRes] = await Promise.all([
          apiClient.get('/transactions', {
            params: { date_from: dateFrom, date_to: dateTo, page_size: 500, page: 1 },
          }),
          // Новый эндпоинт: { balances: { RUB: "102000.00", USD: "500.00" } }
          apiClient.get('/accounts/balances-by-currency'),
        ]);

        const allTx: Transaction[] = txRes.data.items ?? [];

        // Переводы исключаем из расчётов доходов/расходов,
        // но оставляем в списке последних операций для отображения
        const operationalTx = allTx.filter(tx => !isInternalTransfer(tx));

        let totalIncome = 0, totalExpense = 0;
        for (const tx of operationalTx) {
          if (tx.transaction_type === 'income') totalIncome += Number(tx.amount);
          if (tx.transaction_type === 'expense') totalExpense += Number(tx.amount);
        }
        setStats({ totalIncome, totalExpense });

        // Парсим балансы по валютам из нового эндпоинта
        const rawBalances: Record<string, string> = balanceRes.data?.balances ?? {};
        const numericBalances: Record<string, number> = {};
        for (const [cur, val] of Object.entries(rawBalances)) {
          numericBalances[cur] = Number(val);
        }
        setBalances(numericBalances);

        // Последние 5 — из всех транзакций, включая переводы
        setRecentTx(allTx.slice(0, 5));

        // Pie chart — только реальные расходы без категорий-переводов
        const catMap: Record<string, number> = {};
        for (const tx of operationalTx) {
          if (tx.transaction_type !== 'expense') continue;
          const name = tx.category?.name ?? 'Прочее';
          catMap[name] = (catMap[name] ?? 0) + Number(tx.amount);
        }
        setCategoryData(
          Object.entries(catMap)
            .sort(([, a], [, b]) => b - a)
            .map(([name, value], i) => ({ name, value, color: CHART_COLORS[i % CHART_COLORS.length] }))
        );

        // Линейный график — без переводов, с правильной сортировкой по дате
        const byDate: Record<string, { income: number; expense: number }> = {};
        for (const tx of operationalTx) {
          const d = formatDateUI(tx.transaction_date);
          if (!byDate[d]) byDate[d] = { income: 0, expense: 0 };
          if (tx.transaction_type === 'income') byDate[d].income += Number(tx.amount);
          if (tx.transaction_type === 'expense') byDate[d].expense += Number(tx.amount);
        }
        const sortedDays = Object.entries(byDate)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, v]) => ({ date, ...v }));
        // Для коротких периодов показываем все дни, для длинных — последние 14
        setChartData(period <= 14 ? sortedDays : sortedDays.slice(-14));
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };
    load();
  }, [period]);

  // Чистый денежный поток за период (не путать с балансом счетов)
  const netFlow = stats.totalIncome - stats.totalExpense;
  const savedPct = stats.totalIncome > 0
    ? Math.max(0, Math.round((netFlow / stats.totalIncome) * 100))
    : 0;

  const rubBalance = balances.RUB ?? 0;
  const otherCurrencies = Object.entries(balances).filter(([cur]) => cur !== 'RUB');

  return (
    <div className="space-y-8">

      {/* Header — всегда виден */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Обзор финансов</h1>
          <p className="text-default-500 text-sm mt-1">
            Актуальные данные за последние{' '}
            <span className="text-foreground font-medium">{period} дней</span>
            {isLoading && !isInitialLoad && (
              <span className="ml-2 inline-block w-3 h-3 rounded-full border-2
                               border-primary border-t-transparent animate-spin align-middle" />
            )}
          </p>
        </div>

        <div ref={periodRef} className="relative">
          <button
            onClick={() => setPeriodOpen(v => !v)}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-content2
                       border border-divider text-sm font-medium hover:bg-content3
                       transition-colors disabled:opacity-60"
          >
            За {period} дней
            <ChevronDown className={`w-4 h-4 text-default-400 transition-transform duration-300
                                      ${periodOpen ? 'rotate-180' : ''}`} />
          </button>
          {dropMounted && (
            <div className={`absolute right-0 mt-2 w-44 glass-dropdown rounded-xl py-1 z-50
                             ${dropAnimating ? 'animate-dropdown' : 'animate-dropdown-out'}`}>
              {PERIODS.map(p => (
                <button key={p}
                  onClick={() => { setPeriod(p); setPeriodOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 transition-colors
                              ${period === p ? 'text-primary font-medium' : 'text-foreground'}`}
                >
                  {p} дней
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Metric Cards ── */}
      {isInitialLoad ? (
        showSkeleton ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : null
      ) : (
        <div key={`metrics-${period}`}
          className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 stagger-container ${fadeOnUpdate}`}>

          {/* Баланс — мультивалютный снимок счетов, не зависит от периода */}
          <div className="glass-card rounded-2xl p-5 hover-lift">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-default-500 font-medium uppercase tracking-wide">Баланс</p>
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary
                              flex items-center justify-center flex-shrink-0">
                <Wallet className="w-6 h-6" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {rubBalance.toLocaleString('ru-RU')} ₽
            </p>
            {otherCurrencies.length > 0
              ? otherCurrencies.map(([cur, val]) => (
                <p key={cur} className="text-xs text-default-400 mt-0.5">
                  {val.toLocaleString('ru-RU')} {cur}
                </p>
              ))
              : <p className="text-xs text-default-400 mt-0.5">на счетах</p>
            }
          </div>

          <MetricCard
            label="Доходы"
            value={stats.totalIncome.toLocaleString('ru-RU')}
            sub={`за ${period} дней`}
            icon={<TrendingUp className="w-6 h-6" />}
            iconBg="bg-success/10 text-success"
          />
          <MetricCard
            label="Расходы"
            value={stats.totalExpense.toLocaleString('ru-RU')}
            sub={`за ${period} дней`}
            icon={<TrendingDown className="w-6 h-6" />}
            iconBg="bg-danger/10 text-danger"
          />

          {/* Чистый поток = доходы − расходы за период, без переводов */}
          <div className="glass-card rounded-2xl p-5 hover-lift">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-default-500 font-medium uppercase tracking-wide">
                  Чистый поток
                </p>
                <p className={`text-2xl font-bold mt-1
                               ${netFlow < 0 ? 'text-danger' : 'text-foreground'}`}>
                  {netFlow < 0 ? '−' : ''}{Math.abs(netFlow).toLocaleString('ru-RU')} ₽
                </p>
                <p className="text-xs text-default-400 mt-0.5">{savedPct}% от доходов</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-warning/10 text-warning
                              flex items-center justify-center flex-shrink-0">
                <PiggyBank className="w-6 h-6" />
              </div>
            </div>
            <div className="h-2 bg-content3 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700
                            ${netFlow >= 0 ? 'bg-warning' : 'bg-danger'}`}
                style={{ width: `${Math.min(savedPct, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Charts ── */}
      {isInitialLoad ? (
        showSkeleton ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <SkeletonBlock className="lg:col-span-3 h-80" />
            <SkeletonBlock className="lg:col-span-2 h-80" />
          </div>
        ) : null
      ) : (
        <div key={`charts-${period}`}
          className={`grid grid-cols-1 lg:grid-cols-5 gap-5 stagger-container ${fadeOnUpdate}`}>
          <div className="glass-card rounded-2xl p-6 lg:col-span-3">
            <h2 className="text-base font-semibold mb-5 text-foreground">Доходы и расходы</h2>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
                <XAxis dataKey="date" tick={{ fill: C.tick, fontSize: 11 }}
                  axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.tick, fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `${(v / 1000).toFixed(0)}k`} width={36} />
                <Tooltip contentStyle={tooltipStyle}
                  formatter={(v: number) => `${v.toLocaleString('ru-RU')} ₽`} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                <Line type="monotone" dataKey="income" name="Доходы"
                  stroke={C.income} strokeWidth={2} dot={{ r: 3, fill: C.income }} />
                <Line type="monotone" dataKey="expense" name="Расходы"
                  stroke={C.expense} strokeWidth={2} dot={{ r: 3, fill: C.expense }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card rounded-2xl p-6 lg:col-span-2">
            <h2 className="text-base font-semibold mb-5 text-foreground">Категории расходов</h2>
            {categoryData.length === 0 ? (
              <p className="text-center text-default-400 py-12 text-sm">Нет расходов за период</p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%"
                      innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                      {categoryData.map((e, idx) => <Cell key={idx} fill={e.color} />)}
                    </Pie>
                    <Tooltip content={<ChartTooltip style={tooltipStyle} />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-3">
                  {categoryData.map((c, i) => {
                    const total = categoryData.reduce((s, x) => s + x.value, 0);
                    return (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ background: c.color }} />
                          <span className="text-default-500">{c.name}</span>
                        </div>
                        <span className="font-medium text-foreground">
                          {Math.round((c.value / total) * 100)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Recent Transactions ── */}
      {isInitialLoad ? (
        showSkeleton ? (
          <div className="glass-card rounded-2xl p-6">
            <div className="h-6 shimmer rounded-lg w-48 mb-5" />
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => <div key={i} className="h-12 shimmer rounded-xl" />)}
            </div>
          </div>
        ) : null
      ) : (
        <div className={`glass-card rounded-2xl p-6 ${fadeOnUpdate}`}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-foreground">Последние транзакции</h2>
            <Link href="/transactions"
              className="flex items-center gap-1 text-xs text-primary hover:underline font-medium">
              Все <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {recentTx.length === 0 ? (
            <p className="text-center text-default-400 py-8 text-sm">Транзакций пока нет</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-divider">
                    {['Дата', 'Категория', 'Описание', 'Сумма'].map(h => (
                      <th key={h}
                        className="text-left text-xs text-default-400 font-medium pb-3 pr-4 last:text-right">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentTx.map((tx, idx) => {
                    const transfer = isInternalTransfer(tx);
                    const amountColor = transfer
                      ? 'text-primary'
                      : tx.transaction_type === 'income' ? 'text-success' : 'text-danger';
                    const amountPrefix = transfer
                      ? '⇄ '
                      : tx.transaction_type === 'income' ? '+' : '−';
                    return (
                      <tr key={tx.id}
                        onClick={() => setSelectedTx(tx)}
                        className="border-b border-divider/40 hover:bg-content2/50 transition-colors cursor-pointer"
                        style={{
                          animation: 'stagger-in 0.65s cubic-bezier(0.16,1,0.3,1) both',
                          animationDelay: `${0.05 + idx * 0.07}s`,
                        }}
                      >
                        <td className="py-3.5 pr-4 text-default-400 whitespace-nowrap text-xs">
                          {formatDateUI(tx.transaction_date)}
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium
                            ${transfer
                              ? 'bg-primary/10 text-primary'
                              : 'bg-content2 text-default-500'
                            }`}>
                            {tx.category?.name ?? '—'}
                          </span>
                        </td>
                        <td className="py-3.5 pr-4 font-medium text-foreground">
                          {tx.merchant ?? tx.description ?? '—'}
                        </td>
                        <td className={`py-3.5 text-right font-semibold tabular-nums ${amountColor}`}>
                          {amountPrefix}{Number(tx.amount).toLocaleString('ru-RU')} ₽
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <TransactionDetailModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
    </div>
  );
}

function MetricCard({ label, value, sub, icon, iconBg }: {
  label: string; value: string; sub?: string; icon: React.ReactNode; iconBg: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-5 hover-lift">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-default-500 font-medium uppercase tracking-wide">{label}</p>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value} ₽</p>
      {sub && <p className="text-xs text-default-400 mt-1">{sub}</p>}
    </div>
  );
}
