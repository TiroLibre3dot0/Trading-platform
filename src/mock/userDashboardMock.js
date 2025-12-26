// Mock data for User Dashboard (realistic sample values)
export const user = {
  id: 'WLX-4521',
  name: 'Wilson Alex',
  email: 'wilson.alex@bullwaves.com',
  location: 'United States',
  avatar: null,
  risk: 'Medium',
  status: 'Premium', // Premium, Elite, Top
  kyc: { idVerification: 'verified', address: 'pending' }
};

export const accounts = [
  { id: 'ACC-9981', type: 'Live', balance: 120450.34, equity: 123540.12, margin: 8000.0 },
  { id: 'ACC-5512', type: 'Demo', balance: 5000.0, equity: 5000.0, margin: 0.0 }
];

export const kpis = {
  inAccount: 120450.34,
  demo: 5000.0,
  userId: user.id,
  location: user.location,
  risk: user.risk
};

// additional coherent risk/balance metrics
kpis.marginUsed = 8000.0;
kpis.freeMargin = +(kpis.inAccount + 3090.78 - kpis.marginUsed).toFixed(2);
kpis.plLast30 = 4120.5;
kpis.bonus = 250.0; // Bonus amount
kpis.winRate = 52; // percent
kpis.avgTradeDuration = '2h 14m';

// timeseries 14 days
export const timeseries = Array.from({ length: 14 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (13 - i));
  const value = 120000 + Math.round((Math.sin(i / 2) * 1200) + (i * 45));
  return { date: date.toISOString().slice(0,10), value };
});

export const monthlyBars = [
  { month: 'Jan', profit: 4200 },
  { month: 'Feb', profit: 3200 },
  { month: 'Mar', profit: 5400 },
  { month: 'Apr', profit: 2100 },
  { month: 'May', profit: 6800 },
  { month: 'Jun', profit: 4300 }
];

export const topInstruments = [
  { name: 'BTC/USD', pct: 34 },
  { name: 'EUR/USD', pct: 22 },
  { name: 'AAPL', pct: 16 },
  { name: 'XAU/USD', pct: 14 },
  { name: 'ETH/USD', pct: 14 }
];

// ensure colors & consistency for donut component
export const instruments = topInstruments.map((t, i) => ({ ...t, color: ['#06b6d4', '#34d399', '#60a5fa', '#f59e0b', '#f97316'][i % 5] }));

export const transactions = [
  { id: 'TX-1001', type: 'Deposit', method: 'Wire', symbol: '', amount: 50000, date: '2025-12-18 10:32', status: 'Completed' },
  { id: 'TX-1002', type: 'Withdrawal', method: 'Bank', symbol: '', amount: -1500, date: '2025-12-22 09:12', status: 'Pending' },
  { id: 'TX-1003', type: 'Trade', method: 'Sell', symbol: 'EUR/USD', amount: 540, date: '2025-12-24 11:05', status: 'Executed' },
  { id: 'TX-1004', type: 'Trade', method: 'Buy', symbol: 'BTC/USD', amount: 1250, date: '2025-12-24 08:40', status: 'Executed' },
  { id: 'TX-1005', type: 'Trade', method: 'Buy', symbol: 'AAPL', amount: 81, date: '2025-12-23 16:20', status: 'Executed' },
  { id: 'TX-1006', type: 'Fee', method: 'Trading Fee', symbol: '', amount: -12.5, date: '2025-12-23 16:21', status: 'Settled' },
  { id: 'TX-1007', type: 'Deposit', method: 'Card', symbol: '', amount: 2000, date: '2025-12-15 09:10', status: 'Completed' },
  { id: 'TX-1008', type: 'Trade', method: 'Buy', symbol: 'ETH/USD', amount: 450, date: '2025-12-12 12:00', status: 'Executed' },
  { id: 'TX-1009', type: 'Transfer', method: 'Internal', symbol: '', amount: -1000, date: '2025-12-10 14:00', status: 'Completed' },
  { id: 'TX-1010', type: 'Withdrawal', method: 'Crypto', symbol: 'BTC', amount: -0.01, date: '2025-12-08 08:20', status: 'Completed' }
];

export const notifications = [
  { id: 'N-1', title: 'Deposit received', body: 'Your deposit of $2,000 has been credited to ACC-9981.', time: '2h ago', level: 'info' },
  { id: 'N-2', title: 'Withdrawal pending', body: 'A withdrawal request is pending approval.', time: '1d ago', level: 'warning' },
  { id: 'N-3', title: 'New instrument added', body: 'XRP/USD is now available for trading in MetaTrade.', time: '3d ago', level: 'info' }
];

