import { Film } from 'lucide-react'
import { Card, CardContent } from './card'

export function EmptyState({ title, description, action }) {
  return (
    <Card className="border-dashed border-slate-200 bg-slate-50/70">
      <CardContent className="flex flex-col items-center justify-center gap-4 py-14 text-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-500">
          <Film className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
          <p className="max-w-md text-sm text-slate-500">{description}</p>
        </div>
        {action}
      </CardContent>
    </Card>
  )
}
