export type Category =
  | "Еда"
  | "Транспорт"
  | "Подписки"
  | "Здоровье"
  | "Развлечения"
  | "Быт"
  | "Зарплата"
  | "Фриланс"
  | "Инвестиции"
  | "Другое";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: number;
  date: string;
  merchant: string;
  category: Category;
  type: TransactionType;
  amount: number;
}

export const transactions: Transaction[] = [
  { id: 1, date: "09.03.2026", merchant: "Пятёрочка", category: "Еда", type: "expense", amount: 1250 },
  { id: 2, date: "09.03.2026", merchant: "Yandex Go", category: "Транспорт", type: "expense", amount: 450 },
  { id: 3, date: "08.03.2026", merchant: "Зарплата март", category: "Зарплата", type: "income", amount: 180000 },
  { id: 4, date: "07.03.2026", merchant: "Spotify", category: "Подписки", type: "expense", amount: 399 },
  { id: 5, date: "07.03.2026", merchant: "Магнит", category: "Еда", type: "expense", amount: 2100 },
  { id: 6, date: "06.03.2026", merchant: "Netflix", category: "Подписки", type: "expense", amount: 899 },
  { id: 7, date: "06.03.2026", merchant: "Аптека 36.6", category: "Здоровье", type: "expense", amount: 1800 },
  { id: 8, date: "05.03.2026", merchant: "Metro CC", category: "Еда", type: "expense", amount: 4500 },
  { id: 9, date: "05.03.2026", merchant: "Фриланс выплата", category: "Фриланс", type: "income", amount: 45000 },
  { id: 10, date: "04.03.2026", merchant: "GitHub Copilot", category: "Подписки", type: "expense", amount: 1200 },
  { id: 11, date: "04.03.2026", merchant: "Dodo Pizza", category: "Еда", type: "expense", amount: 1550 },
  { id: 12, date: "03.03.2026", merchant: "Ozon", category: "Быт", type: "expense", amount: 3200 },
  { id: 13, date: "03.03.2026", merchant: "Yandex Plus", category: "Подписки", type: "expense", amount: 399 },
  { id: 14, date: "02.03.2026", merchant: "Kino", category: "Развлечения", type: "expense", amount: 600 },
  { id: 15, date: "01.03.2026", merchant: "Стеам", category: "Развлечения", type: "expense", amount: 2100 },
];

export const monthlyData = [
  { month: "Сен", income: 195000, expenses: 82000 },
  { month: "Окт", income: 210000, expenses: 91000 },
  { month: "Ноя", income: 185000, expenses: 88000 },
  { month: "Дек", income: 230000, expenses: 115000 },
  { month: "Янв", income: 180000, expenses: 79000 },
  { month: "Фев", income: 190000, expenses: 86000 },
  { month: "Мар", income: 225000, expenses: 95650 },
];

export const categoryExpenses = [
  { name: "Еда", value: 18500, color: "#10b981" },
  { name: "Транспорт", value: 8200, color: "#3b82f6" },
  { name: "Подписки", value: 3900, color: "#8b5cf6" },
  { name: "Здоровье", value: 5200, color: "#f59e0b" },
  { name: "Развлечения", value: 4100, color: "#ec4899" },
  { name: "Быт", value: 6800, color: "#06b6d4" },
];

export const budgets = [
  { category: "Еда", spent: 18500, limit: 25000, color: "success" as const },
  { category: "Транспорт", spent: 8200, limit: 10000, color: "warning" as const },
  { category: "Подписки", spent: 3900, limit: 4000, color: "danger" as const },
  { category: "Здоровье", spent: 5200, limit: 8000, color: "primary" as const },
];

export const stats = {
  balance: 124350,
  monthlyIncome: 225000,
  monthlyExpenses: 95650,
  savingsRate: 57.5,
};