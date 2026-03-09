"use client";

import { Button } from "@heroui/react";
import {
  LayoutDashboard,
  TrendingUp,
  Receipt,
  Settings,
  Wallet,
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: "Дашборд", href: "/dashboard" },
    { icon: TrendingUp, label: "Аналитика", href: "/analytics" },
    { icon: Receipt, label: "Транзакции", href: "/transactions" },
    { icon: Settings, label: "Настройки", href: "/settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-content1 border-r border-divider flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-divider">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Wallet className="w-6 h-6 text-background" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text-primary">AutoFlow</h1>
            <p className="text-xs text-default-500">Finance Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 custom-scrollbar overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                fullWidth
                variant={isActive ? "flat" : "light"}
                color={isActive ? "primary" : "default"}
                startContent={<Icon className="w-5 h-5" />}
                className={`justify-start text-base transition-all ${
                  isActive
                    ? "font-semibold shadow-glow-sm"
                    : "font-normal hover:bg-content2"
                }`}
              >
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle & User Info */}
      <div className="p-4 border-t border-divider space-y-3">
        {/* Theme Switcher */}
        {mounted && (
          <Button
            fullWidth
            variant="flat"
            color="default"
            startContent={
              theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )
            }
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="justify-start"
          >
            {theme === "dark" ? "Светлая тема" : "Тёмная тема"}
          </Button>
        )}

        {/* User Profile */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-content2 hover:bg-content3 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-success flex items-center justify-center">
            <span className="text-sm font-bold text-background">DU</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">DevOps User</p>
            <p className="text-xs text-default-500 truncate">user@autoflow.dev</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
