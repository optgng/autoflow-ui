"use client";

import { useState } from "react";
import { Sidebar } from "./components/sidebar";
import { DashboardView } from "./components/dashboard-view";
import { AnalyticsView } from "./components/analytics-view";
import { TransactionsView } from "./components/transactions-view";
import { SettingsView } from "./components/settings-view";

type TabType = "dashboard" | "analytics" | "transactions" | "settings";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="ml-64 min-h-screen p-6">
        <div className="mx-auto max-w-7xl">
          {activeTab === "dashboard" && <DashboardView />}
          {activeTab === "analytics" && <AnalyticsView />}
          {activeTab === "transactions" && <TransactionsView />}
          {activeTab === "settings" && <SettingsView />}
        </div>
      </main>
    </div>
  );
}
