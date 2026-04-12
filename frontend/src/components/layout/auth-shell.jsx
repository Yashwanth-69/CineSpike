import { motion } from 'framer-motion'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'

export default function AuthShell() {
  const location = useLocation()
  const isSignup = location.pathname === '/signup'

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 lg:px-8">
        <header className="flex items-center justify-between">
          <Link to="/login" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-pink-500 via-violet-500 to-sky-500 text-base font-bold text-white shadow-[0_16px_32px_-18px_rgba(139,92,246,0.5)]">
              C
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">AI Trailer OS</p>
              <h1 className="text-lg font-semibold text-slate-950">CineSpike</h1>
            </div>
          </Link>

          <Link to={isSignup ? '/login' : '/signup'}>
            <Button variant="secondary">
              {isSignup ? 'Sign in' : 'Create account'}
            </Button>
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-md"
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
