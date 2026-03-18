'use client';
import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, BarChart2, RefreshCw, ChevronDown } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { apiClient } from '@/lib/api';
import type { Category } from '@/lib/types';

// ─── Типы ответов аналитики ───────────────────────────────────────────────────
interface CategoryStat {
  category_id: number | null;
  category_name: string;
  total: number;
  count: number;
  color?: string;
}

interface MonthlyPoint {
  month: string;     // YYYY-MM
  income: number;
  expense: number;
  balance: number;
}

interface TopMerchant {
  merchant: string;
  total: number;
  count: number;
}

const CHART_COLORS = [
  '#00E5FF', '#FF3366', '#00FFA3', '#FFB800',
  '#0066FF', '#FF6600', '#9B59B6', '#1ABC9C',
];

const PERIODS = [
  { label: '7 дней', days: 7 },
  { label: '30 дней', days: 30 },
  { label: '90 дней', days: 90 },
  { label: '180 дней', days: 180 },
  { label: 'Год', days: 365 },
] as const;

// ─── Скелетон ─────────────────────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`shimmer rounded-xl ${className}`} />;
}

// ─── Вспомогательные ─────────────────────────────────────────────────────────
function getDateRange(days: number) {
  const now = new Date();
  const dateTo = now.toISOString().split('T')[0];
  const dateFrom = new Date(now.getTime() - days * 86_400_000)
    .toISOString().split('T')[0];
  return { dateFrom, dateTo };
}

function formatMonth(yyyymm: string) {
  const [y, m] = yyyymm.split('-');
  const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
    'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
  return `${months[Number(m) - 1]} ${y}`;
}

