import type { Transaction, CategorySummary, DaySpending, MonthComparison } from '../types/index';

/**
 * Calculate total savings rate (income - expenses) / income * 100
 */
export function calculateSavingsRate(transactions: Transaction[]): number {
  if (transactions.length === 0) return 0;
  
  const income = transactions
    .filter(t => t.type === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const expenses = transactions
    .filter(t => t.type === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  if (income === 0) return 0;
  return ((income - expenses) / income) * 100;
}

/**
 * Get top N spending categories with amounts and percentages
 */
export function getTopCategories(transactions: Transaction[], limit: number = 3): CategorySummary[] {
  const expenses = transactions.filter(t => t.type === 'Expense');
  if (expenses.length === 0) return [];
  
  const categoryTotals: Record<string, { amount: number; count: number }> = {};
  
  expenses.forEach(t => {
    if (!categoryTotals[t.category]) {
      categoryTotals[t.category] = { amount: 0, count: 0 };
    }
    categoryTotals[t.category].amount += t.amount;
    categoryTotals[t.category].count++;
  });
  
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  
  return Object.entries(categoryTotals)
    .map(([name, data]) => ({
      name,
      amount: data.amount,
      percentage: (data.amount / totalExpenses) * 100,
      monthChange: 0, // Calculated separately if needed
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

/**
 * Calculate average daily spending
 */
export function getDailyAverage(transactions: Transaction[]): number {
  const expenses = transactions.filter(t => t.type === 'Expense');
  if (expenses.length === 0) return 0;
  
  const uniqueDates = new Set(expenses.map(t => t.date));
  const total = expenses.reduce((sum, t) => sum + t.amount, 0);
  
  return total / uniqueDates.size;
}

/**
 * Get spending by day of week
 */
export function getSpendingByDayOfWeek(transactions: Transaction[]): DaySpending[] {
  const expenses = transactions.filter(t => t.type === 'Expense');
  if (expenses.length === 0) return [];
  
  const dayTotals: Record<string, { amount: number; count: number }> = {
    Monday: { amount: 0, count: 0 },
    Tuesday: { amount: 0, count: 0 },
    Wednesday: { amount: 0, count: 0 },
    Thursday: { amount: 0, count: 0 },
    Friday: { amount: 0, count: 0 },
    Saturday: { amount: 0, count: 0 },
    Sunday: { amount: 0, count: 0 },
  };
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  expenses.forEach(t => {
    const date = new Date(t.date);
    const dayName = days[date.getDay()];
    dayTotals[dayName].amount += t.amount;
    dayTotals[dayName].count++;
  });
  
  return Object.entries(dayTotals)
    .map(([day, data]) => ({
      day,
      avgAmount: data.count > 0 ? data.amount / data.count : 0,
      count: data.count,
    }))
    .filter(d => d.count > 0);
}

/**
 * Calculate month-over-month comparison for last N months
 */
export function getMonthlyComparison(transactions: Transaction[], months: number = 3): MonthComparison[] {
  const monthData: Record<string, { income: number; expenses: number }> = {};
  
  transactions.forEach(t => {
    const date = new Date(t.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthData[monthKey]) {
      monthData[monthKey] = { income: 0, expenses: 0 };
    }
    
    if (t.type === 'Income') {
      monthData[monthKey].income += t.amount;
    } else {
      monthData[monthKey].expenses += t.amount;
    }
  });
  
  return Object.entries(monthData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-months)
    .map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
      net: data.income - data.expenses,
    }));
}

/**
 * Calculate financial health score (0-100)
 * Based on: savings rate (40%), expense consistency (30%), income stability (30%)
 */
export function getFinancialHealthScore(transactions: Transaction[]): number {
  if (transactions.length === 0) return 0;
  
  const savingsRate = calculateSavingsRate(transactions);
  
  // Savings rate score (40%)
  let savingsScore = 0;
  if (savingsRate > 30) savingsScore = 40;
  else if (savingsRate > 20) savingsScore = 35;
  else if (savingsRate > 10) savingsScore = 25;
  else if (savingsRate > 0) savingsScore = 15;
  
  // Expense consistency (30%)
  const expenses = transactions.filter(t => t.type === 'Expense');
  let consistencyScore = 30;
  if (expenses.length >= 10) {
    const amounts = expenses.map(t => t.amount);
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance = amounts.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / avg;
    if (cv > 0.8) consistencyScore = 10;
    else if (cv > 0.5) consistencyScore = 20;
  }
  
  // Income stability (30%)
  const income = transactions.filter(t => t.type === 'Income');
  let incomeScore = 30;
  if (income.length >= 3) {
    const amounts = income.map(t => t.amount);
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    if (Math.min(...amounts) > avg * 0.8) incomeScore = 30;
    else if (Math.min(...amounts) > avg * 0.5) incomeScore = 20;
    else incomeScore = 10;
  }
  
  return Math.min(100, Math.round(savingsScore + consistencyScore + incomeScore));
}

/**
 * Get month-over-month expense change percentage
 */
export function getMonthOverMonthChange(transactions: Transaction[]): number {
  const monthlyComparison = getMonthlyComparison(transactions, 2);
  if (monthlyComparison.length < 2) return 0;
  
  const [prev, current] = monthlyComparison;
  if (prev.expenses === 0) return current.expenses > 0 ? 100 : 0;
  
  return ((current.expenses - prev.expenses) / prev.expenses) * 100;
}

/**
 * Format currency to USD
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get health score color (green/amber/red)
 */
export function getHealthScoreColor(score: number): string {
  if (score >= 70) return 'text-emerald-500';
  if (score >= 50) return 'text-amber-500';
  return 'text-error';
}

/**
 * Get health score label
 */
export function getHealthScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Attention';
}
