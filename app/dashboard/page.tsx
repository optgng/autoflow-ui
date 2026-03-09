"use client";

import { useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  mockChartData,
  mockCategoryExpenses,
  mockTransactions,
  type Transaction,
} from "@/lib/mock-data";
import TransactionDetailModal from "@/components/dashboard/TransactionDetailModal";
import Link from "next/link";

const PERIODS = ["Последние 7 дней", "Текущий месяц", "Квартал"] as const;

export default function DashboardPage() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("Текущий месяц");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const totalIncome = 180000;
  const totalExpense = 87550;
  const totalBalance = 252450;
  const saved = totalIncome - totalExpense;
  const savedPct = Math.round((saved / totalIncome) * 100);

  const recentTx = mockTransactions.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-xs text-default-400 mb-1">
            <span>Dashboard</span>
          </nav>
          <h1 className="text-3xl font-bold text-foreground text-balance">
            Добро пожаловать, AutoFlow User
          </h1>
          <p className="text-default-500 text-sm mt-1">Обзор ваших финансов</p>
        </div>
        {/* Period selector */}
        <div className="relative">
          <button
            onClick={() => setPeriodOpen(!periodOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-content2 border border-divider text-sm font-medium hover:bg-content3 transition-colors"
          >
            {period}
            <ChevronDown className="w-4 h-4 text-default-400" />
          </button>
          {periodOpen && (
            <div className="absolute right-0 mt-2 w-52 glass-card rounded-xl py-1 z-50 shadow-lg">
              {PERIODS.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPeriod(p);
                    setPeriodOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-content2 transition-colors ${
                    p === period ? "text-[#00E5FF] font-medium" : "text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Balance */}
        <MetricCard
          label="Общий баланс"
          value={`${totalBalance.toLocaleString("ru-RU")} ₽`}
          sub="на всех счетах"
          icon={<Wallet className="w-6 h-6" />}
          iconBg="bg-[#00E5FF]/10 text-[#00E5FF]"
        />
        {/* Income */}
        <MetricCard
          label="Доходы"
          value={`${totalIncome.toLocaleString("ru-RU")} ₽`}
          badge="+12% к прошлому месяцу"
          badgeColor="text-[#00FFA3]"
          icon={<TrendingUp className="w-6 h-6" />}
          iconBg="bg-[#00FFA3]/10 text-[#00FFA3]"
        />
        {/* Expense */}
        <MetricCard
          label="Расходы"
          value={`${totalExpense.toLocaleString("ru-RU")} ₽`}
          badge="-8% к прошлому месяцу"
          badgeColor="text-[#FF3366]"
          icon={<TrendingDown className="w-6 h-6" />}
          iconBg="bg-[#FF3366]/10 text-[#FF3366]"
        />
        {/* Saved */}
        <div className="glass-card rounded-2xl p-5 hover-lift">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-default-500 font-medium uppercase tracking-wide">
                Сэкономлено
              </p>
              <p className="text-2xl font-bold mt-1 text-foreground">
                {saved.toLocaleString("ru-RU")} ₽
              </p>
              <p className="text-xs text-default-400 mt-0.5">{savedPct}% от дохода</p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-[#FFB800]/10 text-[#FFB800] flex items-center justify-center flex-shrink-0">
              <PiggyBank className="w-6 h-6" />
            </div>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-content3 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FFB800] rounded-full transition-all"
              style={{ width: `${savedPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Line chart */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-3">
          <h2 className="text-base font-semibold mb-5 text-foreground">
            Динамика доходов и расходов
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={mockChartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#9CA3AF", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#9CA3AF", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                width={36}
              />
              <Tooltip
                contentStyle={{
                  background: "#111113",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  fontSize: 12,
                }}
                formatter={(value: number) => [`${value.toLocaleString("ru-RU")} ₽`]}
                labelStyle={{ color: "#9CA3AF" }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: "12px" }}
                formatter={(v) => (v === "income" ? "Доходы" : "Расходы")}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#00FFA3"
                strokeWidth={2}
                dot={{ r: 3, fill: "#00FFA3" }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#FF3366"
                strokeWidth={2}
                dot={{ r: 3, fill: "#FF3366" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-base font-semibold mb-5 text-foreground">
            Расходы по категориям
          </h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={mockCategoryExpenses}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {mockCategoryExpenses.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#111113",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  fontSize: 12,
                }}
                formatter={(value: number) => [`${value.toLocaleString("ru-RU")} ₽`]}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="space-y-2 mt-3">
            {mockCategoryExpenses.map((c, i) => {
              const total = mockCategoryExpenses.reduce((s, x) => s + x.value, 0);
              const pct = Math.round((c.value / total) * 100);
              return (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: c.color }}
                    />
                    <span className="text-default-500">{c.name}</span>
                  </div>
                  <span className="font-medium text-foreground">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-foreground">Последние операции</h2>
          <Link
            href="/transactions"
            className="flex items-center gap-1 text-xs text-[#00E5FF] hover:underline font-medium"
          >
            Все транзакции
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-divider">
                <th className="text-left text-xs text-default-400 font-medium pb-3 pr-4">
                  Дата и время
                </th>
                <th className="text-left text-xs text-default-400 font-medium pb-3 pr-4">
                  Категория
                </th>
                <th className="text-left text-xs text-default-400 font-medium pb-3 pr-4">
                  Место покупки
                </th>
                <th className="text-right text-xs text-default-400 font-medium pb-3">
                  Сумма
                </th>
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
                    {tx.date} {tx.time}
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="px-2.5 py-0.5 rounded-lg bg-content2 text-xs font-medium text-default-600">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 font-medium text-foreground">{tx.merchant}</td>
                  <td className="py-3.5 text-right font-semibold tabular-nums">
                    <span
                      className={tx.amount > 0 ? "text-[#00FFA3]" : "text-[#FF3366]"}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {tx.amount.toLocaleString("ru-RU")} ₽
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedTx && (
        <TransactionDetailModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
      )}
    </div>
  );
}

// ─── MetricCard sub-component ────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  sub,
  badge,
  badgeColor,
  icon,
  iconBg,
}: {
  label: string;
  value: string;
  sub?: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <div className="glass-card rounded-2xl p-5 hover-lift">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-default-500 font-medium uppercase tracking-wide">{label}</p>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {sub && <p className="text-xs text-default-400 mt-1">{sub}</p>}
      {badge && (
        <p className={`text-xs mt-1 font-medium ${badgeColor}`}>{badge}</p>
      )}
    </div>
  );
}
