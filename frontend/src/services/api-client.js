import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 180000,
})

export default apiClient
