"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import {
  mockMonthlyData,
  mockTopMerchants,
  mockBalanceData,
} from "@/lib/mock-data";
import { ChevronDown, RefreshCw, Bot } from "lucide-react";

const AI_RECS = [
  "Вы потратили на такси на 23% больше, чем в среднем. Попробуйте использовать метро — это сэкономит до 4 000 ₽/мес.",
  "Расходы на супермаркеты составляют 8% дохода. Список покупок поможет снизить спонтанные траты на 15%.",
  "У вас есть 92 450 ₽ свободных средств. Рассмотрите открытие накопительного счёта под 12% годовых — это +11 094 ₽ в год.",
  "В марте вы тратили больше всего в пятницу и субботу. Планируйте крупные покупки на будни, когда акций больше.",
];

const ACCOUNTS = ["Все счета", "Сбер Зарплатная", "Тинькофф Карта"];
const CATEGORIES = [
  "Все категории",
  "Супермаркеты",
  "Такси",
  "Кафе",
  "ЖКХ",
  "Развлечения",
  "Покупки",
];

export default function AnalyticsPage() {
  const [account, setAccount] = useState("Все счета");
  const [category, setCategory] = useState("Все категории");
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [recIndex, setRecIndex] = useState(0);

  const handleRefreshRecs = async () => {
    setLoadingRecs(true);
    await new Promise((r) => setTimeout(r, 1500));
    setRecIndex((i) => (i + 1) % AI_RECS.length);
    setLoadingRecs(false);
  };

  const maxMerchant = Math.max(...mockTopMerchants.map((m) => m.total));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="text-xs text-default-400 mb-1">
            <span>Dashboard</span>
            <span className="mx-1.5">/</span>
            <span className="text-foreground">Аналитика</span>
          </nav>
          <h1 className="text-3xl font-bold text-foreground text-balance">Аналитика</h1>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <SelectFilter
            value={account}
            options={ACCOUNTS}
            onChange={setAccount}
          />
          <SelectFilter
            value={category}
            options={CATEGORIES}
            onChange={setCategory}
          />
        </div>
      </div>

      {/* Charts row 1: Monthly comparison + top merchants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Monthly bar chart */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-base font-semibold mb-5 text-foreground">
            Сравнение месяцев
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={mockMonthlyData} barCategoryGap="30%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="month"
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
              <Bar dataKey="income" fill="#00FFA3" radius={[4, 4, 0, 0]} name="income" />
              <Bar dataKey="expense" fill="#FF3366" radius={[4, 4, 0, 0]} name="expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top merchants horizontal bar */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-base font-semibold mb-5 text-foreground">
            Топ-8 мест трат
          </h2>
          <div className="space-y-3">
            {mockTopMerchants.map((m, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-default-600 truncate pr-2">{m.merchant}</span>
                  <span className="font-semibold text-foreground tabular-nums flex-shrink-0">
                    {m.total.toLocaleString("ru-RU")} ₽
                  </span>
                </div>
                <div className="h-2 bg-content3 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00E5FF] rounded-full transition-all"
                    style={{ width: `${(m.total / maxMerchant) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Balance dynamics area chart */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-base font-semibold mb-5 text-foreground">
          Динамика баланса
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={mockBalanceData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#00E5FF" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: "#111113",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: 12,
              }}
              formatter={(value: number) => [`${value.toLocaleString("ru-RU")} ₽`, "Баланс"]}
              labelStyle={{ color: "#9CA3AF" }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#00E5FF"
              strokeWidth={2}
              fill="url(#balanceGradient)"
              dot={{ r: 3, fill: "#00E5FF" }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AI Recommendations */}
      <div className="glass-card rounded-2xl p-6 border border-[#00E5FF]/20">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <h2 className="text-base font-semibold text-foreground">
              Персональные рекомендации
            </h2>
          </div>
          <button
            onClick={handleRefreshRecs}
            disabled={loadingRecs}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-content2 hover:bg-content3 transition-colors text-sm font-medium disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${loadingRecs ? "animate-spin" : ""}`} />
            {loadingRecs ? "Анализируем..." : "Обновить"}
          </button>
        </div>
        <div className="space-y-3">
          {loadingRecs ? (
            <>
              <SkeletonLine width="90%" />
              <SkeletonLine width="75%" />
              <SkeletonLine width="85%" />
            </>
          ) : (
            [AI_RECS[recIndex], AI_RECS[(recIndex + 1) % AI_RECS.length]].map(
              (rec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl bg-content2"
                >
                  <span className="text-[#00E5FF] text-sm font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-default-600 leading-relaxed">{rec}</p>
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}

function SelectFilter({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-content2 border border-divider text-sm font-medium hover:bg-content3 transition-colors whitespace-nowrap"
      >
        {value}
        <ChevronDown className="w-3.5 h-3.5 text-default-400" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl py-1 z-50 shadow-lg">
          {options.map((o) => (
            <button
              key={o}
              onClick={() => {
                onChange(o);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-content2 transition-colors ${
                o === value ? "text-[#00E5FF] font-medium" : "text-foreground"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SkeletonLine({ width }: { width: string }) {
  return (
    <div
      className="h-5 bg-content2 rounded-lg shimmer"
      style={{ width }}
    />
  );
}
