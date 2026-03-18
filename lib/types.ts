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
  id:                number;
  name:              string;
  account_type:      'card' | 'bank_account' | 'cash';
  currency:          string;
  balance:           string;
  bank_name?:        string;
  last_four_digits?: string;
  is_active:         boolean;
  include_in_total:  boolean;
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
export interface Category {
  id:            number;
  name:          string;
  category_type: 'income' | 'expense';
  is_system:     boolean;
  icon?:         string | null;
  color?:        string | null;
}

// ─── Transaction ──────────────────────────────────────────────────────────────
export type TransactionType = 'all' | 'income' | 'expense';

export interface Transaction {
  id:               number;
  transaction_date: string;       // "2026-03-18"
  transaction_type: 'income' | 'expense' | 'transfer';
  amount:           string;       // Decimal → строка
  merchant:         string | null;
  description:      string | null;
  external_id:      string | null;
  import_source:    string | null;
  account?: {
    id:   number;
    name: string;
  };
  category?: {
    id:   number;
    name: string;
  } | null;
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

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface TokensPayload {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface LoginResponse {
  user: User;
  tokens: TokensPayload;
}

// ─── UI-совместимые хелперы ───────────────────────────────────────────────────
// Конвертер дат: бэкенд ISO -> UI DD.MM.YYYY
export function formatDateUI(isoDate: string): string {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  return `${d}.${m}.${y}`;
}
// Конвертер дат: UI DD.MM.YYYY -> бэкенд ISO
export function formatDateAPI(ddmmyyyy: string): string {
  const [d, m, y] = ddmmyyyy.split('.');
  return `${y}-${m}-${d}`;
}
