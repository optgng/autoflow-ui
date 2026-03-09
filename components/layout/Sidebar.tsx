"use client";

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

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: TrendingUp, label: "Аналитика", href: "/analytics" },
  { icon: Receipt, label: "Транзакции", href: "/transactions" },
  { icon: Building2, label: "Счета", href: "/accounts" },
  { icon: Settings, label: "Настройки", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-content1 border-r border-divider flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-divider">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#0066FF] flex items-center justify-center shadow-glow flex-shrink-0">
            <Wallet className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text-primary">AutoFlow</h1>
            <p className="text-xs text-default-500">Finance Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-0.5 custom-scrollbar overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? "bg-[#00E5FF]/10 text-[#00E5FF] font-semibold"
                  : "text-default-500 hover:text-foreground hover:bg-content2 font-normal"
              }`}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 ${
                  isActive ? "text-[#00E5FF]" : "text-default-400"
                }`}
              />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00E5FF]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-divider space-y-2">
        {/* Theme Switcher */}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-default-500 hover:text-foreground hover:bg-content2 transition-all font-normal"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5 flex-shrink-0 text-default-400" />
            ) : (
              <Moon className="w-5 h-5 flex-shrink-0 text-default-400" />
            )}
            <span>{theme === "dark" ? "Светлая тема" : "Тёмная тема"}</span>
          </button>
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
            className="text-default-400 hover:text-[#FF3366] transition-colors p-1 flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
