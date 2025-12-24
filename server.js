import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;
const VITE_ORIGIN = process.env.VITE_ORIGIN || "http://localhost:5173";
const EXTRA_ORIGINS = ["http://localhost:4173"];
const DEV_ORIGINS = ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"];
const allowedOrigins = new Set([VITE_ORIGIN, ...EXTRA_ORIGINS, ...DEV_ORIGINS]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, origin ?? true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());

let profileDashboard = {
  account: {
    accountId: "BW-784231",
    tier: "Pro",
    location: "NY4",
  },
  kpis: {
    balance: 50123,
    equity: 48230,
    freeMargin: 42110,
    dailyPL: 1234,
    currency: "USD",
  },
  nextActions: [
    {
      id: "price-alert",
      title: "Crea 1 alert prezzo",
      description: "Scegli un asset in watchlist e ricevi una notifica push.",
      cta: "Imposta alert",
    },
    {
      id: "take-profit",
      title: "Attiva take profit",
      description: "Proteggi i profitti sulle posizioni aperte.",
      cta: "Aggiungi TP",
    },
    {
      id: "academy",
      title: "Segui un corso rapido",
      description: "3 lezioni da 5 min per migliorare la strategia.",
      cta: "Vai all’Academy",
    },
  ],
  onboarding: {
    progressPct: 0,
    steps: [
      { id: "verify", title: "Completa verifica", description: "Carica documento e prova di residenza.", done: false },
      { id: "deposit", title: "Effettua un deposito", description: "Aggiungi fondi con carta o bonifico.", done: false },
      { id: "alert", title: "Imposta 1 alert prezzo", description: "Ricevi push quando il mercato si muove.", done: false },
      { id: "demo", title: "Esegui 1 trade demo", description: "Testa strategia senza rischio.", done: false },
    ],
  },
  watchlist: [
    { symbol: "EURUSD", price: 1.0923, changePct: 0.34, sentiment: { buyPct: 63, label: "buy" } },
    { symbol: "BTCUSD", price: 91820, changePct: 0.72, sentiment: { buyPct: 58, label: "buy" } },
    { symbol: "NAS100", price: 25615, changePct: -0.18, sentiment: { buyPct: 51, label: "buy" } },
    { symbol: "XAUUSD", price: 2415, changePct: 0.12, sentiment: { buyPct: 55, label: "buy" } },
  ],
  openPositions: [
    { symbol: "BTCUSD", side: "Buy", size: 0.2, entry: 91800, pl: 420 },
    { symbol: "NAS100", side: "Sell", size: 1.0, entry: 25640, pl: -180 },
    { symbol: "XAUUSD", side: "Buy", size: 0.5, entry: 2410, pl: 95 },
  ],
  summaryCards: {
    depositsWithdrawals: "Visa, MasterCard, wire, wallets. 24h avg withdrawals.",
    riskManagement: "Stops, trailing, margin alerts, negative balance protection.",
  },
  recentActivity: [
    "Ordine BTCUSD eseguito – Buy 0.20",
    "Prelievo in revisione – $1,200",
    "Alert NAS100 raggiunto 25,300",
  ],
  updatedAt: new Date().toISOString(),
};

const eventsLog = [];

const allowedKeys = new Set([
  "kpis",
  "nextActions",
  "onboarding",
  "watchlist",
  "openPositions",
  "summaryCards",
  "recentActivity",
]);

const QLIK_TENANT_URL = (process.env.QLIK_TENANT_URL || "").trim();
const QLIK_API_KEY = (process.env.QLIK_API_KEY || "").trim();

function normalizeTenantUrl(url) {
  if (!url) return "";
  return url.replace(/\/+$/, "");
}

function parseLimit(rawLimit, fallback = 20) {
  const value = Number(rawLimit);
  if (Number.isNaN(value) || value <= 0) return fallback;
  return Math.min(100, Math.max(1, value));
}

