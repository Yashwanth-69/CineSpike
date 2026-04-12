import apiClient from './api-client'

export async function getHealthStatus() {
  const { data } = await apiClient.get('/health')
  return data
}

export async function analyzeTrailer({ file, genres = [], emotions = [] }) {
  const formData = new FormData()
  formData.append('trailer', file)
  genres.forEach((genre) => formData.append('genres[]', genre))
  emotions.forEach((emotion) => formData.append('emotions[]', emotion))

  const { data } = await apiClient.post('/analyze', formData)
  return data
}

export async function getAnalysisResults(analysisId) {
  const { data } = await apiClient.get(`/results/${analysisId}`)
  return data
}

export async function getHistory() {
  const { data } = await apiClient.get('/history')
  return data
}

export async function deleteAnalysis(analysisId) {
  const { data } = await apiClient.delete(`/analysis/${analysisId}`)
  return data
}

export async function generateCampaign(analysisId) {
  const { data } = await apiClient.post(`/generate_campaign/${analysisId}`)
  return data
}
