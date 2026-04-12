import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { Card } from '../ui/card'

export default function MovieCard({ movie, rank }) {
  return (
    <motion.div whileHover={{ y: -6, scale: 1.01 }} transition={{ duration: 0.2 }}>
      <Card className="group overflow-hidden">
        <div className="relative aspect-[4/5] overflow-hidden border-b border-slate-200">
          <img
            src={movie.poster_url}
            alt={`${movie.title} poster`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-linear-to-t from-slate-950/75 to-transparent p-4">
            <span className="rounded-full border border-white/50 bg-white/80 px-3 py-1 text-xs text-slate-700 backdrop-blur-sm">
              #{rank} Match
            </span>
            <span className="rounded-full bg-linear-to-r from-sky-500 to-indigo-500 px-3 py-1 text-xs font-medium text-white">
              {movie.similarity_score}% Fit
            </span>
          </div>
        </div>
        <div className="space-y-3 p-5">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">{movie.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{movie.genres || 'Genre mix unavailable'}</p>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>{movie.year || 'Unknown year'}</span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-300 text-amber-300" />
              {movie.vote_average || 'N/A'}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
