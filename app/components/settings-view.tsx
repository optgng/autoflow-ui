"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Tabs,
  Tab,
  Input,
  Button,
  Switch,
  Progress,
  Divider,
} from "@heroui/react";
import { User, Mail, Phone, Shield, Bell, Zap } from "lucide-react";

export function SettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-default-500">Manage your account and preferences.</p>
      </div>

      <Card>
        <CardBody>
          <Tabs
            aria-label="Settings tabs"
            color="primary"
            variant="underlined"
            classNames={{
              tabList: "gap-6",
              tab: "px-0 h-12",
            }}
          >
            {/* Profile Tab */}
            <Tab key="profile" title="Profile">
              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      John Doe
                    </h3>
                    <p className="text-sm text-default-500">
                      Premium Member since Jan 2025
                    </p>
                    <Button size="sm" variant="flat" className="mt-2">
                      Change Avatar
                    </Button>
                  </div>
                </div>

                <Divider />

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Full Name"
                    placeholder="John Doe"
                    defaultValue="John Doe"
                    startContent={<User className="h-4 w-4 text-default-400" />}
                  />
                  <Input
                    label="Email"
                    placeholder="john@example.com"
                    defaultValue="john@example.com"
                    startContent={<Mail className="h-4 w-4 text-default-400" />}
                  />
                  <Input
                    label="Phone"
                    placeholder="+1 234 567 8900"
                    defaultValue="+1 234 567 8900"
                    startContent={<Phone className="h-4 w-4 text-default-400" />}
                  />
                  <Input
                    label="Currency"
                    placeholder="USD"
                    defaultValue="USD"
                    isReadOnly
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="flat">Cancel</Button>
                  <Button color="primary">Save Changes</Button>
                </div>
              </div>
            </Tab>

            {/* Budgets Tab */}
            <Tab key="budgets" title="Budgets">
              <div className="mt-6 space-y-6">
                <p className="text-sm text-default-500">
                  Set monthly spending limits for each category.
                </p>

                <div className="space-y-6">
                  {[
                    { category: "Food & Dining", limit: 400, icon: "🍔" },
                    { category: "Transportation", limit: 250, icon: "🚗" },
                    { category: "Subscriptions", limit: 100, icon: "📱" },
                    { category: "Shopping", limit: 500, icon: "🛍️" },
                    { category: "Entertainment", limit: 200, icon: "🎬" },
                  ].map((budget) => (
                    <div key={budget.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{budget.icon}</span>
                          <span className="font-medium text-foreground">
                            {budget.category}
                          </span>
                        </div>
                        <Input
                          type="number"
                          size="sm"
                          className="w-32"
                          defaultValue={budget.limit.toString()}
                          startContent={
                            <span className="text-default-400">$</span>
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Divider />

                <div className="flex justify-end gap-2">
                  <Button variant="flat">Reset to Defaults</Button>
                  <Button color="primary">Save Budgets</Button>
                </div>
              </div>
            </Tab>

            {/* Automations Tab */}
            <Tab key="automations" title="Automations">
              <div className="mt-6 space-y-6">
                <p className="text-sm text-default-500">
                  Configure automated features to streamline your finance tracking.
                </p>

                <Card className="bg-default-50">
                  <CardHeader className="gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-md font-semibold">Auto-sync Bank CSV</p>
                      <p className="text-small text-default-500">
                        Automatically import transactions from uploaded bank CSV files
                      </p>
                    </div>
                    <Switch defaultSelected className="ml-auto" aria-label="Auto-sync bank CSV toggle" />
                  </CardHeader>
                </Card>

                <Card className="bg-default-50">
                  <CardHeader className="gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20">
                      <Bell className="h-5 w-5 text-success" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-md font-semibold">Telegram Bot Webhook</p>
                      <p className="text-small text-default-500">
                        Receive instant notifications via Telegram when budgets are exceeded
                      </p>
                    </div>
                    <Switch className="ml-auto" aria-label="Telegram bot webhook toggle" />
                  </CardHeader>
                </Card>

                <Card className="bg-default-50">
                  <CardHeader className="gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20">
                      <Shield className="h-5 w-5 text-warning" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-md font-semibold">LLM Categorization</p>
                      <p className="text-small text-default-500">
                        Use AI to automatically categorize your transactions
                      </p>
                    </div>
                    <Switch defaultSelected className="ml-auto" aria-label="LLM categorization toggle" />
                  </CardHeader>
                </Card>

                <Card className="bg-default-50">
                  <CardHeader className="gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
                      <Mail className="h-5 w-5 text-secondary" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-md font-semibold">Weekly Email Reports</p>
                      <p className="text-small text-default-500">
                        Receive a weekly summary of your finances via email
                      </p>
                    </div>
                    <Switch className="ml-auto" aria-label="Weekly email reports toggle" />
                  </CardHeader>
                </Card>

                <Divider />

                <div className="rounded-lg bg-primary/10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">
                        Automation Credits
                      </p>
                      <p className="text-sm text-default-500">
                        850 / 1000 credits remaining this month
                      </p>
                    </div>
                    <Button size="sm" color="primary" variant="flat">
                      Get More
                    </Button>
                  </div>
                  <Progress
                    value={85}
                    color="primary"
                    className="mt-3"
                    aria-label="Automation credits progress"
                  />
                </div>
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
