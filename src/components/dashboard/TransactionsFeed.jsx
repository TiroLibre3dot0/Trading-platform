import React from 'react';

export default function TransactionsFeed({ transactions }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-3 h-64 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="text-slate-100 font-semibold">Recent Activity</div>
        <div className="text-xs text-slate-400">Latest</div>
      </div>

      <div className="overflow-auto flex-1">
        <ul className="space-y-2">
          {transactions.map(t => (
            <li key={t.id} className="flex items-center justify-between p-2 rounded hover:bg-slate-850">
              <div>
                <div className="text-slate-100">{t.type} — {t.method}</div>
                <div className="text-xs text-slate-400">{t.date}</div>
              </div>
              <div className={`font-semibold ${t.amount>=0? 'text-emerald-400':'text-rose-400'}`}>${Math.abs(t.amount).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
