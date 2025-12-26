import React from 'react';

export default function OrdersPanel({ orders = [], onRowClick }){
  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-3 mt-4">
      <div className="text-lg font-semibold mb-2">Recent Orders</div>
      <div className="overflow-auto max-h-48">
        <table className="w-full text-sm">
          <thead className="text-slate-400 text-xs">
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Symbol</th>
              <th className="py-2">Type</th>
              <th className="py-2">Size</th>
              <th className="py-2">Price</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} className="border-t border-slate-800 hover:bg-slate-850 cursor-pointer" onClick={()=>onRowClick && onRowClick(o)}>
                <td className="py-2 text-slate-200">{o.id}</td>
                <td className="py-2 text-slate-200">{o.symbol}</td>
                <td className="py-2 text-slate-400">{o.type}</td>
                <td className="py-2 text-slate-200">{o.size}</td>
                <td className="py-2 text-slate-200">{o.price}</td>
                <td className={`py-2 text-slate-400`}>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
