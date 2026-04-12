import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageHeader from '../components/layout/page-header'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { EmptyState } from '../components/ui/empty-state'
import HistoryTable from '../components/tables/history-table'
import { deleteAnalysis, getHistory } from '../services/analysis-service'
import { useAnalysisStore } from '../store/analysis-store'

export default function HistoryPage() {
  const navigate = useNavigate()
  const { removeAnalysis } = useAnalysisStore()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadHistory() {
    setLoading(true)
    setError('')
    try {
      const data = await getHistory()
      setRows(data)
    } catch (loadError) {
      setError(loadError.response?.data?.error || loadError.message || 'Unable to load history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  async function handleDelete(analysisId) {
    await deleteAnalysis(analysisId)
    removeAnalysis(analysisId)
    setRows((current) => current.filter((row) => row.id !== analysisId))
  }

  return (
    <>
      <PageHeader
        eyebrow="History"
        title="Past trailer analyses"
        description="Reopen any analysis, preserve continuity across product surfaces, and keep the React shell synced with the existing Flask history endpoints."
        actions={
          <Link to="/analyze">
            <Button>New Analysis</Button>
          </Link>
        }
      />

      {loading ? <div className="text-sm text-zinc-400">Loading history...</div> : null}
      {error ? <div className="text-sm text-red-300">{error}</div> : null}

      {!loading && !rows.length ? (
        <EmptyState
          title="No analyses yet"
          description="Your table will populate after the first trailer analysis finishes."
          action={
            <Button type="button" onClick={() => navigate('/analyze')}>
              Analyze A Trailer
            </Button>
          }
        />
      ) : null}

      {!loading && rows.length ? (
        <Card>
          <CardContent className="p-0">
            <HistoryTable rows={rows} onDelete={handleDelete} />
          </CardContent>
        </Card>
      ) : null}
    </>
  )
}
