import React from 'react';

export default function QuickActions({ onAction }) {
  import React from 'react';

  export default function QuickActions({ onAction }) {
    const actions = [
      { id: 'deposit', label: 'Deposit', emoji: '💳' },
      { id: 'withdraw', label: 'Withdraw', emoji: '🏧' },
      { id: 'transfer', label: 'Transfer', emoji: '🔁' },
      { id: 'settings', label: 'Settings', emoji: '⚙' }
    ];

    return (
      <div className="bg-slate-900 border border-slate-800 rounded p-3">
        <div className="text-slate-100 font-semibold mb-2">Quick Actions</div>
        <div className="grid grid-cols-2 gap-2">
          {actions.map(a => (
            <button
              key={a.id}
              onClick={() => onAction && onAction(a.id)}
              className="flex items-center gap-2 p-2 bg-slate-800 rounded hover:bg-slate-700"
            >
              <span className="text-lg">{a.emoji}</span>
              <span className="text-slate-100">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
                <div className="grid grid-cols-2 gap-2">
