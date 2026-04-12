import { cn } from '../../lib/utils'

const variants = {
  default: 'bg-linear-to-r from-pink-500 via-fuchsia-500 to-blue-500 text-white shadow-[0_20px_80px_-30px_rgba(217,70,239,0.8)] hover:brightness-110',
  secondary: 'border border-white/12 bg-white/6 text-zinc-100 hover:bg-white/10',
  ghost: 'text-zinc-300 hover:bg-white/6 hover:text-white',
  outline: 'border border-white/14 bg-transparent text-zinc-100 hover:bg-white/8',
  danger: 'border border-red-400/30 bg-red-500/10 text-red-100 hover:bg-red-500/20',
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
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60 disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  )
}
