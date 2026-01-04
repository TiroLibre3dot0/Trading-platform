import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import RequireAuth from './components/auth/RequireAuth'
import AuthShell from './features/auth/pages/AuthShell'
import Login from './features/auth/pages/LoginPage'
import Signup from './features/auth/pages/SignupPage'
import Bonus from './features/auth/pages/BonusPage'
import PremiumRewardsPage from './pages/PremiumRewardsPage'
import SocialTradingPage from './pages/SocialTradingPage'
import TradePage from './pages/TradePage'
import PlaceholderPage from './pages/PlaceholderPage'
import { useAppPreferences } from './context/AppPreferencesContext'

export default function App() {
  const { theme } = useAppPreferences();

  useEffect(() => {
    try { document.documentElement.dataset.theme = theme; } catch (e) {}
  }, [theme]);
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route element={<AuthShell />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/bonus" element={<Bonus />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route element={<AppShell />}>
            <Route path="/menu" element={<PlaceholderPage title="Menu" />} />
            <Route path="/account-settings" element={<PlaceholderPage title="Account Settings" />} />
            <Route path="/premium" element={<PremiumRewardsPage />} />
            <Route path="/social" element={<SocialTradingPage />} />
            <Route path="/trade" element={<TradePage />} />
            <Route path="/positions" element={<PlaceholderPage title="Positions" />} />
            <Route path="/open-positions" element={<PlaceholderPage title="Positions" />} />
            <Route path="/closed-positions" element={<PlaceholderPage title="Positions" />} />
            <Route path="/funds" element={<PlaceholderPage title="Funds" />} />
            <Route path="/support" element={<PlaceholderPage title="Support" />} />
            <Route path="/documents" element={<PlaceholderPage title="Documents" />} />
            <Route path="/statements" element={<PlaceholderPage title="Statements" />} />
            <Route path="/profile" element={<PlaceholderPage title="Profile & KYC" />} />
            <Route path="/security" element={<PlaceholderPage title="Security" />} />
          </Route>
        </Route>
        <Route path="/" element={<Navigate to="/trade" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
