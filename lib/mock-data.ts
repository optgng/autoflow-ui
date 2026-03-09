// ─── Types ──────────────────────────────────────────────────────────────────

export interface Transaction {
  id: number;
  date: string; // "DD.MM.YYYY"
  time: string; // "HH:MM"
  processedDate: string;
  merchant: string;
  category: string;
  categoryIcon: string;
  account: string;
  amount: number;
  balanceAfter: number;
  authCode: string;
  type: "income" | "expense";
}

export interface Account {
  id: number;
  name: string;
  number: string;
  bank: string;
  currency: "RUB" | "USD" | "EUR";
  balance: number;
  isActive: boolean;
}

export interface ChartPoint {
  date: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryExpense {
  name: string;
  value: number;
  color: string;
}

// ─── Mock Transactions ───────────────────────────────────────────────────────

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    date: "09.03.2026",
    time: "14:32",
    processedDate: "10.03.2026",
    merchant: "YANDEX*GO",
    category: "Такси",
    categoryIcon: "Car",
    account: "Сбер Зарплатная",
    amount: -650,
    balanceAfter: 251800,
    authCode: "A49201",
    type: "expense",
  },
  {
    id: 2,
    date: "09.03.2026",
    time: "10:15",
    processedDate: "09.03.2026",
    merchant: "PYATEROCHKA",
    category: "Супермаркеты",
    categoryIcon: "ShoppingCart",
    account: "Сбер Зарплатная",
    amount: -2100,
    balanceAfter: 252450,
    authCode: "B31045",
    type: "expense",
  },
  {
    id: 3,
    date: "08.03.2026",
    time: "09:00",
    processedDate: "08.03.2026",
    merchant: "ООО Работодатель",
    category: "Зарплата",
    categoryIcon: "Briefcase",
    account: "Сбер Зарплатная",
    amount: 180000,
    balanceAfter: 254550,
    authCode: "SAL0308",
    type: "income",
  },
  {
    id: 4,
    date: "07.03.2026",
    time: "20:44",
    processedDate: "08.03.2026",
    merchant: "Кофейня на углу",
    category: "Кафе",
    categoryIcon: "Coffee",
    account: "Тинькофф Карта",
    amount: -380,
    balanceAfter: 18420,
    authCode: "C12839",
    type: "expense",
  },
  {
    id: 5,
    date: "07.03.2026",
    time: "18:30",
    processedDate: "07.03.2026",
    merchant: "OZON",
    category: "Покупки",
    categoryIcon: "Package",
    account: "Сбер Зарплатная",
    amount: -4350,
    balanceAfter: 74930,
    authCode: "OZ9381",
    type: "expense",
  },
  {
    id: 6,
    date: "06.03.2026",
    time: "11:00",
    processedDate: "06.03.2026",
    merchant: "МосЭнерго ЖКХ",
    category: "ЖКХ",
    categoryIcon: "Zap",
    account: "Тинькофф Карта",
    amount: -5200,
    balanceAfter: 18800,
    authCode: "ZH4401",
    type: "expense",
  },
  {
    id: 7,
    date: "06.03.2026",
    time: "09:22",
    processedDate: "06.03.2026",
    merchant: "YANDEX*GO",
    category: "Такси",
    categoryIcon: "Car",
    account: "Тинькофф Карта",
    amount: -480,
    balanceAfter: 24000,
    authCode: "A49202",
    type: "expense",
  },
  {
    id: 8,
    date: "05.03.2026",
    time: "15:10",
    processedDate: "05.03.2026",
    merchant: "PYATEROCHKA",
    category: "Супермаркеты",
    categoryIcon: "ShoppingCart",
    account: "Сбер Зарплатная",
    amount: -1850,
    balanceAfter: 79280,
    authCode: "B31046",
    type: "expense",
  },
  {
    id: 9,
    date: "04.03.2026",
    time: "19:45",
    processedDate: "05.03.2026",
    merchant: "Кино Парк",
    category: "Развлечения",
    categoryIcon: "Film",
    account: "Тинькофф Карта",
    amount: -900,
    balanceAfter: 24480,
    authCode: "ENT3922",
    type: "expense",
  },
  {
    id: 10,
    date: "03.03.2026",
    time: "12:00",
    processedDate: "03.03.2026",
    merchant: "Возврат OZON",
    category: "Возвраты",
    categoryIcon: "RefreshCcw",
    account: "Сбер Зарплатная",
    amount: 2500,
    balanceAfter: 81130,
    authCode: "REF1120",
    type: "income",
  },
  {
    id: 11,
    date: "02.03.2026",
    time: "08:45",
    processedDate: "02.03.2026",
    merchant: "Метро Транспорт",
    category: "Транспорт",
    categoryIcon: "Train",
    account: "Тинькофф Карта",
    amount: -150,
    balanceAfter: 25380,
    authCode: "TR0099",
    type: "expense",
  },
  {
    id: 12,
    date: "01.03.2026",
    time: "10:30",
    processedDate: "01.03.2026",
    merchant: "Spotify Premium",
    category: "Подписки",
    categoryIcon: "Music",
    account: "Тинькофф Карта",
    amount: -299,
    balanceAfter: 25530,
    authCode: "SPT7712",
    type: "expense",
  },
  {
    id: 13,
    date: "28.02.2026",
    time: "14:00",
    processedDate: "28.02.2026",
    merchant: "PYATEROCHKA",
    category: "Супермаркеты",
    categoryIcon: "ShoppingCart",
    account: "Сбер Зарплатная",
    amount: -3100,
    balanceAfter: 78630,
    authCode: "B31050",
    type: "expense",
  },
  {
    id: 14,
    date: "27.02.2026",
    time: "20:00",
    processedDate: "28.02.2026",
    merchant: "YANDEX*GO",
    category: "Такси",
    categoryIcon: "Car",
    account: "Сбер Зарплатная",
    amount: -750,
    balanceAfter: 81730,
    authCode: "A49220",
    type: "expense",
  },
  {
    id: 15,
    date: "25.02.2026",
    time: "13:30",
    processedDate: "25.02.2026",
    merchant: "Кофейня на углу",
    category: "Кафе",
    categoryIcon: "Coffee",
    account: "Тинькофф Карта",
    amount: -450,
    balanceAfter: 25829,
    authCode: "C12850",
    type: "expense",
  },
];

