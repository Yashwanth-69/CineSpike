import { Clapperboard, Compass, Film, History, LayoutDashboard, Sparkles } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const navigationItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Analyze', to: '/analyze', icon: Clapperboard },
  { label: 'Library', to: '/library', icon: Film },
  { label: 'Insights', to: '/insights', icon: Compass },
  { label: 'Campaigns', to: '/campaigns', icon: Sparkles },
  { label: 'History', to: '/history', icon: History },
]

export default function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-white/90 px-5 py-6 lg:flex">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-sky-500 via-indigo-500 to-fuchsia-500 text-lg font-bold text-white shadow-[0_16px_30px_-18px_rgba(99,102,241,0.5)]">
          C
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">AI Trailer OS</p>
          <h1 className="text-lg font-semibold text-slate-950">CineSpike</h1>
        </div>
      </div>

      <nav className="space-y-1">
        {navigationItems.map(({ label, to, icon: Icon }) => (
          <NavLink key={to} to={to} className="block">
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all',
                  isActive
                    ? 'bg-slate-100 text-slate-950 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl border border-slate-200 bg-linear-to-br from-indigo-50 via-white to-pink-50 p-5">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Studio Pulse</p>
        <h2 className="mt-2 text-lg font-semibold text-slate-950">Turn trailer signal into a release strategy.</h2>
        <p className="mt-2 text-sm text-slate-600">
          Analyze footage, profile communities, and package campaigns in one cinematic workspace.
        </p>
      </div>
    </aside>
  )
}
