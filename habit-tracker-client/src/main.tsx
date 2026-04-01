import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initTheme } from './stores/themeStore'
import './index.css'
import App from './App.tsx'

// Инициализация темы перед рендером
initTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
