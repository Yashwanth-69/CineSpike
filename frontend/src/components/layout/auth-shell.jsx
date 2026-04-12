import { motion } from 'framer-motion'
import { Clapperboard, Sparkles, Users } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

const highlights = [
  {
    icon: Clapperboard,
    title: 'Trailer analysis in one flow',
    description: 'Upload footage, detect tags, and move directly into comparable-title research.',
  },
  {
    icon: Users,
    title: 'Audience intelligence',
    description: 'Map Reddit communities, demographics, and content channels without leaving the workspace.',
  },
  {
    icon: Sparkles,
    title: 'Campaign-ready outputs',
    description: 'Generate release strategy and AI campaign angles from the same backend intelligence graph.',
  },
]

export default function AuthShell() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.14),_transparent_28%),radial-gradient(circle_at_85%_10%,_rgba(236,72,153,0.10),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#eef4ff_100%)]">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-10 px-4 py-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="flex flex-col justify-between rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_24px_60px_-36px_rgba(15,23,42,0.16)]">
          <div>
            <Link to="/login" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 via-indigo-500 to-fuchsia-500 font-semibold text-white">
                C
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">AI Trailer OS</p>
                <h1 className="text-lg font-semibold text-slate-950">CineSpike</h1>
              </div>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mt-14 max-w-xl"
            >
              <p className="text-sm font-medium uppercase tracking-[0.26em] text-slate-500">Premium trailer intelligence</p>
              <h2 className="mt-4 text-5xl font-semibold tracking-tight text-slate-950">
                The calm workspace for trailer analysis, audience fit, and release planning.
              </h2>
              <p className="mt-6 text-base leading-8 text-slate-600">
                Designed like a modern SaaS product: clear hierarchy, low cognitive load, and just enough personality to feel premium.
              </p>
            </motion.div>
          </div>

          <div className="mt-12 grid gap-4">
            {highlights.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-white p-3 text-indigo-600 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-slate-950">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="w-full max-w-xl"
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
