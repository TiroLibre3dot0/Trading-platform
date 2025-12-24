# Trading Platform

## Dev servers

- Avvia API locali (porta 4000): `npm run api`
- Avvia Vite (porta 5173): `npm run dev`

Endpoint rapidi:
- GET http://localhost:4000/api/ping
- GET http://localhost:4000/api/profile/dashboard

## Qlik lab

- Nuova pagina di prova su `/qlik-lab` per test embed e API senza toccare la UI profilo.
- Variabili richieste lato server: `QLIK_HOST`, `QLIK_WEB_INTEGRATION_ID`, `QLIK_APP_ID` (opzionale `QLIK_API_KEY`).
- Endpoint proxy: `/api/qlik/config`, `/api/qlik/ping`, `/api/qlik/items`, `/api/qlik/apps`.
- La pagina legge le variabili via backend e usa `VITE_API_BASE_URL` per le chiamate.
