import React from 'react';

// Simple sparkline-like SVG line chart for small area (14 points)
export default function MiniLineChart({ data = [] }) {
  const w = 220, h = 60;
  const vals = data.map(d => d.value);
  const min = Math.min(...vals), max = Math.max(...vals);

  const points = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * w;
    const y = h - ((v - min) / (max - min || 1)) * h;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
      <defs>
        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline fill="url(#g1)" points={`${points} ${w},${h} 0,${h}`} stroke="none" />
      <polyline fill="none" stroke="#34d399" strokeWidth="2" points={points} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