// ─── Mock Accounts ───────────────────────────────────────────────────────────

export const mockAccounts: Account[] = [
  {
    id: 1,
    name: "Сбер Зарплатная",
    number: "40817810900001234",
    bank: "Сбербанк",
    currency: "RUB",
    balance: 252450,
    isActive: true,
  },
  {
    id: 2,
    name: "Тинькофф Карта",
    number: "40817810200005678",
    bank: "Тинькофф",
    currency: "RUB",
    balance: 18620,
    isActive: true,
  },
  {
    id: 3,
    name: "Альфа Накопительный",
    number: "40817810600009012",
    bank: "Альфа-Банк",
    currency: "RUB",
    balance: 0,
    isActive: false,
  },
];

// ─── Chart Data ──────────────────────────────────────────────────────────────

export const mockChartData: ChartPoint[] = [
  { date: "01.03", income: 0, expense: 3100, balance: 74550 },
  { date: "02.03", income: 0, expense: 150, balance: 74400 },
  { date: "03.03", income: 2500, expense: 0, balance: 76900 },
  { date: "04.03", income: 0, expense: 900, balance: 76000 },
  { date: "05.03", income: 0, expense: 1850, balance: 74150 },
  { date: "06.03", income: 0, expense: 5680, balance: 68470 },
  { date: "07.03", income: 0, expense: 4730, balance: 63740 },
  { date: "08.03", income: 180000, expense: 0, balance: 243740 },
  { date: "09.03", income: 0, expense: 2750, balance: 241000 },
];

export const mockMonthlyData = [
  { month: "Окт", income: 160000, expense: 92000 },
  { month: "Ноя", income: 165000, expense: 98000 },
  { month: "Дек", income: 175000, expense: 115000 },
  { month: "Янв", income: 168000, expense: 88000 },
  { month: "Фев", income: 172000, expense: 83000 },
  { month: "Мар", income: 180000, expense: 87550 },
];

export const mockBalanceData = [
  { date: "01.03", balance: 74550 },
  { date: "02.03", balance: 74400 },
  { date: "03.03", balance: 76900 },
  { date: "04.03", balance: 76000 },
  { date: "05.03", balance: 74150 },
  { date: "06.03", balance: 68470 },
  { date: "07.03", balance: 63740 },
  { date: "08.03", balance: 243740 },
  { date: "09.03", balance: 241000 },
];

export const mockTopMerchants = [
  { merchant: "PYATEROCHKA", total: 7150 },
  { merchant: "YANDEX*GO", total: 1880 },
  { merchant: "OZON", total: 4350 },
  { merchant: "МосЭнерго ЖКХ", total: 5200 },
  { merchant: "Кофейня на углу", total: 830 },
  { merchant: "Кино Парк", total: 900 },
  { merchant: "Spotify Premium", total: 299 },
  { merchant: "Метро Транспорт", total: 150 },
];

export const mockCategoryExpenses: CategoryExpense[] = [
  { name: "Супермаркеты", value: 7150, color: "#00E5FF" },
  { name: "ЖКХ", value: 5200, color: "#0066FF" },
  { name: "Такси", value: 1880, color: "#FF3366" },
  { name: "Кафе", value: 830, color: "#FFB800" },
  { name: "Развлечения", value: 900, color: "#00FFA3" },
];

// ─── Legacy stats (kept for compatibility) ───────────────────────────────────

export const mockStats = [
  {
    label: "Общий баланс",
    value: "252 450 ₽",
    change: 12.5,
    trend: "up" as const,
    color: "primary" as const,
    icon: "wallet" as const,
  },
  {
    label: "Доходы",
    value: "180 000 ₽",
    change: 12,
    trend: "up" as const,
    color: "success" as const,
    icon: "trending-up" as const,
  },
  {
    label: "Расходы",
    value: "87 550 ₽",
    change: -8,
    trend: "down" as const,
    color: "danger" as const,
    icon: "trending-down" as const,
  },
];

export const mockBudgets = [
  { category: "Супермаркеты", spent: 7150, limit: 12000, color: "success" as const },
  { category: "Транспорт", spent: 1880, limit: 5000, color: "success" as const },
  { category: "Кафе", spent: 830, limit: 3000, color: "success" as const },
  { category: "Развлечения", spent: 900, limit: 3000, color: "warning" as const },
  { category: "ЖКХ", spent: 5200, limit: 6000, color: "warning" as const },
];
