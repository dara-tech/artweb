import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { SiteProvider } from './contexts/SiteContext'
import { ThemeProvider } from './contexts/ThemeContext'

// Load Kantomruy Pro font
const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = 'https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@100;200;300;400;500;600;700&display=swap'
document.head.appendChild(link)

// Apply Kantumruy Pro font to body
document.body.style.fontFamily = 'Kantumruy Pro, sans-serif'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)