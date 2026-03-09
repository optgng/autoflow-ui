export const mockStats = [
  {
    label: "Общий баланс",
    value: "124 350 ₽",
    change: 12.5,
    trend: "up" as const,
    color: "primary" as const,
    icon: "wallet" as const,  // ← Строка вместо компонента
  },
  {
    label: "Доход за месяц",
    value: "180 000 ₽",
    change: 8.2,
    trend: "up" as const,
    color: "success" as const,
    icon: "trending-up" as const,  // ← Строка
  },
  {
    label: "Расходы за месяц",
    value: "95 650 ₽",
    change: -3.1,
    trend: "down" as const,
    color: "danger" as const,
    icon: "trending-down" as const,  // ← Строка
  },
];

export const mockBudgets = [
  { category: "Еда и рестораны", spent: 18500, limit: 25000, color: "success" as const },
  { category: "Транспорт", spent: 8200, limit: 10000, color: "warning" as const },
  { category: "Подписки", spent: 3900, limit: 4000, color: "danger" as const },
  { category: "Развлечения", spent: 5200, limit: 8000, color: "success" as const },
  { category: "Покупки", spent: 12300, limit: 15000, color: "warning" as const },
];

export const mockTransactions = [
  { id: 1, date: "09.03.2026", merchant: "Яндекс Еда", amount: -1250, category: "Еда" },
  { id: 2, date: "08.03.2026", merchant: "Yandex Go", amount: -450, category: "Транспорт" },
  { id: 3, date: "08.03.2026", merchant: "Зарплата", amount: 180000, category: "Доход" },
  { id: 4, date: "07.03.2026", merchant: "Spotify", amount: -399, category: "Подписки" },
  { id: 5, date: "07.03.2026", merchant: "Пятёрочка", amount: -2100, category: "Продукты" },
  { id: 6, date: "06.03.2026", merchant: "Steam", amount: -1599, category: "Развлечения" },
  { id: 7, date: "05.03.2026", merchant: "Ozon", amount: -3450, category: "Покупки" },
];
