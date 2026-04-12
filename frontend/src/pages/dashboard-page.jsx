import { BarChart3, Film, Sparkles, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import PageHeader from '../components/layout/page-header'
import MetricCard from '../components/cards/metric-card'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { getHealthStatus, getHistory } from '../services/analysis-service'
import { useAnalysisStore } from '../store/analysis-store'
import { formatCompact, formatDate, resolveAnalysisPath } from '../lib/utils'

export default function DashboardPage() {
  const { activeAnalysisId, currentAnalysis, fetchAnalysis } = useAnalysisStore()
  const [health, setHealth] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    getHealthStatus().then(setHealth).catch(() => {})
    getHistory().then(setHistory).catch(() => {})
  }, [])

  useEffect(() => {
    if (activeAnalysisId && !currentAnalysis) {
      fetchAnalysis(activeAnalysisId).catch(() => {})
    }
  }, [activeAnalysisId, currentAnalysis, fetchAnalysis])

  return (
    <>
      <PageHeader
        eyebrow="Command Center"
        title="Trailer intelligence, wrapped like a SaaS product."
        description="Track ingestion readiness, jump back into the latest analysis, and move from raw upload to audience strategy without leaving the workspace."
        badge={health?.status === 'ok' ? 'System Ready' : undefined}
        actions={
          <>
            <Link to="/analyze">
              <Button>Analyze New Trailer</Button>
            </Link>
            <Link to="/history">
              <Button variant="secondary">Open History</Button>
            </Link>
          </>
        }
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Indexed Movies"
          value={health ? formatCompact(health.db_movies) : '...'}
          helper="Vector database coverage"
          icon={Film}
        />
        <MetricCard
          label="Past Analyses"
          value={formatCompact(history.length)}
          helper="Archived trailer sessions"
          icon={BarChart3}
        />
        <MetricCard
          label="Audience Reach"
          value={currentAnalysis?.audience?.total_addressable_audience ? formatCompact(currentAnalysis.audience.total_addressable_audience) : 'N/A'}
          helper="From current active analysis"
          icon={Users}
        />
        <MetricCard
          label="Campaign Status"
          value={currentAnalysis?.campaign ? 'Ready' : 'Pending'}
          helper="AI campaign generation state"
          icon={Sparkles}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Latest Working Session</CardTitle>
            <CardDescription>Resume your current analysis from exactly where you left off.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentAnalysis ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">Trailer</p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">{currentAnalysis.filename}</p>
                    <p className="mt-1 text-sm text-slate-500">{formatDate(currentAnalysis.timestamp)}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">Recommended Release Window</p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">{currentAnalysis.release_plan?.recommended_month_name || 'Not available yet'}</p>
                    <p className="mt-1 text-sm text-slate-500">{currentAnalysis.release_plan?.season_label || 'Run a trailer analysis to generate timing guidance.'}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link to={resolveAnalysisPath('/insights', activeAnalysisId)}>
                    <Button>Open Insights</Button>
                  </Link>
                  <Link to={resolveAnalysisPath('/library', activeAnalysisId)}>
                    <Button variant="secondary">View Similar Films</Button>
                  </Link>
                  <Link to={resolveAnalysisPath('/campaigns', activeAnalysisId)}>
                    <Button variant="secondary">Open Campaign Workspace</Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6">
                <p className="text-lg font-semibold text-slate-950">No active analysis yet</p>
                <p className="mt-2 max-w-xl text-sm text-slate-500">
                  Start with the Analyze page to upload a trailer. Once the backend finishes processing, the rest of the product surfaces will populate automatically.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workflow</CardTitle>
            <CardDescription>The product flow now mirrors a modern SaaS experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              'Analyze a trailer or manually seed genre and emotion tags.',
              'Inspect confidence, audience fit, and keyword clusters.',
              'Review comparable films and release timing.',
              'Package the release plan into an AI-generated campaign.',
            ].map((step, index) => (
              <div key={step} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-sky-500 to-indigo-500 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-slate-600">{step}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  )
}
