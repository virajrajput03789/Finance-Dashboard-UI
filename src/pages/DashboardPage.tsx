import { useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, cn } from '../utils';
import { SkeletonWealthTiles, SkeletonTable } from '../components/Loading/SkeletonLoader';
import { EmptyState } from '../components/EmptyState/EmptyState';
import { WealthTile } from '../components/Dashboard/WealthTile';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

export const DashboardPage = () => {
  const { transactions, isLoading, activeRole } = useFinance();
  const chartRef = useRef(null);

  const metrics = useMemo(() => {
    let income = 0;
    let expenses = 0;
    const categoryTotals: Record<string, number> = {};

    transactions.forEach((t) => {
      if (t.type === 'Income') income += t.amount;
      else {
        expenses += t.amount;
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      }
    });

    return { income, expenses, balance: income - expenses, categoryTotals };
  }, [transactions]);

  // Calculate quick stats with correct formulas
  const quickStats = useMemo(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const daysElapsed = today.getDate();

    const thisMonthExpenses = transactions
      .filter((tx) => {
        const txDate = new Date(tx.date);
        return tx.type === 'Expense' && txDate >= startOfMonth && txDate <= today;
      })
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    // Calculate avg daily: use current month if has expenses, else fall back to all-time average
    let avgDaily = 0;
    const allExpenses = transactions.filter((tx) => tx.type === 'Expense');
    
    if (thisMonthExpenses > 0) {
      avgDaily = daysElapsed > 0 ? thisMonthExpenses / daysElapsed : 0;
    } else if (allExpenses.length > 0) {
      // Fallback: all-time expense average
      const dates = allExpenses.map((tx) => new Date(tx.date));
      const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
      const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));
      const totalDays = Math.max(
        1,
        Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))
      );
      const totalExpenseAmount = allExpenses.reduce(
        (sum, tx) => sum + Math.abs(tx.amount),
        0
      );
      avgDaily = totalExpenseAmount / totalDays;
    }

    // Get largest single expense (not income)
    const largestOutflow =
      allExpenses.length > 0 ? Math.max(...allExpenses.map((tx) => Math.abs(tx.amount))) : 0;

    // Total entries
    const totalEntries = transactions.length;

    // Calculate savings rate and status
    const totalIncome = transactions.filter((tx) => tx.type === 'Income').reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpense = allExpenses.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
    const status = savingsRate > 20 ? 'Optimized' : savingsRate > 0 ? 'Active' : 'At Risk';
    const statusColor = savingsRate > 20 ? 'emerald' : savingsRate > 0 ? 'amber' : 'red';

    return { avgDaily, largestOutflow, totalEntries, status, statusColor };
  }, [transactions]);

  // Calculate 7-day sparkline data for wealth tiles
  const sparklineData = useMemo(() => {
    const days: Array<{ amount: number }> = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      const dayTransactions = transactions.filter((tx) => {
        const txDate = new Date(tx.date);
        return txDate >= dayStart && txDate < new Date(dayStart.getTime() + 86400000);
      });
      
      const dayAmount = dayTransactions.reduce((sum, tx) => {
        return sum + (tx.type === 'Income' ? tx.amount : -tx.amount);
      }, 0);
      
      days.push({ amount: dayAmount });
    }
    
    return days;
  }, [transactions]);

  // Animate counter values using framer-motion (handled inside WealthTile component)
  // Each WealthTile manages its own animation

  if (isLoading) {
    return (
      <div className="animate-page-in">
        <section className="mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Financial Overview</span>
          <h2 className="text-5xl font-headline font-extrabold text-primary tracking-tight mt-2">The Wealth Statement</h2>
        </section>
        <SkeletonWealthTiles />
        <div className="mt-16">
          <SkeletonTable />
        </div>
      </div>
    );
  }

  // Show empty state if no transactions
  if (transactions.length === 0) {
    return (
      <div className="animate-page-in">
        <section className="mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Financial Overview</span>
          <h2 className="text-5xl font-headline font-extrabold text-primary tracking-tight mt-2">The Wealth Statement</h2>
        </section>
        <EmptyState
          icon="account_balance"
          title="No Transactions Yet"
          description="Get started by adding your first transaction to track your financial activity."
          variant="onboarding"
          action={activeRole === 'admin' ? {
            label: "Add Your First Transaction",
            onClick: () => window.dispatchEvent(new CustomEvent('openTransactionModal'))
          } : undefined}
        />
      </div>
    );
  }

  return (
    <motion.div 
      className="animate-page-in w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Hero Section: Intentional Asymmetry */}
      <section className="mb-6 md:mb-8 lg:mb-12">
        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold block mb-2">Financial Overview</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-extrabold text-primary tracking-tight">The Wealth Statement</h2>
        <p className="text-xs sm:text-sm md:text-base text-on-surface-variant mt-2 md:mt-4 max-w-md leading-relaxed">
          Your financial architecture is evolving. Total liquid assets have appreciated according to live ledger, driven by diverse portfolio rebalancing.
        </p>
        {/* System Status Badge - mobile compact */}
        <div className="mt-4 md:mt-6 bg-surface-container-low px-3 md:px-6 py-2 md:py-4 rounded-lg md:rounded-xl editorial-shadow inline-block">
          <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-on-surface-variant">System Status</p>
          <div className="flex items-center gap-2 mt-1 md:mt-2">
            <span className="h-2 w-2 bg-emerald-500 rounded-full shrink-0"></span>
            <span className="font-bold text-primary text-xs md:text-sm">Synced: Live Markets</span>
          </div>
        </div>
      </section>

      {/* Quick Stats - 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 md:mb-8">
        <motion.div 
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className="bg-surface-container-low p-3 md:p-4 rounded-lg"
        >
          <p className="text-[8px] uppercase tracking-widest text-on-surface-variant font-bold">Avg Daily Spend</p>
          <p className="text-lg md:text-xl font-bold text-primary mt-1">${quickStats.avgDaily.toFixed(0)}</p>
        </motion.div>
        <motion.div 
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className="bg-surface-container-low p-3 md:p-4 rounded-lg"
        >
          <p className="text-[8px] uppercase tracking-widest text-on-surface-variant font-bold">Largest Outflow</p>
          <p className="text-lg md:text-xl font-bold text-primary mt-1 tabular-nums">{formatCurrency(quickStats.largestOutflow)}</p>
        </motion.div>
        <motion.div 
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className="bg-surface-container-low p-3 md:p-4 rounded-lg"
        >
          <p className="text-[8px] uppercase tracking-widest text-on-surface-variant font-bold">Total Entries</p>
          <p className="text-lg md:text-xl font-bold text-primary mt-1">{quickStats.totalEntries}</p>
        </motion.div>
        <motion.div 
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className="bg-surface-container-low p-3 md:p-4 rounded-lg"
        >
          <p className="text-[8px] uppercase tracking-widest text-on-surface-variant font-bold">Status</p>
          <p className={cn('text-lg md:text-xl font-bold mt-1', 
            quickStats.statusColor === 'emerald' ? 'text-emerald-600' : 
            quickStats.statusColor === 'amber' ? 'text-amber-600' : 
            'text-red-600'
          )}>{quickStats.status}</p>
        </motion.div>
      </div>

      {/* Wealth Tiles: 1 col mobile, 2 cols tablet, 3 cols desktop */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 md:mb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <WealthTile
          key={`balance-${transactions.length}-${metrics.balance}`}
          index={0}
          title="Total Balance"
          value={metrics.balance}
          icon="account_balance"
          badge="+2.4%"
          badgeColor="emerald"
          description="Last activity: Live Tracking"
          sparklineData={sparklineData}
        />
        <WealthTile
          key={`income-${transactions.length}-${metrics.income}`}
          index={1}
          title="Monthly Income"
          value={metrics.income}
          icon="arrow_upward"
          badge="Optimal"
          badgeColor="emerald"
          description="Live flow calculation"
          sparklineData={sparklineData}
        />
        <WealthTile
          key={`expenses-${transactions.length}-${metrics.expenses}`}
          index={2}
          title="Monthly Expenses"
          value={metrics.expenses}
          icon="arrow_downward"
          badge="-12%"
          badgeColor="error"
          description={`Savings Gap: ${formatCurrency(metrics.balance)}`}
          sparklineData={sparklineData}
        />
      </motion.div>

      {/* Analytical Layer: Charts - 1 col mobile, side-by-side desktop */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8"
        ref={chartRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, margin: '-80px' }}
      >
        {/* Balance Trend */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-4 md:p-6 lg:p-10 rounded-lg md:rounded-xl editorial-shadow">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-12">
            <div>
              <h4 className="text-lg md:text-xl font-headline font-bold text-primary">Balance Trend</h4>
              <p className="text-on-surface-variant text-xs md:text-sm mt-1">12-month trajectory</p>
            </div>
            <div className="flex gap-2">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs font-bold bg-surface-container-low hover:bg-surface-container transition-colors"
              >
                1Y
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors"
              >
                5Y
              </motion.button>
            </div>
          </div>
          {/* Responsive Chart Container */}
          <div className="relative h-40 md:h-64 w-full flex items-end gap-1 overflow-x-auto">
            <div className="absolute inset-0 flex flex-col justify-between">
              <div className="w-full h-px bg-surface-container-high/50"></div>
              <div className="w-full h-px bg-surface-container-high/50"></div>
              <div className="w-full h-px bg-surface-container-high/50"></div>
              <div className="w-full h-px bg-surface-container-high/50"></div>
            </div>
            {/* Mock bars */}
            {[40, 45, 42, 55, 65, 60, 75, 80, 78, 90, 85, 95].map((height, i) => (
              <div 
                key={i}
                className={cn(
                  "flex-1 min-w-[12px] rounded-t origin-bottom animate-bar-grow transition-all hover:opacity-80",
                  height > 80 ? "bg-primary" : height > 70 ? "bg-primary/30 border-t-2 border-primary" : height > 60 ? "bg-primary/20 border-t-2 border-primary" : "bg-primary/10"
                )}
                style={{ height: `${height}%`, animationDelay: `${i * 35}ms` }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between mt-2 md:mt-4 text-[8px] md:text-[10px] uppercase font-bold text-on-surface-variant tracking-widest px-2">
            <span>Jan</span>
            <span className="hidden sm:inline">Mar</span>
            <span>Jun</span>
            <span className="hidden sm:inline">Sep</span>
            <span>Dec</span>
          </div>
        </div>

        {/* Spending Breakdown - full width on mobile, right col on desktop */}
        <div className="bg-primary text-white p-4 md:p-6 lg:p-10 rounded-lg md:rounded-xl editorial-shadow flex flex-col">
          <h4 className="text-lg md:text-xl font-headline font-bold mb-1">Expenditure</h4>
          <p className="text-emerald-400/60 text-xs md:text-sm mb-4 md:mb-8">Categorical dist.</p>
          {/* Mobile: show as list, Desktop: show as donut */}
          <div className="hidden lg:flex flex-1 flex-col items-center justify-center mb-6">
            <div className="relative h-40 w-40">
              <div className="absolute inset-0 rounded-full border-[12px] border-emerald-900"></div>
              <div className="absolute inset-0 rounded-full border-[12px] border-emerald-400 border-t-transparent border-l-transparent transform rotate-45"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-headline font-extrabold tabular-nums">{formatCurrency(metrics.expenses).replace(/\.00$/, '')}</span>
                <span className="text-[8px] uppercase tracking-widest text-emerald-400/60">Total</span>
              </div>
            </div>
          </div>
          <div className="space-y-2 md:space-y-3 flex-1 lg:flex-initial">
            {Object.entries(metrics.categoryTotals).slice(0, 4).map(([category, amount], idx) => (
              <div key={category} className="flex justify-between items-center">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={cn(
                    "h-2 w-2 rounded-full shrink-0",
                    idx === 0 ? "bg-emerald-400" : idx === 1 ? "bg-emerald-300" : idx === 2 ? "bg-emerald-200" : "bg-tertiary"
                  )}></span>
                  <span className="text-xs md:text-sm font-medium truncate">{category}</span>
                </div>
                <span className="text-xs md:text-sm font-bold ml-2 shrink-0">${(amount / 1000).toFixed(1)}k</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recent Ledger Activity */}
      <motion.section 
        className="mt-8 md:mt-12 lg:mt-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 mb-4 md:mb-8">
          <div>
            <h4 className="text-xl md:text-2xl font-headline font-bold text-primary">Recent Transactions</h4>
            <p className="text-on-surface-variant text-xs md:text-sm mt-0.5 md:mt-1">Direct ledger entries</p>
          </div>
          <button className="text-primary font-bold text-xs md:text-sm hover:underline cursor-pointer whitespace-nowrap">View All →</button>
        </div>
        
        {/* Desktop Table - hidden on mobile */}
        <div className="hidden md:block bg-surface-container-lowest rounded-lg md:rounded-xl editorial-shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="px-4 md:px-8 py-3 md:py-4 text-[8px] md:text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">DESCRIPTION</th>
                <th className="px-4 md:px-8 py-3 md:py-4 text-[8px] md:text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">CATEGORY</th>
                <th className="px-4 md:px-8 py-3 md:py-4 text-[8px] md:text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">DATE</th>
                <th className="px-4 md:px-8 py-3 md:py-4 text-[8px] md:text-[10px] uppercase tracking-widest font-bold text-on-surface-variant text-right">AMOUNT</th>
              </tr>
            </thead>
            <motion.tbody 
              key={`table-${transactions.length}-${transactions[0]?.id}`}
              className="divide-y divide-surface-container"
            >
              {transactions.slice(0, 4).map((t, idx) => (
                <motion.tr 
                  key={t.id} 
                  className="hover:bg-surface-container-high transition-colors" 
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.08 }}
                  whileHover={{ backgroundColor: 'rgba(10, 200, 160, 0.05)' }}
                >
                  <td className="px-4 md:px-8 py-3 md:py-6">
                    <div className="flex items-center gap-3">
                      <div className="h-8 md:h-10 w-8 md:w-10 bg-surface-container flex items-center justify-center rounded-lg text-primary shrink-0">
                        <span className="material-symbols-outlined text-sm" data-icon="payments">payments</span>
                      </div>
                      <div>
                        <p className="font-bold text-primary text-xs md:text-sm">{t.description}</p>
                        <p className="text-[10px] md:text-xs text-on-surface-variant">{t.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 md:px-8 py-3 md:py-6">
                    <span className="text-[8px] md:text-[10px] px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-secondary-container text-on-secondary-container font-bold uppercase">{t.category}</span>
                  </td>
                  <td className="px-4 md:px-8 py-3 md:py-6 text-xs md:text-sm text-on-surface-variant">{t.date}</td>
                  <td className={cn(
                    "px-4 md:px-8 py-3 md:py-6 text-right font-headline font-bold text-xs md:text-sm",
                    t.type === 'Income' ? "text-emerald-600" : "text-primary"
                  )}>
                    {t.type === 'Income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>

        {/* Mobile Card View - shown on mobile only */}
        <div className="md:hidden space-y-3">
          {transactions.slice(0, 4).map((t, idx) => (
            <div 
              key={t.id} 
              className="bg-surface-container-lowest rounded-lg p-4 border border-surface-container shadow-sm animate-row-stagger"
              style={{ animationDelay: `${idx * 35}ms` }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-primary text-sm">{t.description}</p>
                  <p className="text-xs text-on-surface-variant uppercase tracking-wider mt-0.5">{t.category}</p>
                </div>
                <span className={cn(
                  "font-bold font-mono text-sm",
                  t.type === 'Income' ? "text-emerald-600" : "text-primary"
                )}>
                  {t.type === 'Income' ? '+' : '-'}
                  {formatCurrency(Math.abs(t.amount))}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-surface-container">
                <span className="text-xs text-on-surface-variant">{t.date}</span>
                <span className={cn(
                  "text-xs px-2 py-0.5 rounded-full font-bold",
                  t.type === 'Income' 
                    ? "bg-emerald-100 text-emerald-800" 
                    : "bg-red-100 text-red-600"
                )}>
                  {t.type.toUpperCase()}
                </span>
              </div>
              {activeRole === 'admin' && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-surface-container">
                  <motion.button 
                    whileHover={{ scale: 1.05, color: '#10b981' }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs text-on-surface-variant hover:text-primary transition-colors"
                  >
                    Edit
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05, color: '#ef4444' }}
                    whileTap={{ scale: 0.95 }}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    Delete
                  </motion.button>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
};
