export type TransactionType = 'Income' | 'Expense';

export type Role = 'admin' | 'viewer';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: TransactionType;
  amount: number;
}

export interface FinanceContextType {
  transactions: Transaction[];
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, t: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
  deleteMultiple: (ids: string[]) => void;
  isLoading: boolean;
  // ✅ PRODUCTION: Memoized calculations exposed for dashboard optimization
  _metrics?: {
    totalIncome: number;
    totalExpenses: number;
    totalBalance: number;
    categoryTotals: Record<string, number>;
  };
}
