import React from 'react';

export default function PerformanceCard() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-3 h-64 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="text-slate-100 font-semibold">Performance</div>
        <div className="text-xs text-slate-400">1M</div>
      </div>

      <div className="flex-1 flex items-center justify-center text-slate-500">[Performance chart placeholder]</div>
    </div>
  );
}
