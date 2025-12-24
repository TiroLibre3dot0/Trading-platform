import React from 'react';

export default function KpiStrip({ kpis }) {
  const items = [
    { label: 'Balance', value: `$${kpis.balance.toLocaleString()}` },
    { label: 'Equity', value: `$${kpis.equity.toLocaleString()}` },
    { label: 'Margin', value: `$${kpis.margin.toLocaleString()}` },
    { label: 'Free Margin', value: `$${kpis.freeMargin.toLocaleString()}` },
    { label: "P/L Today", value: `$${kpis.plToday.toLocaleString()}` },
    { label: 'Risk Level', value: kpis.riskLevel }
  ];

  return (
    <div className="w-full flex gap-3">
      {items.map(it => (
        <div key={it.label} className="flex-1 bg-slate-900 border border-slate-800 rounded p-3">
          <div className="text-xs text-slate-400">{it.label}</div>
          <div className="text-slate-100 font-semibold text-lg">{it.value}</div>
        </div>
      ))}
    </div>
  );
}
