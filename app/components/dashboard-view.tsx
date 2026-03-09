"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Progress,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@heroui/react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { transactions, budgets, summaryData } from "../data/mock-data";

export function DashboardView() {
  const recentTransactions = transactions.slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dashboard</h2>
        <p className="text-default-500">Welcome back! Here is your financial overview.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
          <CardBody className="gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-default-500">Total Balance</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {formatCurrency(summaryData.totalBalance)}
            </p>
            <p className="text-xs text-success">+2.5% from last month</p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-success/20 to-success/5 border border-success/20">
          <CardBody className="gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-default-500">Monthly Income</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {formatCurrency(summaryData.monthlyIncome)}
            </p>
            <p className="text-xs text-success">+12.3% from last month</p>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-danger/20 to-danger/5 border border-danger/20">
          <CardBody className="gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-default-500">Monthly Expenses</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-danger/20">
                <TrendingDown className="h-5 w-5 text-danger" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {formatCurrency(summaryData.monthlyExpenses)}
            </p>
            <p className="text-xs text-danger">-8.1% from last month</p>
          </CardBody>
        </Card>
      </div>

      {/* Budget Progress */}
      <Card>
        <CardHeader className="flex-col items-start gap-1">
          <h3 className="text-lg font-semibold text-foreground">Budget Progress</h3>
          <p className="text-sm text-default-500">Track your spending limits</p>
        </CardHeader>
        <CardBody className="gap-5">
          {budgets.map((budget) => (
            <div key={budget.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {budget.category}
                </span>
                <span className="text-sm text-default-500">
                  {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                </span>
              </div>
              <Progress
                value={(budget.spent / budget.limit) * 100}
                color={budget.color as "warning" | "danger" | "primary" | "success"}
                className="h-2"
                aria-label={`${budget.category} budget progress`}
              />
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex-col items-start gap-1">
          <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
          <p className="text-sm text-default-500">Your latest 5 transactions</p>
        </CardHeader>
        <CardBody>
          <Table aria-label="Recent transactions table" removeWrapper>
            <TableHeader>
              <TableColumn>DATE</TableColumn>
              <TableColumn>MERCHANT</TableColumn>
              <TableColumn>CATEGORY</TableColumn>
              <TableColumn>TYPE</TableColumn>
              <TableColumn className="text-right">AMOUNT</TableColumn>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="text-default-500">
                    {new Date(transaction.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="font-medium">{transaction.merchant}</TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat">
                      {transaction.category}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      color={transaction.type === "Income" ? "success" : "danger"}
                      variant="flat"
                    >
                      {transaction.type}
                    </Chip>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        transaction.type === "Income"
                          ? "text-success font-semibold"
                          : "text-danger font-semibold"
                      }
                    >
                      {transaction.type === "Income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
