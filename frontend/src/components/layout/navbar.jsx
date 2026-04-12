import { Menu, Search, UserCircle2 } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-black/20 backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3 lg:hidden">
          <Button variant="secondary" size="icon" type="button" aria-label="Open navigation">
            <Menu className="h-4 w-4" />
          </Button>
          <div>
            <p className="text-sm font-semibold text-white">CineSpike</p>
            <p className="text-xs text-zinc-500">Modern trailer intelligence</p>
          </div>
        </div>

        <div className="hidden max-w-md flex-1 lg:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input className="pl-10" placeholder="Search analyses, campaigns, or communities" />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-100 sm:block">
            Backend connected
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/6 text-zinc-200">
            <UserCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  )
}
