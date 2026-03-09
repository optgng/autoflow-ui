'use client';
import { Card, CardBody } from "@heroui/react";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Настройки ⚙️</h1>
        <p className="text-default-500">Управление профилем и автоматизацией</p>
      </div>

      <Card className="glass-card">
        <CardBody className="p-12 text-center">
          <p className="text-xl text-default-500">
            🚧 Настройки в разработке...
          </p>
          <p className="text-sm text-default-400 mt-2">
            Здесь будут настройки профиля, бюджетов и автоматизации
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
