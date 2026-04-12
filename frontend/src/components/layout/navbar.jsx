import { Menu, Search, UserCircle2 } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3 lg:hidden">
          <Button variant="secondary" size="icon" type="button" aria-label="Open navigation">
            <Menu className="h-4 w-4" />
          </Button>
          <div>
            <p className="text-sm font-semibold text-slate-950">CineSpike</p>
            <p className="text-xs text-slate-500">Modern trailer intelligence</p>
          </div>
        </div>

        <div className="hidden max-w-md flex-1 lg:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input className="pl-10" placeholder="Search analyses, campaigns, or communities" />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700 sm:block">
            Backend connected
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm">
            <UserCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  )
}
