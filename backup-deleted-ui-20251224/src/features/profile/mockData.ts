export const accountInfo = {
  id: "BW-784231",
  type: "Pro | NY4",
  kpis: [
    { key: "balance", label: "Balance", value: "$50,000" },
    { key: "equity", label: "Equity", value: "$48,230" },
    { key: "freeMargin", label: "Free margin", value: "$42,110" },
    { key: "dailyPL", label: "Daily P/L", value: "+$820", positive: true },
  ],
};

export const watchlistRows = [
  { symbol: "EURUSD", price: "1.0923", change: "+0.34%", sentiment: "63% buy" },
  { symbol: "BTCUSD", price: "91,820", change: "+0.72%", sentiment: "58% buy" },
  { symbol: "NAS100", price: "25,615", change: "-0.18%", sentiment: "51% buy" },
  { symbol: "XAUUSD", price: "2,415", change: "+0.12%", sentiment: "55% buy" },
];

export const positionsRows = [
  { symbol: "BTCUSD", side: "Buy", size: "0.20", entry: "91,800", pnl: "+$420" },
  { symbol: "NAS100", side: "Sell", size: "1.00", entry: "25,640", pnl: "-$180" },
  { symbol: "XAUUSD", side: "Buy", size: "0.50", entry: "2,410", pnl: "+$95" },
];

export const activityItems = [
  "Ordine BTCUSD eseguito - Buy 0.20",
  "Prelievo in revisione - $1,200",
  "Alert NAS100 raggiunto 25,300",
];
