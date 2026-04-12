import { AnimatePresence, motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './navbar'
import Sidebar from './sidebar'

export default function AppShell() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.14),_transparent_28%),radial-gradient(circle_at_78%_8%,_rgba(236,72,153,0.10),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#f8fafc_55%,_#eef4ff_100%)] text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Navbar />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28 }}
                className="mx-auto flex w-full max-w-7xl flex-col gap-6"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}
