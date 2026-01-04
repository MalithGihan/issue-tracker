import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from 'recharts';

export function DonutChartCard({ 
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
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-xl border border-zinc-200 bg-linear-to-br from-zinc-50 to-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-zinc-900 mb-4">{title}</h3>
      <div className="relative">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              paddingAngle={2}
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
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-3xl font-bold text-zinc-900">{total}</div>
            <div className="text-xs text-zinc-600 mt-1">Total</div>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {data.map((item) => (
          <div key={item.name} className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: getColor(item.name) }}
              />
            </div>
            <div className="text-xs font-medium text-zinc-600">{item.name}</div>
            <div className="text-sm font-semibold text-zinc-900">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}