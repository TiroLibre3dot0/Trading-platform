import React from 'react';

export default function PositionsPanel({ positions, onRowClick }){
  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-3 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-semibold">Open Positions</div>
        <div className="text-xs text-slate-400">{positions.length} positions</div>
      </div>
      <div className="overflow-auto flex-1">
        <table className="w-full text-sm">
          <thead className="text-slate-400 text-xs sticky top-0 bg-slate-900">
            <tr>
              <th className="py-2 text-left">Symbol</th>
              <th className="py-2">Side</th>
              <th className="py-2">Size</th>
              <th className="py-2">Entry</th>
              <th className="py-2">Current</th>
              <th className="py-2">P/L</th>
            </tr>
          </thead>
          <tbody>
            {positions.map(pos=> (
              <tr key={pos.id} onClick={()=>onRowClick && onRowClick(pos)} className="border-b border-slate-800 hover:bg-slate-850 cursor-pointer">
                <td className="py-2 text-slate-100">{pos.symbol}</td>
                <td className={`py-2 text-center ${pos.side==='Buy' ? 'text-emerald-400' : 'text-rose-400'}`}>{pos.side}</td>
                <td className="py-2 text-center text-slate-200">{pos.size}</td>
                <td className="py-2 text-center text-slate-400">{pos.entry}</td>
                <td className="py-2 text-center text-slate-200">{pos.current}</td>
                <td className={`py-2 text-center font-semibold ${pos.pnl>=0 ? 'text-emerald-400' : 'text-rose-400'}`}>${Math.abs(pos.pnl).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
