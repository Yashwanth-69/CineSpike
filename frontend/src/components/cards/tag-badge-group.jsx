import { Badge } from '../ui/badge'

const variantMap = {
  genre: 'genre',
  emotion: 'emotion',
  keyword: 'keyword',
}

export default function TagBadgeGroup({ title, items, variant = 'default' }) {
  return (
    <div className="space-y-4">
      <div className="text-sm font-medium text-slate-700">{title}</div>
      <div className="flex flex-wrap gap-2">
        {items?.length ? (
          items.map((item) => (
            <Badge key={item} variant={variantMap[variant] || 'default'}>
              {item}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-slate-500">No tags available</span>
        )}
      </div>
    </div>
  )
}
