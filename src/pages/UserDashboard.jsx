import React from 'react';
import DashboardShell from '../components/dashboard/DashboardShell';

/*
  UserDashboard page
  - Structure: uses `DashboardLayout` (navbar + sidebars) and renders a fixed, non-scrolling page.
  - Mock data lives in: `src/mock/userDashboardMock.js`.
  - All long lists/charts are internally scrollable; the overall page uses `h-screen` and `overflow-hidden`.
*/

export default function UserDashboard() {
  return <DashboardShell />;
}
