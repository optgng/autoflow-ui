'use client';

import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, Legend,
  ResponsiveContainer,
} from "recharts";
import { monthlyData, categoryExpenses } from "../data/mock-data";

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 shadow-xl">
        <p className="text-zinc-400 text-xs mb-2">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
            {p.name}: {fmt(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsView() {
  const totalExpenses = categoryExpenses.reduce((s, c) => s + c.value, 0);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-zinc-500 text-sm mb-1">Анализ за период</p>
        <h1 className="text-3xl font-bold text-white">
          <span className="gradient-text">Аналитика</span> финансов
        </h1>
      </div>

      {/* Monthly Bar Chart */}
      <Card className="bg-zinc-900 border border-zinc-800 shadow-none">
        <CardHeader className="px-6 pt-6 pb-2">
          <div>
            <h2 className="text-base font-semibold text-white">Доходы и расходы</h2>
            <p className="text-xs text-zinc-500">Последние 7 месяцев</p>
          </div>
        </CardHeader>
        <CardBody className="px-4 pb-6">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fill: '#71717a', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" name="Доходы" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Расходы" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="bg-zinc-900 border border-zinc-800 shadow-none">
          <CardHeader className="px-6 pt-6 pb-2">
            <div>
              <h2 className="text-base font-semibold text-white">Расходы по категориям</h2>
              <p className="text-xs text-zinc-500">Текущий месяц</p>
            </div>
          </CardHeader>
          <CardBody className="pb-6">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categoryExpenses}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryExpenses.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [fmt(value), ""]}
                  contentStyle={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* Category Breakdown */}
        <Card className="bg-zinc-900 border border-zinc-800 shadow-none">
          <CardHeader className="px-6 pt-6 pb-2">
            <h2 className="text-base font-semibold text-white">Расшифровка</h2>
          </CardHeader>
          <CardBody className="px-6 pb-6 space-y-3">
            {categoryExpenses.map((cat, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: cat.color }}
                  />
                  <span className="text-sm text-zinc-300">{cat.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500">
                    {Math.round((cat.value / totalExpenses) * 100)}%
                  </span>
                  <span className="text-sm font-semibold text-white w-28 text-right">
                    {fmt(cat.value)}
                  </span>
                </div>
              </div>
            ))}
            <div className="border-t border-zinc-800 pt-3 flex justify-between">
              <span className="text-sm text-zinc-400">Итого</span>
              <span className="text-sm font-bold text-white">{fmt(totalExpenses)}</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}