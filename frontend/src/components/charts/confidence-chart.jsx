import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function ConfidenceChart({ scores }) {
  const data = Object.entries(scores || {}).map(([name, confidence]) => ({
    name,
    confidence,
  }))

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="name" stroke="#71717a" tickLine={false} axisLine={false} />
          <YAxis stroke="#71717a" tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            contentStyle={{ background: '#0c0d13', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }}
          />
          <Bar dataKey="confidence" radius={[12, 12, 0, 0]} fill="url(#confidenceGradient)" />
          <defs>
            <linearGradient id="confidenceGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="55%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
