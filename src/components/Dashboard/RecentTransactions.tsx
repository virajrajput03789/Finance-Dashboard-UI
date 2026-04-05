import { useFinance } from '../../context/FinanceContext';
import { formatCurrency, cn } from '../../utils';
import { format, parseISO } from 'date-fns';
import { ShoppingCart, Coffee, Car, HeartPulse, Film, Briefcase, Home, Zap } from 'lucide-react';

export const RecentTransactions = () => {
  const { transactions } = useFinance();
  const recent = transactions.slice(0, 5);

  const getIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'food': return <Coffee size={18} />;
      case 'transport': return <Car size={18} />;
      case 'shopping': return <ShoppingCart size={18} />;
      case 'healthcare': return <HeartPulse size={18} />;
      case 'entertainment': return <Film size={18} />;
      case 'rent': return <Home size={18} />;
      case 'utilities': return <Zap size={18} />;
      default: return <Briefcase size={18} />;
    }
  };

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <button className="text-sm text-accent hover:underline font-medium">View All</button>
      </div>

      <div className="space-y-4">
        {recent.length === 0 ? (
          <p className="text-muted text-center py-4">No recent transactions.</p>
        ) : (
          recent.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-muted/5 rounded-xl transition-colors">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "p-3 rounded-xl",
                  tx.type === 'Income' ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                )}>
                  {getIcon(tx.category)}
                </div>
                <div>
                  <p className="font-semibold text-text">{tx.description}</p>
                  <p className="text-sm text-muted">{tx.category} • {format(parseISO(tx.date), 'MMM dd, yyyy')}</p>
                </div>
              </div>
              <div className={cn(
                "font-bold flex items-center gap-1",
                tx.type === 'Income' ? "text-success" : "text-text"
              )}>
                {tx.type === 'Income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
