"use client";

import { Button } from "@heroui/react";
import {
  LayoutDashboard,
  TrendingUp,
  Receipt,
  Settings,
  Wallet,
  Building2,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: TrendingUp, label: "Аналитика", href: "/analytics" },
    { icon: Receipt, label: "Транзакции", href: "/transactions" },
    { icon: Building2, label: "Счета", href: "/accounts" },
    { icon: Settings, label: "Настройки", href: "/settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-content1 border-r border-divider flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-divider">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#0066FF] flex items-center justify-center shadow-glow">
            <Wallet className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text-primary">AutoFlow</h1>
            <p className="text-xs text-default-500">Finance Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 custom-scrollbar overflow-y-auto">
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
                className={`justify-start text-sm transition-all ${
                  isActive ? "font-semibold" : "font-normal hover:bg-content2"
                }`}
              >
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-divider space-y-2">
        {/* Theme Switcher */}
        {mounted && (
          <Button
            fullWidth
            variant="light"
            color="default"
            startContent={
              theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )
            }
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="justify-start text-sm"
          >
            {theme === "dark" ? "Светлая тема" : "Тёмная тема"}
          </Button>
        )}

        {/* User Profile */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-content2 hover:bg-content3 transition-colors">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00FFA3] to-[#00C853] flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-black">AF</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">AutoFlow User</p>
            <p className="text-xs text-default-500 truncate">user@autoflow.dev</p>
          </div>
          <button
            onClick={() => router.push("/login")}
            aria-label="Выйти"
            className="text-default-400 hover:text-[#FF3366] transition-colors p-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
