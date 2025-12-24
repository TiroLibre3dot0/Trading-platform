import React from 'react';

export default function PositionsTable({ positions }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-3 h-64 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="text-slate-100 font-semibold">Positions Snapshot</div>
        <div className="text-xs text-slate-400">{positions.length} open</div>
      </div>

      <div className="overflow-auto flex-1">
        <table className="w-full table-auto text-sm">
          <thead className="text-slate-400 text-xs border-b border-slate-800">
            <tr>
              <th className="py-2 text-left">Symbol</th>
              <th className="py-2">Size</th>
              <th className="py-2">Entry</th>
              <th className="py-2">Current</th>
              <th className="py-2">P/L</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {positions.map(p => (
              <tr key={p.id} className="border-b border-slate-800 hover:bg-slate-850">
                <td className="py-2 text-slate-100">{p.symbol}</td>
                <td className="py-2 text-center text-slate-200">{p.size}</td>
                <td className="py-2 text-center text-slate-400">{p.entry}</td>
                <td className="py-2 text-center text-slate-200">{p.current}</td>
                <td className={`py-2 text-center ${p.pl>=0 ? 'text-emerald-400' : 'text-rose-400'}`}>${Math.abs(p.pl).toLocaleString()}</td>
                <td className="py-2 text-center text-slate-400">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
