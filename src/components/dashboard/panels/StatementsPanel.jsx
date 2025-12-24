import React from 'react';

export default function StatementsPanel(){
  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-4 h-full">
      <div className="text-lg font-semibold mb-3">Statements</div>
      <div className="text-slate-400 text-sm">Monthly / Yearly statements will be available here.</div>
      <div className="mt-4">
        <button className="px-3 py-2 bg-slate-800 rounded">Download Last 30 days</button>
      </div>
    </div>
  );
}
