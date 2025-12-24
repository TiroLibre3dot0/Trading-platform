import React from 'react';

export default function TransactionsList({ items = [], onRowClick }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-3 h-60 flex flex-col">
      <div className="text-slate-100 font-semibold mb-2">Recent Transactions</div>
      <div className="overflow-auto flex-1">
        <table className="w-full text-sm">
          <thead className="text-slate-400 text-xs border-b border-slate-800">
            <tr>
              <th className="py-2 text-left">ID</th>
              <th className="py-2">Type</th>
              <th className="py-2">Symbol</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Date</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map(tx => (
              <tr key={tx.id} onClick={() => onRowClick && onRowClick(tx)} className="border-b border-slate-800 hover:bg-slate-850 cursor-pointer">
                <td className="py-2 text-slate-200">{tx.id}</td>
                <td className="py-2 text-slate-200">{tx.type}</td>
                <td className="py-2 text-slate-400">{tx.symbol || tx.method}</td>
                <td className={`py-2 font-semibold ${tx.amount>=0? 'text-emerald-400':'text-rose-400'}`}>${Math.abs(tx.amount).toLocaleString()}</td>
                <td className="py-2 text-slate-400">{tx.date}</td>
                <td className="py-2 text-slate-400">{tx.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
