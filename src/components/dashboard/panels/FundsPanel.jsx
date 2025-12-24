import React from 'react';

export default function FundsPanel({ accounts }){
  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-4 h-full flex flex-col">
      <div className="text-lg font-semibold mb-3">Funds</div>
      <div className="text-slate-400 text-sm mb-2">Accounts</div>
      <div className="space-y-2">
        {accounts.map(a => (
          <div key={a.id} className="flex items-center justify-between bg-slate-800 p-2 rounded">
            <div>
              <div className="text-slate-100 font-medium">{a.id} • {a.type}</div>
              <div className="text-slate-400 text-xs">Currency: {a.currency || 'USD'}</div>
            </div>
            <div className="text-emerald-400 font-semibold">${a.balance.toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
