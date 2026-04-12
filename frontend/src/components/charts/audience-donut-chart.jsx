import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#ec4899', '#d946ef', '#3b82f6', '#22c55e']

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
            contentStyle={{ background: '#0c0d13', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
