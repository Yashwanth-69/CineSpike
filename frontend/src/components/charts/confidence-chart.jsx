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
          <CartesianGrid stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} />
          <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: 'rgba(99,102,241,0.05)' }}
            contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, color: '#0f172a' }}
          />
          <Bar dataKey="confidence" radius={[12, 12, 0, 0]} fill="url(#confidenceGradient)" />
          <defs>
            <linearGradient id="confidenceGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="55%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
