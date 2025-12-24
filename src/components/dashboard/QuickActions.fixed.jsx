import React from 'react';

function Icon({ children, title }){
  return <span title={title} className="inline-flex w-6 h-6 items-center justify-center">{children}</span>;
}

const IconCard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M2 10h20" stroke="currentColor" strokeWidth="1.2"/></svg>
);

const IconWallet = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 7h18v10H2z" stroke="currentColor" strokeWidth="1.2"/><circle cx="18" cy="12" r="1" fill="currentColor"/></svg>
);

const IconTransfer = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 7l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 7l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

const IconGear = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z" stroke="currentColor" strokeWidth="1.2"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06A2 2 0 114.1 17.88l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1c.12-.6-.05-1.22-.33-1.82L4.21 4.1A2 2 0 116.7 1.6l.06.06c.6.28 1.22.45 1.82.33.6-.16 1.23.12 1.51.66.28.54.78.96 1.4.96h.12c.62 0 1.12-.42 1.4-.96.28-.54.9-.82 1.51-.66.6.12 1.22-.05 1.82-.33l.06-.06A2 2 0 1119.4 4.1l-.06.06c-.28.6-.45 1.22-.33 1.82.16.6.48 1.09.98 1.51.5.42.86.96.86 1.6v.12c0 .64-.36 1.18-.86 1.6-.5.42-.82.91-.98 1.51-.12.6.05 1.22.33 1.82l.06.06A2 2 0 1119.4 15z" stroke="currentColor" strokeWidth="0.6"/></svg>
);

export default function QuickActions({ onAction }) {
  const actions = [
    { id: 'deposit', label: 'Deposit', icon: <IconCard /> },
    { id: 'withdraw', label: 'Withdraw', icon: <IconWallet /> },
    { id: 'transfer', label: 'Transfer', icon: <IconTransfer /> },
    { id: 'settings', label: 'Settings', icon: <IconGear /> }
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
            <Icon title={a.label}>{a.icon}</Icon>
            <span className="text-slate-100">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
