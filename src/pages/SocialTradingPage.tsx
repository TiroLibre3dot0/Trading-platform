import React, { useState } from 'react';
import socialMock from '../mock/socialMock';

export default function SocialTradingPage(){
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const providers = socialMock.providers.filter(p => filter==='all' || (filter==='low' && p.risk==='Low') || (filter==='top' && p.followers>2000));

  return (
    <div className="h-full min-w-0 overflow-hidden">
      <div className="flex flex-col gap-4 h-full" style={{minHeight:0}}>
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Social Trading</h1>
            <div className="text-slate-400 text-sm">Discover providers, copy strategies, and follow top traders.</div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded-md bg-slate-800">Explore providers</button>
            <button className="px-3 py-1 rounded-md bg-emerald-600 text-black">Start copying</button>
            <button className="px-3 py-1 rounded-md bg-slate-800">Risk settings</button>
          </div>
        </header>

        <div className="flex gap-4 flex-1 min-w-0" style={{minHeight:0}}>
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex items-center gap-2">
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search providers" className="flex-1 bg-transparent outline-none text-slate-200" />
              <div className="flex gap-2">
                <button onClick={()=>setFilter('all')} className={`px-2 py-1 rounded-full ${filter==='all'?'bg-slate-700':''}`}>All</button>
                <button onClick={()=>setFilter('low')} className={`px-2 py-1 rounded-full ${filter==='low'?'bg-slate-700':''}`}>Low risk</button>
                <button onClick={()=>setFilter('top')} className={`px-2 py-1 rounded-full ${filter==='top'?'bg-slate-700':''}`}>Top ROI</button>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 overflow-auto" style={{minHeight:0}}>
              {providers.map(p => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-slate-400">Risk: {p.risk} • Followers: {p.followers}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-emerald-300">30d {p.roi30}%</div>
                    <div className="text-xs text-slate-400">Drawdown {p.drawdown}%</div>
                    <div className="mt-2 flex gap-2">
                      <button className="px-2 py-1 rounded-md bg-slate-800">View</button>
                      <button className="px-2 py-1 rounded-md bg-emerald-600 text-black">Copy</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 mt-2 overflow-auto" style={{minHeight:0}}>
              <div className="font-semibold mb-2">Social Feed</div>
              {socialMock.feed.map(item => (
                <div key={item.id} className="py-2 border-b last:border-b-0">
                  <div className="text-sm">{item.text}</div>
                  <div className="text-xs text-slate-400">{item.time}</div>
                </div>
              ))}
            </div>
          </div>

          <aside className="w-96 flex flex-col gap-3 min-w-0">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 overflow-auto">
              <div className="font-semibold mb-2">Leaderboard</div>
              {socialMock.leaderboard.map((l, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <div className="font-semibold">{l.name}</div>
                    <div className="text-xs text-slate-400">Sharpe {l.sharpe}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-300">{l.roi30}%</div>
                    <div className="text-xs text-slate-400">{l.followers} followers</div>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
