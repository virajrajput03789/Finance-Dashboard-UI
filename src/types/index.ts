export type TransactionType = 'Income' | 'Expense';
export type Role = 'admin' | 'viewer';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: TransactionType;
  date: string;
}

export interface FilterState {
  category: string;
  type: 'All' | TransactionType;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  search: string;
}

export interface SortConfig {
  field: 'date' | 'amount' | 'category' | 'none';
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  currentPage: number;
  perPage: number;
  total: number;
}

export interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  duration?: number;
}

export interface InsightData {
  savingsRate: number;
  healthScore: number;
  topCategories: CategorySummary[];
  spendingByDay: DaySpending[];
  monthlyComparison: MonthComparison[];
}

export interface CategorySummary {
  name: string;
  amount: number;
  percentage: number;
  monthChange: number;
}

export interface DaySpending {
  day: string;
  avgAmount: number;
  count: number;
}

export interface MonthComparison {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

export interface ChartDataPoint {
  date: string;
  amount: number;
  month: string;
}

export interface FinanceContextType {
  transactions: Transaction[];
  activeRole: Role;
  isLoading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
  deleteMultiple: (ids: string[]) => void;
  setActiveRole: (role: Role) => void;
}
