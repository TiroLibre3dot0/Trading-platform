import React, { useMemo, useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { LineChart, Activity, Grid3X3, ZoomIn, ZoomOut, Play, RotateCcw, TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, CheckCircle, XCircle, HelpCircle, ExternalLink, ArrowLeft } from 'lucide-react';
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
const Toast = ({ message, type, onClose }: any) => {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className={`fixed top-[calc(116px+1rem)] md:top-4 right-4 z-[70] flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-out ${
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
    </div>,
    document.body
  );
};

// MetaTrader-style components
const Toolbar = ({ symbol, timeframe, onTimeframeChange, onIndicatorAdd, onMarketWatchToggle, onChartToggle, mtWebTraderUrl, onOpenMtWebTrader }: any) => (
  <div className="bg-theme-secondary border-b border-theme-primary px-2 py-1.5 lg:px-3 lg:py-2 flex items-center justify-between flex-wrap gap-2 mobile-toolbar-compact" data-tour="chart-toolbar">
    <div className="flex items-center gap-2 mobile-text-center">
      <span className="font-semibold text-theme-primary">{symbol}</span>
      <span className="text-sm text-theme-secondary hidden sm:inline">EURUSD</span>
    </div>

    <div className="flex items-center gap-0.5 flex-wrap order-3 sm:order-2 w-full sm:w-auto justify-center sm:justify-start mobile-gap-1 hidden md:flex">
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

      {mtWebTraderUrl && (
        <button
          onClick={onOpenMtWebTrader}
          className="ml-1 px-2 py-1 bg-theme-tertiary rounded hover:bg-theme-primary transition-all duration-200 flex items-center gap-1"
          title="MetaTrader WebTrader"
        >
          <ExternalLink className="w-4 h-4" />
          <span className="text-xs font-semibold">MT</span>
        </button>
      )}
    </div>
  </div>
);

const MarketWatch = ({ instruments, selectedSymbol, onSymbolSelect, onOpenTradingPanel, onSetOrderSide, onQuickTrade, isMobile, dock = 'left' }: any) => (
  <div
    className={`bg-theme-secondary ${dock === 'right' ? 'border-l' : 'border-r'} border-theme-primary flex flex-col h-full`}
    data-tour="market-watch"
  >
    <div className="px-2 py-1 border-b border-theme-primary flex items-center justify-between">
      <div className="text-xs font-semibold text-theme-primary">Market Watch</div>
      {isMobile && (
        <button
          onClick={onOpenTradingPanel}
          className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded font-semibold transition-all duration-200"
        >
          Trading Panel
        </button>
      )}
    </div>
    <div className={isMobile ? 'flex-1 overflow-auto scrollbar-invisible' : 'flex-1'}>
      <table className="w-full text-xs leading-tight">
        <thead className="bg-theme-tertiary">
          <tr>
            <th className="text-left px-1 py-1 text-theme-secondary">Symbol</th>
            <th className="text-right px-1 py-1 text-theme-secondary">Bid</th>
            <th className="text-right px-1 py-1 text-theme-secondary">Ask</th>
            <th className="text-right px-1 py-1 text-theme-secondary">Change</th>
          </tr>
        </thead>
        <tbody>
          {instruments.map((inst: any) => (
            <tr 
              key={inst.symbol} 
              onClick={() => onSymbolSelect(inst.symbol)}
              className={`cursor-pointer hover:bg-theme-tertiary ${selectedSymbol === inst.symbol ? 'bg-theme-primary' : ''}`}
            >
              <td className="px-1 py-1 text-theme-primary text-xs">{inst.symbol}</td>
              <td className="px-1 py-1 text-right text-theme-secondary text-xs">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="min-w-[50px] text-right">{inst.bid}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSymbolSelect(inst.symbol);
                      // Always open the trade-entry area
                      try {
                        onSetOrderSide?.('sell');
                      } catch (_err) {
                        // ignore
                      }
                      if (typeof onQuickTrade === 'function') {
                        onQuickTrade(inst.symbol, 'sell');
                      } else {
                        onOpenTradingPanel?.();
                      }
                    }}
                    className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded font-semibold transition-all duration-200 flex items-center gap-1 min-w-[52px] justify-center"
                    title={`Sell ${inst.symbol}`}
                  >
                    <TrendingDown className="w-3 h-3" />
                    SELL
                  </button>
                </div>
              </td>
              <td className="px-1 py-1 text-right text-theme-secondary text-xs">
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSymbolSelect(inst.symbol);
                      // Always open the trade-entry area
                      try {
                        onSetOrderSide?.('buy');
                      } catch (_err) {
                        // ignore
                      }
                      if (typeof onQuickTrade === 'function') {
                        onQuickTrade(inst.symbol, 'buy');
                      } else {
                        onOpenTradingPanel?.();
                      }
                    }}
                    className="px-2 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded font-semibold transition-all duration-200 flex items-center gap-1 min-w-[52px] justify-center"
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
  const chartWrapRef = useRef<HTMLDivElement | null>(null);
  const [chartSize, setChartSize] = useState({ width: 900, height: 360 });
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  const PAD = { top: 12, right: 72, bottom: 24, left: 10 };

  useLayoutEffect(() => {
    if (!chartWrapRef.current) return;

    const el = chartWrapRef.current;
    const update = (rect: DOMRectReadOnly | DOMRect) => {
      const width = Math.max(520, Math.floor(rect.width));
      const height = Math.max(260, Math.floor(rect.height));
      setChartSize({ width, height });
    };

    try {
      const ro = new ResizeObserver(entries => {
        if (!entries?.[0]) return;
        update(entries[0].contentRect);
      });
      ro.observe(el);
      update(el.getBoundingClientRect());
      return () => ro.disconnect();
    } catch (_err) {
      // Fallback for environments without ResizeObserver
      update(el.getBoundingClientRect());
      return;
    }
  }, []);
  
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
  
  const innerWidth = Math.max(1, chartSize.width - PAD.left - PAD.right);
  const innerHeight = Math.max(1, chartSize.height - PAD.top - PAD.bottom);
  const candleWidth = Math.max(3, Math.min(10, Math.floor(innerWidth / Math.max(30, candles.length * 1.6))));
  const candleHalf = candleWidth / 2;

  const priceToY = (price: number) => {
    const denom = (priceRange.max - priceRange.min) || 1;
    const t = (price - priceRange.min) / denom;
    return PAD.top + (1 - t) * innerHeight;
  };
  
  const timeToX = (index: number, total: number) => {
    if (total <= 1) return PAD.left;
    return PAD.left + (index / (total - 1)) * innerWidth;
  };

  const yToPrice = (y: number) => {
    const denom = innerHeight || 1;
    const t = 1 - (y - PAD.top) / denom;
    return priceRange.min + t * (priceRange.max - priceRange.min);
  };

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!chartWrapRef.current) return;
    if (candles.length < 2) return;

    const rect = chartWrapRef.current.getBoundingClientRect();
    const x = clamp(clientX - rect.left, PAD.left, chartSize.width - PAD.right);
    const y = clamp(clientY - rect.top, PAD.top, chartSize.height - PAD.bottom);
    const t = (x - PAD.left) / innerWidth;
    const idx = Math.round(t * (candles.length - 1));
    const safeIdx = clamp(idx, 0, candles.length - 1);

    setHoverIndex(safeIdx);
    setHoverPos({ x, y });
  };

  const clearHover = () => {
    setHoverIndex(null);
    setHoverPos(null);
  };

  const hoveredCandle = hoverIndex !== null ? candles[hoverIndex] : null;
  const hoveredX = hoverIndex !== null ? timeToX(hoverIndex, candles.length) : null;
  const hoveredY = hoverPos?.y ?? null;

  const formatTime = (ts: number) => {
    try {
      const d = new Date(ts);
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      return `${hh}:${mm}`;
    } catch (_err) {
      return '';
    }
  };
  
  const maxVolume = useMemo(() => {
    if (!candles.length) return 1;
    return Math.max(1, ...candles.map(c => c.volume || 0));
  }, [candles]);

  return (
    <div className="bg-theme-secondary flex-1 flex flex-col border-b border-theme-primary">
      {/* Price display */}
      <div className="flex justify-between items-center px-3 py-2.5 bg-theme-primary/15 border-b border-theme-primary">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold text-theme-secondary">{symbol}</span>
          <span className="text-lg font-bold text-theme-primary tabular-nums">{currentPrice.toFixed(5)}</span>
        </div>
        <div className="text-[11px] text-theme-secondary tabular-nums">
          Spread: 0.2 pips | Volume: {candles[candles.length - 1]?.volume || 0}
        </div>
      </div>
      
      {/* Chart area */}
      <div className="flex-1 min-h-0 flex flex-col bg-theme-secondary overflow-hidden">
        <div ref={chartWrapRef} className="flex-1 min-h-0 relative">
        {/* Grid lines */}
        <div className="absolute inset-0">
          {Array.from({length: 5}).map((_, i) => (
            <div 
              key={i} 
              className="absolute w-full border-t border-theme-primary/20"
              style={{ top: `${(i + 1) * 20}%` }}
            />
          ))}
        </div>
        
        {/* Price labels */}
        <div className="absolute top-2 bottom-8 right-2 w-[64px] flex flex-col justify-between text-[11px] text-theme-secondary pointer-events-none">
          {Array.from({length: 6}).map((_, i) => {
            const price = priceRange.max - (i * (priceRange.max - priceRange.min) / 5);
            return (
              <div key={i} className="text-right tabular-nums">
                {price.toFixed(5)}
              </div>
            );
          })}
        </div>
        
        {/* Candles */}
        <svg
          className="absolute inset-0 w-full h-full"
          width={chartSize.width}
          height={chartSize.height}
          viewBox={`0 0 ${chartSize.width} ${chartSize.height}`}
          preserveAspectRatio="xMidYMid meet"
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onMouseLeave={clearHover}
          onTouchMove={(e) => {
            const t = e.touches?.[0];
            if (!t) return;
            handlePointerMove(t.clientX, t.clientY);
          }}
          onTouchEnd={clearHover}
        >
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
                  x1={x} 
                  y1={highY} 
                  x2={x} 
                  y2={lowY} 
                  stroke={isGreen ? "#22c55e" : "#ef4444"} 
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                  className="transition-all duration-300 opacity-70"
                />
                {/* Body */}
                <rect 
                  x={x - candleHalf} 
                  y={bodyY} 
                  width={candleWidth} 
                  height={Math.max(bodyHeight, 1)}
                  fill={isGreen ? "#22c55e" : "#ef4444"}
                  stroke={isGreen ? "#16a34a" : "#dc2626"}
                  strokeWidth="0.5"
                  vectorEffect="non-scaling-stroke"
                  className="transition-all duration-300 opacity-80"
                />
              </g>
            );
          })}

          {/* Hover crosshair */}
          {hoveredX !== null && hoveredY !== null && (
            <g>
              <line
                x1={hoveredX}
                y1={PAD.top}
                x2={hoveredX}
                y2={chartSize.height - PAD.bottom}
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4,4"
                vectorEffect="non-scaling-stroke"
                className="text-theme-primary/30"
              />
              <line
                x1={PAD.left}
                y1={hoveredY}
                x2={chartSize.width - PAD.right}
                y2={hoveredY}
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4,4"
                vectorEffect="non-scaling-stroke"
                className="text-theme-primary/20"
              />
            </g>
          )}
          
          {/* Current price line */}
          <line 
            x1={PAD.left} 
            y1={priceToY(currentPrice)} 
            x2={chartSize.width - PAD.right} 
            y2={priceToY(currentPrice)}
            stroke="#fbbf24" 
            strokeWidth="1" 
            strokeDasharray="5,5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Hover tooltip */}
        {hoveredCandle && hoverPos && (
          <div
            className="absolute z-10 pointer-events-none"
            style={{ left: 12, top: 10 }}
          >
            <div className="bg-theme-primary/90 backdrop-blur-sm border border-theme-secondary/20 rounded-lg px-3 py-2 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="text-xs font-semibold text-theme-primary">{symbol}</div>
                <div className="text-[11px] text-theme-secondary tabular-nums">
                  {formatTime(hoveredCandle.time)}
                </div>
              </div>
              <div className="mt-1 text-[11px] text-theme-secondary tabular-nums grid grid-cols-2 gap-x-3 gap-y-1">
                <div>O: <span className="text-theme-primary">{hoveredCandle.open.toFixed(5)}</span></div>
                <div>H: <span className="text-theme-primary">{hoveredCandle.high.toFixed(5)}</span></div>
                <div>L: <span className="text-theme-primary">{hoveredCandle.low.toFixed(5)}</span></div>
                <div>C: <span className="text-theme-primary">{hoveredCandle.close.toFixed(5)}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Hover price bubble on right axis */}
        {hoverPos && (
          <div
            className="absolute right-2 z-10 pointer-events-none"
            style={{ top: clamp(hoverPos.y - 12, 8, chartSize.height - PAD.bottom - 24) }}
          >
            <div className="bg-theme-primary/80 border border-theme-secondary/20 rounded px-2 py-1 text-[11px] text-theme-primary tabular-nums">
              {yToPrice(hoverPos.y).toFixed(5)}
            </div>
          </div>
        )}
        
        </div>

        {/* Time + Volume area (separate, so it doesn't overlap candles) */}
        <div className="h-[88px] border-t border-theme-primary/20 relative">
          <div className="absolute top-2 left-2 right-2 flex justify-between text-[11px] text-theme-secondary pointer-events-none">
            {Array.from({length: 6}).map((_, i) => {
              const candleIndex = Math.floor((i / 5) * (candles.length - 1));
              const candle = candles[candleIndex];
              if (!candle) return null;
              const date = new Date(candle.time);
              return (
                <div key={i} className="tabular-nums">
                  {date.getHours().toString().padStart(2, '0')}:{date.getMinutes().toString().padStart(2, '0')}
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-2 left-2 right-2 h-14">
            <div className="flex items-end h-full gap-px">
              {candles.slice(-30).map((candle) => {
                const height = ((candle.volume || 0) / maxVolume) * 56;
                const isGreen = candle.close >= candle.open;
                return (
                  <div
                    key={candle.time}
                    className={`flex-1 ${isGreen ? 'bg-green-600/80' : 'bg-red-600/80'}`}
                    style={{ height: `${Math.max(2, height)}px` }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Trading Panel Component
const TradingPanel = ({ symbol, currentPrice, onOrderPlaced, balance, onTogglePanel, orderSide, isMobile, scrollMode = 'auto' }: any) => {
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

      <div
        className={`bg-theme-secondary border-l border-theme-primary flex flex-col overflow-hidden ${
          scrollMode === 'auto' ? 'h-full min-h-0' : ''
        }`}
      >
        {/* Symbol & Price Header */}
        <div className="px-2 py-1.5 lg:px-3 lg:py-2 border-b border-theme-primary flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isMobile && (
              <button
                onClick={onTogglePanel}
                className="px-2 py-1 bg-theme-tertiary hover:bg-theme-primary text-theme-secondary text-xs rounded transition-all duration-200"
              >
                ← Market Watch
              </button>
            )}
            <span className="font-semibold text-xs lg:text-sm text-theme-primary">{symbol}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className={`text-base lg:text-lg font-bold text-theme-primary transition-all duration-300 ${priceAnimation ? 'animate-price-update' : ''}`}>
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

        {/* Side (BUY/SELL) selector */}
        <div className="px-2 py-1.5 lg:px-3 lg:py-2 border-b border-theme-primary">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setSide('buy')}
              className={`py-1.5 px-2 rounded text-xs font-semibold transition-all duration-200 ${
                side === 'buy'
                  ? 'bg-green-600 text-white'
                  : 'bg-theme-tertiary text-theme-secondary hover:bg-theme-primary'
              }`}
            >
              BUY
            </button>
            <button
              type="button"
              onClick={() => setSide('sell')}
              className={`py-1.5 px-2 rounded text-xs font-semibold transition-all duration-200 ${
                side === 'sell'
                  ? 'bg-red-600 text-white'
                  : 'bg-theme-tertiary text-theme-secondary hover:bg-theme-primary'
              }`}
            >
              SELL
            </button>
          </div>
        </div>

        {/* Main content */}
        <div
          className={
            scrollMode === 'auto'
              ? 'flex-1 min-h-0 overflow-y-auto scrollbar-invisible'
              : 'shrink-0'
          }
        >
          {/* Order Type Selection */}
          <div className="px-2 py-1.5 lg:px-3 lg:py-2 border-b border-theme-primary">
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
          <div className="px-2 py-1.5 lg:px-3 lg:py-2 border-b border-theme-primary">
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
          <div className="px-2 py-1.5 lg:px-3 lg:py-2 border-b border-theme-primary">
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
        </div>

        {/* Bottom actions (always visible) */}
        <div className="shrink-0 border-t border-theme-primary">
          {/* Single CTA based on selected side */}
          <div className="px-3 py-3">
            <button
              onClick={handleOrderExecution}
              disabled={isExecuting}
              className={`w-full py-3 px-4 text-white font-bold rounded transition-all duration-300 disabled:transform-none disabled:opacity-50 ${
                side === 'buy'
                  ? 'bg-green-600 hover:bg-green-500 disabled:bg-green-800'
                  : 'bg-red-600 hover:bg-red-500 disabled:bg-red-800'
              } ${isExecuting ? 'animate-pulse' : ''}`}
            >
              {isExecuting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mx-auto"></div>
              ) : (
                `${side.toUpperCase()} ${symbol}`
              )}
            </button>
          </div>

          {/* Account Info */}
          <div className="px-3 py-2">
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
    </div>
  </>
  );
};

// Quick Trade Panel - Simplified trading interface for mobile
const QuickTradePanel = ({ symbol, currentPrice, onOrderPlaced, balance, onClose, side }: any) => {
  const [orderType, setOrderType] = useState('market');
  const [volume, setVolume] = useState('0.01');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [toast, setToast] = useState<any>(null);

  const handleOrderSubmit = async () => {
    setIsExecuting(true);
    
    // Simulate order execution
    setTimeout(() => {
      const order = {
        id: Date.now(),
        symbol,
        side,
        type: orderType,
        volume: parseFloat(volume),
        price: currentPrice,
        stopLoss: stopLoss ? parseFloat(stopLoss) : null,
        takeProfit: takeProfit ? parseFloat(takeProfit) : null,
        timestamp: new Date()
      };
      
      onOrderPlaced(order);
      setIsExecuting(false);
      setToast({ message: `${side.toUpperCase()} order placed for ${symbol}`, type: 'success' });
      
      // Close after successful order
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 1000);
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

      <div className="bg-theme-secondary border-l border-theme-primary flex flex-col animate-fade-in h-full">
        {/* Header */}
        <div className="px-3 py-2 border-b border-theme-primary flex items-center justify-between">
          <span className="font-semibold text-sm text-theme-primary">{side.toUpperCase()} {symbol}</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-theme-tertiary rounded transition-colors group"
            title="Close"
          >
            <XCircle className="w-4 h-4 text-theme-secondary group-hover:text-theme-primary" />
          </button>
        </div>

        {/* Current Price */}
        <div className="px-3 py-2 border-b border-theme-primary text-center">
          <div className="text-lg font-bold text-theme-primary">{currentPrice}</div>
          <div className="text-xs text-green-400">+0.15%</div>
        </div>

        {/* Order Type */}
        <div className="px-3 py-2 border-b border-theme-primary">
          <div className="flex gap-1">
            <button
              onClick={() => setOrderType('market')}
              className={`flex-1 py-2 px-2 rounded text-sm font-medium transition-all duration-200 ${orderType === 'market' ? 'bg-blue-600 text-white' : 'bg-theme-tertiary text-theme-secondary hover:bg-theme-primary'}`}
            >
              Market
            </button>
            <button
              onClick={() => setOrderType('limit')}
              className={`flex-1 py-2 px-2 rounded text-sm font-medium transition-all duration-200 ${orderType === 'limit' ? 'bg-blue-600 text-white' : 'bg-theme-tertiary text-theme-secondary hover:bg-theme-primary'}`}
            >
              Limit
            </button>
          </div>
        </div>

        {/* Volume */}
        <div className="px-3 py-2 border-b border-theme-primary">
          <label className="block text-sm font-medium text-theme-secondary mb-2">Volume (Lots)</label>
          <div className="grid grid-cols-4 gap-1 mb-2">
            {['0.01', '0.1', '1', '10'].map(size => (
              <button
                key={size}
                onClick={() => setVolume(size)}
                className={`py-2 px-1 rounded text-xs transition-all duration-200 ${volume === size ? 'bg-blue-600 text-white' : 'bg-theme-tertiary text-theme-secondary hover:bg-theme-primary'}`}
              >
                {size}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            className="w-full px-2 py-2 bg-theme-tertiary border border-theme-primary rounded text-theme-primary text-sm"
            step="0.01"
            min="0.01"
          />
        </div>

        {/* Stop Loss & Take Profit */}
        <div className="px-3 py-2 border-b border-theme-primary">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-theme-secondary mb-1">Stop Loss</label>
              <input
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="Optional"
                className="w-full px-2 py-2 bg-theme-tertiary border border-theme-primary rounded text-theme-primary text-sm"
                step="0.00001"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-theme-secondary mb-1">Take Profit</label>
              <input
                type="number"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                placeholder="Optional"
                className="w-full px-2 py-2 bg-theme-tertiary border border-theme-primary rounded text-theme-primary text-sm"
                step="0.00001"
              />
            </div>
          </div>
        </div>

        {/* Execute Button */}
        <div className="px-3 py-4">
          <button
            onClick={handleOrderSubmit}
            disabled={isExecuting}
            className={`w-full py-3 rounded font-semibold text-sm transition-all duration-200 ${
              side === 'buy' 
                ? 'bg-green-600 hover:bg-green-500 text-white' 
                : 'bg-red-600 hover:bg-red-500 text-white'
            } ${isExecuting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isExecuting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Executing...
              </div>
            ) : (
              `${side.toUpperCase()} ${symbol}`
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default function TradePage(){
  const { theme, toggleTheme } = useAppPreferences();
  const mtWebTraderUrl = (import.meta as any).env?.VITE_MT_WEBTRADER_URL as string | undefined;
  const [showMtWebTrader, setShowMtWebTrader] = useState(false);
  const [mtIframeLoaded, setMtIframeLoaded] = useState(false);
  const [mtIframeShowHelp, setMtIframeShowHelp] = useState(false);

  const getHost = (url: string | undefined) => {
    if (!url) return null;
    try {
      return new URL(url).host.toLowerCase();
    } catch (_err) {
      return null;
    }
  };

  const mtHost = getHost(mtWebTraderUrl);
  const mtKnownNoEmbedHosts = new Set([
    'trade.mql5.com',
    'metatraderweb.app',
    'webtrader.metaquotes.net'
  ]);
  const mtMayEmbed = mtHost ? !mtKnownNoEmbedHosts.has(mtHost) : true;
  const mtEmbedMode: 'iframe' | 'newtab-only' = mtWebTraderUrl ? (mtMayEmbed ? 'iframe' : 'newtab-only') : 'newtab-only';

  useEffect(() => {
    if (!showMtWebTrader) return;
    setMtIframeLoaded(false);
    setMtIframeShowHelp(false);

    // If an iframe can't load (due to X-Frame-Options/CSP), we won't reliably know.
    // Provide a gentle help CTA after a short delay.
    const t = window.setTimeout(() => setMtIframeShowHelp(true), 2500);
    return () => window.clearTimeout(t);
  }, [showMtWebTrader]);
  const isMobileScreen = () => {
    try {
      return typeof window !== 'undefined' && window.innerWidth <= 768;
    } catch (_err) {
      return false;
    }
  };

  const safeStorageGet = (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (_err) {
      return null;
    }
  };

  const safeStorageSet = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (_err) {
      // ignore (private mode / storage disabled)
    }
  };

  const instruments = useMemo(() => mock.markets.slice(0, 20), []);
  const [symbol, setSymbol] = useState(instruments[0]?.symbol || 'EUR/USD');
  const [timeframe, setTimeframe] = useState('H1');
  const [isMobile, setIsMobile] = useState(isMobileScreen);
  const [showMarketWatch, setShowMarketWatch] = useState(() => {
    // Show market watch by default on both mobile and desktop
    return true;
  });
  const [showNavigator, setShowNavigator] = useState(false);
  
  const [showTradingPanel, setShowTradingPanel] = useState(() => {
    // Load from localStorage, default to false (closed)
    const saved = safeStorageGet('tradingPanelCollapsed');
    if (saved === null) return false;
    try {
      return JSON.parse(saved);
    } catch (_err) {
      return false;
    }
  });
  const [selectedOrderSide, setSelectedOrderSide] = useState<'buy' | 'sell'>('buy');
  const [showChartFullscreen, setShowChartFullscreen] = useState(false);
  const [mobileView, setMobileView] = useState<'marketWatch' | 'trading' | 'quickTrade'>(() => {
    // Default to market watch on mobile, trading on desktop
    return isMobileScreen() ? 'marketWatch' : 'trading';
  });
  const [quickTradeSymbol, setQuickTradeSymbol] = useState('');
  const [quickTradeSide, setQuickTradeSide] = useState<'buy' | 'sell'>('buy');
  
  // Trading state
  const [positions, setPositions] = useState<any[]>([]);
  const [balance, setBalance] = useState(10000);
  const [currentPrice, setCurrentPrice] = useState(1.0825);

  // When user clicks BUY/SELL in Market Watch, prioritize panel space (Market Watch shrinks)
  const [panelOpener, setPanelOpener] = useState<'default' | 'intent'>('default');

  const tradingPanelFocusRef = useRef<HTMLDivElement | null>(null);

  // Keep keyboard focus on the trading panel when it opens (avoids a “janky” feel)
  useEffect(() => {
    if (isMobile) return;
    if (!showTradingPanel) return;
    try {
      const id = window.requestAnimationFrame(() => tradingPanelFocusRef.current?.focus());
      return () => window.cancelAnimationFrame(id);
    } catch (_err) {
      tradingPanelFocusRef.current?.focus();
      return;
    }
  }, [isMobile, showTradingPanel]);

  // Update current price from mock data
  useEffect(() => {
    const selectedInstrument = instruments.find(inst => inst.symbol === symbol);
    if (selectedInstrument) {
      setCurrentPrice(selectedInstrument.price);
    }
  }, [symbol, instruments]);

  // Track viewport changes (orientation/resize) without reading window in render.
  useEffect(() => {
    const onResize = () => setIsMobile(isMobileScreen());
    onResize();

    try {
      window.addEventListener('resize', onResize);
      window.addEventListener('orientationchange', onResize);
      return () => {
        window.removeEventListener('resize', onResize);
        window.removeEventListener('orientationchange', onResize);
      };
    } catch (_err) {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    safeStorageSet('tradingPanelCollapsed', JSON.stringify(newState));
    if (!newState) setPanelOpener('default');
  };

  const openTradingPanel = () => {
    setShowTradingPanel(true);
    safeStorageSet('tradingPanelCollapsed', JSON.stringify(true));
  };

  const openQuickTrade = (symbol: string, side: 'buy' | 'sell') => {
    setQuickTradeSymbol(symbol);
    setQuickTradeSide(side);
    setMobileView('quickTrade');
  };

  const setOrderSide = (side: 'buy' | 'sell') => {
    setSelectedOrderSide(side);
    if (!isMobile) setPanelOpener('intent');
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

  if (showMtWebTrader && mtWebTraderUrl) {
    return (
      <div className="h-full bg-theme-background text-theme-primary flex flex-col">
        <div className="h-[56px] shrink-0 flex items-center justify-between px-3 border-b border-theme-primary bg-theme-secondary">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMtWebTrader(false)}
              className="p-2 rounded bg-theme-tertiary hover:bg-theme-primary transition-colors"
              aria-label="Back to Trading Platform"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="text-sm font-semibold text-theme-primary">MetaTrader 5 Web</div>
            <div className="hidden sm:block text-xs text-theme-secondary">
              {mtEmbedMode === 'newtab-only'
                ? 'This provider does not allow embedding. Use new tab.'
                : 'If the iframe is blank, your provider may block embedding.'}
            </div>
          </div>
          <a
            href={mtWebTraderUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-theme-secondary hover:text-theme-primary transition-colors flex items-center gap-1"
          >
            <ExternalLink className="w-4 h-4" />
            Open in new tab
          </a>
        </div>
        <div className="flex-1 min-h-0">
          {mtEmbedMode === 'newtab-only' ? (
            <div className="h-full w-full flex items-center justify-center p-6">
              <div className="max-w-md w-full bg-theme-secondary/20 border border-theme-secondary/20 rounded-lg p-4">
                <div className="text-sm font-semibold text-theme-primary">Embedding blocked</div>
                <div className="text-xs text-theme-secondary mt-1">
                  This MT5 WebTrader host blocks iframe embedding (X-Frame-Options / CSP). Use “Open in new tab”.
                </div>
                <a
                  href={mtWebTraderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm text-theme-primary bg-theme-secondary/50 hover:bg-theme-secondary px-3 py-2 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open MT5 WebTrader
                </a>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              {!mtIframeLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-theme-background">
                  <div className="text-xs text-theme-secondary">Loading MT5 WebTrader…</div>
                </div>
              )}
              {mtIframeShowHelp && !mtIframeLoaded && (
                <div className="absolute top-3 right-3 left-3 md:left-auto md:w-[360px] bg-theme-secondary/20 border border-theme-secondary/20 rounded-lg p-3">
                  <div className="text-xs text-theme-secondary">
                    If it stays blank, your MT5 provider likely blocks embedding.
                  </div>
                  <a
                    href={mtWebTraderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-2 text-xs text-theme-primary bg-theme-secondary/50 hover:bg-theme-secondary px-3 py-2 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in new tab
                  </a>
                </div>
              )}
              <iframe
                title="MetaTrader WebTrader"
                src={mtWebTraderUrl}
                className="w-full h-full border-0"
                allow="fullscreen; clipboard-read; clipboard-write"
                onLoad={() => setMtIframeLoaded(true)}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-w-0 overflow-hidden bg-theme-background text-theme-primary flex flex-col">
      {/* MetaTrader-style toolbar */}
      <Toolbar
        symbol={symbol}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        onIndicatorAdd={() => setShowNavigator(!showNavigator)}
        onMarketWatchToggle={() => setShowMarketWatch(!showMarketWatch)}
        onChartToggle={() => setShowChartFullscreen(!showChartFullscreen)}
        mtWebTraderUrl={mtWebTraderUrl}
        onOpenMtWebTrader={() => setShowMtWebTrader(true)}
      />
      
      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden min-h-0 gap-2 lg:gap-3">
        {/* Mobile view switching */}
        {isMobile ? (
          mobileView === 'marketWatch' ? (
            <div className="flex-1">
              <MarketWatch 
                instruments={instruments} 
                selectedSymbol={symbol} 
                onSymbolSelect={handleSymbolChange}
                onOpenTradingPanel={() => setMobileView('trading')}
                onSetOrderSide={setOrderSide}
                onQuickTrade={openQuickTrade}
                isMobile={isMobile}
              />
            </div>
          ) : mobileView === 'quickTrade' ? (
            <div className="flex-1">
              <QuickTradePanel 
                symbol={quickTradeSymbol} 
                currentPrice={instruments.find(inst => inst.symbol === quickTradeSymbol)?.price || currentPrice}
                onOrderPlaced={handleOrderPlaced}
                balance={balance}
                onClose={() => setMobileView('marketWatch')}
                side={quickTradeSide}
              />
            </div>
          ) : (
            <div className="flex-1">
              <TradingPanel 
                symbol={symbol} 
                currentPrice={currentPrice} 
                onOrderPlaced={handleOrderPlaced}
                balance={balance}
                onTogglePanel={() => setMobileView('marketWatch')}
                orderSide={selectedOrderSide}
                isMobile={isMobile}
              />
            </div>
          )
        ) : (
          <>
            {/* Desktop layout: Chart left, right sidebar (Market Watch + Trading Panel) */}
            <div className="flex-1 flex overflow-hidden min-h-0 gap-2 lg:gap-3">
              {/* Left: optional navigator + chart */}
              <div className="flex flex-1 min-w-0 gap-2 lg:gap-3">
                {showNavigator && (
                  <div style={{ width: '170px' }} className="animate-section-in">
                    <Navigator />
                  </div>
                )}

                <div className="flex-1 flex flex-col chart-container mobile-chart-responsive">
                  <MTChart symbol={symbol} timeframe={timeframe} />
                </div>
              </div>

              {/* Right: Market Watch + Trading Panel */}
              <div
                className="flex flex-col gap-2 lg:gap-3 shrink-0"
                style={{ width: 'clamp(360px, 32vw, 480px)' }}
              >
                {showMarketWatch && (
                  <div className="animate-section-in">
                    <MarketWatch
                      instruments={instruments}
                      selectedSymbol={symbol}
                      onSymbolSelect={handleSymbolChange}
                      onOpenTradingPanel={openTradingPanel}
                      onSetOrderSide={setOrderSide}
                      isMobile={false}
                      dock="right"
                    />
                  </div>
                )}

                {showTradingPanel ? (
                  <div
                    ref={tradingPanelFocusRef}
                    tabIndex={-1}
                    className="outline-none animate-slide-in-right"
                    data-tour="trading-panel"
                  >
                    <TradingPanel
                      symbol={symbol}
                      currentPrice={currentPrice}
                      onOrderPlaced={handleOrderPlaced}
                      balance={balance}
                      onTogglePanel={toggleTradingPanel}
                      orderSide={selectedOrderSide}
                      scrollMode={'none'}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-end">
                    <button
                      onClick={toggleTradingPanel}
                      className="bg-theme-secondary border border-theme-primary px-3 py-2 hover:bg-theme-tertiary transition-all duration-200 text-xs font-semibold rounded"
                      title="Show Trading Panel"
                    >
                      Open trading panel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
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
