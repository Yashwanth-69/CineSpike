import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/app-shell'

const DashboardPage = lazy(() => import('./pages/dashboard-page'))
const AnalyzePage = lazy(() => import('./pages/analyze-page'))
const LibraryPage = lazy(() => import('./pages/library-page'))
const InsightsPage = lazy(() => import('./pages/insights-page'))
const CampaignsPage = lazy(() => import('./pages/campaigns-page'))
const HistoryPage = lazy(() => import('./pages/history-page'))

function App() {
  return (
    <Suspense fallback={<div className="px-4 py-10 text-sm text-zinc-400">Loading workspace...</div>}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analyze" element={<AnalyzePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/library/:analysisId" element={<LibraryPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/insights/:analysisId" element={<InsightsPage />} />
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/campaigns/:analysisId" element={<CampaignsPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
