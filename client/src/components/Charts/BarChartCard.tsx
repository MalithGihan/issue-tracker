import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip} from 'recharts';

export function BarChartCard({ 
  title, 
  data 
}: { 
  title: string; 
  data: { name: string; value: number }[] 
}) {
  const getBarColor = (name: string) => {
    if (name === 'OPEN') return '#f97316'; // orange
    if (name === 'IN_PROGRESS') return '#3b82f6'; // blue
    if (name === 'RESOLVED') return '#22c55e'; // green
    if (name === 'LOW') return '#71717a'; // zinc
    if (name === 'MEDIUM') return '#eab308'; // yellow
    if (name === 'HIGH') return '#ef4444'; // red
    return '#3b82f6';
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-linear-to-br from-zinc-50 to-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-zinc-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#71717a', fontSize: 12 }}
            axisLine={{ stroke: '#e4e4e7' }}
          />
          <YAxis 
            tick={{ fill: '#71717a', fontSize: 12 }}
            axisLine={{ stroke: '#e4e4e7' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff',
              border: '1px solid #e4e4e7',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            labelStyle={{ color: '#18181b', fontWeight: 600 }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.name)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}