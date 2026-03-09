import { Card, CardBody } from "@heroui/react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Аналитика 📊</h1>
        <p className="text-default-500">Детальный анализ ваших финансов</p>
      </div>

      <Card className="glass-card">
        <CardBody className="p-12 text-center">
          <p className="text-xl text-default-500">
            🚧 Экран аналитики в разработке...
          </p>
          <p className="text-sm text-default-400 mt-2">
            Здесь будут графики доходов/расходов, распределение по категориям и тренды
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
