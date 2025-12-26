import React, { useMemo, useState } from 'react';

function ChangeBadge({ pct }){
  const isPos = pct >= 0;
  return <div className={`text-sm ${isPos ? 'text-emerald-300' : 'text-rose-300'}`}>{isPos?'+':''}{pct}%</div>;
}

function Icon({ children, title }){
  return (
    <button title={title} className="p-1 rounded hover:bg-slate-800 text-slate-200">
      {children}
    </button>
  );
}

const IconBuy = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block text-emerald-400">
    <path d="M12 2v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 9l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconSell = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block text-rose-400">
    <path d="M12 22V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 15l-5 5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconInfo = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 8v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M11.5 11.5h1v4h-1z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
    <path d="M12 .587l3.668 7.431L23.6 9.753l-5.8 5.647L19.335 24 12 19.897 4.665 24l1.535-8.6L.4 9.753l7.932-1.735L12 .587z" fill="currentColor" />
  </svg>
);

export default function MarketsPanel({ markets = [], onTrade, onAction }){
  const [category, setCategory] = useState('all');
  const categories = useMemo(() => ['all', ...Array.from(new Set((markets||[]).map(m=>m.category).filter(Boolean)))], [markets]);
  const filtered = useMemo(() => category === 'all' ? (markets||[]) : (markets||[]).filter(m => m.category === category), [markets, category]);

  const fmt = (v) => (typeof v === 'number' ? v.toLocaleString(undefined, { maximumFractionDigits: 4 }) : v);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-slate-100 font-semibold">Markets / MetaTrade Sample</div>
        <div className="text-xs text-slate-400">Live quotes</div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} className={`text-xs px-3 py-1 rounded-full ${category===cat ? 'bg-slate-700 text-white' : 'bg-transparent text-slate-400 hover:bg-slate-800'}`}>
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="overflow-auto" style={{minHeight:0}}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 text-left text-xs">
              <th className="py-2">Symbol</th>
              <th className="py-2">Bid</th>
              <th className="py-2">Ask</th>
              <th className="py-2">Change</th>
              <th className="py-2">High</th>
              <th className="py-2">Low</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.symbol} className="border-t border-slate-800 hover:bg-slate-800">
                <td className="py-2 text-slate-100 font-medium">
                  {m.symbol}
                  <div className="text-xs text-slate-400">{m.name}</div>
                </td>
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <div className="text-green-400 font-semibold">{fmt(m.bid)}</div>
                    <button onClick={() => onTrade && onTrade(m, 'sell', m.bid)} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 rounded text-white text-sm font-medium transition-colors">Sell</button>
                  </div>
                </td>
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <div className="text-red-400 font-semibold">{fmt(m.ask)}</div>
                    <button onClick={() => onTrade && onTrade(m, 'buy', m.ask)} className="px-3 py-1.5 bg-green-500 hover:bg-green-600 rounded text-white text-sm font-medium transition-colors">Buy</button>
                  </div>
                </td>
                <td className="py-2"><ChangeBadge pct={m.changePct} /></td>
                <td className="py-2 text-slate-400">{fmt(m.high)}</td>
                <td className="py-2 text-slate-400">{fmt(m.low)}</td>
                <td className="py-2">
                  <div className="flex items-center ml-auto gap-2">
                    <button onClick={() => onAction && onAction('insights', m)} className="bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded-md">Insights</button>
                    <button onClick={() => onAction && onAction('watchlist', m)} className="bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded-md">Watchlist</button>
                    <button onClick={() => onAction && onAction('alert', m)} className="bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded-md">Price alert</button>
                    <button onClick={() => onAction && onAction('info', m)} className="bg-slate-800 text-slate-200 text-xs px-2 py-1 rounded-md">Info</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
