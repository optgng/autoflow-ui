"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Input,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import { Search, Download, Filter } from "lucide-react";
import { transactions } from "../data/mock-data";

const categoryColors: Record<string, "warning" | "danger" | "primary" | "success" | "secondary"> = {
  Food: "warning",
  Transport: "danger",
  Subscriptions: "primary",
  Shopping: "success",
  Income: "secondary",
  Entertainment: "secondary",
};

export function TransactionsView() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Transactions</h2>
          <p className="text-default-500">View and manage all your transactions.</p>
        </div>
        <Button color="primary" startContent={<Download className="h-4 w-4" />}>
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardBody>
          <div className="flex flex-wrap items-end gap-4">
            <Input
              placeholder="Search transactions..."
              startContent={<Search className="h-4 w-4 text-default-400" />}
              className="max-w-xs"
              size="sm"
            />
            <Select
              label="Category"
              placeholder="All"
              className="max-w-[150px]"
              size="sm"
            >
              <SelectItem key="all">All</SelectItem>
              <SelectItem key="food">Food</SelectItem>
              <SelectItem key="transport">Transport</SelectItem>
              <SelectItem key="subscriptions">Subscriptions</SelectItem>
              <SelectItem key="shopping">Shopping</SelectItem>
              <SelectItem key="income">Income</SelectItem>
            </Select>
            <Select
              label="Type"
              placeholder="All"
              className="max-w-[150px]"
              size="sm"
            >
              <SelectItem key="all">All</SelectItem>
              <SelectItem key="income">Income</SelectItem>
              <SelectItem key="expense">Expense</SelectItem>
            </Select>
            <Button
              variant="flat"
              startContent={<Filter className="h-4 w-4" />}
              size="sm"
            >
              More Filters
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader className="flex-col items-start gap-1">
          <h3 className="text-lg font-semibold text-foreground">
            All Transactions
          </h3>
          <p className="text-sm text-default-500">
            {transactions.length} transactions found
          </p>
        </CardHeader>
        <CardBody>
          <Table aria-label="Transactions table" removeWrapper>
            <TableHeader>
              <TableColumn>DATE</TableColumn>
              <TableColumn>MERCHANT</TableColumn>
              <TableColumn>CATEGORY</TableColumn>
              <TableColumn>TYPE</TableColumn>
              <TableColumn className="text-right">AMOUNT</TableColumn>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-default-100">
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">
                        {new Date(transaction.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-default-400">
                        {new Date(transaction.date).toLocaleDateString("en-US", {
                          weekday: "long",
                        })}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-foreground">
                      {transaction.merchant}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      color={categoryColors[transaction.category] || "default"}
                      variant="flat"
                    >
                      {transaction.category}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      color={transaction.type === "Income" ? "success" : "danger"}
                      variant="dot"
                    >
                      {transaction.type}
                    </Chip>
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`text-lg font-semibold ${
                        transaction.type === "Income"
                          ? "text-success"
                          : "text-danger"
                      }`}
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
