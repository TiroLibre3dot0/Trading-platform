import React from 'react'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { AppPreferencesProvider } from './context/AppPreferencesContext'

function syncAppVh() {
  try {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--app-vh', `${vh}px`);
  } catch (_err) {
    // ignore
  }
}

syncAppVh();
try {
  window.addEventListener('resize', syncAppVh);
  window.addEventListener('orientationchange', syncAppVh);
} catch (_err) {
  // ignore
}

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  try {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // ignore
      });
    });
  } catch (_err) {
    // ignore
  }
}

const root = createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <StrictMode>
    <AuthProvider>
      <AppPreferencesProvider>
        <App />
      </AppPreferencesProvider>
    </AuthProvider>
  </StrictMode>
)
