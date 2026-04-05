import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Transaction, Role, FinanceContextType } from '../types';

const DEFAULT_MOCK_DATA: Transaction[] = [
  // November 2024
  { id: '1', date: '2024-11-01', description: 'Tech Corp Salary', category: 'Salary', type: 'Income', amount: 5000 },
  { id: '2', date: '2024-11-02', description: 'Monthly Rent', category: 'Rent', type: 'Expense', amount: 1500 },
  { id: '3', date: '2024-11-04', description: 'Grocery shopping', category: 'Food', type: 'Expense', amount: 145.75 },
  { id: '4', date: '2024-11-05', description: 'Electric bill', category: 'Utilities', type: 'Expense', amount: 105.00 },
  { id: '5', date: '2024-11-07', description: 'Coffee and lunch', category: 'Food', type: 'Expense', amount: 28.50 },
  { id: '6', date: '2024-11-10', description: 'Gas station fill-up', category: 'Transport', type: 'Expense', amount: 52.00 },
  { id: '7', date: '2024-11-12', description: 'New winter coat', category: 'Shopping', type: 'Expense', amount: 280.00 },
  { id: '8', date: '2024-11-15', description: 'Freelance design project', category: 'Freelance', type: 'Income', amount: 1200 },
  { id: '9', date: '2024-11-18', description: 'Movie tickets + popcorn', category: 'Entertainment', type: 'Expense', amount: 42.00 },
  { id: '10', date: '2024-11-22', description: 'Pharmacy prescription', category: 'Healthcare', type: 'Expense', amount: 67.50 },
  { id: '11', date: '2024-11-29', description: 'Internet provider', category: 'Utilities', type: 'Expense', amount: 75.00 },
  
  // December 2024
  { id: '12', date: '2024-12-01', description: 'Tech Corp Salary', category: 'Salary', type: 'Income', amount: 5000 },
  { id: '13', date: '2024-12-02', description: 'Monthly Rent', category: 'Rent', type: 'Expense', amount: 1500 },
  { id: '14', date: '2024-12-03', description: 'Shopping mall', category: 'Shopping', type: 'Expense', amount: 185.00 },
  { id: '15', date: '2024-12-06', description: 'Dinner with clients', category: 'Food', type: 'Expense', amount: 95.00 },
  { id: '16', date: '2024-12-08', description: 'Car insurance annual', category: 'Transport', type: 'Expense', amount: 320.00 },
  { id: '17', date: '2024-12-12', description: 'Yoga class membership', category: 'Healthcare', type: 'Expense', amount: 110.00 },
  { id: '18', date: '2024-12-15', description: 'Freelance writing gig', category: 'Freelance', type: 'Income', amount: 900 },
  { id: '19', date: '2024-12-20', description: 'Christmas gifts', category: 'Shopping', type: 'Expense', amount: 450.00 },
  { id: '20', date: '2024-12-23', description: 'Holiday party catering', category: 'Food', type: 'Expense', amount: 175.00 },
  
  // January 2025
  { id: '21', date: '2025-01-01', description: 'Tech Corp Salary', category: 'Salary', type: 'Income', amount: 5000 },
  { id: '22', date: '2025-01-02', description: 'Monthly Rent', category: 'Rent', type: 'Expense', amount: 1500 },
  { id: '23', date: '2025-01-05', description: 'Grocery delivery', category: 'Food', type: 'Expense', amount: 132.45 },
  { id: '24', date: '2025-01-08', description: 'Doctor visit', category: 'Healthcare', type: 'Expense', amount: 180.00 },
  { id: '25', date: '2025-01-10', description: 'Gym membership', category: 'Healthcare', type: 'Expense', amount: 50.00 },
  { id: '26', date: '2025-01-13', description: 'Gas and parking', category: 'Transport', type: 'Expense', amount: 65.00 },
  { id: '27', date: '2025-01-16', description: 'Concert tickets', category: 'Entertainment', type: 'Expense', amount: 120.00 },
  { id: '28', date: '2025-01-20', description: 'Contractor payment', category: 'Freelance', type: 'Income', amount: 1500 },
  
  // February 2025
  { id: '29', date: '2025-02-01', description: 'Tech Corp Salary', category: 'Salary', type: 'Income', amount: 5000 },
  { id: '30', date: '2025-02-02', description: 'Monthly Rent', category: 'Rent', type: 'Expense', amount: 1500 },
  { id: '31', date: '2025-02-04', description: 'Landscaping supplies', category: 'Shopping', type: 'Expense', amount: 95.50 },
  { id: '32', date: '2025-02-07', description: 'Restaurant dinner', category: 'Food', type: 'Expense', amount: 78.00 },
  { id: '33', date: '2025-02-09', description: 'Phone repair', category: 'Electronics', type: 'Expense', amount: 145.00 },
  { id: '34', date: '2025-02-12', description: 'Water bill', category: 'Utilities', type: 'Expense', amount: 55.00 },
  { id: '35', date: '2025-02-15', description: 'Freelance consulting', category: 'Freelance', type: 'Income', amount: 800 },
  { id: '36', date: '2025-02-18', description: 'Bookstore purchase', category: 'Entertainment', type: 'Expense', amount: 68.00 },
  
  // March 2025
  { id: '37', date: '2025-03-01', description: 'Tech Corp Salary', category: 'Salary', type: 'Income', amount: 5000 },
  { id: '38', date: '2025-03-02', description: 'Monthly Rent', category: 'Rent', type: 'Expense', amount: 1500 },
  { id: '39', date: '2025-03-05', description: 'Spring wardrobe', category: 'Shopping', type: 'Expense', amount: 220.00 },
  { id: '40', date: '2025-03-08', description: 'Farmers market', category: 'Food', type: 'Expense', amount: 72.00 },
  { id: '41', date: '2025-03-10', description: 'Car maintenance', category: 'Transport', type: 'Expense', amount: 280.00 },
  { id: '42', date: '2025-03-14', description: 'Therapy session', category: 'Healthcare', type: 'Expense', amount: 150.00 },
  { id: '43', date: '2025-03-17', description: 'Home renovation project', category: 'Entertainment', type: 'Expense', amount: 350.00 },
  
  // April 2025
  { id: '44', date: '2025-04-01', description: 'Tech Corp Salary', category: 'Salary', type: 'Income', amount: 5000 },
  { id: '45', date: '2025-04-02', description: 'Monthly Rent', category: 'Rent', type: 'Expense', amount: 1500 },
  { id: '46', date: '2025-04-04', description: 'Weekend groceries', category: 'Food', type: 'Expense', amount: 156.30 },
  { id: '47', date: '2025-04-07', description: 'Dental cleaning', category: 'Healthcare', type: 'Expense', amount: 200.00 },
  { id: '48', date: '2025-04-10', description: 'Metro pass', category: 'Transport', type: 'Expense', amount: 80.00 },
  { id: '49', date: '2025-04-12', description: 'Online course', category: 'Entertainment', type: 'Expense', amount: 99.00 },
];

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Get saved transactions from localStorage
const getSavedTransactions = (): Transaction[] => {
  try {
    const saved = localStorage.getItem('sovereign-transactions');
    return saved ? JSON.parse(saved) : DEFAULT_MOCK_DATA;
  } catch {
    return DEFAULT_MOCK_DATA;
  }
};

