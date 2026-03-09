import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import BudgetProgress from "@/components/dashboard/BudgetProgress";
import TransactionList from "@/components/dashboard/TransactionList";
import { mockStats, mockBudgets, mockTransactions } from "@/lib/mock-data";

export default function DashboardPage() {
  const icons = [Wallet, TrendingUp, TrendingDown];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Добро пожаловать! 👋</h1>
        <p className="text-default-500">Вот обзор ваших финансов за март 2026</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockStats.map((stat, idx) => (
          <StatCard
            key={idx}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={icons[idx]}
            color={stat.color}
          />
        ))}
      </div>

      {/* Budget & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetProgress budgets={mockBudgets} />
        <TransactionList transactions={mockTransactions.slice(0, 5)} />
      </div>
    </div>
  );
}