function ensureQlikEnv(res) {
  const tenant = normalizeTenantUrl(QLIK_TENANT_URL);
  if (!tenant) {
    res.status(500).json({ ok: false, status: 500, error: "QLIK_TENANT_URL is required", details: "" });
    return null;
  }
  if (!QLIK_API_KEY) {
    res.status(500).json({ ok: false, status: 500, error: "QLIK_API_KEY is required", details: "" });
    return null;
  }
  return { tenant, apiKey: QLIK_API_KEY };
}

async function qlikGet(res, url) {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${QLIK_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const text = await response.text();
    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        status: response.status,
        error: response.statusText || "Qlik request failed",
        details: text.slice(0, 500),
      });
    }

    let data = text;
    try {
      data = text ? JSON.parse(text) : null;
    } catch (_err) {
      // leave data as text snippet
    }

    return res.json({ ok: true, status: response.status, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Qlik request failed";
    return res.status(500).json({ ok: false, status: 500, error: message, details: "" });
  }
}

app.get("/api/ping", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.get("/api/qlik/ping", async (_req, res) => {
  const env = ensureQlikEnv(res);
  if (!env) return;

  const url = `${env.tenant}/api/v1/items?limit=1`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${env.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({
        ok: false,
        status: response.status,
        error: response.statusText || "Qlik request failed",
        details: text.slice(0, 500),
      });
    }

    return res.json({ ok: true, tenant: env.tenant, ts: new Date().toISOString() });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Qlik request failed";
    return res.status(500).json({ ok: false, status: 500, error: message, details: "" });
  }
});

app.get("/api/qlik/items", async (req, res) => {
  const env = ensureQlikEnv(res);
  if (!env) return;

  const limit = parseLimit(req.query.limit, 20);
  const url = `${env.tenant}/api/v1/items?limit=${limit}`;
  await qlikGet(res, url);
});

app.get("/api/qlik/apps", async (req, res) => {
  const env = ensureQlikEnv(res);
  if (!env) return;

  const limit = parseLimit(req.query.limit, 20);
  const url = `${env.tenant}/api/v1/apps?limit=${limit}`;
  await qlikGet(res, url);
});

app.get("/api/profile/dashboard", (_req, res) => {
  res.json(profileDashboard);
});

function computeInsights(snapshot) {
  const balance = snapshot?.kpis?.balance ?? 0;
  const freeMargin = snapshot?.kpis?.freeMargin ?? 0;
  const safeRatio = balance === 0 ? null : freeMargin / balance;
  const metrics = {
    freeMarginRatio: safeRatio,
    positionsCount: snapshot?.openPositions?.length ?? 0,
    dailyPL: snapshot?.kpis?.dailyPL ?? 0,
  };

  const flags = [];

  if ((snapshot?.onboarding?.progressPct ?? 0) < 50) {
    flags.push({
      id: "onboarding-incomplete",
      level: "orange",
      title: "Onboarding incomplete",
      reason: "Completa i passaggi obbligatori per sbloccare tutte le funzioni dell'account.",
      drivers: ["Progress sotto 50%", "Step KYC mancanti"],
      nextSteps: ["Completa verifica documento", "Carica prova di residenza", "Imposta alert prezzo"],
      metrics,
    });
  }

  if ((snapshot?.kpis?.dailyPL ?? 0) < 0 && metrics.freeMarginRatio !== null && metrics.freeMarginRatio < 0.5) {
    flags.push({
      id: "margin-stress",
      level: "red",
      title: "Margin stress risk",
      reason: "P/L negativo con margine libero sotto soglia: potenziale margin call.",
      drivers: metrics.freeMarginRatio === null ? ["Balance not available"] : ["Daily P/L sotto zero", "Free margin <50% del balance"],
      nextSteps: ["Riduci leva o chiudi posizioni in perdita", "Aumenta il margine disponibile", "Imposta alert di rischio"],
      metrics,
    });
  }

  if ((snapshot?.openPositions?.length ?? 0) >= 4 && (snapshot?.kpis?.dailyPL ?? 0) < 0) {
    flags.push({
      id: "overexposure",
      level: "orange",
      title: "Overexposure",
      reason: "Troppe posizioni aperte mentre il P/L giornaliero è negativo.",
      drivers: [">=4 posizioni aperte", "P/L giornaliero negativo"],
      nextSteps: ["Ribilancia il portafoglio", "Chiudi le posizioni meno performanti", "Riduci concentrazione su asset correlati"],
      metrics,
    });
  }

  if (flags.length === 0) {
    flags.push({
      id: "account-healthy",
      level: "green",
      title: "Account healthy",
      reason: "Margine e rischio sotto controllo. Puoi ottimizzare ulteriormente.",
      drivers: ["Margine adeguato", "P/L giornaliero stabile"],
      nextSteps: ["Imposta alert automatici", "Diversifica la watchlist", "Rafforza il piano di take profit"],
      metrics,
    });
  }

  // Higher number = higher severity; stable sort preserves original order for same level.
  const severityPriority = { red: 3, orange: 2, green: 1 };
  const sortedFlags = flags
    .map((flag, idx) => ({ flag, idx }))
    .sort((a, b) => {
      const pa = severityPriority[a.flag.level] ?? 0;
      const pb = severityPriority[b.flag.level] ?? 0;
      if (pa !== pb) return pb - pa;
      return a.idx - b.idx;
    })
    .map((item) => item.flag);

  return { flags: sortedFlags, generatedAt: new Date().toISOString() };
}

