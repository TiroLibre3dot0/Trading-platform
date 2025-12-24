import React from 'react';
import premiumMock from '../mock/premiumMock';

export default function PremiumRewardsPage(){
  const { userPoints, currentTier, nextTierProgress, tiers } = premiumMock;
  return (
    <div className="h-full min-w-0 overflow-hidden">
      <div className="h-full flex flex-col gap-4" style={{minHeight:0}}>
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Rewards</h1>
            <div className="text-slate-400 text-sm">Your trading activity earns points. Unlock tiers for better benefits.</div>
          </div>
        </header>

        <div className="flex gap-4 flex-1 min-w-0" style={{minHeight:0}}>
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="text-slate-400">You have</div>
                <div className="text-3xl font-bold">{userPoints.toLocaleString()}</div>
                <div className="mt-1 text-sm text-slate-300">Current tier: <span className="font-semibold">{currentTier}</span></div>
              </div>
              <div style={{width:180}}>
                <div className="text-xs text-slate-400 mb-2">Progress to next tier</div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div style={{width:`${nextTierProgress}%`}} className="h-3 bg-emerald-500" />
                </div>
                <div className="text-xs text-slate-400 mt-2">Next review: 2026-01-15</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {tiers.map(t => (
                <div key={t.name} className={`bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col`}>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold">{t.name}</div>
                    <div className="text-sm text-slate-400">Min {t.min.toLocaleString()}</div>
                  </div>
                  <ul className="mt-3 space-y-1 text-sm text-slate-300 flex-1">
                    {t.benefits.map((b,i) => <li key={i}>• {b}</li>)}
                  </ul>
                  <div className="mt-3">
                    {t.name === currentTier ? (
                      <button className="px-3 py-2 bg-slate-700 rounded-md">View benefits</button>
                    ) : (
                      <button className="px-3 py-2 bg-emerald-600 text-black rounded-md">How to unlock</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="w-96 bg-slate-900 border border-slate-800 rounded-lg p-3 overflow-auto">
            <div className="font-semibold mb-2">Benefits details</div>
            <div className="text-sm text-slate-300">Expand each benefit to read more. (Mock FAQ/accordion)</div>
          </aside>
        </div>
      </div>
    </div>
  );
}
