import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { SiteProvider } from './contexts/SiteContext'
import { ThemeProvider } from './contexts/ThemeContext'

// Load premium typography with beautiful Khmer support
const link = document.createElement('link')
link.rel = 'preconnect'
link.href = 'https://fonts.googleapis.com'
document.head.appendChild(link)

const link2 = document.createElement('link')
link2.rel = 'preconnect'
link2.href = 'https://fonts.gstatic.com'
link2.crossOrigin = 'anonymous'
document.head.appendChild(link2)

const fontLink = document.createElement('link')
fontLink.rel = 'stylesheet'
fontLink.href = 'https://fonts.googleapis.com/css2?family=Huuman+Front:wght@100;200;300;400;500;600;700;800;900&family=Noto+Sans+Khmer:wght@100;200;300;400;500;600;700;800;900&display=swap'
document.head.appendChild(fontLink)

// Apply sophisticated font stack with beautiful Khmer and English support
document.body.style.fontFamily = '"Huuman Front", "Noto Sans Khmer", "Inter", "Segoe UI", sans-serif'
document.body.style.letterSpacing = '-0.008em'
document.body.style.lineHeight = '1.65'
document.body.style.fontWeight = '400'
document.body.style.textRendering = 'optimizeLegibility'
document.body.style.webkitFontSmoothing = 'antialiased'
document.body.style.mozOsxFontSmoothing = 'grayscale'
document.body.style.fontFeatureSettings = '"kern" 1, "liga" 1, "calt" 1'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <SiteProvider>
            <App />
          </SiteProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)