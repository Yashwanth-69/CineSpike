import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHeader from '../components/layout/page-header'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import ReleaseDistributionChart from '../components/charts/release-distribution-chart'
import { EmptyState } from '../components/ui/empty-state'
import { generateCampaign } from '../services/analysis-service'
import { useAnalysisStore } from '../store/analysis-store'
import { formatMoney, resolveAnalysisPath } from '../lib/utils'

export default function CampaignsPage() {
  const params = useParams()
  const analysisId = params.analysisId
  const {
    activeAnalysisId,
    analysesById,
    currentAnalysis,
    fetchAnalysis,
    setActiveAnalysisId,
    upsertAnalysis,
  } = useAnalysisStore()
  const [error, setError] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

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
      setError(fetchError.response?.data?.error || fetchError.message || 'Unable to load campaign data')
    })
  }, [resolvedAnalysisId, fetchAnalysis])

  async function handleGenerateCampaign() {
    if (!resolvedAnalysisId) {
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const campaign = await generateCampaign(resolvedAnalysisId)
      upsertAnalysis({
        ...analysis,
        campaign,
      })
    } catch (generateError) {
      setError(generateError.response?.data?.error || generateError.message || 'Campaign generation failed')
    } finally {
      setIsGenerating(false)
    }
  }

  if (!resolvedAnalysisId) {
    return (
      <EmptyState
        title="Campaign workspace is empty"
        description="Open or create an analysis first, then generate release strategy and AI campaign content here."
        action={
          <Link to="/analyze">
            <Button>Analyze A Trailer</Button>
          </Link>
        }
      />
    )
  }

  if (error && !analysis) {
    return <div className="text-sm text-red-300">{error}</div>
  }

  if (!analysis) {
    return <div className="text-sm text-zinc-400">Loading campaign workspace...</div>
  }

  const releasePlan = analysis.release_plan || {}
  const campaign = analysis.campaign

  return (
    <>
      <PageHeader
        eyebrow="Campaigns"
        title="Release timing and campaign orchestration"
        description="Turn comparable-title timing and audience fit into a polished campaign workspace without changing the backend logic."
        badge={campaign ? 'Campaign Ready' : 'Awaiting AI Strategy'}
        actions={
          <>
            <Link to={resolveAnalysisPath('/insights', resolvedAnalysisId)}>
              <Button variant="secondary">Open Insights</Button>
            </Link>
            <Button type="button" onClick={handleGenerateCampaign} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : campaign ? 'Regenerate AI Strategy' : 'Generate AI Strategy'}
            </Button>
          </>
        }
      />

      {error ? <p className="text-sm text-red-300">{error}</p> : null}

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <Card>
          <CardHeader>
            <CardTitle>Release Strategy</CardTitle>
            <CardDescription>Rule-based planning from your existing Flask service.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-[28px] border border-pink-400/20 bg-linear-to-br from-pink-500/14 via-fuchsia-500/10 to-blue-500/10 p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-zinc-400">Recommended Month</p>
              <h2 className="mt-3 text-4xl font-semibold text-white">{releasePlan.recommended_month_name || 'N/A'}</h2>
              <p className="mt-2 text-zinc-300">{releasePlan.recommended_quarter}</p>
              <p className="mt-1 text-sm text-zinc-400">{releasePlan.season_label}</p>
            </div>
            <div className="space-y-3 rounded-2xl border border-white/8 bg-black/20 p-5">
              <p className="text-sm font-medium text-white">Strategic rationale</p>
              <p className="text-sm leading-6 text-zinc-400">{releasePlan.reasoning}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {releasePlan.avoid_months?.map((month) => (
                <Badge key={month} variant="warning">
                  Avoid {month}
                </Badge>
              ))}
            </div>
            <div className="rounded-2xl border border-white/8 bg-black/20 p-5">
              <p className="text-sm font-medium text-white">Comparable revenue midpoint</p>
              <p className="mt-2 text-2xl font-semibold text-white">{formatMoney(analysis.audience?.box_office_estimate?.mid || 0)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Release Distribution</CardTitle>
            <CardDescription>Historical month distribution from similar films.</CardDescription>
          </CardHeader>
          <CardContent>
            <ReleaseDistributionChart distribution={releasePlan.monthly_distribution} recommendedMonth={releasePlan.recommended_month} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Campaign Strategy</CardTitle>
            <CardDescription>Ollama-backed campaign output surfaced inside a modular React view.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {campaign ? (
              <>
                <div className="rounded-3xl border border-white/8 bg-black/20 p-6">
                  <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">Core concept</p>
                  <p className="mt-3 text-lg leading-8 text-white">{campaign.overview}</p>
                </div>

                <div className="rounded-2xl border border-white/8 bg-black/20 p-5">
                  <p className="text-sm font-medium text-white">Release timeline context</p>
                  <p className="mt-3 text-sm leading-7 text-zinc-400">{campaign.release_analysis}</p>
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  {campaign.phases?.map((phase) => (
                    <div key={phase.name} className="rounded-2xl border border-white/8 bg-black/20 p-5">
                      <p className="text-base font-semibold text-white">{phase.name}</p>
                      <div className="mt-4 space-y-3">
                        {phase.tactics?.map((tactic) => (
                          <div key={tactic} className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
                            {tactic}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-pink-400/20 bg-linear-to-r from-pink-500/14 via-fuchsia-500/10 to-blue-500/10 p-6">
                  <p className="text-sm uppercase tracking-[0.28em] text-zinc-500">Guerrilla marketing hero tactic</p>
                  <p className="mt-3 text-base leading-7 text-white">{campaign.guerrilla_marketing}</p>
                </div>
              </>
            ) : (
              <EmptyState
                title="No campaign generated yet"
                description="The release plan is ready. Generate an AI campaign to flesh out the launch arc, phase tactics, and community-native stunt."
                action={
                  <Button type="button" onClick={handleGenerateCampaign} disabled={isGenerating}>
                    {isGenerating ? 'Generating...' : 'Generate AI Strategy'}
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>
      </section>
    </>
  )
}
