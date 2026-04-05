
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils';

export const SummaryCards = () => {
  const { transactions } = useFinance();
  
  const totalIncome = transactions.filter(t => t.type === 'Income').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'Expense').reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  const cards = [
    {
      title: 'Total Balance',
      amount: balance,
      trend: '+12.5%',
      isPositive: true,
      icon: Wallet,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      title: 'Total Income',
      amount: totalIncome,
      trend: '+8.2%',
      isPositive: true,
      icon: TrendingUp,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      title: 'Total Expenses',
      amount: totalExpense,
      trend: '-3.1%',
      isPositive: false,
      icon: TrendingDown,
      color: 'text-danger',
      bg: 'bg-danger/10',
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-surface rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${card.bg} opacity-50 group-hover:scale-110 transition-transform duration-500`} />
            
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-muted font-medium mb-1">{card.title}</p>
                <h3 className="text-3xl font-bold text-text mb-4 tabular-nums">
                  {formatCurrency(card.amount)}
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                <Icon size={24} />
              </div>
            </div>
            
            <div className="relative z-10 flex items-center gap-2">
              <span className={`flex items-center text-sm font-medium ${card.isPositive ? 'text-success' : 'text-danger'}`}>
                {card.isPositive ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
                {card.trend}
              </span>
              <span className="text-sm text-muted">vs last month</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
