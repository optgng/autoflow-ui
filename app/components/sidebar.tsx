'use client';

import { Button } from "@heroui/react";
import { LayoutDashboard, TrendingUp, Receipt, Wallet, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: LayoutDashboard, label: "Дашборд", href: "/" },
  { icon: TrendingUp, label: "Аналитика", href: "/analytics" },
  { icon: Receipt, label: "Транзакции", href: "/transactions" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col z-50">
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center shadow-lg">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">AutoFlow</h1>
            <p className="text-xs text-zinc-500 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Finance AI
            </p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-xs font-semibold text-zinc-600 uppercase tracking-wider px-3 mb-3">
          Навигация
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                fullWidth
                variant={isActive ? "flat" : "light"}
                color={isActive ? "primary" : "default"}
                startContent={<Icon className="w-4 h-4" />}
                className={`justify-start h-10 px-3 text-sm ${
                  isActive
                    ? "bg-sky-500/15 text-sky-400 font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {item.label}
              </Button>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">ДВ</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Денис В.</p>
            <p className="text-xs text-zinc-500 truncate">autoflow.dev</p>
          </div>
        </div>
      </div>
    </aside>
  );
}