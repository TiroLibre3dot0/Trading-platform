import React from 'react';

export default function StatCard({ title, value, small }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-3">
      <div className="text-xs text-slate-400">{title}</div>
      <div className={`text-slate-100 font-semibold ${small ? 'text-sm' : 'text-lg'}`}>{value}</div>
    </div>
  );
}
