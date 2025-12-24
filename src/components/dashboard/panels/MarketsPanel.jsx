import React, { useMemo, useState } from 'react';

function ChangeBadge({ pct }){
  const isPos = pct >= 0;
  return <div className={`text-sm ${isPos ? 'text-emerald-300' : 'text-rose-300'}`}>{isPos?'+':''}{pct}%</div>;
}
  }
  const categories = useMemo(() => ['all', ...Array.from(new Set(markets.map(m=>m.category).filter(Boolean)))], [markets]);
  const filtered = useMemo(() => category === 'all' ? markets : markets.filter(m => m.category === category), [markets, category]);

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
                    <div className="text-emerald-300 font-semibold">{m.bid}</div>
                    <button onClick={() => onTrade && onTrade(m, 'sell', m.bid)} className="px-2 py-1 bg-rose-600 rounded-md text-white">Sell</button>
                  </div>
                </td>
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <div className="text-rose-300 font-semibold">{m.ask}</div>
                    <button onClick={() => onTrade && onTrade(m, 'buy', m.ask)} className="px-2 py-1 bg-emerald-600 rounded-md text-black">Buy</button>
                  </div>
                </td>
                <td className="py-2"><ChangeBadge pct={m.changePct} /></td>
                <td className="py-2 text-slate-400">{m.high}</td>
                <td className="py-2 text-slate-400">{m.low}</td>
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
