import { createContext, useContext, useEffect, useState } from 'react'
import { getAnalysisResults } from '../services/analysis-service'

const STORAGE_KEY = 'cinespike-active-analysis-id'

const AnalysisStoreContext = createContext(null)

export function AnalysisStoreProvider({ children }) {
  const [activeAnalysisId, setActiveAnalysisIdState] = useState(() => localStorage.getItem(STORAGE_KEY) || '')
  const [analysesById, setAnalysesById] = useState({})
  const [loadingAnalysisId, setLoadingAnalysisId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (activeAnalysisId) {
      localStorage.setItem(STORAGE_KEY, activeAnalysisId)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [activeAnalysisId])

  async function fetchAnalysis(analysisId, options = {}) {
    if (!analysisId) {
      return null
    }

    if (!options.force && analysesById[analysisId]) {
      return analysesById[analysisId]
    }

    setLoadingAnalysisId(analysisId)
    setError('')

    try {
      const data = await getAnalysisResults(analysisId)
      setAnalysesById((current) => ({ ...current, [analysisId]: data }))
      return data
    } catch (fetchError) {
      const message = fetchError.response?.data?.error || fetchError.message || 'Unable to load analysis'
      setError(message)
      throw fetchError
    } finally {
      setLoadingAnalysisId('')
    }
  }

  function setActiveAnalysisId(nextId) {
    setActiveAnalysisIdState(nextId || '')
  }

  function upsertAnalysis(data) {
    if (!data?.id) {
      return
    }
    setAnalysesById((current) => ({ ...current, [data.id]: data }))
    setActiveAnalysisIdState(data.id)
  }

  function removeAnalysis(analysisId) {
    setAnalysesById((current) => {
      const next = { ...current }
      delete next[analysisId]
      return next
    })
    if (activeAnalysisId === analysisId) {
      setActiveAnalysisIdState('')
    }
  }

  const value = {
    activeAnalysisId,
    analysesById,
    currentAnalysis: analysesById[activeAnalysisId] || null,
    error,
    fetchAnalysis,
    loadingAnalysisId,
    removeAnalysis,
    setActiveAnalysisId,
    upsertAnalysis,
  }

  return <AnalysisStoreContext.Provider value={value}>{children}</AnalysisStoreContext.Provider>
}

export function useAnalysisStore() {
  const context = useContext(AnalysisStoreContext)
  if (!context) {
    throw new Error('useAnalysisStore must be used inside AnalysisStoreProvider')
  }
  return context
}
