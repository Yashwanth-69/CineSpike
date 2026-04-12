import { cn } from '../../lib/utils'

export function Table({ className, ...props }) {
  return <div className="overflow-hidden rounded-2xl border border-white/10"><table className={cn('w-full text-left text-sm', className)} {...props} /></div>
}

export function TableHeader({ className, ...props }) {
  return <thead className={cn('bg-white/6 text-zinc-400', className)} {...props} />
}

export function TableBody({ className, ...props }) {
  return <tbody className={cn('divide-y divide-white/8', className)} {...props} />
}

export function TableRow({ className, ...props }) {
  return <tr className={cn('transition-colors hover:bg-white/4', className)} {...props} />
}

export function TableHead({ className, ...props }) {
  return <th className={cn('px-5 py-3 font-medium', className)} {...props} />
}

export function TableCell({ className, ...props }) {
  return <td className={cn('px-5 py-4 text-zinc-200', className)} {...props} />
}
