import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

export const SpendingDonut = () => {
  const { transactions } = useFinance();

  const data = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'Expense');
    const categoryMap: Record<string, number> = {};
    
    expenses.forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });
    
    return Object.keys(categoryMap)
      .map(key => ({ name: key, value: categoryMap[key] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // top 5
  }, [transactions]);

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col">
      <h3 className="text-lg font-semibold mb-6">Spending by Category</h3>
      <div className="flex-1 min-h-[300px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => formatCurrency(value as number)}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--surface))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-muted">No expenses found.</div>
        )}
      </div>
    </div>
  );
};