app.get("/api/profile/dashboard/insights", (_req, res) => {
  const snapshot = profileDashboard;
  const payload = computeInsights(snapshot);
  res.json(payload);
});

app.get("/api/routes", (_req, res) => {
  res.json({
    routes: [
      "/api/ping",
      "/api/qlik/ping",
      "/api/qlik/items",
      "/api/qlik/apps",
      "/api/profile/dashboard",
    ],
  });
});

function computeEconomicChurn(snapshot) {
  const balance = snapshot?.kpis?.balance ?? 0;
  const equity = snapshot?.kpis?.equity ?? 0;
  const equityBalanceRatio = balance > 0 ? equity / balance : null;
  const dailyPL = snapshot?.kpis?.dailyPL ?? 0;
  const positionsCount = snapshot?.openPositions?.length ?? 0;
  const onboardingProgress = snapshot?.onboarding?.progressPct ?? 0;

  const conditions = {
    c1: dailyPL < 0,
    c2: equityBalanceRatio !== null && equityBalanceRatio < 0.7,
    c3: positionsCount >= 4,
    c4: onboardingProgress < 50,
  };

  const trueCount = Object.values(conditions).filter(Boolean).length;
  let level = "green";
  if (trueCount >= 2) level = "red";
  else if (trueCount === 1) level = "orange";

  const lifetimeByLevel = { green: 120, orange: 45, red: 14 };
  const estimatedLifetimeDays = lifetimeByLevel[level];
  const estimatedEconomicValue = Math.max(0, balance * 0.1 * (estimatedLifetimeDays / 30));

  return {
    level,
    title: "Economic churn risk",
    reason:
      level === "red"
        ? "Rischio alto di churn economico rilevato su più segnali."
        : level === "orange"
          ? "Alcuni segnali indicano rischio di churn: intervenire proattivamente."
          : "Basso rischio di churn economico: mantieni l'ingaggio attivo.",
    drivers: Object.entries(conditions)
      .filter(([, isTrue]) => isTrue)
      .map(([key]) => {
        switch (key) {
          case "c1":
            return "P/L giornaliero negativo";
          case "c2":
            return "Equity <70% del balance";
          case "c3":
            return ">=4 posizioni aperte";
          case "c4":
            return "Onboarding incompleto (<50%)";
          default:
            return key;
        }
      }),
    metrics: {
      balance,
      equity,
      equityBalanceRatio,
      dailyPL,
      positionsCount,
      onboardingProgress,
    },
    estimatedLifetimeDays,
    estimatedEconomicValue,
    generatedAt: new Date().toISOString(),
  };
}

