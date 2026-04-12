import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHeader from '../components/layout/page-header'
import MovieCard from '../components/cards/movie-card'
import { EmptyState } from '../components/ui/empty-state'
import { Button } from '../components/ui/button'
import { useAnalysisStore } from '../store/analysis-store'
import { resolveAnalysisPath } from '../lib/utils'

export default function LibraryPage() {
  const params = useParams()
  const analysisId = params.analysisId
  const { activeAnalysisId, analysesById, currentAnalysis, fetchAnalysis, setActiveAnalysisId } = useAnalysisStore()
  const [error, setError] = useState('')

  const resolvedAnalysisId = analysisId || activeAnalysisId
  const analysis = resolvedAnalysisId ? analysesById[resolvedAnalysisId] || (resolvedAnalysisId === activeAnalysisId ? currentAnalysis : null) : null

  useEffect(() => {
    if (analysisId) {
      setActiveAnalysisId(analysisId)
    }
  }, [analysisId, setActiveAnalysisId])

  useEffect(() => {
    if (!resolvedAnalysisId) {
      return
    }
    fetchAnalysis(resolvedAnalysisId).catch((fetchError) => {
      setError(fetchError.response?.data?.error || fetchError.message || 'Unable to load library data')
    })
  }, [resolvedAnalysisId, fetchAnalysis])

  if (!resolvedAnalysisId) {
    return (
      <EmptyState
        title="No analysis available for the library"
        description="Run a trailer analysis to populate the comparable films grid."
        action={
          <Link to="/analyze">
            <Button>Go To Analyze</Button>
          </Link>
        }
      />
    )
  }

  if (error && !analysis) {
    return <div className="text-sm text-red-300">{error}</div>
  }

  if (!analysis) {
    return <div className="text-sm text-zinc-400">Loading similar films...</div>
  }

  return (
    <>
      <PageHeader
        eyebrow="Library"
        title="Comparable film library"
        description="A cinematic grid of the highest-match films, presented with a product-grade browsing experience."
        actions={
          <>
            <Link to={resolveAnalysisPath('/insights', resolvedAnalysisId)}>
              <Button variant="secondary">Back To Insights</Button>
            </Link>
            <Link to={resolveAnalysisPath('/campaigns', resolvedAnalysisId)}>
              <Button>Open Campaign Planning</Button>
            </Link>
          </>
        }
      />

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {analysis.top_movies?.map((movie, index) => (
          <MovieCard key={`${movie.title}-${movie.release_date}-${index}`} movie={movie} rank={index + 1} />
        ))}
      </section>
    </>
  )
}
