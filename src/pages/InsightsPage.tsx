import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, cn } from '../utils';
import { SkeletonTable } from '../components/Loading/SkeletonLoader';
import { EmptyState } from '../components/EmptyState/EmptyState';

export const InsightsPage = () => {
  const { transactions, isLoading } = useFinance();

  const metrics = useMemo(() => {
    let income = 0;
    let expenses = 0;
    const categoryTotals: Record<string, number> = {};
    let highestSingleExpense = 0;
    let highestSingleExpenseName = '';

    transactions.forEach((t) => {
      if (t.type === 'Income') income += t.amount;
      else {
        expenses += t.amount;
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        if (t.amount > highestSingleExpense) {
          highestSingleExpense = t.amount;
          highestSingleExpenseName = t.description;
        }
      }
    });

    let topCategory = { name: 'None', amount: 0 };
    Object.entries(categoryTotals).forEach(([name, amount]) => {
      if (amount > topCategory.amount) topCategory = { name, amount };
    });

    // Calculate monthly data for spending velocity
    const monthlyData: Record<string, { income: number; expenses: number }> = {};
    transactions.forEach((t) => {
      const monthKey = t.date.slice(0, 7); // YYYY-MM
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expenses: 0 };
      }
      if (t.type === 'Income') {
        monthlyData[monthKey].income += t.amount;
      } else {
        monthlyData[monthKey].expenses += t.amount;
      }
    });

    // Get last 3 months sorted
    const sortedMonths = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-3);

    const topCategoryPercentage = expenses > 0 ? (topCategory.amount / expenses) * 100 : 0;

    return { 
      income, 
      expenses, 
      savingsRate: income > 0 ? ((income - expenses) / income) * 100 : 0,
      topCategory,
      topCategoryPercentage,
      highestSingleExpense,
      highestSingleExpenseName,
      monthlyData: sortedMonths
    };
  }, [transactions]);

  if (isLoading) {
    return (
      <div className="animate-page-in max-w-7xl mx-auto px-4 md:px-10 py-12">
        <section className="mb-12">
          <span className="text-xs font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-2 block font-headline">Analytical Performance</span>
          <h2 className="font-headline text-5xl font-extrabold tracking-tight text-primary leading-none">Financial Insights</h2>
        </section>
        <SkeletonTable />
      </div>
    );
  }

  // Show empty state if no transactions
  if (transactions.length === 0) {
    return (
      <div className="animate-page-in max-w-7xl mx-auto px-4 md:px-10 py-12">
        <section className="mb-12">
          <span className="text-xs font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-2 block font-headline">Analytical Performance</span>
          <h2 className="font-headline text-5xl font-extrabold tracking-tight text-primary leading-none">Financial Insights</h2>
        </section>
        <EmptyState
          icon="analytics"
          title="No Data Available"
          description="Add transactions to see detailed spending analysis, velocity metrics, and financial insights."
          variant="onboarding"
        />
      </div>
    );
  }

  // Format month for display (Oct 2023, etc)
  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(`${year}-${month}-01`);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <motion.div 
      className="w-full animate-page-in"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Header Section */}
      <section className="mb-6 md:mb-8 lg:mb-12">
        <span className="text-xs font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-2 block font-headline">Analytical Performance</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-primary leading-none">Financial Insights</h2>
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 bg-secondary-container px-3 py-1 rounded-full text-on-secondary-container text-xs font-semibold">
            <span className="material-symbols-outlined text-sm" data-icon="calendar_today">calendar_today</span>
            <span className="truncate">{metrics.monthlyData.length > 0 
              ? `${formatMonth(metrics.monthlyData[0][0])} - ${formatMonth(metrics.monthlyData[metrics.monthlyData.length - 1][0])}`
              : 'Analysis Period'}</span>
          </div>
          <div className="hidden sm:block h-px w-8 bg-outline-variant/30"></div>
          <p className="text-on-surface-variant text-xs sm:text-sm italic">Spending patterns & growth</p>
        </div>
      </section>

      {/* Insights Bento Grid - responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
        
        {/* Left Column: Primary Spending Insight - full width on mobile */}
        <div className="col-span-1 lg:col-span-5 space-y-4 md:space-y-6">
          {/* Highest Spending Category Card */}
          <div className="bg-surface-container-lowest rounded-lg md:rounded-xl p-6 md:p-8 transition-all hover:bg-surface-container relative overflow-hidden editorial-shadow border border-primary/10">
            <div className="absolute top-0 right-0 p-4 md:p-8 opacity-5 md:opacity-10">
              <span className="material-symbols-outlined text-6xl md:text-8xl" data-icon="trending_down">trending_down</span>
            </div>
            <div className="flex justify-between items-start mb-6 md:mb-10 relative z-10">
              <div className="bg-error-fixed p-2 md:p-3 rounded-lg text-error">
                <span className="material-symbols-outlined text-base md:text-2xl" data-icon="account_balance_wallet">account_balance_wallet</span>
              </div>
              <div className="text-right">
                <p className="text-[8px] md:text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">Top Drain</p>
                <p className="text-sm md:text-lg font-headline font-bold text-error truncate">{metrics.topCategory.name}</p>
              </div>
            </div>
            <div className="mb-6 md:mb-8 relative z-10">
              <p className="text-xs md:text-sm font-medium text-on-surface-variant mb-1">Total Allocated</p>
              <h3 className="font-headline text-4xl md:text-6xl font-extrabold text-error tracking-tighter tabular-nums">{formatCurrency(metrics.topCategory.amount).replace(/\.00$/, '')}</h3>
              <p className="text-xs text-on-surface-variant mt-2">
                {metrics.topCategoryPercentage.toFixed(1)}% of total spending
              </p>
            </div>
            <div className="flex items-start gap-2 bg-error/5 p-3 md:p-4 rounded-lg relative z-10">
              <span className="material-symbols-outlined text-error text-lg md:text-xl shrink-0 mt-0.5" data-icon="warning">warning</span>
              <p className="text-xs md:text-sm font-medium text-error">Largest outbound capital sector in this cycle.</p>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-lg md:rounded-xl p-6 md:p-8 space-y-4 md:space-y-6">
            <h4 className="font-headline text-lg md:text-xl font-bold text-primary">Strategic Observations</h4>
            <div className="space-y-3 md:space-y-4">
              <div className="flex gap-3 md:gap-4 p-3 md:p-4 bg-surface-container-lowest rounded-lg border-l-4 border-emerald-500">
                <div className="h-8 md:h-10 w-8 md:w-10 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-700 shrink-0 text-sm md:text-base">
                  <span className="material-symbols-outlined" data-icon="trending_up">trending_up</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm font-bold text-on-surface">Saving Optimization</p>
                  <p className="text-xs text-on-surface-variant mt-1">Savings rate at <span className="text-emerald-700 font-bold">{metrics.savingsRate.toFixed(1)}%</span>. Reserves increasing.</p>
                </div>
              </div>
              <div className="flex gap-3 md:gap-4 p-3 md:p-4 bg-surface-container-lowest rounded-lg border-l-4 border-tertiary">
                <div className="h-8 md:h-10 w-8 md:w-10 flex items-center justify-center rounded-full bg-tertiary-fixed text-tertiary shrink-0 text-sm md:text-base">
                  <span className="material-symbols-outlined" data-icon="receipt">receipt</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-sm font-bold text-on-surface">Significant Outlier</p>
                  <p className="text-xs text-on-surface-variant mt-1">Highest: <span className="text-tertiary font-bold truncate">{metrics.highestSingleExpenseName}</span> (<span className="tabular-nums">{formatCurrency(metrics.highestSingleExpense).replace(/\.00$/, '')}</span>).</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Charts & Heatmap - responsive stacking */}
        <div className="col-span-1 lg:col-span-7 space-y-4 md:space-y-6">
          {/* Monthly Spending Comparison */}
          <div className="bg-surface-container-lowest rounded-lg md:rounded-xl p-6 md:p-8 editorial-shadow">
            <div className="mb-6 md:mb-12">
              <div>
                <h4 className="font-headline text-lg md:text-2xl font-bold text-primary">Monthly Spending</h4>
                <p className="text-xs md:text-sm text-on-surface-variant">Income vs Expense trends</p>
              </div>
              <div className="flex gap-4 text-xs font-bold uppercase tracking-wider mt-4 md:mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-primary rounded-sm"></div>
                  <span>Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-error rounded-sm"></div>
                  <span>Expenses</span>
                </div>
              </div>
            </div>
            
            {metrics.monthlyData.length > 0 ? (
              <>
                <div className="h-40 md:h-64 w-full flex items-end justify-between gap-2 md:gap-4 lg:gap-6 border-b border-outline-variant/20 px-2 md:px-4 pb-4">
                  {metrics.monthlyData.map(([monthKey, data]) => {
                    const maxValue = Math.max(
                      ...metrics.monthlyData.map(([_, d]) => Math.max(d.income, d.expenses))
                    );
                    const incomeHeight = (data.income / maxValue) * 100;
                    const expenseHeight = (data.expenses / maxValue) * 100;

                    return (
                      <div key={monthKey} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full flex justify-center gap-1 md:gap-2 h-full items-end">
                          <div 
                            className="flex-1 bg-primary rounded-t-sm transition-all group-hover:brightness-110"
                            style={{height: `${incomeHeight}%`}}
                            title={`Income: ${formatCurrency(data.income)}`}
                          ></div>
                          <div 
                            className="flex-1 bg-error rounded-t-sm transition-all group-hover:brightness-110"
                            style={{height: `${expenseHeight}%`}}
                            title={`Expenses: ${formatCurrency(data.expenses)}`}
                          ></div>
                        </div>
                        <span className="text-[8px] md:text-[10px] font-bold text-on-surface-variant uppercase">{formatMonth(monthKey)}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Monthly Summary - compact on mobile */}
                <div className="mt-6 md:mt-12 space-y-2 md:space-y-4">
                  {metrics.monthlyData.map(([monthKey, data], idx) => {
                    const prevMonth = idx > 0 ? metrics.monthlyData[idx - 1] : null;
                    const expenseChange = prevMonth ? (((data.expenses - prevMonth[1].expenses) / prevMonth[1].expenses) * 100) : 0;
                    const direction = expenseChange > 0 ? 'increased' : 'decreased';
                    const absChange = Math.abs(expenseChange).toFixed(1);

                    return (
                      <div key={monthKey} className="p-3 md:p-4 bg-surface-container-low rounded-lg">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs md:text-sm font-bold text-on-surface">{formatMonth(monthKey)}</p>
                            <p className="text-xs text-on-surface-variant mt-0.5 md:mt-1 line-clamp-2">
                              <span className="tabular-nums">In: {formatCurrency(data.income).replace(/\.00$/, '')} | Out: {formatCurrency(data.expenses).replace(/\.00$/, '')}</span>
                            </p>
                            {prevMonth && (
                              <p className="text-xs text-on-surface-variant mt-0.5 md:mt-1">
                                Spending <span className={expenseChange > 0 ? 'text-error font-bold' : 'text-emerald-600 font-bold'}>
                                  {direction} {absChange}%
                                </span>
                              </p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs md:text-sm font-bold text-primary tabular-nums">{formatCurrency(data.income - data.expenses).replace(/\.00$/, '')}</p>
                            <p className="text-[10px] text-on-surface-variant">Net</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="py-8 md:py-12 text-center text-on-surface-variant">
                <p className="text-xs md:text-sm">Not enough data for monthly comparison</p>
              </div>
            )}
          </div>

          {/* Daily Spending Density (Heatmap) - mobile friendly */}
          <div className="bg-surface-container rounded-lg md:rounded-xl p-6 md:p-8 editorial-shadow">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h4 className="font-headline text-lg md:text-lg font-bold text-primary">Daily Spending Density</h4>
              <span className="material-symbols-outlined text-primary cursor-pointer text-lg md:text-xl" data-icon="info">info</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5 md:gap-2">
              {[...Array(21)].map((_, i) => (
                <div key={i} className={cn(
                  "aspect-square rounded-sm transition-all hover:scale-110 cursor-pointer",
                  i % 3 === 0 ? "bg-primary/20" : i % 5 === 0 ? "bg-primary/80" : i % 2 === 0 ? "bg-primary/40" : "bg-primary/10"
                )}></div>
              ))}
            </div>
            <div className="flex justify-between mt-3 md:mt-4 text-[10px] font-bold text-on-surface-variant uppercase">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
