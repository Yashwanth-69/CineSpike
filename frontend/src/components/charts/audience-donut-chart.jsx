import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#60a5fa', '#818cf8', '#2dd4bf', '#a78bfa']

export default function AudienceDonutChart({ genderSplit }) {
  const data = Object.entries(genderSplit || {}).map(([name, value]) => ({ name, value }))

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={68} outerRadius={100} paddingAngle={4}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, color: '#0f172a' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
