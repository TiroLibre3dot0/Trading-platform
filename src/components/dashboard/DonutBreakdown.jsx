import React from 'react';

export default function DonutBreakdown({ data = [] }) {
  // compute conic-gradient stops
  const total = data.reduce((s, d) => s + d.pct, 0) || 100;
  let acc = 0;
  const stops = data.map(d => {
    const start = acc;
    acc += (d.pct / total) * 100;
    const end = acc;
    return `${d.color || '#06b6d4'} ${start}% ${end}%`;
  }).join(', ');

  const style = { background: `conic-gradient(${stops})` };

  return (
    <div className="flex items-center gap-3">
      <div className="w-28 h-28 rounded-full" style={style} />
      <div className="flex-1">
        {data.map(d => (
          <div key={d.name} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full" style={{background: d.color || '#06b6d4'}} />
              <span className="text-slate-100">{d.name}</span>
            </div>
            <div className="text-slate-400">{d.pct}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
