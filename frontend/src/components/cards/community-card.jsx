import { motion } from 'framer-motion'
import { Card, CardContent } from '../ui/card'
import { formatCompact } from '../../lib/utils'

export default function CommunityCard({ community }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.18 }}>
      <Card className="h-full">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-white">{community.name}</p>
              <p className="mt-1 text-sm text-zinc-400">{formatCompact(community.subscribers)} subscribers</p>
            </div>
            <div className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-100">
              {community.relevance}% match
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
