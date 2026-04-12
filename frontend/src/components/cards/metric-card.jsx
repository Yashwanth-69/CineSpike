import { motion } from 'framer-motion'
import { Card, CardContent } from '../ui/card'

export default function MetricCard({ label, value, helper, icon: Icon }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="h-full">
        <CardContent className="flex h-full items-start justify-between gap-4 p-5">
          <div className="space-y-3">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-2xl font-semibold text-slate-950">{value}</p>
            {helper ? <p className="text-sm text-slate-500">{helper}</p> : null}
          </div>
          {Icon ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-600">
              <Icon className="h-5 w-5" />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </motion.div>
  )
}
