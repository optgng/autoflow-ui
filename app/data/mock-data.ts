export const transactions = [
  { id: 1, date: "2026-03-09", merchant: "Amazon", category: "Shopping", type: "Expense", amount: 89.99 },
  { id: 2, date: "2026-03-08", merchant: "Salary Deposit", category: "Income", type: "Income", amount: 4500.00 },
  { id: 3, date: "2026-03-07", merchant: "Starbucks", category: "Food", type: "Expense", amount: 12.50 },
  { id: 4, date: "2026-03-06", merchant: "Netflix", category: "Subscriptions", type: "Expense", amount: 15.99 },
  { id: 5, date: "2026-03-05", merchant: "Uber", category: "Transport", type: "Expense", amount: 24.30 },
  { id: 6, date: "2026-03-04", merchant: "Whole Foods", category: "Food", type: "Expense", amount: 156.78 },
  { id: 7, date: "2026-03-03", merchant: "Freelance Payment", category: "Income", type: "Income", amount: 850.00 },
  { id: 8, date: "2026-03-02", merchant: "Spotify", category: "Subscriptions", type: "Expense", amount: 9.99 },
  { id: 9, date: "2026-03-01", merchant: "Shell Gas Station", category: "Transport", type: "Expense", amount: 62.40 },
  { id: 10, date: "2026-02-28", merchant: "Apple Store", category: "Shopping", type: "Expense", amount: 299.00 },
  { id: 11, date: "2026-02-27", merchant: "Chipotle", category: "Food", type: "Expense", amount: 18.95 },
  { id: 12, date: "2026-02-26", merchant: "Adobe Creative Cloud", category: "Subscriptions", type: "Expense", amount: 54.99 },
  { id: 13, date: "2026-02-25", merchant: "Interest Payment", category: "Income", type: "Income", amount: 45.32 },
  { id: 14, date: "2026-02-24", merchant: "Metro Card Refill", category: "Transport", type: "Expense", amount: 127.00 },
  { id: 15, date: "2026-02-23", merchant: "Target", category: "Shopping", type: "Expense", amount: 78.45 },
];

export const budgets = [
  { category: "Food", spent: 188.23, limit: 400, color: "warning" },
  { category: "Transport", spent: 213.70, limit: 250, color: "danger" },
  { category: "Subscriptions", spent: 80.97, limit: 100, color: "primary" },
  { category: "Shopping", spent: 467.44, limit: 500, color: "success" },
];

export const monthlyData = [
  { month: "Oct", income: 5200, expenses: 3800 },
  { month: "Nov", income: 4800, expenses: 4100 },
  { month: "Dec", income: 6100, expenses: 5200 },
  { month: "Jan", income: 5350, expenses: 3950 },
  { month: "Feb", income: 5395, expenses: 4200 },
  { month: "Mar", income: 5350, expenses: 2100 },
];

export const expenseByCategory = [
  { name: "Food", value: 188.23, fill: "#f5a524" },
  { name: "Transport", value: 213.70, fill: "#f31260" },
  { name: "Subscriptions", value: 80.97, fill: "#006fee" },
  { name: "Shopping", value: 467.44, fill: "#17c964" },
  { name: "Entertainment", value: 125.00, fill: "#9353d3" },
];

export const summaryData = {
  totalBalance: 24589.42,
  monthlyIncome: 5350.00,
  monthlyExpenses: 2100.34,
};
