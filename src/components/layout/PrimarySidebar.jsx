import React from 'react';

const Icon = ({ children }) => (
  <div className="h-8 w-8 flex items-center justify-center text-slate-200">{children}</div>
);

export default function PrimarySidebar({ collapsed, active, onSelect, onToggleMenu }) {
  const items = [
    { id: 'trade', label: 'Trade', icon: '↔' },
    { id: 'markets', label: 'Markets', icon: '⚙' },
    { id: 'open', label: 'Open Positions', icon: '📈' },
    { id: 'closed', label: 'Closed Positions', icon: '📉' },
    { id: 'funds', label: 'Funds', icon: '💰' },
    { id: 'withdrawals', label: 'Withdrawals', icon: '⬇' },
    { id: 'transactions', label: 'Transactions', icon: '🔁' },
    { id: 'support', label: 'Support', icon: '✉' }
  ];

  // Matrix intro removed per request; keep sidebar simple and static for now.

  return (
    <aside className={`bg-slate-900 border-r border-slate-800 flex flex-col ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out`}>
      <div className="p-3 flex items-center justify-between">
        <button onClick={onToggleMenu} className="px-2 py-1 rounded bg-slate-800 text-slate-200">Menu</button>
        {!collapsed && <div className="text-xs text-slate-400">Navigation</div>}
      </div>

      <nav className="flex-1 px-2 py-3 space-y-1 overflow-auto panel-scroll relative">
        {items.map(it => (
          <button key={it.id} onClick={() => onSelect && onSelect(it.id)} className={`w-full flex items-center gap-3 rounded px-3 py-2 text-left hover:bg-slate-800 ${active===it.id ? 'bg-slate-800 ring-1 ring-slate-700' : ''}`}>
            <Icon>{it.icon}</Icon>
            {!collapsed && <span className="text-slate-100">{it.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-3 text-slate-400 text-xs">© Bullwaves</div>
    </aside>
  );
}
