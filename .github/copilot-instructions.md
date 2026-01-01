<!-- Copilot Instructions — trading-platform/ -->
# Copilot instructions — trading-platform

## Quick start (dev)
- UI (Vite): run `npm run dev` from `trading-platform/` (default port 5173).
- Local API: run `npm run api` from `trading-platform/` (runs `server.js`, default port 4000).
- Health check: `GET http://localhost:4000/api/ping`.

## Architecture (what talks to what)
- Frontend is a Vite + React app (mixed TS/JS). Routing is in `src/App.tsx`; the shell/layout is `src/components/layout/AppShell.tsx`.
- Backend is a single Express server in `server.js` serving “profile dashboard” mock data + a proxy to Qlik APIs.

## Backend API (server.js)
- Profile dashboard (mock snapshot + derived insights):
  - `GET /api/profile/dashboard`
  - `GET /api/profile/dashboard/insights`
  - `GET /api/profile/dashboard/economic-churn`
  - `GET /api/profile/dashboard/economic-churn/actions`
  - `PUT /api/profile/dashboard` (only allows specific top-level keys; merges objects)
  - `POST /api/profile/events` (simple event log)
- Qlik proxy endpoints:
  - `GET /api/qlik/ping`
  - `GET /api/qlik/items?limit=…`
  - `GET /api/qlik/apps?limit=…`

## Env vars (what the code actually reads)
- Server (`server.js`):
  - `PORT` (default 4000)
  - `VITE_ORIGIN` (CORS allow-list origin; default `http://localhost:5173`)
  - `QLIK_TENANT_URL` and `QLIK_API_KEY` are required for `/api/qlik/*`.
- Note: `trading-platform/README.md` mentions `QLIK_HOST`/`QLIK_WEB_INTEGRATION_ID`/`QLIK_APP_ID`, but current `server.js` expects `QLIK_TENANT_URL` + `QLIK_API_KEY`.

## Frontend patterns worth following
- Auth is purely local (no backend auth): `src/context/AuthContext.jsx` stores a mock user in `localStorage` key `bw_user`.
- Theme is driven via `src/context/AppPreferencesContext.tsx` and applied with `document.documentElement.dataset.theme` in `src/App.tsx`.
- The “trade terminal” UI is largely mock-driven (see `src/pages/TradePage.tsx`).

## Known drift / sharp edges
- UI navigation contains a `/qlik-lab` link (see `src/features/profile/components/ProfileSidebar.tsx`), but there is no route/page defined for `/qlik-lab` in `src/App.tsx`.
- Older Qlik UI helpers exist under `backup-deleted-ui-20251224/` (useful for reference, but not wired into the current build).
