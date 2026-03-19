'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { TrendingUp, TrendingDown, BarChart2, RefreshCw, ChevronDown } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { useTheme } from 'next-themes';
import { apiClient } from '@/lib/api';
import { useAnimatedMount } from '@/lib/hooks/useAnimatedMount';
import { useDelayedSkeleton } from '@/lib/hooks/useDelayedSkeleton';

interface CategoryStat { category_name: string; total: number; color?: string; }
interface MonthlyPoint { month: string; income: number; expense: number; balance: number; }
interface TopMerchant { merchant: string; total: number; count: number; }

const CHART_COLORS = ['#3D7EFF', '#FF3366', '#00FFA3', '#FFB800', '#A855F7', '#FF6600', '#06B6D4', '#1ABC9C'];

const PERIODS = [
  { label: '7 дней', days: 7 },
  { label: '30 дней', days: 30 },
  { label: '90 дней', days: 90 },
  { label: '180 дней', days: 180 },
  { label: 'Год', days: 365 },
] as const;

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`shimmer rounded-xl ${className}`} />;
}

function getDateRange(days: number) {
  const now = new Date();
  const dateTo = now.toISOString().split('T')[0];
  const dateFrom = new Date(now.getTime() - days * 86_400_000).toISOString().split('T')[0];
  return { dateFrom, dateTo };
}

function formatMonth(yyyymm: string) {
  const [y, m] = yyyymm.split('-');
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  return `${months[Number(m) - 1]} ${y}`;
}

