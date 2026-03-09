"use client";

import { Button } from "@heroui/react";
import {
  LayoutDashboard,
  BarChart3,
  Receipt,
  Settings,
  Wallet,
} from "lucide-react";

type TabType = "dashboard" | "analytics" | "transactions" | "settings";

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const navItems: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "transactions", label: "Transactions", icon: Receipt },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-default-200 bg-content1">
      <div className="flex items-center gap-3 border-b border-default-200 p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <Wallet className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">FinanceFlow</h1>
          <p className="text-xs text-default-500">Personal Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Button
              key={item.id}
              variant={isActive ? "flat" : "light"}
              color={isActive ? "primary" : "default"}
              className={`w-full justify-start gap-3 ${
                isActive ? "bg-primary/20" : ""
              }`}
              onPress={() => setActiveTab(item.id)}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Button>
          );
        })}
      </nav>

      <div className="border-t border-default-200 p-4">
        <div className="rounded-lg bg-default-100 p-4">
          <p className="text-sm font-medium text-foreground">Pro Upgrade</p>
          <p className="mt-1 text-xs text-default-500">
            Unlock AI insights and advanced analytics
          </p>
          <Button size="sm" color="primary" className="mt-3 w-full">
            Upgrade Now
          </Button>
        </div>
      </div>
    </aside>
  );
}
