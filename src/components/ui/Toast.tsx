import React, { useEffect } from 'react';

export type ToastItem = { id: string; type?: 'success'|'error'|'info'; message: string };

export default function Toast({ items, onDismiss }: { items: ToastItem[]; onDismiss: (id: string) => void }){
  useEffect(()=>{
    const timers = items.map(t => setTimeout(()=> onDismiss(t.id), 4000));
    return () => timers.forEach(t=>clearTimeout(t as any));
  }, [items, onDismiss]);

  if(!items || items.length===0) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
      {items.map(it=> (
        <div key={it.id} className={`px-4 py-2 rounded shadow ${it.type==='success' ? 'bg-emerald-600 text-black' : it.type==='error' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-white'}`}>
          {it.message}
        </div>
      ))}
    </div>
  );
}
