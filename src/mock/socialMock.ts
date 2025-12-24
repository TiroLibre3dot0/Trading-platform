const socialMock = {
  providers: [
    { id: 'P-1', name: 'AlphaStrategies', avatar: null, risk: 'Medium', roi30: 4.2, roi90: 12.5, drawdown: 6.2, followers: 1240 },
    { id: 'P-2', name: 'MacroPulse', avatar: null, risk: 'Low', roi30: 2.1, roi90: 7.3, drawdown: 3.8, followers: 5400 },
    { id: 'P-3', name: 'CryptoSage', avatar: null, risk: 'High', roi30: 12.4, roi90: 45.1, drawdown: 22.5, followers: 880 },
    { id: 'P-4', name: 'EquityEdge', avatar: null, risk: 'Medium', roi30: 3.9, roi90: 9.6, drawdown: 5.0, followers: 2200 }
  ],
  leaderboard: [
    { name: 'TraderOne', roi30: 18.2, followers: 10200, sharpe: 1.45 },
    { name: 'TopSignals', roi30: 15.6, followers: 8200, sharpe: 1.32 },
    { name: 'SwiftAlpha', roi30: 12.9, followers: 5400, sharpe: 1.12 }
  ],
  feed: [
    { id: 'F1', text: 'AlphaStrategies opened a long on BTC/USD', time: '2h ago' },
    { id: 'F2', text: 'MacroPulse reduced exposure to EUR/USD', time: '4h ago' },
    { id: 'F3', text: 'CryptoSage signalled a high-conviction ETH trade', time: '6h ago' },
    { id: 'F4', text: 'EquityEdge added AAPL to top holdings', time: '1d ago' },
    { id: 'F5', text: 'TopSignals reached 10k followers', time: '2d ago' }
  ]
};

export default socialMock;
