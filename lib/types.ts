// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  total_accounts: number;
  total_transactions: number;
}

// ─── Account ──────────────────────────────────────────────────────────────────
export type AccountType =
  | 'card'
  | 'bank_account'
  | 'cash'
  | 'investment'
  | 'crypto'
  | 'other';

export type Currency = 'RUB' | 'USD' | 'EUR' | 'GBP' | 'CNY' | 'BTC' | 'ETH';

export interface Account {
  id: number;
  name: string;
  account_type: AccountType;
  currency: Currency;
  balance: number;
  bank_name: string | null;
  account_number: string | null;
  last_four_digits: string | null;
  icon: string | null;
  color: string | null;
  description: string | null;
  is_active: boolean;
  include_in_total: boolean;
  created_at: string;
  updated_at: string;
}

export interface AccountCreate {
  name: string;
  account_type: AccountType;
  currency: Currency;
  balance?: number;
  bank_name?: string;
  account_number?: string;
  last_four_digits?: string;
  icon?: string;
  color?: string;
  include_in_total?: boolean;
}

export interface AccountUpdate extends Partial<AccountCreate> {
  is_active?: boolean;
}

// ─── Category ─────────────────────────────────────────────────────────────────
export type CategoryType = 'income' | 'expense' | 'transfer';

export interface Category {
  id: number;
  name: string;
  category_type: CategoryType;
  icon: string | null;
  color: string | null;
  is_system: boolean;
  is_active: boolean;
  user_id: number | null;
}

// ─── Transaction ──────────────────────────────────────────────────────────────
export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: number;
  user_id: number;
  account_id: number;
  category_id: number | null;
  target_account_id: number | null;
  transaction_date: string; // ISO: YYYY-MM-DD (бэкенд) vs DD.MM.YYYY (старый UI)
  amount: number;
  transaction_type: TransactionType;
  description: string | null;
  merchant: string | null;
  location: string | null;
  tags: string | null;
  notes: string | null;
  receipt_url: string | null;
  created_at: string;
  updated_at: string;
  // Joined relations (если бэкенд отдаёт с selectinload)
  account?: Account;
  category?: Category;
}

export interface TransactionCreate {
  account_id: number;
  category_id?: number;
  target_account_id?: number;
  transaction_date: string; // YYYY-MM-DD
  amount: number;
  transaction_type: TransactionType;
  description?: string;
  merchant?: string;
  notes?: string;
}

// ─── Budget ───────────────────────────────────────────────────────────────────
export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Budget {
  id: number;
  user_id: number;
  category_id: number | null;
  name: string;
  amount: number;
  period_type: PeriodType;
  start_date: string;
  end_date: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
}

// ─── API Responses ────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export interface TotalResponse {
  total: number;
}

export interface TotalBalanceResponse {
  total_balance: number;
  currency: string;
}

// ─── UI-совместимые хелперы ───────────────────────────────────────────────────
// Конвертер дат: бэкенд ISO -> UI DD.MM.YYYY
export function formatDateUI(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

// Конвертер дат: UI DD.MM.YYYY -> бэкенд ISO
export function formatDateAPI(ddmmyyyy: string): string {
  const [d, m, y] = ddmmyyyy.split('.');
  return `${y}-${m}-${d}`;
}
