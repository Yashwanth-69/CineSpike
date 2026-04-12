import { motion } from 'framer-motion'
import { Badge } from '../ui/badge'

export default function PageHeader({ eyebrow, title, description, badge, actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-5 rounded-[32px] border border-slate-200 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))] p-7 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.16)] lg:flex-row lg:items-end lg:justify-between"
    >
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{eyebrow}</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
          {badge ? <Badge variant="success">{badge}</Badge> : null}
        </div>
        <p className="max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </motion.div>
  )
}
