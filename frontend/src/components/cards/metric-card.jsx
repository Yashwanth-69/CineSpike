import { motion } from 'framer-motion'
import { Card, CardContent } from '../ui/card'

export default function MetricCard({ label, value, helper, icon: Icon }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="h-full">
        <CardContent className="flex h-full items-start justify-between gap-4 p-5">
          <div className="space-y-3">
            <p className="text-sm text-zinc-400">{label}</p>
            <p className="text-2xl font-semibold text-white">{value}</p>
            {helper ? <p className="text-sm text-zinc-500">{helper}</p> : null}
          </div>
          {Icon ? (
            <div className="rounded-2xl border border-white/10 bg-white/6 p-3 text-zinc-200">
              <Icon className="h-5 w-5" />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  )
}
