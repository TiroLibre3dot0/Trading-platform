export const user = {
  name: 'Wilson Alex',
  location: 'United States',
  avatar: null,
  kyc: {
    idVerification: 'verified',
    proofOfAddress: 'pending',
    sanctionsScreen: 'clear'
  }
};

export const accounts = [
  { id: 'ACC-9981', type: 'Live', balance: 120450.34, equity: 123540.12, margin: 8000.0 },
  { id: 'ACC-5512', type: 'Demo', balance: 5000.0, equity: 5000.0, margin: 0.0 }
];

export const kpis = {
  balance: accounts[0].balance,
  equity: accounts[0].equity,
  margin: accounts[0].margin,
  freeMargin: accounts[0].equity - accounts[0].margin,
  plToday: 3090.78,
  riskLevel: 'Medium'
};

export const positions = [
  { id: 'P-1001', symbol: 'EUR/USD', size: 1.5, entry: 1.0874, current: 1.0912, pl: 540.0, status: 'Open' },
  { id: 'P-1002', symbol: 'USD/JPY', size: 2.0, entry: 151.23, current: 150.87, pl: -720.0, status: 'Open' },
  { id: 'P-1003', symbol: 'BTC/USD', size: 0.05, entry: 62000, current: 64500, pl: 1250.0, status: 'Open' },
  { id: 'P-1004', symbol: 'AAPL', size: 50, entry: 168.5, current: 170.12, pl: 81.0, status: 'Open' }
];

export const transactions = [
  { id: 'T-9001', type: 'Deposit', method: 'Wire', amount: 50000.0, date: '2025-12-18 10:32', status: 'Completed' },
  { id: 'T-9002', type: 'Withdrawal', method: 'Bank', amount: 1500.0, date: '2025-12-22 09:12', status: 'Pending' },
  { id: 'T-9003', type: 'Trade', method: 'EUR/USD', amount: -720.0, date: '2025-12-24 11:05', status: 'Executed' },
  { id: 'T-9004', type: 'Trade', method: 'BTC/USD', amount: 1250.0, date: '2025-12-24 08:40', status: 'Executed' }
];

export const alerts = [
  { id: 'A1', level: 'warning', message: 'Proof of address pending. Upload to avoid limits.' },
  { id: 'A2', level: 'info', message: 'Margin utilization at 18% — within acceptable range.' }
];

export default { user, accounts, kpis, positions, transactions, alerts };
