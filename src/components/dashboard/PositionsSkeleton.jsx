import React from 'react';

export default function PositionsSkeleton(){
  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-3 h-64 flex flex-col">
      <div className="animate-pulse space-y-3 w-full">
        <div className="h-4 bg-slate-800 rounded w-1/3" />
        <div className="h-3 bg-slate-800 rounded" />
        <div className="h-3 bg-slate-800 rounded" />
        <div className="h-3 bg-slate-800 rounded" />
      </div>
    </div>
  )
}
