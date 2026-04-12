import { motion } from 'framer-motion'
import { ArrowRight, Clapperboard, LineChart, Sparkles, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

const highlights = [
  {
    icon: Clapperboard,
    title: 'Analyze the trailer signal',
    description: 'Turn raw footage into genre, emotion, and keyword intelligence in a single pass.',
  },
  {
    icon: Users,
    title: 'Find the right audience',
    description: 'Surface communities, demographics, and high-fit channels without guesswork.',
  },
  {
    icon: LineChart,
    title: 'Plan the launch window',
    description: 'Compare release patterns, revenue context, and timing strategy with clarity.',
  },
  {
    icon: Sparkles,
    title: 'Generate campaign angles',
    description: 'Translate analysis into an AI-assisted campaign brief for launch planning.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f8fafc]">
      <div className="relative mx-auto min-h-screen max-w-7xl px-4 py-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-24 mx-auto h-80 w-[54rem] rounded-full bg-linear-to-r from-pink-300/30 via-violet-300/30 to-sky-300/30 blur-[120px]" />

        <header className="relative z-10 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-pink-500 via-violet-500 to-sky-500 text-base font-bold text-white shadow-[0_16px_32px_-18px_rgba(139,92,246,0.5)]">
              C
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">AI Trailer OS</p>
              <h1 className="text-lg font-semibold text-slate-950">CineSpike</h1>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="secondary">Login</Button>
            </Link>
            <Link to="/signup">
              <Button>Create account</Button>
            </Link>
          </div>
        </header>

        <main className="relative z-10 flex flex-col items-center px-2 py-32 text-center sm:py-36">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-medium text-slate-600 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.16)]"
          >
            <span className="rounded-full bg-linear-to-r from-pink-500 via-violet-500 to-sky-500 px-2.5 py-0.5 text-xs font-semibold text-white">
              New
            </span>
            Built for modern film marketing teams
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-8 max-w-5xl"
          >
            <h2 className="text-5xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-6xl">
              Make every trailer launch feel
              {' '}
              <span className="bg-linear-to-r from-pink-500 via-violet-500 to-sky-500 bg-clip-text text-transparent">
                data-backed and cinematic
              </span>
              .
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-500">
              CineSpike helps studios and indie teams analyze trailers, find audience fit, and shape release strategy inside a calm, premium SaaS workflow.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Link to="/signup">
              <Button size="lg" className="min-w-48">
                Start free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="min-w-48">
                Login
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-18 grid w-full max-w-5xl gap-4 md:grid-cols-2 xl:grid-cols-4"
          >
            {highlights.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-3xl bg-white/90 p-6 text-left shadow-[0_20px_50px_-34px_rgba(15,23,42,0.16)] ring-1 ring-slate-200/80"
              >
                <div className="mb-5 inline-flex rounded-2xl bg-slate-50 p-3 text-slate-700 shadow-sm ring-1 ring-slate-200">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-base font-semibold text-slate-950">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
              </div>
            ))}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
