import React, { useMemo, useState, useEffect, useRef } from 'react';
import { LineChart, Activity, Grid3X3, ZoomIn, ZoomOut, Play, RotateCcw, TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { useAppPreferences } from '../context/AppPreferencesContext';

// Mock market data
const mock = {
  markets: [
    { symbol: 'EUR/USD', name: 'Euro vs US Dollar', price: 1.0825, bid: 1.0823, ask: 1.0827, change: 0.15, changePct: 0.15 },
    { symbol: 'GBP/USD', name: 'British Pound vs US Dollar', price: 1.2750, bid: 1.2748, ask: 1.2752, change: -0.25, changePct: -0.25 },
    { symbol: 'USD/JPY', name: 'US Dollar vs Japanese Yen', price: 153.45, bid: 153.42, ask: 153.48, change: 0.35, changePct: 0.35 },
    { symbol: 'USD/CHF', name: 'US Dollar vs Swiss Franc', price: 0.8750, bid: 0.8748, ask: 0.8752, change: -0.12, changePct: -0.12 },
    { symbol: 'AUD/USD', name: 'Australian Dollar vs US Dollar', price: 0.6525, bid: 0.6523, ask: 0.6527, change: 0.08, changePct: 0.08 },
    { symbol: 'USD/CAD', name: 'US Dollar vs Canadian Dollar', price: 1.3525, bid: 1.3523, ask: 1.3527, change: -0.18, changePct: -0.18 },
    { symbol: 'NZD/USD', name: 'New Zealand Dollar vs US Dollar', price: 0.5950, bid: 0.5948, ask: 0.5952, change: 0.22, changePct: 0.22 },
    { symbol: 'EUR/GBP', name: 'Euro vs British Pound', price: 0.8475, bid: 0.8473, ask: 0.8477, change: 0.41, changePct: 0.41 },
    { symbol: 'EUR/JPY', name: 'Euro vs Japanese Yen', price: 166.25, bid: 166.22, ask: 166.28, change: 0.50, changePct: 0.50 },
    { symbol: 'GBP/JPY', name: 'British Pound vs Japanese Yen', price: 196.15, bid: 196.12, ask: 196.18, change: 0.10, changePct: 0.10 },
    { symbol: 'BTC/USD', name: 'Bitcoin vs US Dollar', price: 45230.50, bid: 45225.00, ask: 45236.00, change: 2.15, changePct: 2.15 },
    { symbol: 'ETH/USD', name: 'Ethereum vs US Dollar', price: 2456.75, bid: 2454.50, ask: 2459.00, change: -1.25, changePct: -1.25 },
    { symbol: 'XAU/USD', name: 'Gold vs US Dollar', price: 2056.30, bid: 2055.80, ask: 2056.80, change: 0.75, changePct: 0.75 },
    { symbol: 'XAG/USD', name: 'Silver vs US Dollar', price: 23.45, bid: 23.42, ask: 23.48, change: -0.30, changePct: -0.30 },
    { symbol: 'USOIL', name: 'Crude Oil', price: 78.25, bid: 78.22, ask: 78.28, change: 1.85, changePct: 1.85 },
    { symbol: 'SPX500', name: 'S&P 500 Index', price: 4756.50, bid: 4755.00, ask: 4758.00, change: -0.45, changePct: -0.45 },
    { symbol: 'NDX100', name: 'Nasdaq 100', price: 16890.25, bid: 16885.00, ask: 16895.50, change: 0.95, changePct: 0.95 },
    { symbol: 'DAX30', name: 'DAX 30 Index', price: 17654.80, bid: 17650.00, ask: 17659.60, change: 0.65, changePct: 0.65 },
    { symbol: 'FTSE100', name: 'FTSE 100 Index', price: 8123.45, bid: 8120.00, ask: 8126.90, change: -0.25, changePct: -0.25 },
    { symbol: 'NIKKEI', name: 'Nikkei 225', price: 33245.60, bid: 33240.00, ask: 33251.20, change: 1.15, changePct: 1.15 }
  ]
};

// Toast Notification Component
const Toast = ({ message, type, onClose }: any) => (
  <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-out ${
    type === 'success' 
      ? 'bg-green-600 text-white border border-green-500' 
      : type === 'error'
      ? 'bg-red-600 text-white border border-red-500'
      : 'bg-blue-600 text-white border border-blue-500'
  } animate-slide-in-right`}>
    {type === 'success' && <CheckCircle className="w-5 h-5" />}
    {type === 'error' && <XCircle className="w-5 h-5" />}
    {type === 'info' && <AlertTriangle className="w-5 h-5" />}
    <span className="text-sm font-medium">{message}</span>
    <button 
      onClick={onClose}
      className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
    >
      <XCircle className="w-4 h-4" />
    </button>
  </div>
);

// MetaTrader-style components
const Toolbar = ({ symbol, timeframe, onTimeframeChange, onIndicatorAdd, onMarketWatchToggle, onChartToggle }: any) => (
  <div className="bg-theme-secondary border-b border-theme-primary px-3 py-2 flex items-center justify-between flex-wrap gap-2 mobile-toolbar-compact" data-tour="chart-toolbar">
    <div className="flex items-center gap-2 mobile-text-center">
      <span className="font-semibold text-theme-primary">{symbol}</span>
      <span className="text-sm text-theme-secondary hidden sm:inline">EURUSD</span>
    </div>

    <div className="flex items-center gap-0.5 flex-wrap order-3 sm:order-2 w-full sm:w-auto justify-center sm:justify-start mobile-gap-1">
      {['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1', 'MN'].map(tf => (
        <button
          key={tf}
          onClick={() => onTimeframeChange(tf)}
          className={`px-1.5 py-0.5 text-xs rounded transition-all duration-200 ${timeframe === tf ? 'bg-blue-600 text-white' : 'bg-theme-tertiary text-theme-secondary hover:bg-theme-primary'}`}
        >
          {tf}
        </button>
      ))}
    </div>

    <div className="flex items-center gap-1 order-2 sm:order-3 mobile-gap-2">
      <button onClick={onMarketWatchToggle} className="p-1 bg-theme-tertiary rounded hover:bg-theme-primary transition-all duration-200 transform hover:scale-110 hover-lift" title="Toggle Market Watch">
        <TrendingUp className="w-4 h-4" />
      </button>
      <button onClick={onChartToggle} className="p-1 bg-theme-tertiary rounded hover:bg-theme-primary transition-all duration-200 transform hover:scale-110 hover-lift md:hidden" title="Toggle Chart">
        <LineChart className="w-4 h-4" />
      </button>
      <button className="p-1 bg-theme-tertiary rounded hover:bg-theme-primary transition-all duration-200 transform hover:scale-110 hover-lift hidden sm:inline" title="Line Study">
        <LineChart className="w-4 h-4" />
      </button>
      <button onClick={onIndicatorAdd} className="p-1 bg-theme-tertiary rounded hover:bg-theme-primary transition-all duration-200 transform hover:scale-110 hover-lift hidden sm:inline" title="Add Indicator">
        <Activity className="w-4 h-4" />
      </button>
      <button className="p-1 bg-theme-tertiary rounded hover:bg-theme-primary transition-all duration-200 transform hover:scale-110 hover-lift hidden sm:inline" title="Objects">
        <Grid3X3 className="w-4 h-4" />
      </button>
      <button className="p-1 bg-theme-tertiary rounded hover:bg-theme-primary transition-all duration-200 transform hover:scale-110 hover-lift hidden sm:inline" title="Zoom In">
        <ZoomIn className="w-4 h-4" />
      </button>
      <button className="p-1 bg-theme-tertiary rounded hover:bg-theme-primary transition-all duration-200 transform hover:scale-110 hover-lift hidden sm:inline" title="Zoom Out">
        <ZoomOut className="w-4 h-4" />
      </button>
      <button className="p-1 bg-theme-tertiary rounded hover:bg-theme-primary transition-all duration-200 transform hover:scale-110 hover-lift hidden sm:inline" title="Auto Scroll">
        <Play className="w-4 h-4" />
      </button>
      <button className="p-1 bg-theme-tertiary rounded hover:bg-theme-primary transition-all duration-200 transform hover:scale-110 hover-lift hidden sm:inline" title="Reset">
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const MarketWatch = ({ instruments, selectedSymbol, onSymbolSelect, onOpenTradingPanel, onSetOrderSide }: any) => (
  <div className="bg-theme-secondary border-r border-theme-primary flex flex-col h-full" data-tour="market-watch">
    <div className="px-2 py-1 border-b border-theme-primary">
      <div className="text-xs font-semibold text-theme-primary">Market Watch</div>
    </div>
    <div className="flex-1 overflow-auto">
      <table className="w-full text-xs">
        <thead className="bg-theme-tertiary">
          <tr>
            <th className="text-left px-1 py-1 text-theme-secondary">Symbol</th>
            <th className="text-right px-1 py-1 text-theme-secondary">Bid</th>
            <th className="text-right px-1 py-1 text-theme-secondary">Ask</th>
            <th className="text-right px-1 py-1 text-theme-secondary">Change</th>
          </tr>
        </thead>
        <tbody>
          {instruments.slice(0, 12).map((inst: any) => (
            <tr 
              key={inst.symbol} 
              onClick={() => onSymbolSelect(inst.symbol)}
              className={`cursor-pointer hover:bg-theme-tertiary ${selectedSymbol === inst.symbol ? 'bg-theme-primary' : ''}`}
            >
              <td className="px-1 py-1 text-theme-primary text-xs">{inst.symbol}</td>
              <td className="px-1 py-1 text-right text-theme-secondary text-xs">
                <div className="flex items-center justify-end gap-2">
                  <span className="min-w-[50px] text-right">{inst.bid}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSymbolSelect(inst.symbol);
                      onSetOrderSide('sell');
                      onOpenTradingPanel();
                    }}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs rounded font-semibold transition-all duration-200 flex items-center gap-1 min-w-[60px] justify-center"
                    title={`Sell ${inst.symbol}`}
                  >
                    <TrendingDown className="w-3 h-3" />
                    SELL
                  </button>
                </div>
              </td>
              <td className="px-1 py-1 text-right text-theme-secondary text-xs">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSymbolSelect(inst.symbol);
                      onSetOrderSide('buy');
                      onOpenTradingPanel();
                    }}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs rounded font-semibold transition-all duration-200 flex items-center gap-1 min-w-[60px] justify-center"
                    title={`Buy ${inst.symbol}`}
                  >
                    <TrendingUp className="w-3 h-3" />
                    BUY
                  </button>
                  <span className="min-w-[50px] text-right">{inst.ask}</span>
                </div>
              </td>
              <td className={`px-1 py-1 text-right text-xs ${inst.changePct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {inst.changePct >= 0 ? '+' : ''}{inst.changePct}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Navigator = () => (
  <div className="bg-theme-secondary border-r border-theme-primary flex flex-col h-full" data-tour="navigator">
    <div className="p-2 border-b border-theme-primary">
      <div className="text-sm font-semibold text-theme-primary">Navigator</div>
    </div>
    <div className="flex-1 p-2 space-y-2">
      <div>
        <div className="text-xs text-theme-secondary mb-1">ACCOUNTS</div>
        <div className="text-sm text-theme-primary">Demo Account</div>
      </div>
      <div>
        <div className="text-xs text-theme-secondary mb-1">INDICATORS</div>
        <div className="space-y-1 text-sm text-theme-secondary">
          <div>Moving Average</div>
          <div>RSI</div>
          <div>MACD</div>
          <div>Bollinger Bands</div>
        </div>
      </div>
      <div>
        <div className="text-xs text-theme-secondary mb-1">EXPERT ADVISORS</div>
        <div className="text-sm text-theme-secondary">No EAs loaded</div>
      </div>
    </div>
  </div>
);

const MTChart = ({ symbol, timeframe }: any) => {
  const [candles, setCandles] = useState<any[]>([]);
  const [currentPrice, setCurrentPrice] = useState(1.0825);
  const [priceRange, setPriceRange] = useState({ min: 1.0750, max: 1.0900 });
  
  // Initialize candles
  useEffect(() => {
    const now = Date.now();
    const initialCandles = [];
    let price = currentPrice;
    
    for (let i = 59; i >= 0; i--) {
      const time = now - i * 60000; // 1 minute intervals
      const open = price;
      const change = (Math.random() - 0.5) * 0.002; // Small price movements
      price += change;
      const close = price;
      const high = Math.max(open, close) + Math.random() * 0.001;
      const low = Math.min(open, close) - Math.random() * 0.001;
      
      initialCandles.push({
        time,
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 1000) + 100
      });
    }
    
    setCandles(initialCandles);
    setCurrentPrice(price);
  }, [symbol]);
  
  // Update candles every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCandles(prevCandles => {
        const newCandles = [...prevCandles];
        const lastCandle = newCandles[newCandles.length - 1];
        
        if (lastCandle) {
          // Update last candle with new tick
          const now = Date.now();
          const timeDiff = now - lastCandle.time;
          
          if (timeDiff < 60000) { // Still in current minute
            const change = (Math.random() - 0.5) * 0.0005;
            const newPrice = Math.max(0.0001, lastCandle.close + change);
            
            lastCandle.close = newPrice;
            lastCandle.high = Math.max(lastCandle.high, newPrice);
            lastCandle.low = Math.min(lastCandle.low, newPrice);
            lastCandle.volume += Math.floor(Math.random() * 50) + 10;
            
            setCurrentPrice(newPrice);
          } else {
            // Create new candle
            const change = (Math.random() - 0.5) * 0.002;
            const newPrice = Math.max(0.0001, lastCandle.close + change);
            
            newCandles.push({
              time: now,
              open: lastCandle.close,
              high: Math.max(lastCandle.close, newPrice) + Math.random() * 0.0005,
              low: Math.min(lastCandle.close, newPrice) - Math.random() * 0.0005,
              close: newPrice,
              volume: Math.floor(Math.random() * 1000) + 100
            });
            
            // Keep only last 60 candles
            if (newCandles.length > 60) {
              newCandles.shift();
            }
            
            setCurrentPrice(newPrice);
          }
        }
        
        return newCandles;
      });
    }, 2000); // Update every 2 seconds for demo purposes (simulating 1-minute movements)
    
    return () => clearInterval(interval);
  }, []);
  
  // Calculate price range for scaling
  useEffect(() => {
    if (candles.length > 0) {
      const prices = candles.flatMap(c => [c.open, c.high, c.low, c.close]);
      const min = Math.min(...prices) * 0.9995;
      const max = Math.max(...prices) * 1.0005;
      setPriceRange({ min, max });
    }
  }, [candles]);
  
  const priceToY = (price: number) => {
    const chartHeight = 300; // Chart height in pixels
    return chartHeight - ((price - priceRange.min) / (priceRange.max - priceRange.min)) * chartHeight;
  };
  
  const timeToX = (index: number, total: number) => {
    const chartWidth = 600; // Chart width in pixels
    return (index / (total - 1)) * chartWidth;
  };
  
  return (
    <div className="bg-slate-900 flex-1 flex flex-col">
      {/* Price display */}
      <div className="flex justify-between items-center p-2 bg-slate-800 border-b border-slate-700">
        <div className="text-sm text-slate-300">
          <span className="font-semibold">{symbol}</span>
          <span className="ml-2 text-lg font-bold text-white">{currentPrice.toFixed(5)}</span>
        </div>
        <div className="text-xs text-slate-400">
          Spread: 0.2 pips | Volume: {candles[candles.length - 1]?.volume || 0}
        </div>
      </div>
      
      {/* Chart area */}
      <div className="flex-1 relative bg-gradient-to-b from-slate-800 to-slate-900 overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0">
          {Array.from({length: 5}).map((_, i) => (
            <div 
              key={i} 
              className="absolute w-full border-t border-slate-700 opacity-30"
              style={{ top: `${(i + 1) * 20}%` }}
            />
          ))}
        </div>
        
        {/* Price labels */}
        <div className="absolute right-2 top-2 text-xs text-slate-400 space-y-4">
          {Array.from({length: 6}).map((_, i) => {
            const price = priceRange.max - (i * (priceRange.max - priceRange.min) / 5);
            return (
              <div key={i} style={{ marginTop: i === 0 ? '0' : '-16px' }}>
                {price.toFixed(5)}
              </div>
            );
          })}
        </div>
        
        {/* Candles */}
        <svg className="absolute inset-0 w-full h-full" style={{ paddingRight: '60px', paddingTop: '10px', paddingBottom: '30px' }}>
          {candles.map((candle, index) => {
            const x = timeToX(index, candles.length);
            const openY = priceToY(candle.open);
            const closeY = priceToY(candle.close);
            const highY = priceToY(candle.high);
            const lowY = priceToY(candle.low);
            
            const isGreen = candle.close >= candle.open;
            const bodyHeight = Math.abs(closeY - openY);
            const bodyY = Math.min(openY, closeY);
            
            return (
              <g key={candle.time} className="animate-candle-appear" style={{animationDelay: `${index * 0.02}s`}}>
                {/* Wick */}
                <line 
                  x1={x + 2.5} 
                  y1={highY} 
                  x2={x + 2.5} 
                  y2={lowY} 
                  stroke={isGreen ? "#22c55e" : "#ef4444"} 
                  strokeWidth="1"
                  className="transition-all duration-300 opacity-70"
                />
                {/* Body */}
                <rect 
                  x={x} 
                  y={bodyY} 
                  width="5" 
                  height={Math.max(bodyHeight, 1)}
                  fill={isGreen ? "#22c55e" : "#ef4444"}
                  stroke={isGreen ? "#16a34a" : "#dc2626"}
                  strokeWidth="0.5"
                  className="transition-all duration-300 opacity-80"
                />
              </g>
            );
          })}
          
          {/* Current price line */}
          <line 
            x1="0" 
            y1={priceToY(currentPrice)} 
            x2="100%" 
            y2={priceToY(currentPrice)}
            stroke="#fbbf24" 
            strokeWidth="1" 
            strokeDasharray="5,5"
          />
        </svg>
        
        {/* Time labels */}
        <div className="absolute bottom-2 left-2 right-16 flex justify-between text-xs text-slate-500">
          {Array.from({length: 6}).map((_, i) => {
            const candleIndex = Math.floor((i / 5) * (candles.length - 1));
            const candle = candles[candleIndex];
            if (!candle) return null;
            
            const date = new Date(candle.time);
            return (
              <div key={i}>
                {date.getHours().toString().padStart(2, '0')}:{date.getMinutes().toString().padStart(2, '0')}
              </div>
            );
          })}
        </div>
        
        {/* Volume bars */}
        <div className="absolute bottom-8 left-2 right-16 h-16 border-t border-slate-700">
          <div className="flex items-end h-full gap-px">
            {candles.slice(-30).map((candle, index) => {
              const maxVolume = Math.max(...candles.map(c => c.volume));
              const height = (candle.volume / maxVolume) * 60;
              const isGreen = candle.close >= candle.open;
              
              return (
                <div 
                  key={candle.time}
                  className={`flex-1 ${isGreen ? 'bg-green-600' : 'bg-red-600'}`}
                  style={{ height: `${height}px`, minHeight: '2px' }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// Trading Panel Component
const TradingPanel = ({ symbol, currentPrice, onOrderPlaced, balance, onTogglePanel, orderSide }: any) => {
  const [orderType, setOrderType] = useState('market');
  const [side, setSide] = useState(orderSide || 'buy');
  const [volume, setVolume] = useState('0.01');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [toast, setToast] = useState<any>(null);
  const [priceAnimation, setPriceAnimation] = useState(false);

  // Update side when orderSide prop changes
  useEffect(() => {
    if (orderSide) {
      setSide(orderSide);
    }
  }, [orderSide]);

  // Animate price changes
  useEffect(() => {
    setPriceAnimation(true);
    const timer = setTimeout(() => setPriceAnimation(false), 1000);
    return () => clearTimeout(timer);
  }, [currentPrice]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOrderExecution = async () => {
    setIsExecuting(true);
    
    // Simulate order execution delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const order = {
      id: Date.now(),
      symbol,
      side,
      type: orderType,
      volume: parseFloat(volume),
      price: currentPrice,
      stopLoss: stopLoss ? parseFloat(stopLoss) : null,
      takeProfit: takeProfit ? parseFloat(takeProfit) : null,
      timestamp: new Date(),
      status: 'filled'
    };
    
    onOrderPlaced(order);
    setIsExecuting(false);
    
    // Show success toast
    showToast(`${side.toUpperCase()} ${volume} lots of ${symbol} executed at ${currentPrice}`, 'success');
    
    // Reset form with animation
    setTimeout(() => {
      setVolume('0.01');
      setStopLoss('');
      setTakeProfit('');
    }, 500);
  };

  const calculateSLTP = (action: 'sl' | 'tp', percentage: number) => {
    const price = parseFloat(currentPrice);
    if (side === 'buy') {
      if (action === 'sl') {
        setStopLoss((price * (1 - percentage / 100)).toFixed(5));
      } else {
        setTakeProfit((price * (1 + percentage / 100)).toFixed(5));
      }
    } else {
      if (action === 'sl') {
        setStopLoss((price * (1 + percentage / 100)).toFixed(5));
      } else {
        setTakeProfit((price * (1 - percentage / 100)).toFixed(5));
      }
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <div className="bg-theme-secondary border-l border-theme-primary flex flex-col animate-fade-in">
        {/* Symbol & Price Header */}
        <div className="px-3 py-2 border-b border-theme-primary flex items-center justify-between">
          <span className="font-semibold text-sm text-theme-primary">{symbol}</span>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className={`text-lg font-bold text-theme-primary transition-all duration-300 ${priceAnimation ? 'animate-price-update' : ''}`}>
                {currentPrice}
              </div>
              <div className="text-xs text-green-400">
                +0.15%
              </div>
            </div>
            <button
              onClick={onTogglePanel}
              className="p-1 hover:bg-theme-tertiary rounded transition-colors group"
              title="Hide Trading Panel"
            >
              <XCircle className="w-4 h-4 text-theme-secondary group-hover:text-theme-primary" />
            </button>
          </div>
        </div>

      {/* Order Type Selection */}
      <div className="px-3 py-2 border-b border-theme-primary">
        <div className="flex gap-1 mb-2">
          <button
            onClick={() => setOrderType('market')}
            className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-all duration-200 ${orderType === 'market' ? 'bg-blue-600 text-white' : 'bg-theme-tertiary text-theme-secondary hover:bg-theme-primary'}`}
          >
            Market
          </button>
          <button
            onClick={() => setOrderType('limit')}
            className={`flex-1 py-1.5 px-2 rounded text-xs font-medium transition-all duration-200 ${orderType === 'limit' ? 'bg-blue-600 text-white' : 'bg-theme-tertiary text-theme-secondary hover:bg-theme-primary'}`}
          >
            Limit
          </button>
        </div>
      </div>

      {/* Volume Input */}
      <div className="px-3 py-2 border-b border-theme-primary">
        <label className="block text-xs font-medium text-theme-secondary mb-1">Volume (Lots)</label>
        <div className="flex gap-1">
          {['0.01', '0.1', '1', '10'].map(size => (
            <button
              key={size}
              onClick={() => setVolume(size)}
              className={`flex-1 py-1.5 px-2 rounded text-xs transition-all duration-200 ${volume === size ? 'bg-blue-600 text-white' : 'bg-theme-tertiary text-theme-secondary hover:bg-theme-primary'}`}
            >
              {size}
            </button>
          ))}
        </div>
        <input
          type="number"
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
          className="w-full mt-1 px-2 py-1 bg-theme-tertiary border border-theme-primary rounded text-theme-primary text-xs"
          step="0.01"
          min="0.01"
        />
      </div>

      {/* Stop Loss & Take Profit */}
      <div className="px-3 py-2 border-b border-theme-primary">
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-theme-secondary mb-1">Stop Loss</label>
            <div className="flex gap-1">
              <input
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="Optional"
                className="flex-1 px-2 py-1 bg-theme-tertiary border border-theme-primary rounded text-theme-primary text-xs"
                step="0.00001"
              />
              <div className="flex gap-0.5">
                <button
                  onClick={() => calculateSLTP('sl', 1)}
                  className="px-1.5 py-1 bg-theme-tertiary hover:bg-theme-primary rounded text-xs text-theme-secondary"
                  title="1% Stop Loss"
                >
                  1%
                </button>
                <button
                  onClick={() => calculateSLTP('sl', 2)}
                  className="px-1.5 py-1 bg-theme-tertiary hover:bg-theme-primary rounded text-xs text-theme-secondary"
                  title="2% Stop Loss"
                >
                  2%
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-theme-secondary mb-1">Take Profit</label>
            <div className="flex gap-1">
              <input
                type="number"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                placeholder="Optional"
                className="flex-1 px-2 py-1 bg-theme-tertiary border border-theme-primary rounded text-theme-primary text-xs"
                step="0.00001"
              />
              <div className="flex gap-0.5">
                <button
                  onClick={() => calculateSLTP('tp', 1)}
                  className="px-1.5 py-1 bg-theme-tertiary hover:bg-theme-primary rounded text-xs text-theme-secondary"
                  title="1% Take Profit"
                >
                  1%
                </button>
                <button
                  onClick={() => calculateSLTP('tp', 2)}
                  className="px-1.5 py-1 bg-theme-tertiary hover:bg-theme-primary rounded text-xs text-theme-secondary"
                  title="2% Take Profit"
                >
                  2%
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buy/Sell Buttons */}
      <div className="px-3 py-3 space-y-2">
        <button
          onClick={() => {
            setSide('buy');
            handleOrderExecution();
          }}
          disabled={isExecuting}
          className={`w-full py-3 px-4 bg-green-600 hover:bg-green-500 disabled:bg-green-800 text-white font-bold rounded transition-all duration-300 disabled:transform-none disabled:opacity-50 ${isExecuting && side === 'buy' ? 'animate-pulse' : ''}`}
        >
          {isExecuting && side === 'buy' ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mx-auto"></div>
          ) : (
            `BUY ${symbol}`
          )}
        </button>
        
        <button
          onClick={() => {
            setSide('sell');
            handleOrderExecution();
          }}
          disabled={isExecuting}
          className={`w-full py-3 px-4 bg-red-600 hover:bg-red-500 disabled:bg-red-800 text-white font-bold rounded transition-all duration-300 disabled:transform-none disabled:opacity-50 ${isExecuting && side === 'sell' ? 'animate-pulse' : ''}`}
        >
          {isExecuting && side === 'sell' ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mx-auto"></div>
          ) : (
            `SELL ${symbol}`
          )}
        </button>
      </div>

      {/* Account Info */}
      <div className="px-3 py-2 border-t border-theme-primary mt-auto">
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-theme-secondary">Balance:</span>
            <span className="text-theme-primary font-medium">${balance.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-theme-secondary">Margin Used:</span>
            <span className="text-theme-secondary">$0.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-theme-secondary">Free Margin:</span>
            <span className="text-green-400">${balance.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

// Terminal Component for positions and orders
const Terminal = ({ positions, orders, history }: any) => (
  <div className="bg-theme-secondary border-t border-theme-primary h-48 flex animate-fade-in">
    {/* Positions Tab */}
    <div className="flex-1 border-r border-theme-primary">
      <div className="p-2 border-b border-theme-primary">
        <h3 className="text-sm font-medium text-theme-primary">Positions</h3>
      </div>
      <div className="overflow-auto h-full">
        {positions.length === 0 ? (
          <div className="p-4 text-center text-theme-secondary text-sm animate-fade-in">
            No open positions
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {positions.map((position: any, index: number) => (
              <div 
                key={position.id} 
                className="bg-theme-tertiary rounded p-2 text-xs animate-slide-in-up hover-lift transition-all duration-200"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-theme-primary">{position.symbol}</span>
                  <span className={`font-medium ${position.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                    {position.side.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-theme-secondary">
                  <span>{position.volume} lots</span>
                  <span>${position.price.toFixed(5)}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-theme-secondary">P&L:</span>
                  <span className={`font-medium transition-colors duration-300 ${position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${position.pnl.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* Orders Tab */}
    <div className="flex-1">
      <div className="p-2 border-b border-theme-primary">
        <h3 className="text-sm font-medium text-theme-primary">Orders</h3>
      </div>
      <div className="overflow-auto h-full">
        {orders.length === 0 ? (
          <div className="p-4 text-center text-theme-secondary text-sm">
            No pending orders
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-theme-tertiary rounded p-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-theme-primary">{order.symbol}</span>
                  <span className="text-blue-400">{order.type}</span>
                </div>
                <div className="text-theme-secondary mt-1">
                  {order.volume} lots @ ${order.price}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default function TradePage(){
  const { theme, toggleTheme } = useAppPreferences();
  const instruments = useMemo(() => mock.markets.slice(0, 20), []);
  const [symbol, setSymbol] = useState(instruments[0]?.symbol || 'EUR/USD');
  const [timeframe, setTimeframe] = useState('H1');
  const [showMarketWatch, setShowMarketWatch] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showTradingPanel, setShowTradingPanel] = useState(() => {
    // Load from localStorage, default to true
    const saved = localStorage.getItem('tradingPanelCollapsed');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [selectedOrderSide, setSelectedOrderSide] = useState<'buy' | 'sell'>('buy');
  const [showChartFullscreen, setShowChartFullscreen] = useState(false);
  
  // Trading state
  const [positions, setPositions] = useState<any[]>([]);
  const [balance, setBalance] = useState(10000);
  const [currentPrice, setCurrentPrice] = useState(1.0825);

  // Update current price from mock data
  useEffect(() => {
    const selectedInstrument = instruments.find(inst => inst.symbol === symbol);
    if (selectedInstrument) {
      setCurrentPrice(selectedInstrument.price);
    }
  }, [symbol, instruments]);

  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol);
    // Add a brief animation effect
    const chartElement = document.querySelector('.chart-container');
    if (chartElement) {
      chartElement.classList.add('animate-pulse');
      setTimeout(() => chartElement.classList.remove('animate-pulse'), 300);
    }
  };

  const toggleTradingPanel = () => {
    const newState = !showTradingPanel;
    setShowTradingPanel(newState);
    localStorage.setItem('tradingPanelCollapsed', JSON.stringify(newState));
  };

  const openTradingPanel = () => {
    setShowTradingPanel(true);
    localStorage.setItem('tradingPanelCollapsed', JSON.stringify(true));
  };

  const setOrderSide = (side: 'buy' | 'sell') => {
    setSelectedOrderSide(side);
  };

  const handleOrderPlaced = (order: any) => {
    // Add position to portfolio
    const newPosition = {
      ...order,
      pnl: 0,
      pnlPercent: 0
    };
    
    setPositions(prev => [...prev, newPosition]);
    
    // Simulate balance update (simplified)
    const orderValue = order.volume * order.price * 100000; // Standard lot size
    setBalance(prev => prev - (orderValue * 0.01)); // 1% margin requirement
  };


  // Update P&L in real-time
  useEffect(() => {
    setPositions(prevPositions => 
      prevPositions.map(position => {
        const priceDiff = currentPrice - position.price;
        const pipValue = position.volume * 10; // Simplified pip value
        const pnl = position.side === 'buy' ? priceDiff * pipValue : -priceDiff * pipValue;
        const pnlPercent = (pnl / (position.volume * position.price * 100000)) * 100;
        
        return {
          ...position,
          pnl,
          pnlPercent
        };
      })
    );
  }, [currentPrice]);

  return (
    <div className="h-full bg-theme-background text-theme-primary flex flex-col">
      {/* MetaTrader-style toolbar */}
      <Toolbar
        symbol={symbol}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        onIndicatorAdd={() => setShowNavigator(!showNavigator)}
        onMarketWatchToggle={() => setShowMarketWatch(!showMarketWatch)}
        onChartToggle={() => setShowChartFullscreen(!showChartFullscreen)}
      />
      
      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panels - hidden on mobile by default */}
        <div className="flex">
          {showMarketWatch && (
            <div style={{width: '450px'}} className="animate-section-in">
              <MarketWatch 
                instruments={instruments} 
                selectedSymbol={symbol} 
                onSymbolSelect={handleSymbolChange}
                onOpenTradingPanel={openTradingPanel}
                onSetOrderSide={setOrderSide}
              />
            </div>
          )}
          {showNavigator && (
            <div style={{width: '180px'}} className="animate-section-in">
              <Navigator />
            </div>
          )}
        </div>
        
        {/* Main chart area */}
        <div className="flex-1 flex mobile-flex-col">
          {/* Chart */}
          <div className="flex-1 md:flex flex-col chart-container mobile-chart-responsive hidden">
            <MTChart symbol={symbol} timeframe={timeframe} />
            
            {/* Terminal at bottom - compact on mobile */}
            {showTerminal && <Terminal positions={positions} orders={[]} history={[]} />}
          </div>
          
          {/* Trading Panel - collapsible */}
          {showTradingPanel && (
            <div style={{width: '300px'}} className="mobile-full-width transition-all duration-300 animate-slide-in-right" data-tour="trading-panel">
              <TradingPanel 
                symbol={symbol} 
                currentPrice={currentPrice} 
                onOrderPlaced={handleOrderPlaced}
                balance={balance}
                onTogglePanel={toggleTradingPanel}
                orderSide={selectedOrderSide}
              />
            </div>
          )}
          
          {/* Toggle button when panel is collapsed */}
          {!showTradingPanel && (
            <div className="flex items-center">
              <button
                onClick={toggleTradingPanel}
                className="bg-theme-secondary border-l border-theme-primary px-2 py-4 hover:bg-theme-tertiary transition-all duration-200 group"
                title="Show Trading Panel"
              >
                <TrendingUp className="w-4 h-4 text-theme-secondary group-hover:text-theme-primary transition-colors" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Chart Overlay - Mobile */}
      {showChartFullscreen && (
        <div className="fixed inset-0 z-50 bg-theme-background md:hidden">
          <div className="h-full flex flex-col">
            {/* Close button */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setShowChartFullscreen(false)}
                className="p-2 bg-theme-secondary rounded hover:bg-theme-tertiary transition-colors"
                title="Close Chart"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            {/* Fullscreen Chart */}
            <div className="flex-1">
              <MTChart symbol={symbol} timeframe={timeframe} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
