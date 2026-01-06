# Trading Platform

React 18 + Vite + TypeScript. Include un server Express opzionale (`server.js`) per mock API locali e integrazione Qlik (utile in dev, non necessario per un deploy solo front-end).

## Prerequisiti

- Node.js 18+ consigliato
- npm

## Setup

```bash
npm install
```

## Avvio in locale

### Solo UI (front-end)

```bash
npm run dev
```

Vite parte di default su `http://localhost:5173`.

### UI + API locali (Express)

In un terminale:

```bash
npm run api
```

In un altro terminale:

```bash
npm run dev
```

Endpoint rapidi:

- GET `http://localhost:4000/api/ping`
- GET `http://localhost:4000/api/profile/dashboard`

## Variabili d'ambiente

Questo progetto usa variabili sia lato Vite (front-end) sia lato server Express.

### Front-end (Vite)

- `VITE_API_BASE_URL` (opzionale): base URL per le chiamate API dal browser.
	- Esempio: `http://localhost:4000`
	- Se non impostata, alcune pagine possono assumere endpoint relativi (dipende dall'implementazione UI).

### Server (Express)

- `PORT` (opzionale): porta del server (default `4000`).
- `VITE_ORIGIN` (opzionale): origin consentita dal CORS (default `http://localhost:5173`).
	- Il server consente anche origini di sviluppo comuni (`5173-5175`) e `4173` per `vite preview`.

#### Qlik

Le rotte Qlik richiedono:

- `QLIK_TENANT_URL` (obbligatoria): es. `https://<tenant>.qlikcloud.com`
- `QLIK_API_KEY` (obbligatoria): API key/token usato per autenticare le chiamate

## Qlik lab

Pagina di prova su `/qlik-lab` per test embed e API senza toccare la UI profilo.

Endpoint proxy disponibili nel server:

- GET `/api/qlik/ping`
- GET `/api/qlik/items?limit=20`
- GET `/api/qlik/apps?limit=20`

## Test (Playwright)

Playwright è già incluso tra le dev-deps.

```bash
npm run test
```

Opzionale (runner UI):

```bash
npm run test:e2e:ui
```

Nota: i test assumono che l'app sia raggiungibile (default `http://localhost:5173`).

## Deploy

Per deploy su Vercel solo front-end, basta la build Vite:

```bash
npm run build
npm run preview
```

Il server Express non è necessario per servire lo statico su Vercel (a meno di esigenze specifiche di proxy/API).
