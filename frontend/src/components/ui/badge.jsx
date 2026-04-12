import { cn } from '../../lib/utils'

const variants = {
  default: 'border-slate-200 bg-slate-50 text-slate-700',
  genre: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  emotion: 'border-sky-200 bg-sky-50 text-sky-700',
  keyword: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
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
