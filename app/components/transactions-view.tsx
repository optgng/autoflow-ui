'use client';

import { useState } from "react";
import {
  Card, CardBody,
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Chip, Input, Pagination,
} from "@heroui/react";
import { Search } from "lucide-react";
import { transactions, type TransactionType } from "../data/mock-data";

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);

const categoryColors: Record<string, string> = {
  "Еда": "#10b981",
  "Транспорт": "#3b82f6",
  "Подписки": "#8b5cf6",
  "Здоровье": "#f59e0b",
  "Развлечения": "#ec4899",
  "Быт": "#06b6d4",
  "Зарплата": "#10b981",
  "Фриланс": "#0ea5e9",
};

const ROWS_PER_PAGE = 8;

export default function TransactionsView() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = transactions.filter(
    (tx) =>
      tx.merchant.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-zinc-500 text-sm mb-1">История операций</p>
        <h1 className="text-3xl font-bold text-white">
          <span className="gradient-text">Транзакции</span>
        </h1>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 mb-1">Всего операций</p>
          <p className="text-xl font-bold text-white">{transactions.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 mb-1">Поступления</p>
          <p className="text-xl font-bold text-emerald-400">{fmt(income)}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 mb-1">Списания</p>
          <p className="text-xl font-bold text-red-400">{fmt(expense)}</p>
        </div>
      </div>

      <Card className="bg-zinc-900 border border-zinc-800 shadow-none">
        <CardBody className="p-4">
          <div className="mb-4">
            <Input
              placeholder="Поиск по контрагенту или категории..."
              value={search}
              onValueChange={(v) => { setSearch(v); setPage(1); }}
              startContent={<Search className="w-4 h-4 text-zinc-500" />}
              classNames={{
                base: "max-w-sm",
                inputWrapper: "bg-zinc-800 border-zinc-700 hover:bg-zinc-800",
                input: "text-sm text-zinc-200",
              }}
              variant="bordered"
              size="sm"
            />
          </div>
          <Table
            removeWrapper
            aria-label="Транзакции"
            classNames={{
              th: "bg-zinc-800/50 text-zinc-400 text-xs font-medium uppercase",
              td: "py-3 border-b border-zinc-800/40",
              tr: "last:border-0",
            }}
          >
            <TableHeader>
              <TableColumn>ДАТА</TableColumn>
              <TableColumn>КОНТРАГЕНТ</TableColumn>
              <TableColumn>КАТЕГОРИЯ</TableColumn>
              <TableColumn>ТИП</TableColumn>
              <TableColumn align="end">СУММА</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Ничего не найдено">
              {paginated.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>
                    <span className="text-xs text-zinc-500">{tx.date}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-white">{tx.merchant}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: categoryColors[tx.category] ?? '#71717a' }}
                      />
                      <span className="text-xs text-zinc-300">{tx.category}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={tx.type === "income" ? "success" : "danger"}
                      classNames={{ content: "text-xs font-medium" }}
                    >
                      {tx.type === "income" ? "Доход" : "Расход"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm font-bold ${
                      tx.type === "income" ? "text-emerald-400" : "text-red-400"
                    }`}>
                      {tx.type === "income" ? "+" : "-"}{fmt(tx.amount)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination
                total={totalPages}
                page={page}
                onChange={setPage}
                color="primary"
                size="sm"
                classNames={{ cursor: "bg-sky-500" }}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}