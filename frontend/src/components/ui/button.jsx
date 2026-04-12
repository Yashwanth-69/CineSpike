import { cn } from '../../lib/utils'

const variants = {
  default: 'bg-linear-to-r from-sky-500 via-indigo-500 to-fuchsia-500 text-white shadow-[0_18px_36px_-18px_rgba(99,102,241,0.45)] hover:scale-[1.01] hover:shadow-[0_22px_40px_-20px_rgba(99,102,241,0.42)]',
  secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900',
  ghost: 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
  outline: 'border border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50',
  danger: 'border border-red-200 bg-red-50 text-red-700 hover:bg-red-100',
}

const sizes = {
  default: 'h-11 px-4 py-2',
  sm: 'h-9 px-3 text-sm',
  lg: 'h-12 px-5 text-base',
  icon: 'h-10 w-10',
}

export function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}) {
  const Comp = asChild ? 'span' : 'button'

  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}
