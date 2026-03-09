"use client";

import { Card, CardBody } from "@heroui/react";
import { Wallet, TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

// Маппинг строковых идентификаторов на компоненты иконок
const iconMap: Record<string, LucideIcon> = {
  wallet: Wallet,
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
};

interface StatCardProps {
  label: string;
  value: string;
  change: number;
  trend: "up" | "down";
  icon: "wallet" | "trending-up" | "trending-down";  // ← Строка, а не компонент
  color: "primary" | "success" | "danger";
}

export default function StatCard({
  label,
  value,
  change,
  trend,
  icon,
  color,
}: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Получаем компонент иконки из маппинга
  const Icon = iconMap[icon];

  const colorClasses = {
    primary: "text-[#00E5FF] bg-[#00E5FF]/10",
    success: "text-[#00FFA3] bg-[#00FFA3]/10",
    danger: "text-[#FF3366] bg-[#FF3366]/10",
  };

  const glowClasses = {
    primary: "glow-primary",
    success: "glow-success",
    danger: "glow-danger",
  };

  return (
    <Card
      className={`glass-card hover-lift card-hover-glow transition-all ${
        isVisible ? "animate-scale-in" : "opacity-0"
      }`}
    >
      <CardBody className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-default-500 mb-1">{label}</p>
            <h3 className="text-3xl font-bold mb-2">{value}</h3>
            <div className="flex items-center gap-1">
              {trend === "up" ? (
                <span className="text-[#00FFA3] text-sm font-medium">
                  ↗ +{Math.abs(change)}%
                </span>
              ) : (
                <span className="text-[#FF3366] text-sm font-medium">
                  ↘ {change}%
                </span>
              )}
              <span className="text-xs text-default-400 ml-1">за месяц</span>
            </div>
          </div>
          <div
            className={`w-14 h-14 rounded-xl ${colorClasses[color]} flex items-center justify-center ${glowClasses[color]}`}
          >
            <Icon className="w-7 h-7" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
