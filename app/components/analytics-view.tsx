"use client";

import { Card, CardBody, CardHeader, Select, SelectItem } from "@heroui/react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { monthlyData, expenseByCategory } from "../data/mock-data";

const COLORS = ["#f5a524", "#f31260", "#006fee", "#17c964", "#9353d3"];

export function AnalyticsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
        <p className="text-default-500">Detailed insights into your financial data.</p>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-wrap items-center gap-4">
            <Select
              label="Time Period"
              placeholder="Select period"
              defaultSelectedKeys={["6months"]}
              className="max-w-xs"
              size="sm"
            >
              <SelectItem key="1month">Last Month</SelectItem>
              <SelectItem key="3months">Last 3 Months</SelectItem>
              <SelectItem key="6months">Last 6 Months</SelectItem>
              <SelectItem key="1year">Last Year</SelectItem>
            </Select>
            <Select
              label="Category"
              placeholder="All Categories"
              className="max-w-xs"
              size="sm"
            >
              <SelectItem key="all">All Categories</SelectItem>
              <SelectItem key="food">Food</SelectItem>
              <SelectItem key="transport">Transport</SelectItem>
              <SelectItem key="subscriptions">Subscriptions</SelectItem>
              <SelectItem key="shopping">Shopping</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pie Chart - Expense Distribution */}
        <Card>
          <CardHeader className="flex-col items-start gap-1">
            <h3 className="text-lg font-semibold text-foreground">
              Expense Distribution
            </h3>
            <p className="text-sm text-default-500">Breakdown by category</p>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  dataKey="value"
                >
                  {expenseByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) =>
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(value)
                  }
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {expenseByCategory.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-default-500">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Bar Chart - Income vs Expenses */}
        <Card>
          <CardHeader className="flex-col items-start gap-1">
            <h3 className="text-lg font-semibold text-foreground">
              Income vs Expenses
            </h3>
            <p className="text-sm text-default-500">Last 6 months comparison</p>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis dataKey="month" stroke="#71717a" />
                <YAxis stroke="#71717a" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) =>
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(value)
                  }
                />
                <Legend />
                <Bar
                  dataKey="income"
                  fill="#17c964"
                  name="Income"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expenses"
                  fill="#f31260"
                  name="Expenses"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardBody className="text-center">
            <p className="text-sm text-default-500">Avg. Monthly Income</p>
            <p className="text-2xl font-bold text-success">$5,199</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-sm text-default-500">Avg. Monthly Expenses</p>
            <p className="text-2xl font-bold text-danger">$3,892</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-sm text-default-500">Savings Rate</p>
            <p className="text-2xl font-bold text-primary">25.1%</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-sm text-default-500">Top Category</p>
            <p className="text-2xl font-bold text-warning">Shopping</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
