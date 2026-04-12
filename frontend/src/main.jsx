import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AnalysisStoreProvider } from './store/analysis-store'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AnalysisStoreProvider>
        <App />
      </AnalysisStoreProvider>
    </BrowserRouter>
  </StrictMode>,
)
