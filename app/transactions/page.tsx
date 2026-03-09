'use client';
import { Card, CardBody } from "@heroui/react";

export default function TransactionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Транзакции 💳</h1>
        <p className="text-default-500">Полная история ваших операций</p>
      </div>

      <Card className="glass-card">
        <CardBody className="p-12 text-center">
          <p className="text-xl text-default-500">
            🚧 Таблица транзакций в разработке...
          </p>
          <p className="text-sm text-default-400 mt-2">
            Здесь будет полная таблица с фильтрами, поиском и экспортом
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
