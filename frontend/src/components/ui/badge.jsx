import { cn } from '../../lib/utils'

const variants = {
  default: 'border-white/12 bg-white/10 text-zinc-100',
  genre: 'border-fuchsia-400/25 bg-fuchsia-500/10 text-fuchsia-100',
  emotion: 'border-blue-400/25 bg-blue-500/10 text-blue-100',
  keyword: 'border-pink-400/25 bg-pink-500/10 text-pink-100',
  success: 'border-emerald-400/25 bg-emerald-500/10 text-emerald-100',
  warning: 'border-amber-400/25 bg-amber-500/10 text-amber-100',
}

export function Badge({ className, variant = 'default', ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
