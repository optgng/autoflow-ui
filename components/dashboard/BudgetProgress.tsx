"use client";

import { Card, CardBody, CardHeader, Progress } from "@heroui/react";

interface BudgetItem {
  category: string;
  spent: number;
  limit: number;
  color: "success" | "warning" | "danger";
}

interface BudgetProgressProps {
  budgets: BudgetItem[];
}

export default function BudgetProgress({ budgets }: BudgetProgressProps) {
  return (
    <Card className="glass-card animate-slide-up">
      <CardHeader>
        <h2 className="text-2xl font-bold">Бюджет по категориям</h2>
      </CardHeader>
      <CardBody className="space-y-6">
        {budgets.map((budget, idx) => {
          const percentage = (budget.spent / budget.limit) * 100;
          return (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{budget.category}</span>
                <span className="text-sm text-default-500">
                  {budget.spent.toLocaleString("ru-RU")} ₽ /{" "}
                  {budget.limit.toLocaleString("ru-RU")} ₽
                </span>
              </div>
              <Progress
                value={percentage}
                color={budget.color}
                size="md"
                className="w-full"
                classNames={{
                  indicator: percentage > 90 ? "animate-glow-pulse" : "",
                }}
              />
              <div className="flex justify-between items-center text-xs text-default-400">
                <span>{percentage.toFixed(0)}% использовано</span>
                <span>
                  Осталось: {(budget.limit - budget.spent).toLocaleString("ru-RU")} ₽
                </span>
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
