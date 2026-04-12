import { useEffect, useMemo, useState } from 'react'
import { Activity, BadgeCheck, Users } from 'lucide-react'
import { useParams } from 'react-router-dom'
import PageHeader from '../components/layout/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import TagBadgeGroup from '../components/cards/tag-badge-group'
import ConfidenceChart from '../components/charts/confidence-chart'
import AudienceDonutChart from '../components/charts/audience-donut-chart'
import CommunityCard from '../components/cards/community-card'
import PostCard from '../components/cards/post-card'
import MetricCard from '../components/cards/metric-card'
import { EmptyState } from '../components/ui/empty-state'
import { Button } from '../components/ui/button'
import { Link } from 'react-router-dom'
import { useAnalysisStore } from '../store/analysis-store'
import { formatCompact, formatMoney, resolveAnalysisPath } from '../lib/utils'

export default function InsightsPage() {
  const params = useParams()
  const analysisId = params.analysisId
  const { activeAnalysisId, currentAnalysis, fetchAnalysis, setActiveAnalysisId, analysesById } = useAnalysisStore()
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
      setError(fetchError.response?.data?.error || fetchError.message || 'Unable to load analysis')
    })
  }, [resolvedAnalysisId, fetchAnalysis])

  const genderSplit = analysis?.audience?.demographics?.gender_split || {}
  const confidenceScores = useMemo(() => analysis?.tags?.confidence_scores?.genres || {}, [analysis])

  if (!resolvedAnalysisId) {
    return (
      <EmptyState
        title="No analysis selected"
        description="Run a trailer analysis first, then this page will transform the response into an insight dashboard."
        action={
          <Link to="/analyze">
            <Button>Go To Analyze</Button>
          </Link>
        }
      />
    )
  }

  if (error && !analysis) {
    return (
      <EmptyState
        title="Could not load this analysis"
        description={error}
        action={
          <Link to="/history">
            <Button variant="secondary">Open History</Button>
          </Link>
        }
      />
    )
  }

  if (!analysis) {
    return <div className="text-sm text-slate-500">Loading insights...</div>
  }

  return (
    <>
      <PageHeader
        eyebrow="Insights"
        title={analysis.filename}
        description="Genre tags, emotional tone, keyword clusters, and audience composition now live inside a composable analytics surface."
        badge={analysis.tags?.method || 'analysis'}
        actions={
          <>
            <Link to={resolveAnalysisPath('/library', resolvedAnalysisId)}>
              <Button variant="secondary">Open Library</Button>
            </Link>
            <Link to={resolveAnalysisPath('/campaigns', resolvedAnalysisId)}>
              <Button>Open Campaigns</Button>
            </Link>
          </>
        }
      />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Primary Communities" value={analysis.audience?.primary_subreddits?.length || 0} helper="Highest-fit subreddits" icon={Users} />
        <MetricCard label="Addressable Audience" value={formatCompact(analysis.audience?.total_addressable_audience || 0)} helper="Estimated Reddit audience" icon={Activity} />
        <MetricCard label="Release Quarter" value={analysis.release_plan?.recommended_quarter || 'N/A'} helper={analysis.release_plan?.recommended_month_name || 'No release window yet'} icon={BadgeCheck} />
        <MetricCard label="Box Office Mid" value={formatMoney(analysis.audience?.box_office_estimate?.mid || 0)} helper="Average from comparable films" icon={Activity} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Detected Tags</CardTitle>
            <CardDescription>Auto-generated or manually overridden trailer metadata.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <TagBadgeGroup title="Genres" items={analysis.tags?.genres} variant="genre" />
            <TagBadgeGroup title="Emotional Tone" items={analysis.tags?.emotions} variant="emotion" />
            <TagBadgeGroup title="Keywords" items={analysis.tags?.keywords} variant="keyword" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tag Confidence</CardTitle>
            <CardDescription>Recharts-powered confidence distribution for genre predictions.</CardDescription>
          </CardHeader>
          <CardContent>
            <ConfidenceChart scores={confidenceScores} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Audience Communities</CardTitle>
            <CardDescription>Primary and secondary subreddit clusters for launch planning.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Primary Communities</p>
              <div className="grid gap-4 md:grid-cols-2">
                {analysis.audience?.primary_subreddits?.map((community) => (
                  <CommunityCard key={community.name} community={community} />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Secondary Communities</p>
              <div className="grid gap-4 md:grid-cols-2">
                {analysis.audience?.secondary_subreddits?.map((community) => (
                  <CommunityCard key={community.name} community={community} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Demographic Split</CardTitle>
            <CardDescription>Audience age range and gender composition derived from the backend profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Age Range</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{analysis.audience?.demographics?.age_range || 'Unknown'}</p>
            </div>
            <AudienceDonutChart genderSplit={genderSplit} />
            <div className="flex flex-wrap gap-2">
              {Object.entries(genderSplit).map(([label, value]) => (
                <div key={label} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">
                  {label}: {value}%
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Box Office Outlook</CardTitle>
            <CardDescription>Revenue envelope based on the top comparable titles.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
            {['low', 'mid', 'high'].map((key) => (
              <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{key}</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{formatMoney(analysis.audience?.box_office_estimate?.[key] || 0)}</p>
              </div>
            ))}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Recommended channels</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {analysis.audience?.marketing_recommendations?.map((item) => (
                  <span key={item.platform} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700">
                    {item.platform}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Synthetic Community Buzz</CardTitle>
            <CardDescription>Sample post energy to help shape messaging tone.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {analysis.audience?.sample_posts?.map((post) => (
              <PostCard key={`${post.subreddit}-${post.title}`} post={post} />
            ))}
          </CardContent>
        </Card>
      </section>
    </>
  )
}
