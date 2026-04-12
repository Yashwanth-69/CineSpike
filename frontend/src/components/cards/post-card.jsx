import { Card, CardContent } from '../ui/card'
import { formatCompact } from '../../lib/utils'

export default function PostCard({ post }) {
  return (
    <Card className="h-full">
      <CardContent className="space-y-3 p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">{post.subreddit}</p>
        <p className="text-base font-medium leading-6 text-white">{post.title}</p>
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <span>Upvotes {formatCompact(post.upvotes)}</span>
          <span>Comments {formatCompact(post.comments)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
