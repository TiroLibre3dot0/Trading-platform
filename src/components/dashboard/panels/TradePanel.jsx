import React, { useState } from 'react';

export default function TradePanel({ accounts, onPlaceOrder }) {
  const [symbol, setSymbol] = useState('EUR/USD');
  const [side, setSide] = useState('Buy');
  const [size, setSize] = useState(1);
  const [account, setAccount] = useState(accounts?.[0]?.id || '');

  return (
    <div className="bg-theme-primary border border-theme-secondary rounded p-4 h-full flex flex-col">
      <div className="text-lg font-semibold mb-3 text-theme-primary">New Order</div>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-xs text-theme-secondary uppercase tracking-wide">Account</label>
        <select value={account} onChange={e=>setAccount(e.target.value)} className="bg-theme-secondary text-theme-primary p-2 rounded border border-theme-secondary">
          {accounts?.map(a=> <option key={a.id} value={a.id}>{a.id} — ${a.balance.toLocaleString()}</option>)}
        </select>

        <label className="text-xs text-theme-secondary uppercase tracking-wide">Symbol</label>
        <input value={symbol} onChange={e=>setSymbol(e.target.value)} className="bg-theme-secondary text-theme-primary p-2 rounded border border-theme-secondary" />

        <label className="text-xs text-theme-secondary uppercase tracking-wide">Side</label>
        <select value={side} onChange={e=>setSide(e.target.value)} className="bg-theme-secondary text-theme-primary p-2 rounded border border-theme-secondary">
          <option>Buy</option>
          <option>Sell</option>
        </select>

        <label className="text-xs text-theme-secondary uppercase tracking-wide">Size</label>
        <input type="number" value={size} onChange={e=>setSize(Number(e.target.value))} className="bg-theme-secondary text-theme-primary p-2 rounded border border-theme-secondary" />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button onClick={()=>onPlaceOrder && onPlaceOrder({ account, symbol, side, size })} className={`px-4 py-2 rounded text-white font-medium ${side === 'Buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} transition-colors`}>Place Order</button>
        <button onClick={()=>{setSize(1); setSymbol('EUR/USD');}} className="px-3 py-2 bg-theme-secondary hover:bg-theme-tertiary text-theme-secondary rounded transition-colors">Reset</button>
      </div>
    </div>
  );
}
