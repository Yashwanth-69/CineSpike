import { motion } from 'framer-motion'
import { Badge } from '../ui/badge'

export default function PageHeader({ eyebrow, title, description, badge, actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-5 rounded-[28px] border border-white/10 bg-linear-to-br from-white/8 to-white/[0.02] p-6 shadow-[0_40px_120px_-60px_rgba(236,72,153,0.45)] lg:flex-row lg:items-end lg:justify-between"
    >
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">{eyebrow}</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h1>
          {badge ? <Badge variant="success">{badge}</Badge> : null}
        </div>
        <p className="max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </motion.div>
  )
}