// Get saved role from localStorage
const getSavedRole = (): Role => {
  try {
    const saved = localStorage.getItem('sovereign-role');
    return (saved as Role) || 'viewer';
  } catch {
    return 'viewer';
  }
};

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(getSavedTransactions);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRole, setActiveRole] = useState<Role>(getSavedRole);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('sovereign-transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Save role to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sovereign-role', activeRole);
  }, [activeRole]);

  // Simulate API loading delay on first mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);

  // ✅ PRODUCTION OPTIMIZATION: Memoize total income calculation
  const totalIncome = useMemo(() => {
    return transactions
      .filter(t => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // ✅ PRODUCTION OPTIMIZATION: Memoize total expenses calculation
  const totalExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, [transactions]);

  // ✅ PRODUCTION OPTIMIZATION: Memoize total balance calculation
  const totalBalance = useMemo(() => {
    return totalIncome - totalExpenses;
  }, [totalIncome, totalExpenses]);

  // ✅ PRODUCTION OPTIMIZATION: Memoize category breakdown calculation
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'Expense')
      .forEach(t => {
        totals[t.category] = (totals[t.category] || 0) + Math.abs(t.amount);
      });
    return totals;
  }, [transactions]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = { ...t, id: Date.now().toString() };
    setTransactions((prev) => [newTx, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const editTransaction = (id: string, updated: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const deleteMultiple = (ids: string[]) => {
    setTransactions((prev) => prev.filter((t) => !ids.includes(t.id)));
  };

  const setActiveRoleHandler = (role: Role) => {
    setActiveRole(role);
  };

  // ✅ PRODUCTION OPTIMIZATION: Wrap context value in useMemo to prevent unnecessary re-renders
  const value = useMemo(() => ({
    transactions,
    activeRole,
    setActiveRole: setActiveRoleHandler,
    addTransaction,
    editTransaction,
    deleteTransaction,
    deleteMultiple,
    isLoading,
    // Expose memoized calculations for immediate dashboard access
    _metrics: {
      totalIncome,
      totalExpenses,
      totalBalance,
      categoryTotals,
    },
  } as FinanceContextType), [
    transactions,
    activeRole,
    totalIncome,
    totalExpenses,
    totalBalance,
    categoryTotals,
    isLoading,
  ]);

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
};
