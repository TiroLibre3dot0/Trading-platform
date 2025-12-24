import React from 'react';

export default function SectionPlaceholder({ title }) {
  return (
    <div className="h-full bg-slate-900 border border-slate-800 rounded p-6 flex flex-col">
      <div className="text-2xl font-semibold text-slate-100 mb-4">{title}</div>
      <div className="text-slate-400">Coming soon — this section will contain full features for {title.toLowerCase()}.</div>
      <div className="mt-4 text-sm text-slate-400">You can add actions, charts and detailed tables here.</div>
      <div className="mt-auto text-xs text-slate-500">Placeholder view — board-ready layout</div>
    </div>
  );
}
