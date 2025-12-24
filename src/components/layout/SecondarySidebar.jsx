import React from 'react';

export default function SecondarySidebar({ open, onClose, active, onSelect }) {
  const items = [
    'Profile', 'Documents', 'Statements', 'Tax Reports', 'Security', 'Notifications', 'Preferences'
  ];

  return (
    <aside className={`bg-slate-900 border-r border-slate-800 p-3 flex flex-col transition-all duration-300 ${open ? 'w-64 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-4 overflow-hidden'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-slate-100 font-semibold">Account</div>
        <button onClick={onClose} className="text-slate-400 px-2 py-1 rounded hover:bg-slate-800">✕</button>
      </div>

      <nav className="flex-1 space-y-1 overflow-auto panel-scroll">
        {items.map(i => (
          <button key={i} onClick={() => onSelect && onSelect(i)} className={`w-full text-left px-3 py-2 rounded hover:bg-slate-800 ${active===i ? 'bg-slate-800 ring-1 ring-slate-700 text-slate-100' : 'text-slate-200'}`}>
            {i}
          </button>
        ))}
      </nav>

      <div className="text-slate-400 text-xs mt-3">Last login: 2025-12-24</div>
    </aside>
  );
}
