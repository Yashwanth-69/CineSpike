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
    <aside className="hidden w-72 shrink-0 flex-col border-r border-white/8 bg-black/25 px-5 py-6 backdrop-blur-2xl lg:flex">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-pink-500 via-fuchsia-500 to-blue-500 text-lg font-bold text-white shadow-[0_18px_65px_-24px_rgba(236,72,153,0.95)]">
          C
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">AI Trailer OS</p>
          <h1 className="text-lg font-semibold text-white">CineSpike</h1>
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
                    ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100',
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl border border-white/10 bg-linear-to-br from-white/10 to-white/[0.02] p-5">
        <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Studio Pulse</p>
        <h2 className="mt-2 text-lg font-semibold text-white">Turn trailer signal into a release strategy.</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Analyze footage, profile communities, and package campaigns in one cinematic workspace.
        </p>
      </div>
    </aside>
  )
}
