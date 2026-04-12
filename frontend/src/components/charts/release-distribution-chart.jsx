import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function ReleaseDistributionChart({ distribution, recommendedMonth }) {
  const data = MONTHS.map((label, index) => ({
    name: label,
    value: Number(distribution?.[String(index + 1)] || 0),
    month: index + 1,
  }))

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: 'rgba(99,102,241,0.05)' }}
            contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, color: '#0f172a' }}
          />
          <Bar dataKey="value" radius={[12, 12, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.month} fill={entry.month === recommendedMonth ? '#6366f1' : '#cbd5e1'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