function computeEconomicChurnActions(snapshot) {
  const churn = computeEconomicChurn(snapshot);
  const onboardingProgress = snapshot?.onboarding?.progressPct ?? 0;

  if (churn.level === "red") {
    return {
      level: churn.level,
      primaryAction: {
        id: "reduce-exposure",
        label: "Reduce exposure",
        why: "Segnali multipli di churn con rischio margin: serve ridurre il rischio immediatamente.",
        expectedImpact: "Riduce la probabilita' di margin call e abbandono.",
      },
      secondaryActions: [
        {
          id: "set-margin-alert",
          label: "Set margin alert",
          why: "Monitora il margine residuo per evitare liquidation.",
          expectedImpact: "Intervento proattivo prima di eventi critici.",
        },
        {
          id: "restore-margin",
          label: "Deposit to restore margin",
          why: "Ripristina free margin per mantenere le posizioni sane.",
          expectedImpact: "Aumenta resilienza e lifetime stimata.",
        },
      ],
    };
  }

  if (churn.level === "orange" && onboardingProgress < 50) {
    return {
      level: churn.level,
      primaryAction: {
        id: "complete-verification",
        label: "Complete verification",
        why: "Onboarding incompleto: blocca feature chiave e aumenta churn.",
        expectedImpact: "Sblocca funzioni, riduce frizione e rischio di uscita.",
      },
      secondaryActions: [
        {
          id: "set-price-alert",
          label: "Set price alert",
          why: "Mantiene l'utente ingaggiato su asset chiave.",
          expectedImpact: "Migliora re-engagement e lifetime.",
        },
      ],
    };
  }

  return {
    level: churn.level,
    primaryAction: {
      id: "set-price-alert",
      label: "Set price alert",
      why: "Churn basso: mantieni l'attenzione sugli asset rilevanti.",
      expectedImpact: "Aumenta interazioni future e retention.",
    },
    secondaryActions: [
      {
        id: "explore-academy",
        label: "Explore Academy",
        why: "Formazione leggera per aumentare confidenza e frequenza d'uso.",
        expectedImpact: "Supporta upgrade e maggiore lifetime.",
      },
    ],
  };
}

app.get("/api/profile/dashboard/economic-churn", (_req, res) => {
  const snapshot = profileDashboard;
  const payload = computeEconomicChurn(snapshot);
  res.json(payload);
});

app.get("/api/profile/dashboard/economic-churn/actions", (_req, res) => {
  const snapshot = profileDashboard;
  const payload = computeEconomicChurnActions(snapshot);
  res.json(payload);
});

app.post("/api/profile/events", (req, res) => {
  const { eventType, actionId, ts } = req.body || {};
  if (!eventType || !actionId) {
    return res.status(400).json({ error: "eventType and actionId are required" });
  }
  const entry = {
    eventType,
    actionId,
    ts: ts || new Date().toISOString(),
  };
  eventsLog.push(entry);
  res.json({ ok: true, saved: entry });
});

app.put("/api/profile/dashboard", (req, res) => {
  const payload = req.body || {};
  const next = { ...profileDashboard };

  for (const key of Object.keys(payload)) {
    if (!allowedKeys.has(key)) continue;
    const value = payload[key];
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      next[key] = { ...next[key], ...value };
    } else {
      next[key] = value;
    }
  }

  next.updatedAt = new Date().toISOString();
  profileDashboard = next;
  res.json(profileDashboard);
});

app.listen(PORT, () => {
  console.log(`Profile API listening on http://localhost:${PORT} (Qlik routes enabled)`);
});
