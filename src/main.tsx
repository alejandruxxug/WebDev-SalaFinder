/**
 * main.tsx - Application entry point
 *
 * createRoot mounts the React app into the DOM element with id="root".
 * BrowserRouter enables client-side routing (React Router).
 * StrictMode helps catch potential issues during development.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
