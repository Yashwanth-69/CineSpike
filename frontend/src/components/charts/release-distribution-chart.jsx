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
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="name" stroke="#71717a" tickLine={false} axisLine={false} />
          <YAxis stroke="#71717a" tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            contentStyle={{ background: '#0c0d13', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }}
          />
          <Bar dataKey="value" radius={[12, 12, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.month} fill={entry.month === recommendedMonth ? '#ec4899' : 'rgba(139,92,246,0.45)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
