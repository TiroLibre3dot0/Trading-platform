import React from 'react';

export default function PlaceholderPage({ title }:{title?:string}){
  return (
    <div className="h-full min-w-0 overflow-auto p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 h-full">
        <h2 className="text-xl font-semibold">{title || 'Placeholder'}</h2>
        <div className="text-slate-400 mt-2">This is a placeholder page. Content to be implemented.</div>
      </div>
    </div>
  );
}
