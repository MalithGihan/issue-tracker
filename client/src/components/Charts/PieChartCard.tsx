/* eslint-disable @typescript-eslint/no-explicit-any */
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export function PieChartCard({ 
  title, 
  data 
}: { 
  title: string; 
  data: { name: string; value: number }[] 
}) {
  const COLORS = {
    'OPEN': '#f97316',
    'IN_PROGRESS': '#3b82f6',
    'RESOLVED': '#22c55e',
    'LOW': '#71717a',
    'MEDIUM': '#eab308',
    'HIGH': '#ef4444'
  };

  const getColor = (name: string) => COLORS[name as keyof typeof COLORS] || '#3b82f6';

  const renderLabel = (entry: any) => {
    const percent = ((entry.value / data.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0);
    return `${percent}%`;
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-linear-to-br from-zinc-50 to-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-zinc-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff',
              border: '1px solid #e4e4e7',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-sm text-zinc-700">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}