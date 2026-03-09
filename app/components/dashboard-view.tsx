'use client';

import {
  Card, CardBody, CardHeader,
  Progress,
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Chip,
} from "@heroui/react";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { stats, budgets, transactions } from "../data/mock-data";

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);

export default function DashboardView() {
  const statCards = [
    {
      label: "Баланс",
      value: fmt(stats.balance),
      change: "+12.5%",
      trend: "up" as const,
      icon: Wallet,
      accent: "from-sky-500 to-blue-600",
      glow: "glow-blue",
      textColor: "text-sky-400",
    },
    {
      label: "Доходы за март",
      value: fmt(stats.monthlyIncome),
      change: "+8.2%",
      trend: "up" as const,
      icon: TrendingUp,
      accent: "from-emerald-500 to-green-600",
      glow: "glow-green",
      textColor: "text-emerald-400",
    },
    {
      label: "Расходы за март",
      value: fmt(stats.monthlyExpenses),
      change: "-3.1%",
      trend: "down" as const,
      icon: TrendingDown,
      accent: "from-red-500 to-rose-600",
      glow: "glow-red",
      textColor: "text-red-400",
    },
    {
      label: "Норма сбережений",
      value: `${stats.savingsRate}%`,
      change: "+4.3%",
      trend: "up" as const,
      icon: PiggyBank,
      accent: "from-violet-500 to-purple-600",
      glow: "glow-blue",
      textColor: "text-violet-400",
    },
  ];

  const recent = transactions.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-zinc-500 text-sm mb-1">Понедельник, 09 марта 2026</p>
        <h1 className="text-3xl font-bold text-white">
          Обзор <span className="gradient-text">финансов</span>
        </h1>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={i} className="bg-zinc-900 border border-zinc-800 shadow-none">
              <CardBody className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.accent} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${
                    s.trend === "up" ? "text-emerald-400" : "text-red-400"
                  }`}>
                    {s.trend === "up"
                      ? <ArrowUpRight className="w-3.5 h-3.5" />
                      : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {s.change}
                  </div>
                </div>
                <p className="text-zinc-400 text-xs mb-1">{s.label}</p>
                <p className="text-white text-xl font-bold tracking-tight">{s.value}</p>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Budget Progress */}
        <Card className="lg:col-span-2 bg-zinc-900 border border-zinc-800 shadow-none">
          <CardHeader className="px-6 pt-6 pb-2">
            <h2 className="text-base font-semibold text-white">Бюджеты</h2>
          </CardHeader>
          <CardBody className="px-6 pb-6 space-y-5">
            {budgets.map((b, i) => {
              const pct = Math.round((b.spent / b.limit) * 100);
              return (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-zinc-300">{b.category}</span>
                    <span className="text-xs text-zinc-500">
                      {fmt(b.spent)} / {fmt(b.limit)}
                    </span>
                  </div>
                  <Progress
                    value={pct}
                    color={b.color}
                    size="sm"
                    className="w-full"
                  />
                  <p className="text-xs text-zinc-600 mt-1 text-right">{pct}%</p>
                </div>
              );
            })}
          </CardBody>
        </Card>

        {/* Recent Transactions */}
        <Card className="lg:col-span-3 bg-zinc-900 border border-zinc-800 shadow-none">
          <CardHeader className="px-6 pt-6 pb-2 flex justify-between items-center">
            <h2 className="text-base font-semibold text-white">Последние операции</h2>
          </CardHeader>
          <CardBody className="px-2 pb-4">
            <Table
              removeWrapper
              aria-label="Транзакции"
              classNames={{
                th: "bg-zinc-800/50 text-zinc-400 text-xs font-medium",
                td: "py-3",
                tr: "border-b border-zinc-800/50 last:border-0",
              }}
            >
              <TableHeader>
                <TableColumn>КОНТРАГЕНТ</TableColumn>
                <TableColumn>КАТЕГОРИЯ</TableColumn>
                <TableColumn align="end">СУММА</TableColumn>
              </TableHeader>
              <TableBody>
                {recent.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div>
                        <p className="text-sm text-white font-medium">{tx.merchant}</p>
                        <p className="text-xs text-zinc-500">{tx.date}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="sm"
                        variant="flat"
                        classNames={{ base: "bg-zinc-800", content: "text-zinc-300 text-xs" }}
                      >
                        {tx.category}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-semibold ${
                        tx.type === "income" ? "text-emerald-400" : "text-red-400"
                      }`}>
                        {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}