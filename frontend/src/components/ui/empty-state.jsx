import { Film } from 'lucide-react'
import { Card, CardContent } from './card'

export function EmptyState({ title, description, action }) {
  return (
    <Card className="border-dashed border-white/14 bg-white/[0.03]">
      <CardContent className="flex flex-col items-center justify-center gap-4 py-14 text-center">
        <div className="rounded-2xl border border-white/12 bg-white/6 p-4 text-zinc-300">
          <Film className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="max-w-md text-sm text-zinc-400">{description}</p>
        </div>
        {action}
      </CardContent>
    </Card>
  )
}
