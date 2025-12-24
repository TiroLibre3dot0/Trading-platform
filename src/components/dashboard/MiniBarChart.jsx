import React from 'react';

export default function MiniBarChart({ data = [] }) {
  const max = Math.max(...data.map(d => d.profit), 1);
  return (
    <div className="flex items-end gap-2 h-28">
      {data.map(d => (
        <div key={d.month} className="flex-1 flex flex-col items-center">
          <div className="w-full bg-slate-800 rounded-t" style={{height: `${(d.profit / max) * 100}%`}} title={`${d.month}: ${d.profit}`} />
          <div className="text-xs text-slate-400 mt-2">{d.month}</div>
        </div>
      ))}
    </div>
  );
}
