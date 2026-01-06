import React, { useEffect, useRef } from 'react';
import { createChart, LineSeries, CandlestickSeries, AreaSeries } from 'lightweight-charts';

interface Point { time: number; value: number }

// TradeChart renders a candlestick series built from incoming tick points and two area series for depth visualization.
export default function TradeChart({ data, bids, asks }: { data: Point[]; bids?: Array<[number, number]>; asks?: Array<[number, number]> }){
  const ref = useRef<HTMLDivElement | null>(null);
  const candleRef = useRef<any>(null);
  const bidsRef = useRef<any>(null);
  const asksRef = useRef<any>(null);
  const chartRef = useRef<any>(null);
  const themeObserverRef = useRef<MutationObserver | null>(null);

  const getVar = (name: string, fallback: string) => {
    try {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    } catch (_err) {
      return fallback;
    }
  };

  const applyTheme = () => {
    const chart = chartRef.current;
    if (!chart) return;

    const bg = getVar('--bg-secondary', '#ffffff');
    const text = getVar('--text-secondary', '#334155');
    const grid = getVar('--border-primary', '#d7e2f3');
    const scale = getVar('--border-primary', '#d7e2f3');

    try {
      chart.applyOptions({
        layout: { background: { color: bg }, textColor: text },
        grid: { vertLines: { color: grid }, horzLines: { color: grid } },
        rightPriceScale: { borderColor: scale },
        timeScale: { borderColor: scale },
      });
    } catch (_err) {
      // ignore
    }
  };

  // helper: convert tick series into small OHLC candles (one-second candles)
  const buildCandles = (points: Point[]) => {
    if(!points || points.length===0) return [];
    const bySec: Record<number, {open:number;high:number;low:number;close:number}> = {};
    points.forEach(p=>{
      const s = Math.floor(p.time/1000);
      if(!bySec[s]) bySec[s] = { open: p.value, high: p.value, low: p.value, close: p.value };
      else{
        const c = bySec[s];
        c.high = Math.max(c.high, p.value);
        c.low = Math.min(c.low, p.value);
        c.close = p.value;
      }
    });
    return Object.keys(bySec).sort().map(k=>({ time: Number(k), open: bySec[Number(k)].open, high: bySec[Number(k)].high, low: bySec[Number(k)].low, close: bySec[Number(k)].close }));
  };

  useEffect(()=>{
    if(!ref.current) return;
    const chart = createChart(ref.current, {
      width: ref.current.clientWidth,
      height: 300,
      layout: { background: { color: '#0b1220' }, textColor: '#cbd5e1' },
      grid: { vertLines: { color: '#1f2937' }, horzLines: { color: '#1f2937' } },
      rightPriceScale: { borderColor: '#1f2937' },
      timeScale: { borderColor: '#1f2937' }
    });
    chartRef.current = chart;
    applyTheme();
    // use addSeries for compatibility with different lightweight-charts builds
    // create series using a safe fallback strategy to avoid runtime assertions across lightweight-charts builds
    let candles: any = null;
    try{
      if((chart as any).addCandlestickSeries){
        candles = (chart as any).addCandlestickSeries({ upColor: '#10b981', downColor: '#ef4444', wickUpColor: '#10b981', wickDownColor: '#ef4444' });
      } else if((chart as any).addSeries){
        // try generic addSeries but guard against assertions
        try{
          candles = (chart as any).addSeries(CandlestickSeries, { upColor: '#10b981', downColor: '#ef4444', wickUpColor: '#10b981', wickDownColor: '#ef4444' });
        }catch(e){
          // fallback to a line series if candlestick not supported
          candles = (chart as any).addSeries(LineSeries, { color: '#10b981', lineWidth: 2 });
        }
      } else {
        candles = (chart as any).addSeries(LineSeries, { color: '#10b981', lineWidth: 2 });
      }
    }catch(e){
      candles = (chart as any).addSeries(LineSeries, { color: '#10b981', lineWidth: 2 });
    }
    candleRef.current = candles;

    // bids/asks: prefer area series, but fall back to line series if needed
    let bidsArea: any = null;
    let asksArea: any = null;
    try{
      if((chart as any).addAreaSeries){
        bidsArea = (chart as any).addAreaSeries();
        asksArea = (chart as any).addAreaSeries();
      } else if((chart as any).addSeries){
        try{ bidsArea = (chart as any).addSeries(AreaSeries, {}); }catch(e){ bidsArea = (chart as any).addSeries(LineSeries, {}); }
        try{ asksArea = (chart as any).addSeries(AreaSeries, {}); }catch(e){ asksArea = (chart as any).addSeries(LineSeries, {}); }
      } else {
        bidsArea = (chart as any).addSeries(LineSeries, {});
        asksArea = (chart as any).addSeries(LineSeries, {});
      }
    }catch(e){
      bidsArea = (chart as any).addSeries(LineSeries, {});
      asksArea = (chart as any).addSeries(LineSeries, {});
    }
    bidsRef.current = bidsArea;
    asksRef.current = asksArea;

    const handleResize = () => {
      if(ref.current && chartRef.current) {
        chartRef.current.applyOptions({ width: ref.current.clientWidth });
        applyTheme();
      }
    };
    window.addEventListener('resize', handleResize);

    try {
      const obs = new MutationObserver(() => applyTheme());
      obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      themeObserverRef.current = obs;
    } catch (_err) {
      // ignore
    }

    return ()=>{
      window.removeEventListener('resize', handleResize);
      try { themeObserverRef.current?.disconnect(); } catch (_err) {}
      chart.remove();
    };
  }, []);

  useEffect(()=>{
    const candles = buildCandles(data || []);
    if(candleRef.current && candles.length) candleRef.current.setData(candles as any);
    if(bidsRef.current && bids) bidsRef.current.setData(bids.map(([p,sz])=>({ time: Math.floor(Date.now()/1000), value: p, volume: sz })) as any);
    if(asksRef.current && asks) asksRef.current.setData(asks.map(([p,sz])=>({ time: Math.floor(Date.now()/1000), value: p, volume: sz })) as any);
  }, [data, bids, asks]);

  return <div ref={ref} className="w-full" data-tour="chart-toolbar" />;
}
