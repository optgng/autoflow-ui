'use client';
import { useEffect, useState } from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, ChevronDown, ArrowUpRight } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { formatDateUI } from '@/lib/types';
import type { Transaction, Account, Category } from '@/lib/types';
import TransactionDetailModal from '@/components/dashboard/TransactionDetailModal';

// ─── Типы ответов аналитики ───────────────────────────────────────────────────
interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
}

interface ChartPoint { date: string; income: number; expense: number; }
interface CategoryStat { name: string; value: number; color: string; }

const CHART_COLORS = ['#00E5FF', '#FF3366', '#00FFA3', '#FFB800', '#0066FF', '#FF6600'];
const PERIODS = [7, 14, 30, 90] as const;

// ─── Скелетон-заглушка пока грузится ─────────────────────────────────────────
function SkeletonCard() {
  return <div className="glass-card rounded-2xl p-5 shimmer h-32" />;
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>(30);
  const [periodOpen, setPeriodOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({ totalIncome: 0, totalExpense: 0, totalBalance: 0 });
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryStat[]>([]);
  const [recentTx, setRecentTx] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark'

  const COLORS = {
    income: isDark ? '#00FFA3' : '#00874A',
    expense: isDark ? '#FF3366' : '#DC2626',
    primary: isDark ? '#3D7EFF' : '#1A6EF5',
  };

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const now = new Date();
        const dateTo = now.toISOString().split('T')[0];
        const dateFrom = new Date(now.getTime() - period * 86400000)
          .toISOString().split('T')[0];

        // Один запрос — получаем все транзакции за период
        const txRes = await apiClient.get('/transactions', {
          params: {
            date_from: dateFrom,      // ← без подчёркивания
            date_to: dateTo,        // ← без подчёркивания
            page_size: 500, // ← без подчёркивания
            page: 1,
          },
        });

        const allTx = txRes.data.items ?? [];

        // Считаем totals на фронте
        let totalIncome = 0;
        let totalExpense = 0;
        for (const tx of allTx) {
          if (tx.transaction_type === 'income') totalIncome += Number(tx.amount);
          if (tx.transaction_type === 'expense') totalExpense += Number(tx.amount);
        }

        // Баланс — реальный эндпоинт существует
        const balanceRes = await apiClient.get('/accounts/total-balance');
        const totalBalance = Number(balanceRes.data?.total_balance ?? 0);

        setStats({ totalIncome, totalExpense, totalBalance });

        // Последние 5 транзакций — просто берём из того же списка
        setRecentTx(allTx.slice(0, 5));

        // Категории расходов — группируем на фронте
        const catMap: Record<string, number> = {};
        for (const tx of allTx) {
          if (tx.transaction_type !== 'expense') continue;
          const name = tx.category?.name ?? 'Прочее';
          catMap[name] = (catMap[name] ?? 0) + Number(tx.amount);
        }
        const cats = Object.entries(catMap).map(([name, value], i) => ({
          name,
          value,
          color: CHART_COLORS[i % CHART_COLORS.length],
        }));
        setCategoryData(cats);

        // График по дням — группируем на фронте
        const byDate: Record<string, { income: number; expense: number }> = {};
        for (const tx of allTx) {
          const d = formatDateUI(tx.transaction_date);
          if (!byDate[d]) byDate[d] = { income: 0, expense: 0 };
          if (tx.transaction_type === 'income') byDate[d].income += Number(tx.amount);
          if (tx.transaction_type === 'expense') byDate[d].expense += Number(tx.amount);
        }
        setChartData(
          Object.entries(byDate)
            .map(([date, v]) => ({ date, ...v }))
            .slice(-14)
        );

      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [period]);


  const saved = stats.totalIncome - stats.totalExpense;
  const savedPct = stats.totalIncome > 0
    ? Math.round((saved / stats.totalIncome) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-xs text-default-400 mb-1"><span>Dashboard</span></nav>
          <h1 className="text-3xl font-bold text-foreground">Обзор финансов</h1>
          <p className="text-default-500 text-sm mt-1">Актуальные данные за последние {period} дней</p>
        </div>
        {/* Period selector */}
        <div className="relative">
          <button
            onClick={() => setPeriodOpen(!periodOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-content2 border border-divider text-sm font-medium hover:bg-content3 transition-colors"
          >
            За {period} дней <ChevronDown className="w-4 h-4 text-default-400" />
          </button>
          {periodOpen && (
            <div className="absolute right-0 mt-2 w-44 glass-dropdown rounded-xl py-1 z-50 shadow-lg animate-dropdown">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  onClick={() => { setPeriod(p); setPeriodOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-content2 transition-colors ${period === p ? 'text-primary font-medium' : 'text-foreground'}`}
                >
                  За {p} дней
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <MetricCard
              label="Баланс" value={stats.totalBalance.toLocaleString('ru-RU')} sub="₽ на счетах"
              icon={<Wallet className="w-6 h-6" />} iconBg="bg-primary/10 text-primary"
            />
            <MetricCard
              label="Доходы" value={stats.totalIncome.toLocaleString('ru-RU')}
              icon={<TrendingUp className="w-6 h-6" />} iconBg="bg-success/10 text-success"
            />
            <MetricCard
              label="Расходы" value={stats.totalExpense.toLocaleString('ru-RU')}
              icon={<TrendingDown className="w-6 h-6" />} iconBg="bg-[#FF3366]/10 text-[#FF3366]"
            />
            {/* Накоплено */}
            <div className="glass-card rounded-2xl p-5 hover-lift">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-default-500 font-medium uppercase tracking-wide">Накоплено</p>
                  <p className="text-2xl font-bold mt-1 text-foreground">
                    {saved.toLocaleString('ru-RU')}
                  </p>
                  <p className="text-xs text-default-400 mt-0.5">{savedPct}% от доходов</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-[#FFB800]/10 text-[#FFB800] flex items-center justify-center flex-shrink-0">
                  <PiggyBank className="w-6 h-6" />
                </div>
              </div>
              <div className="h-2 bg-content3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FFB800] rounded-full transition-all"
                  style={{ width: `${Math.min(savedPct, 100)}%` }}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="glass-card rounded-2xl p-6 lg:col-span-3">
          <h2 className="text-base font-semibold mb-5 text-foreground">Доходы и расходы</h2>
          {isLoading ? (
            <div className="h-60 shimmer rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} width={36} />
                <Tooltip
                  contentStyle={{ background: '#111113', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                  formatter={(value: number) => value.toLocaleString('ru-RU')}
                />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                <Line type="monotone" dataKey="income" name="Доходы" stroke="#00FFA3" strokeWidth={2} dot={{ r: 3, fill: '#00FFA3' }} />
                <Line type="monotone" dataKey="expense" name="Расходы" stroke="#FF3366" strokeWidth={2} dot={{ r: 3, fill: '#FF3366' }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-base font-semibold mb-5 text-foreground">Категории расходов</h2>
          {isLoading || categoryData.length === 0 ? (
            <div className="h-40 shimmer rounded-xl" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                    {categoryData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#111113', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }}
                    formatter={(v: number) => v.toLocaleString('ru-RU')}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {categoryData.map((c, i) => {
                  const total = categoryData.reduce((s, x) => s + x.value, 0);
                  const pct = Math.round((c.value / total) * 100);
                  return (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                        <span className="text-default-500">{c.name}</span>
                      </div>
                      <span className="font-medium text-foreground">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-foreground">Последние транзакции</h2>
          <Link href="/transactions" className="flex items-center gap-1 text-xs text-primary hover:underline font-medium">
            Все <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => <div key={i} className="h-12 shimmer rounded-xl" />)}
          </div>
        ) : recentTx.length === 0 ? (
          <p className="text-center text-default-400 py-8 text-sm">Транзакций пока нет</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-divider">
                  {['Дата', 'Категория', 'Описание', 'Сумма'].map((h) => (
                    <th key={h} className="text-left text-xs text-default-400 font-medium pb-3 pr-4 last:text-right">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentTx.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="border-b border-divider/40 hover:bg-content2/50 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 pr-4 text-default-400 whitespace-nowrap">
                      {formatDateUI(tx.transaction_date)}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="px-2.5 py-0.5 rounded-lg bg-content2 text-xs font-medium text-default-600">
                        {tx.category?.name ?? '—'}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 font-medium text-foreground">
                      {tx.merchant ?? tx.description ?? '—'}
                    </td>
                    <td className={`py-3.5 text-right font-semibold tabular-nums ${tx.transaction_type === 'income' ? 'text-success' : 'text-[#FF3366]'}`}>
                      {tx.transaction_type === 'income' ? '+' : '-'}
                      {Number(tx.amount).toLocaleString('ru-RU')} ₽
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedTx && (
        <TransactionDetailModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
      )}
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
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {sub && <p className="text-xs text-default-400 mt-1">{sub}</p>}
    </div>
  );
}
