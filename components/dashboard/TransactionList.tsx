"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";

interface Transaction {
  id: number;
  date: string;
  merchant: string;
  amount: number;
  category: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({
  transactions,
}: TransactionListProps) {
  return (
    <Card className="glass-card animate-slide-up">
      <CardHeader>
        <h2 className="text-2xl font-bold">Последние транзакции</h2>
      </CardHeader>
      <CardBody>
        <Table
          removeWrapper
          aria-label="Таблица транзакций"
          classNames={{
            base: "bg-transparent",
            th: "bg-content2 text-default-600 font-semibold",
            td: "text-default-700 dark:text-default-300",
          }}
        >
          <TableHeader>
            <TableColumn>ДАТА</TableColumn>
            <TableColumn>КОНТРАГЕНТ</TableColumn>
            <TableColumn>КАТЕГОРИЯ</TableColumn>
            <TableColumn align="end">СУММА</TableColumn>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} className="hover:bg-content2 transition-colors">
                <TableCell>{tx.date}</TableCell>
                <TableCell className="font-medium">{tx.merchant}</TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat">
                    {tx.category}
                  </Chip>
                </TableCell>
                <TableCell>
                  <span
                    className={`font-semibold ${
                      tx.amount > 0
                        ? "text-[#00FFA3]"
                        : "text-[#FF3366]"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : ""}
                    {Math.abs(tx.amount).toLocaleString("ru-RU")} ₽
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
