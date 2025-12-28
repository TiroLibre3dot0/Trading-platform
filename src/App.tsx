import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Login from './pages/Login'
import PremiumRewardsPage from './pages/PremiumRewardsPage'
import SocialTradingPage from './pages/SocialTradingPage'
import PlaceholderPage from './pages/PlaceholderPage'
import { useAppPreferences } from './context/AppPreferencesContext'

export default function App() {
  const { theme } = useAppPreferences();

  useEffect(() => {
    try { document.documentElement.dataset.theme = theme; } catch (e) {}
  }, [theme]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AppShell />}>
          <Route path="/premium" element={<PremiumRewardsPage />} />
          <Route path="/social" element={<SocialTradingPage />} />
          <Route path="/trade" element={<PlaceholderPage title="Negotiate" />} />
          <Route path="/open-positions" element={<PlaceholderPage title="Open Positions" />} />
          <Route path="/closed-positions" element={<PlaceholderPage title="Closed Positions" />} />
          <Route path="/funds" element={<PlaceholderPage title="Funds" />} />
          <Route path="/support" element={<PlaceholderPage title="Support" />} />
          <Route path="/documents" element={<PlaceholderPage title="Documents" />} />
          <Route path="/statements" element={<PlaceholderPage title="Statements" />} />
          <Route path="/profile" element={<PlaceholderPage title="Profile & KYC" />} />
          <Route path="/security" element={<PlaceholderPage title="Security" />} />
        </Route>
        <Route path="/" element={<Navigate to="/trade" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
