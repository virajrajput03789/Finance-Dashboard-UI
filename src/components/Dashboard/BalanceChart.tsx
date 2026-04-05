import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { format, subMonths, parseISO, isAfter } from 'date-fns';
import { formatCurrency } from '../../utils';

export const BalanceChart = () => {
  const { transactions } = useFinance();

  const data = useMemo(() => {
    const sixMonthsAgo = subMonths(new Date(), 6);
    
    // Group transactions by month
    const monthlyMap: Record<string, { income: number; expense: number }> = {};
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(new Date(), i);
      const key = format(d, 'MMM yyyy');
      monthlyMap[key] = { income: 0, expense: 0 };
    }

    transactions.forEach(t => {
      const tDate = parseISO(t.date);
      if (isAfter(tDate, sixMonthsAgo)) {
        const key = format(tDate, 'MMM yyyy');
        if (monthlyMap[key]) {
          if (t.type === 'Income') monthlyMap[key].income += t.amount;
          else monthlyMap[key].expense += t.amount;
        }
      }
    });

    let runningBalance = 0; // In a real app we would have an initial balance
    
    return Object.keys(monthlyMap).map(key => {
      runningBalance += (monthlyMap[key].income - monthlyMap[key].expense);
      return {
        name: key,
        balance: runningBalance > 0 ? runningBalance : Math.max(0, runningBalance + 5000) // Mock offset
      };
    });
  }, [transactions]);

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
      <h3 className="text-lg font-semibold mb-6">Balance Trend</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'hsl(var(--muted))', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(val) => `$${val/1000}k`}
              tick={{ fill: 'hsl(var(--muted))', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--surface))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value: any) => [formatCurrency(value as number), 'Balance']}
            />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke="hsl(var(--accent))" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorBalance)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
