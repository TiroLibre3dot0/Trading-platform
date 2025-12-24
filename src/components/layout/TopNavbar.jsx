import React from 'react';
import { accounts, user } from '../../mock/dashboardMock';

const UserAvatar = ({ name }) => (
  <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold text-white">{name.split(' ')[0][0]}</div>
);

export default function TopNavbar({ selectedAccountId, onAccountChange, onSettings, onMenuToggle }) {
  const acct = accounts.find(a => a.id === selectedAccountId) || accounts[0];
  return (
    <header className="h-16 w-full bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between">
      <div className="flex items-center gap-4">
        <img src="/Logo.png" alt="Bullwaves" className="h-8 w-auto" />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-slate-800 px-3 py-1 rounded">
          <div className="text-xs text-slate-400">Account</div>
          <select value={acct.id} onChange={e => onAccountChange && onAccountChange(e.target.value)} className="bg-transparent text-slate-100 text-sm outline-none">
            {accounts.map(a => (
              <option key={a.id} value={a.id}>{a.id} — ${a.balance.toLocaleString()}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right mr-2">
            <div className="text-slate-200 text-sm">{user.name}</div>
            <div className="text-slate-400 text-xs">{user.location}</div>
          </div>
          <UserAvatar name={user.name} />
          <button
            onClick={() => { if (typeof window !== 'undefined' && typeof window.__onNotificationsToggle === 'function') window.__onNotificationsToggle(); }}
            aria-label="Notifications"
            className="ml-2 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 relative"
          >
            🔔
            <span className="absolute -top-1 -right-2 text-[10px] bg-rose-500 text-white rounded-full px-1">{(typeof window !== 'undefined' && window.__notificationsCount) ? window.__notificationsCount : ''}</span>
          </button>
          <button onClick={onSettings} className="ml-2 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700">⚙</button>
        </div>
      </div>
    </header>
  );
}
