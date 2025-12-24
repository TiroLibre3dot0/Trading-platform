import React, { useState } from 'react';

export default function TradePanel({ accounts, onPlaceOrder }) {
  const [symbol, setSymbol] = useState('EUR/USD');
  const [side, setSide] = useState('Buy');
  const [size, setSize] = useState(1);
  const [account, setAccount] = useState(accounts?.[0]?.id || '');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-4 h-full flex flex-col">
      <div className="text-lg font-semibold mb-3">New Order</div>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-xs text-slate-400">Account</label>
        <select value={account} onChange={e=>setAccount(e.target.value)} className="bg-slate-800 p-2 rounded">
          {accounts?.map(a=> <option key={a.id} value={a.id}>{a.id} — ${a.balance.toLocaleString()}</option>)}
        </select>

        <label className="text-xs text-slate-400">Symbol</label>
        <input value={symbol} onChange={e=>setSymbol(e.target.value)} className="bg-slate-800 p-2 rounded" />

        <label className="text-xs text-slate-400">Side</label>
        <select value={side} onChange={e=>setSide(e.target.value)} className="bg-slate-800 p-2 rounded">
          <option>Buy</option>
          <option>Sell</option>
        </select>

        <label className="text-xs text-slate-400">Size</label>
        <input type="number" value={size} onChange={e=>setSize(Number(e.target.value))} className="bg-slate-800 p-2 rounded" />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button onClick={()=>onPlaceOrder && onPlaceOrder({ account, symbol, side, size })} className="px-4 py-2 bg-emerald-600 rounded">Place Order</button>
        <button onClick={()=>{setSize(1); setSymbol('EUR/USD');}} className="px-3 py-2 bg-slate-800 rounded">Reset</button>
      </div>
    </div>
  );
}
