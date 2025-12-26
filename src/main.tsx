import React from 'react'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { AppPreferencesProvider } from './context/AppPreferencesContext'

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
