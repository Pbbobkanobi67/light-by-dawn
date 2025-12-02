import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CandleBusinessApp from './LightByDawn_CandleApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CandleBusinessApp />
  </StrictMode>,
)