export default function AnalyticsPage() {
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

  const [periodIdx, setPeriodIdx] = useState(1);
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

  const [expenseByCategory, setExpenseByCategory] = useState<CategoryStat[]>([]);
  const [incomeByCategory, setIncomeByCategory] = useState<CategoryStat[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyPoint[]>([]);
  const [topMerchants, setTopMerchants] = useState<TopMerchant[]>([]);
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const showSkeleton = useDelayedSkeleton(isLoading && isInitialLoad, 2000);
  const fadeOnUpdate = `transition-opacity duration-500 ${isLoading && !isInitialLoad ? 'opacity-50' : 'opacity-100'}`;

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const { dateFrom, dateTo } = getDateRange(PERIODS[periodIdx].days);
      const [txRes, balanceRes] = await Promise.all([
        apiClient.get('/transactions', {
          params: { date_from: dateFrom, date_to: dateTo, page_size: 500, page: 1 },
        }),
        apiClient.get('/accounts/total-balance'),
      ]);

      const allTx = txRes.data.items ?? [];
      let income = 0, expense = 0;
      for (const tx of allTx) {
        if (tx.transaction_type === 'income') income += Number(tx.amount);
        if (tx.transaction_type === 'expense') expense += Number(tx.amount);
      }
      setTotals({ income, expense, balance: Number(balanceRes.data?.total_balance ?? 0) });

      const expCatMap: Record<string, number> = {};
      const incCatMap: Record<string, number> = {};
      for (const tx of allTx) {
        const name = tx.category?.name ?? 'Прочее';
        if (tx.transaction_type === 'expense') expCatMap[name] = (expCatMap[name] ?? 0) + Number(tx.amount);
        if (tx.transaction_type === 'income') incCatMap[name] = (incCatMap[name] ?? 0) + Number(tx.amount);
      }
      setExpenseByCategory(
        Object.entries(expCatMap).sort(([, a], [, b]) => b - a)
          .map(([name, total], i) => ({ category_name: name, total, color: CHART_COLORS[i % CHART_COLORS.length] }))
      );
      setIncomeByCategory(
        Object.entries(incCatMap).sort(([, a], [, b]) => b - a)
          .map(([name, total], i) => ({ category_name: name, total, color: CHART_COLORS[i % CHART_COLORS.length] }))
      );

      const byMonth: Record<string, { income: number; expense: number }> = {};
      for (const tx of allTx) {
        const month = tx.transaction_date.slice(0, 7);
        if (!byMonth[month]) byMonth[month] = { income: 0, expense: 0 };
        if (tx.transaction_type === 'income') byMonth[month].income += Number(tx.amount);
        if (tx.transaction_type === 'expense') byMonth[month].expense += Number(tx.amount);
      }
      setMonthlyData(
        Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b))
          .map(([month, v]) => ({ month, ...v, balance: v.income - v.expense }))
      );

      const merchantMap: Record<string, { total: number; count: number }> = {};
      for (const tx of allTx) {
        if (tx.transaction_type !== 'expense' || !tx.merchant) continue;
        if (!merchantMap[tx.merchant]) merchantMap[tx.merchant] = { total: 0, count: 0 };
        merchantMap[tx.merchant].total += Number(tx.amount);
        merchantMap[tx.merchant].count += 1;
      }
      setTopMerchants(
        Object.entries(merchantMap)
          .map(([merchant, v]) => ({ merchant, ...v }))
          .sort((a, b) => b.total - a.total).slice(0, 5)
      );
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка загрузки');
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, [periodIdx]);

  useEffect(() => { load(); }, [load]);

  const maxMerchant = Math.max(...topMerchants.map(m => m.total), 1);

  return (
    <div className="space-y-8">

      {/* Header — всегда виден */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Аналитика</h1>
          <p className="text-default-500 text-sm mt-1">
            Статистика за период:{' '}
            <span className="text-foreground font-medium">{PERIODS[periodIdx].label}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} disabled={isLoading}
            className="p-2.5 rounded-xl bg-content2 border border-divider text-default-400
                       hover:text-foreground hover:bg-content3 transition-colors disabled:opacity-40">
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <div ref={periodRef} className="relative">
            <button
              onClick={() => setPeriodOpen(v => !v)}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-content2
                         border border-divider text-sm font-medium hover:bg-content3
                         transition-colors disabled:opacity-60"
            >
              {PERIODS[periodIdx].label}
              <ChevronDown className={`w-4 h-4 text-default-400 transition-transform duration-300
                                        ${periodOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropMounted && (
              <div className={`absolute right-0 mt-2 w-44 glass-dropdown rounded-xl py-1 z-50
                               ${dropAnimating ? 'animate-dropdown' : 'animate-dropdown-out'}`}>
                {PERIODS.map((p, i) => (
                  <button key={i}
                    onClick={() => { setPeriodIdx(i); setPeriodOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/5
                                ${periodIdx === i ? 'text-primary font-medium' : 'text-foreground'}`}>
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-danger/10 border border-danger/30 text-sm text-danger">
          {error}
        </div>
      )}

      {/* Totals */}
      {isInitialLoad ? (
        showSkeleton ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-28" />)}
          </div>
        ) : null
      ) : (
        <div key={`totals-${periodIdx}`}
          className={`grid grid-cols-1 sm:grid-cols-3 gap-5 stagger-container ${fadeOnUpdate}`}>
          {[
            { label: 'Доходы', value: totals.income, color: C.income, Icon: TrendingUp },
            { label: 'Расходы', value: totals.expense, color: C.expense, Icon: TrendingDown },
            { label: 'Баланс', value: totals.balance, color: C.primary, Icon: BarChart2 },
          ].map(({ label, value, color, Icon }) => (
            <div key={label} className="glass-card rounded-2xl p-5 hover-lift">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs text-default-500 font-medium uppercase tracking-wide">{label}</p>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}18`, color }}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {value.toLocaleString('ru-RU')} ₽
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Monthly chart */}
      {isInitialLoad ? (
        showSkeleton ? <Skeleton className="h-80" /> : null
      ) : (
        <div className={`glass-card rounded-2xl p-6 ${fadeOnUpdate}`}>
          <h2 className="text-base font-semibold mb-5 text-foreground">Помесячная динамика</h2>
          {monthlyData.length === 0 ? (
            <p className="text-center text-default-400 py-16 text-sm">Нет данных за период</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
                <XAxis dataKey="month" tickFormatter={formatMonth}
                  tick={{ fill: C.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.tick, fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={v => `${(v / 1000).toFixed(0)}k`} width={36} />
                <Tooltip contentStyle={tooltipStyle}
                  formatter={(v: number) => `${v.toLocaleString('ru-RU')} ₽`}
                  labelFormatter={formatMonth} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                <Bar dataKey="income" name="Доходы" fill={C.income} radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Расходы" fill={C.expense} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* Categories */}
      {isInitialLoad ? (
        showSkeleton ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        ) : null
      ) : (
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-5 ${fadeOnUpdate}`}>
          {/* Расходы */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-base font-semibold mb-5 text-foreground">Расходы по категориям</h2>
            {expenseByCategory.length === 0 ? (
              <p className="text-center text-default-400 py-12 text-sm">Нет данных</p>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={expenseByCategory} dataKey="total" nameKey="category_name"
                      cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3}>
                      {expenseByCategory.map((c, i) => (
                        <Cell key={i} fill={c.color ?? CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle}
                      formatter={(v: number) => `${v.toLocaleString('ru-RU')} ₽`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2.5 w-full">
                  {expenseByCategory.map((c, i) => {
                    const total = expenseByCategory.reduce((s, x) => s + x.total, 0);
                    const pct = total > 0 ? Math.round((c.total / total) * 100) : 0;
                    const color = c.color ?? CHART_COLORS[i % CHART_COLORS.length];
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                              style={{ background: color }} />
                            <span className="text-default-500">{c.category_name || 'Прочее'}</span>
                          </div>
                          <span className="font-medium text-foreground">
                            {c.total.toLocaleString('ru-RU')} ₽ · {pct}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-content3 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, background: color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Доходы */}
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-base font-semibold mb-5 text-foreground">Доходы по категориям</h2>
            {incomeByCategory.length === 0 ? (
              <p className="text-center text-default-400 py-12 text-sm">Нет данных</p>
            ) : (
              <div className="space-y-3">
                {incomeByCategory.map((c, i) => {
                  const total = incomeByCategory.reduce((s, x) => s + x.total, 0);
                  const pct = total > 0 ? Math.round((c.total / total) * 100) : 0;
                  const color = c.color ?? CHART_COLORS[i % CHART_COLORS.length];
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                          <span className="text-default-500">{c.category_name || 'Прочее'}</span>
                        </div>
                        <span className="font-medium text-foreground">
                          {c.total.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                      <div className="h-1.5 bg-content3 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top merchants */}
      {isInitialLoad ? (
        showSkeleton ? (
          <div className="glass-card rounded-2xl p-6">
            <div className="h-5 shimmer rounded-lg w-32 mb-5" />
            <div className="space-y-3">
              {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-10" />)}
            </div>
          </div>
        ) : null
      ) : (
        <div className={`glass-card rounded-2xl p-6 ${fadeOnUpdate}`}>
          <h2 className="text-base font-semibold mb-5 text-foreground">Топ-5 трат</h2>
          {topMerchants.length === 0 ? (
            <p className="text-center text-default-400 py-10 text-sm">Нет данных о продавцах</p>
          ) : (
            <div key={`merchants-${periodIdx}`} className="space-y-3 stagger-container">
              {topMerchants.map((m, i) => {
                const pct = Math.round((m.total / maxMerchant) * 100);
                return (
                  <div key={i} className="flex items-center gap-4">
                    <span className="w-5 text-xs text-default-400 text-right flex-shrink-0">#{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-foreground">{m.merchant}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-default-400">{m.count} операций</span>
                          <span className="font-semibold tabular-nums text-danger">
                            {m.total.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-content3 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background: `linear-gradient(90deg, ${C.expense}, #FF6600)`,
                          }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Balance trend */}
      {!isInitialLoad && monthlyData.length > 1 && (
        <div className={`glass-card rounded-2xl p-6 ${fadeOnUpdate}`}>
          <h2 className="text-base font-semibold mb-5 text-foreground">Тренд баланса</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
              <XAxis dataKey="month" tickFormatter={formatMonth}
                tick={{ fill: C.tick, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.tick, fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v / 1000).toFixed(0)}k`} width={36} />
              <Tooltip contentStyle={tooltipStyle}
                formatter={(v: number) => `${v.toLocaleString('ru-RU')} ₽`}
                labelFormatter={formatMonth} />
              <Line type="monotone" dataKey="balance" name="Баланс"
                stroke={C.primary} strokeWidth={2}
                dot={{ r: 4, fill: C.primary }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  );
}