export default function AnalyticsPage() {
  const [periodIdx, setPeriodIdx] = useState(1);       // 30 дней по умолчанию
  const [periodOpen, setPeriodOpen] = useState(false);

  // Данные
  const [expenseByCategory, setExpenseByCategory] = useState<CategoryStat[]>([]);
  const [incomeByCategory, setIncomeByCategory] = useState<CategoryStat[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyPoint[]>([]);
  const [topMerchants, setTopMerchants] = useState<TopMerchant[]>([]);
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const { dateFrom, dateTo } = getDateRange(PERIODS[periodIdx].days);

      // Один запрос — всё считаем на фронте
      const [txRes, balanceRes, budgetsRes] = await Promise.all([
	apiClient.get('/transactions', {
	  params: {
	    datefrom: dateFrom,   // ← без подчёркивания
	    dateto: dateTo,       // ← без подчёркивания
	    pagesize: 500,
	    page: 1,
	  },
	}),
	apiClient.get('/accounts/total-balance'),
      ]);

      const allTx = txRes.data.items ?? [];

      // Totals
      let income = 0, expense = 0;
      for (const tx of allTx) {
	if (tx.transaction_type === 'income')  income  += Number(tx.amount);
	if (tx.transaction_type === 'expense') expense += Number(tx.amount);
      }
      setTotals({
	income,
	expense,
	balance: Number(balanceRes.data?.total_balance ?? 0),
      });

      // Категории расходов
      const expCatMap: Record<string, number> = {};
      const incCatMap: Record<string, number> = {};
      for (const tx of allTx) {
	const name = tx.category?.name ?? 'Прочее';
	if (tx.transaction_type === 'expense') expCatMap[name] = (expCatMap[name] ?? 0) + Number(tx.amount);
	if (tx.transaction_type === 'income')  incCatMap[name] = (incCatMap[name] ?? 0) + Number(tx.amount);
      }
      setExpenseByCategory(
	Object.entries(expCatMap).map(([name, total], i) => ({
	  category_name: name, total,
	  color: CHART_COLORS[i % CHART_COLORS.length],
	}))
      );
      setIncomeByCategory(
	Object.entries(incCatMap).map(([name, total], i) => ({
	  category_name: name, total,
	  color: CHART_COLORS[i % CHART_COLORS.length],
	}))
      );

      // Помесячно
      const byMonth: Record<string, { income: number; expense: number }> = {};
      for (const tx of allTx) {
	const month = tx.transaction_date.slice(0, 7);
	if (!byMonth[month]) byMonth[month] = { income: 0, expense: 0 };
	if (tx.transaction_type === 'income')  byMonth[month].income  += Number(tx.amount);
	if (tx.transaction_type === 'expense') byMonth[month].expense += Number(tx.amount);
      }
      setMonthlyData(
	Object.entries(byMonth)
	  .sort(([a], [b]) => a.localeCompare(b))
	  .map(([month, v]) => ({ month, ...v, balance: v.income - v.expense }))
      );

      // Топ продавцов
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
	  .sort((a, b) => b.total - a.total)
	  .slice(0, 5)
      );

    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка загрузки');
    } finally {
      setIsLoading(false);
    }
  }, [periodIdx]);
  

  useEffect(() => { load(); }, [load]);

  const maxMerchant = Math.max(...topMerchants.map((m) => m.total), 1);

  return (
    <div className="space-y-8">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-xs text-default-400 mb-1">
            <span>Dashboard</span><span className="mx-1.5">/</span>
            <span className="text-foreground">Аналитика</span>
          </nav>
          <h1 className="text-3xl font-bold text-foreground">Аналитика</h1>
          <p className="text-default-500 text-sm mt-1">
            Статистика за период: <span className="text-foreground font-medium">{PERIODS[periodIdx].label}</span>
          </p>
        </div>

        {/* Period selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-content2 border border-divider text-default-400 hover:text-foreground hover:bg-content3 transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <div className="relative">
            <button
              onClick={() => setPeriodOpen(!periodOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-content2 border border-divider text-sm font-medium hover:bg-content3 transition-colors"
            >
              {PERIODS[periodIdx].label}
              <ChevronDown className="w-4 h-4 text-default-400" />
            </button>
            {periodOpen && (
              <div className="absolute right-0 mt-2 w-40 glass-card rounded-xl py-1 z-50 shadow-lg">
                {PERIODS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => { setPeriodIdx(i); setPeriodOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-content2 transition-colors ${periodIdx === i ? 'text-[#00E5FF] font-medium' : 'text-foreground'
                      }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Error ──────────────────────────────────────────────────────────── */}
      {error && (
        <div className="p-4 rounded-xl bg-[#FF3366]/10 border border-[#FF3366]/30 text-sm text-[#FF3366]">
          {error}
        </div>
      )}

      {/* ── Totals row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-28" />)
        ) : (
          <>
            {[
              { label: 'Доходы', value: totals.income, color: '#00FFA3', Icon: TrendingUp },
              { label: 'Расходы', value: totals.expense, color: '#FF3366', Icon: TrendingDown },
              { label: 'Баланс', value: totals.balance, color: '#00E5FF', Icon: BarChart2 },
            ].map(({ label, value, color, Icon }) => (
              <div key={label} className="glass-card rounded-2xl p-5 hover-lift">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs text-default-500 font-medium uppercase tracking-wide">{label}</p>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}15`, color }}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {value.toLocaleString('ru-RU')} ₽
                </p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* ── Monthly bar chart ──────────────────────────────────────────────── */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-base font-semibold mb-5 text-foreground">Помесячная динамика</h2>
        {isLoading ? (
          <Skeleton className="h-64" />
        ) : monthlyData.length === 0 ? (
          <p className="text-center text-default-400 py-16 text-sm">Нет данных за период</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonth}
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                axisLine={false} tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                width={36}
              />
              <Tooltip
                contentStyle={{
                  background: '#111113',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, fontSize: 12,
                }}
                formatter={(v: number) => `${v.toLocaleString('ru-RU')} ₽`}
                labelFormatter={formatMonth}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              <Bar dataKey="income" name="Доходы" fill="#00FFA3" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Расходы" fill="#FF3366" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Categories row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Расходы по категориям */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-base font-semibold mb-5 text-foreground">Расходы по категориям</h2>
          {isLoading ? (
            <Skeleton className="h-52" />
          ) : expenseByCategory.length === 0 ? (
            <p className="text-center text-default-400 py-12 text-sm">Нет данных</p>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    dataKey="total"
                    nameKey="category_name"
                    cx="50%" cy="50%"
                    innerRadius={50} outerRadius={75}
                    paddingAngle={3}
                  >
                    {expenseByCategory.map((c, i) => (
                      <Cell key={i} fill={c.color ?? CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: '#111113',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 12, fontSize: 12,
                    }}
                    formatter={(v: number) => `${v.toLocaleString('ru-RU')} ₽`}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2.5 w-full">
                {expenseByCategory.map((c, i) => {
                  const total = expenseByCategory.reduce((s, x) => s + x.total, 0);
                  const pct = total > 0 ? Math.round((c.total / total) * 100) : 0;
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ background: c.color ?? CHART_COLORS[i % CHART_COLORS.length] }} />
                          <span className="text-default-500">{c.category_name || 'Прочее'}</span>
                        </div>
                        <span className="font-medium text-foreground">
                          {c.total.toLocaleString('ru-RU')} ₽ · {pct}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-content3 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            background: c.color ?? CHART_COLORS[i % CHART_COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Доходы по категориям */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-base font-semibold mb-5 text-foreground">Доходы по категориям</h2>
          {isLoading ? (
            <Skeleton className="h-52" />
          ) : incomeByCategory.length === 0 ? (
            <p className="text-center text-default-400 py-12 text-sm">Нет данных</p>
          ) : (
            <div className="space-y-3">
              {incomeByCategory.map((c, i) => {
                const total = incomeByCategory.reduce((s, x) => s + x.total, 0);
                const pct = total > 0 ? Math.round((c.total / total) * 100) : 0;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full"
                          style={{ background: c.color ?? CHART_COLORS[i % CHART_COLORS.length] }} />
                        <span className="text-default-500">{c.category_name || 'Прочее'}</span>
                      </div>
                      <span className="font-medium text-foreground">
                        {c.total.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                    <div className="h-1.5 bg-content3 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: c.color ?? CHART_COLORS[i % CHART_COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>


      {/* ── Top merchants ──────────────────────────────────────────────────── */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-base font-semibold mb-5 text-foreground">Топ-5 продавцов по расходам</h2>
        {isLoading ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-10" />)}
          </div>
        ) : topMerchants.length === 0 ? (
          <p className="text-center text-default-400 py-10 text-sm">Нет данных о продавцах</p>
        ) : (
          <div className="space-y-3">
            {topMerchants.map((m, i) => {
              const pct = Math.round((m.total / maxMerchant) * 100);
              return (
                <div key={i} className="flex items-center gap-4">
                  <span className="w-5 text-xs text-default-400 text-right flex-shrink-0">
                    #{i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-foreground">{m.merchant}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-default-400">{m.count} операций</span>
                        <span className="font-semibold tabular-nums text-[#FF3366]">
                          {m.total.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-content3 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#FF3366] to-[#FF6600]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Income vs Expense trend line ───────────────────────────────────── */}
      {!isLoading && monthlyData.length > 1 && (
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-base font-semibold mb-5 text-foreground">Тренд баланса</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="month"
                tickFormatter={formatMonth}
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                axisLine={false} tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                width={36}
              />
              <Tooltip
                contentStyle={{
                  background: '#111113',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12, fontSize: 12,
                }}
                formatter={(v: number) => `${v.toLocaleString('ru-RU')} ₽`}
                labelFormatter={formatMonth}
              />
              <Line
                type="monotone" dataKey="balance" name="Баланс"
                stroke="#00E5FF" strokeWidth={2}
                dot={{ r: 4, fill: '#00E5FF' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

    </div>
  );
}
