import React from 'react';

export default function TransactionsSkeleton(){
  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-3 h-64 flex flex-col">
      <div className="animate-pulse space-y-2 w-full overflow-hidden">
        {Array.from({length:6}).map((_,i)=>(
          <div key={i} className="flex justify-between items-center">
            <div className="h-3 bg-slate-800 rounded w-1/4 my-2"></div>
            <div className="h-3 bg-slate-800 rounded w-1/6 my-2"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
