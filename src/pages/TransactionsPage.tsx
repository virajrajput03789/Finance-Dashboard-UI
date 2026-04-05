import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, cn, exportToCSV, exportToJSON } from '../utils';
import { SkeletonTable } from '../components/Loading/SkeletonLoader';
import { EmptyState } from '../components/EmptyState/EmptyState';
import { TransactionModal } from '../components/Transactions/TransactionModal';
import type { Transaction } from '../types';

type SortField = 'date' | 'amount' | 'category' | 'none';
type SortDirection = 'asc' | 'desc';
type DateRangeFilter = 'allTime' | 'thisMonth' | 'last3Months' | 'thisYear';

export const TransactionsPage = () => {
  const { transactions, activeRole, deleteTransaction, isLoading } = useFinance();
  const [filter, setFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showModal, setShowModal] = useState(false);
  // ✅ TASK 1: Add date range filter state
  const [dateRange, setDateRange] = useState<DateRangeFilter>('allTime');

  const categories = ['All', ...Array.from(new Set(transactions.map(t => t.category)))];

  // ✅ TASK 1: Helper function to check if transaction is within date range
  const isTransactionInDateRange = (txDate: string, range: DateRangeFilter): boolean => {
    const tx = new Date(txDate);
    const now = new Date();
    
    switch (range) {
      case 'thisMonth':
        return tx.getFullYear() === now.getFullYear() && 
               tx.getMonth() === now.getMonth();
      case 'last3Months':
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        return tx >= threeMonthsAgo && tx <= now;
      case 'thisYear':
        return tx.getFullYear() === now.getFullYear();
      case 'allTime':
      default:
        return true;
    }
  };

  const filteredTransactions = transactions.filter(t => 
    (filter === 'All' ? true : t.category === filter) &&
    isTransactionInDateRange(t.date, dateRange)
  );

  // Apply sorting after filtering
  const sortedTransactions = useMemo(() => {
    if (sortField === 'none') return filteredTransactions;

    const sorted = [...filteredTransactions].sort((a, b) => {
      let aVal: any, bVal: any;

      if (sortField === 'date') {
        aVal = new Date(a.date).getTime();
        bVal = new Date(b.date).getTime();
      } else if (sortField === 'amount') {
        aVal = a.amount;
        bVal = b.amount;
      } else if (sortField === 'category') {
        aVal = a.category.toLowerCase();
        bVal = b.category.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

    return sorted;
  }, [filteredTransactions, sortField, sortDirection]);



  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, start with desc
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="px-4 md:px-10 py-12 max-w-7xl mx-auto animate-page-in">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="font-headline text-5xl font-extrabold text-primary tracking-tight mb-2">Ledger</h2>
            <p className="text-on-surface-variant max-w-md">Detailed record of sovereign transactions and capital flow across global portfolios.</p>
          </div>
        </div>
        <SkeletonTable />
      </div>
    );
  }

  // Show empty state if no transactions in database
  if (transactions.length === 0) {
    return (
      <div className="px-4 md:px-10 py-12 max-w-7xl mx-auto animate-page-in">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="font-headline text-5xl font-extrabold text-primary tracking-tight mb-2">Ledger</h2>
            <p className="text-on-surface-variant max-w-md">Detailed record of sovereign transactions and capital flow across global portfolios.</p>
          </div>
        </div>
        <EmptyState
          icon="receipt_long"
          title="No Transactions Found"
          description="Start tracking your financial activity by adding your first transaction."
          variant="onboarding"
          action={activeRole === 'admin' ? {
            label: "Add Your First Transaction",
            onClick: () => { setEditingTransaction(null); setShowModal(true); }
          } : undefined}
        />
      </div>
    );
  }

  // Show empty state if filter returns zero results
  if (sortedTransactions.length === 0) {
    return (
      <div className="px-4 md:px-10 py-12 max-w-7xl mx-auto animate-page-in">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="font-headline text-5xl font-extrabold text-primary tracking-tight mb-2">Ledger</h2>
            <p className="text-on-surface-variant max-w-md">Detailed record of sovereign transactions and capital flow across global portfolios.</p>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="grid grid-cols-12 gap-8 mb-8">
          <div className="col-span-12 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mr-2">Filter By:</span>
            {categories.slice(0, 6).map(c => (
              <button 
                key={c}
                onClick={() => setFilter(c)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95",
                  filter === c 
                    ? "bg-primary text-white" 
                    : "bg-secondary-container text-on-secondary-container hover:bg-surface-container-highest"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <EmptyState
          icon="filter_list"
          title="No Results Found"
          description={`No transactions match the "${filter}" filter. Try clearing filters to see all transactions.`}
          action={{
            label: "Clear Filters",
            onClick: () => setFilter('All')
          }}
        />
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full animate-page-in"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Hero Header Section */}
      <div className="flex flex-col gap-4 mb-6 md:mb-8 lg:mb-12">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-headline font-extrabold text-primary tracking-tight mb-1 md:mb-2">Ledger</h2>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-md">Detailed record of sovereign transactions and capital flow.</p>
        </div>
        
        {/* Export Actions - compact on mobile */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          <div className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Export:</div>
          <div className="flex gap-2">
            <motion.button 
              onClick={() => exportToCSV(sortedTransactions)}
              whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              whileTap={{ y: 0 }}
              className="px-3 py-1.5 bg-surface-container-low rounded text-xs font-bold text-primary hover:bg-surface-container transition-colors cursor-pointer"
            >
              CSV
            </motion.button>
            <motion.button 
              onClick={() => exportToJSON(sortedTransactions)}
              whileHover={{ y: -2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              whileTap={{ y: 0 }}
              className="px-3 py-1.5 bg-surface-container-low rounded text-xs font-bold text-primary hover:bg-surface-container transition-colors cursor-pointer"
            >
              JSON
            </motion.button>
          </div>
        </div>
      </div>

      {/* Filters & Actions - collapsible on mobile */}
      <div className="mb-6 md:mb-8 space-y-4">
        {/* ✅ TASK 1: Date Range Filter Dropdown */}
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant whitespace-nowrap">
            Date Range:
          </label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRangeFilter)}
            className="px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface text-xs font-semibold border border-surface-container hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer"
          >
            <option value="allTime">All Time</option>
            <option value="thisMonth">This Month</option>
            <option value="last3Months">Last 3 Months</option>
            <option value="thisYear">This Year</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant whitespace-nowrap mr-1">Filter:</span>
          {categories.slice(0, 6).map(c => (
            <button 
              key={c}
              onClick={() => setFilter(c)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95 whitespace-nowrap",
                filter === c 
                  ? "bg-primary text-white" 
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table - hidden on mobile */}
      <div className="hidden md:block bg-surface-container-lowest rounded-lg md:rounded-xl editorial-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-surface-container-low">
              <tr>
                <motion.th 
                  onClick={() => handleSort('date')}
                  whileHover={{ color: '#1a3a2a' }}
                  className="px-4 md:px-6 py-3 md:py-4 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant cursor-pointer hover:text-primary transition-colors"
                >
                  Date {sortField === 'date' && (
                    <motion.span
                      animate={{ rotate: sortDirection === 'desc' ? 180 : 0 }}
                      transition={{ duration: 0.25, type: 'spring', stiffness: 300 }}
                      style={{ display: 'inline-block', marginLeft: '4px' }}
                    >
                      ↑
                    </motion.span>
                  )}
                </motion.th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Description</th>
                <motion.th 
                  onClick={() => handleSort('category')}
                  whileHover={{ color: '#1a3a2a' }}
                  className="px-4 md:px-6 py-3 md:py-4 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant cursor-pointer hover:text-primary transition-colors"
                >
                  Category {sortField === 'category' && (
                    <motion.span
                      animate={{ rotate: sortDirection === 'desc' ? 180 : 0 }}
                      transition={{ duration: 0.25, type: 'spring', stiffness: 300 }}
                      style={{ display: 'inline-block', marginLeft: '4px' }}
                    >
                      ↑
                    </motion.span>
                  )}
                </motion.th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Type</th>
                <motion.th 
                  onClick={() => handleSort('amount')}
                  whileHover={{ color: '#1a3a2a' }}
                  className="px-4 md:px-6 py-3 md:py-4 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant text-right cursor-pointer hover:text-primary transition-colors"
                >
                  Amount {sortField === 'amount' && (
                    <motion.span
                      animate={{ rotate: sortDirection === 'desc' ? 180 : 0 }}
                      transition={{ duration: 0.25, type: 'spring', stiffness: 300 }}
                      style={{ display: 'inline-block', marginLeft: '4px' }}
                    >
                      ↑
                    </motion.span>
                  )}
                </motion.th>
                {activeRole === 'admin' && (
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant text-center">Actions</th>
                )}
              </tr>
            </thead>
            <AnimatePresence mode="popLayout">
              <motion.tbody
                className="divide-y divide-surface-container-low"
                key={`table-${sortField}-${sortDirection}-${filter}-${dateRange}`}
                initial="hidden"
                animate="show"
                variants={{
                  hidden: {},
                  show: {
                    transition: { staggerChildren: 0.02, delayChildren: 0.05 },
                  },
                }}
              >
                {sortedTransactions.map((t) => (
                    <motion.tr
                      key={t.id}
                      variants={{
                        hidden: { opacity: 0, x: -20, scale: 0.99 },
                        show: {
                          opacity: 1,
                          x: 0,
                          scale: 1,
                          transition: {
                            type: 'spring' as const,
                            stiffness: 350,
                            damping: 28,
                          },
                        },
                      }}
                      whileHover={{
                        backgroundColor: 'rgba(0,0,0,0.025)',
                        transition: { duration: 0.1 },
                      }}
                      exit={{
                        opacity: 0,
                        x: 20,
                        scale: 0.98,
                        transition: { duration: 0.2 },
                      }}
                      layout
                      className="group hover:bg-slate-50/50 transition-colors duration-200"
                    >
                  <td className="px-4 md:px-6 py-4 md:py-6">
                    <p className="text-xs md:text-sm font-semibold text-on-surface">{t.date}</p>
                  </td>
                  <td className="px-4 md:px-6 py-4 md:py-6">
                    <span className="text-xs md:text-sm font-medium">{t.description}</span>
                  </td>
                  <td className="px-4 md:px-6 py-4 md:py-6">
                    <span className="text-xs md:text-sm font-medium text-on-surface-variant">{t.category}</span>
                  </td>
                  <td className="px-4 md:px-6 py-4 md:py-6">
                    <span className={cn(
                      "px-2 md:px-3 py-0.5 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-wider inline-block",
                      t.type === 'Income' ? "bg-primary-fixed text-on-primary-fixed-variant" : "bg-error-container text-on-error-container"
                    )}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-4 md:py-6 text-right">
                    <p className={cn(
                      "font-headline font-bold text-sm md:text-lg tabular-nums",
                      t.type === 'Income' ? "text-primary" : "text-error"
                    )}>
                      {t.type === 'Income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </p>
                  </td>
                  {activeRole === 'admin' && (
                    <td className="px-4 md:px-6 py-4 md:py-6 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditingTransaction(t); setShowModal(true); }}
                          className="p-1.5 hover:bg-primary/20 rounded transition-colors text-on-surface-variant hover:text-primary cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base" data-icon="edit">edit</span>
                        </button>
                        <button 
                          onClick={() => deleteTransaction(t.id)}
                          className="p-1.5 hover:bg-error-container/20 rounded transition-colors text-on-surface-variant hover:text-error cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-base" data-icon="delete">delete</span>
                        </button>
                      </div>
                    </td>
                  )}
                </motion.tr>
                ))}
              </motion.tbody>
            </AnimatePresence>
          </table>
        </div>
        {/* Pagination - desktop */}
        <div className="px-4 md:px-6 py-4 bg-surface-container-low flex items-center justify-between">
          <p className="text-xs text-on-surface-variant font-medium">Showing <span className="text-on-surface font-bold">1-{sortedTransactions.length}</span> of {sortedTransactions.length}</p>
          <div className="flex gap-1">
            <button className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center font-bold text-xs cursor-pointer">1</button>
          </div>
        </div>
      </div>

      {/* Mobile Card View - shown on mobile only */}
      <div className="md:hidden space-y-3">
        {sortedTransactions.map((t, idx) => (
          <div 
            key={t.id} 
            className="bg-surface-container-lowest rounded-lg p-4 border border-surface-container shadow-sm animate-row-stagger"
            style={{ animationDelay: `${Math.min(idx * 35, 350)}ms` }}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="font-bold text-primary text-sm line-clamp-1">{t.description}</p>
                <p className="text-xs text-on-surface-variant uppercase tracking-wider mt-0.5">{t.category}</p>
              </div>
              <span className={cn(
                "font-bold font-mono text-sm ml-2 whitespace-nowrap tabular-nums",
                t.type === 'Income' ? "text-emerald-600" : "text-primary"
              )}>
                {t.type === 'Income' ? '+' : '-'}
                {formatCurrency(Math.abs(t.amount)).replace(/\.00$/, '')}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-surface-container">
              <span className="text-xs text-on-surface-variant">{t.date}</span>
              <span className={cn(
                "text-xs px-2.5 py-0.5 rounded-full font-bold",
                t.type === 'Income' 
                  ? "bg-emerald-100 text-emerald-800" 
                  : "bg-red-100 text-red-600"
              )}>
                {t.type.toUpperCase()}
              </span>
            </div>
            {activeRole === 'admin' && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-surface-container">
                <button 
                  onClick={() => { setEditingTransaction(t); setShowModal(true); }}
                  className="text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button 
                  onClick={() => deleteTransaction(t.id)}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Pagination - compact */}
      {sortedTransactions.length > 0 && (
        <div className="md:hidden flex items-center justify-between mt-6 text-xs text-on-surface-variant">
          <span>Showing {sortedTransactions.length} items</span>
          <div className="flex gap-1">
            <button className="px-2 py-1 rounded bg-primary text-white font-bold text-xs cursor-pointer">1</button>
          </div>
        </div>
      )}

      {/* Contextual Insight (Bento Grid) - responsive */}
      <div className="mt-8 md:mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 bg-primary rounded-lg lg:rounded-xl p-6 lg:p-8 relative overflow-hidden group editorial-shadow">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-emerald-400/20 text-emerald-400 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-3 md:mb-4 inline-block">Monthly Outlook</span>
              <h3 className="text-2xl md:text-3xl font-headline font-bold text-white mb-2 leading-tight">Projected Liquidity Increase</h3>
              <p className="text-emerald-100/70 text-xs md:text-sm max-w-md mb-4 md:mb-8">Based on current transaction velocity, portfolio liquidity is expected to rise by 12.4% by fiscal year end.</p>
            </div>
            <div className="flex items-center gap-4 md:gap-6">
              <div className="flex flex-col">
                <span className="text-[8px] md:text-[10px] uppercase font-bold text-emerald-400 tracking-widest">Current Ratio</span>
                <span className="text-lg md:text-2xl font-headline font-bold text-white">2.45x</span>
              </div>
              <div className="w-px h-8 md:h-10 bg-white/10"></div>
              <div className="flex flex-col">
                <span className="text-[8px] md:text-[10px] uppercase font-bold text-emerald-400 tracking-widest">Velocity Score</span>
                <span className="text-lg md:text-2xl font-headline font-bold text-white">A+</span>
              </div>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-64 md:w-80 h-64 md:h-80 bg-primary-container rounded-full blur-[80px] md:blur-[100px] opacity-20 md:opacity-30 group-hover:scale-110 transition-transform duration-700"></div>
        </div>
        
        <div className="bg-surface-container rounded-lg lg:rounded-xl p-6 lg:p-8 flex flex-col justify-between editorial-shadow">
          <div>
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4 md:mb-6">Volume by Type</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Equities</span>
                  <span>65%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{width: '65%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>Digital Assets</span>
                  <span>24%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-secondary" style={{width: '24%'}}></div>
                </div>
              </div>
            </div>
          </div>
          <button className="w-full py-2.5 md:py-3 bg-white text-on-surface font-bold text-xs rounded-lg hover:shadow-sm transition-all flex items-center justify-center gap-2 mt-6 md:mt-8 cursor-pointer min-h-[44px]">
            View Report
            <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Transaction Modal */}
      <TransactionModal 
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingTransaction(null); }}
        editData={editingTransaction}
      />
    </motion.div>
  );
};