export const markets = [
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'forex', bid: 1.0842, ask: 1.0845, spread: 0.0003, tickSize: 0.0001, lotSize: 100000, tradable: true, changePct: 0.12, change: 0.0013, high: 1.0880, low: 1.0790 },
  { symbol: 'GBP/USD', name: 'British Pound / US Dollar', category: 'forex', bid: 1.2645, ask: 1.2648, spread: 0.0003, tickSize: 0.0001, lotSize: 100000, tradable: true, changePct: -0.05, change: -0.0006, high: 1.2690, low: 1.2620 },
  { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', category: 'forex', bid: 148.22, ask: 148.25, spread: 0.03, tickSize: 0.01, lotSize: 100000, tradable: true, changePct: 0.18, change: 0.27, high: 148.70, low: 147.80 },
  { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar', category: 'crypto', bid: 51245.5, ask: 51266.0, spread: 20.5, tickSize: 0.1, lotSize: 1, tradable: true, changePct: -0.38, change: -195.5, high: 51500.0, low: 50900.0 },
  { symbol: 'ETH/USD', name: 'Ethereum / US Dollar', category: 'crypto', bid: 3801.2, ask: 3803.5, spread: 2.3, tickSize: 0.1, lotSize: 1, tradable: true, changePct: 0.95, change: 36.0, high: 3845.0, low: 3740.0 },
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'stocks', bid: 173.22, ask: 173.30, spread: 0.08, tickSize: 0.01, lotSize: 1, tradable: true, changePct: 1.12, change: 1.92, high: 174.10, low: 170.50 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', category: 'stocks', bid: 349.12, ask: 349.30, spread: 0.18, tickSize: 0.01, lotSize: 1, tradable: true, changePct: -0.45, change: -1.58, high: 353.00, low: 346.50 },
  { symbol: 'TSLA', name: 'Tesla Inc.', category: 'stocks', bid: 322.44, ask: 322.90, spread: 0.46, tickSize: 0.01, lotSize: 1, tradable: true, changePct: 2.10, change: 6.62, high: 325.00, low: 312.00 },
  { symbol: 'XAU/USD', name: 'Gold / US Dollar', category: 'commodities', bid: 2321.1, ask: 2321.9, spread: 0.8, tickSize: 0.1, lotSize: 100, tradable: true, changePct: -0.24, change: -5.6, high: 2330.0, low: 2312.0 },
  { symbol: 'US30', name: 'Dow Jones 30', category: 'indices', bid: 36340, ask: 36360, spread: 20, tickSize: 1, lotSize: 1, tradable: true, changePct: 0.32, change: 116, high: 36450, low: 36000 }
];

// open positions examples: long/short, partial sizes, hedged, different instruments
export const positions = [
  { id: 'P-9001', symbol: 'EUR/USD', side: 'Buy', size: 1.2, lotSize: 100000, entry: 1.0810, current: 1.0842, leverage: 30, margin: 3600, pl: +384, plPct: 3.2, openedAt: '2025-12-20 09:12', status: 'open' },
  { id: 'P-9002', symbol: 'BTC/USD', side: 'Sell', size: 0.05, lotSize: 1, entry: 52400, current: 51245.5, leverage: 5, margin: 5240, pl: +577.5, plPct: 11.02, openedAt: '2025-12-15 14:22', status: 'open' },
  { id: 'P-9003', symbol: 'AAPL', side: 'Buy', size: 50, lotSize: 1, entry: 168.40, current: 173.22, leverage: 2, margin: 4210, pl: +241, plPct: 1.16, openedAt: '2025-12-10 11:00', status: 'open' },
  { id: 'P-9004', symbol: 'XAU/USD', side: 'Buy', size: 2, lotSize: 100, entry: 2318.0, current: 2321.1, leverage: 10, margin: 4636, pl: +6.2, plPct: 0.13, openedAt: '2025-12-01 08:00', status: 'open' },
  { id: 'P-9005', symbol: 'ETH/USD', side: 'Buy', size: 3, lotSize: 1, entry: 3750.0, current: 3801.2, leverage: 3, margin: 3750, pl: +153.6, plPct: 1.37, openedAt: '2025-12-22 18:30', status: 'open' }
];

// funds & ledger examples
export const funds = {
  summary: { total: kpis.inAccount, available: kpis.freeMargin, marginUsed: kpis.marginUsed },
  history: [
    { id: 'F-2001', type: 'Deposit', method: 'Card', amount: 2000, date: '2025-12-15', status: 'Completed' },
    { id: 'F-2002', type: 'Deposit', method: 'Wire', amount: 50000, date: '2025-12-18', status: 'Completed' },
    { id: 'F-2003', type: 'Withdrawal', method: 'Bank', amount: -1500, date: '2025-12-22', status: 'Pending' }
  ]
};

// sample orders to demonstrate pending/limit/market flows
export const orders = [
  { id: 'O-3001', symbol: 'EUR/USD', side: 'Buy', type: 'Market', size: 1.0, price: 1.0845, status: 'Filled', createdAt: '2025-12-24 08:35' },
  { id: 'O-3002', symbol: 'BTC/USD', side: 'Buy', type: 'Limit', size: 0.02, price: 50000, status: 'Pending', createdAt: '2025-12-23 14:12' },
  { id: 'O-3003', symbol: 'AAPL', side: 'Sell', type: 'Stop', size: 20, price: 165.0, status: 'Cancelled', createdAt: '2025-12-21 09:00' }
];

// documents and compliance artifacts
export const documents = [
  { id: 'D-1', type: 'ID', name: 'passport_wilson_alex.pdf', issuedBy: 'US Passport Office', status: 'verified', uploadedAt: '2025-10-01' },
  { id: 'D-2', type: 'Address', name: 'utility_bill_dec24.pdf', issuedBy: 'Electric Co.', status: 'pending', uploadedAt: '2025-12-12' },
  { id: 'D-3', type: 'Tax', name: 'tax_2024.pdf', issuedBy: 'IRS', status: 'available', uploadedAt: '2025-03-10' }
];

// quick demo alerts and compliance messages
export const alerts = [
  { id: 'A-1', level: 'info', title: 'Margin reminder', body: 'Free margin is getting low on ACC-9981. Consider reducing position size or depositing funds.' },
  { id: 'A-2', level: 'critical', title: 'KYC pending', body: 'Address verification pending — withdrawals may be delayed.' }
];

export const openPositions = positions;

export default { user, accounts, kpis, timeseries, monthlyBars, topInstruments, instruments, transactions, notifications, markets, positions, openPositions, funds, documents, alerts, orders };

