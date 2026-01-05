import React, { useState } from 'react';

export default function SettingsSlideover({ open, onClose }:{open:boolean,onClose:()=>void}){
  const [tab, setTab] = useState('preferences');
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1" onClick={onClose} />
      <aside className="w-full max-w-[24rem] bg-slate-900 border-l border-slate-800 p-4 overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">Settings</div>
          <button onClick={onClose} className="text-slate-400">Close</button>
        </div>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setTab('preferences')} className={`px-3 py-1 rounded ${tab==='preferences'?'bg-slate-700':'bg-transparent'}`}>Preferences</button>
          <button onClick={() => setTab('notifications')} className={`px-3 py-1 rounded ${tab==='notifications'?'bg-slate-700':'bg-transparent'}`}>Notifications</button>
          <button onClick={() => setTab('privacy')} className={`px-3 py-1 rounded ${tab==='privacy'?'bg-slate-700':'bg-transparent'}`}>Privacy</button>
          <button onClick={() => setTab('theme')} className={`px-3 py-1 rounded ${tab==='theme'?'bg-slate-700':'bg-transparent'}`}>Theme</button>
        </div>

        <div className="space-y-4">
          {tab === 'preferences' && <div className="text-sm text-slate-300">Preferences content (mock). Toggle simple options here.</div>}
          {tab === 'notifications' && <div className="text-sm text-slate-300">Notification settings (mock).</div>}
          {tab === 'privacy' && <div className="text-sm text-slate-300">Privacy controls (mock).</div>}
          {tab === 'theme' && <div className="text-sm text-slate-300">Theme selector (mock).</div>}
        </div>
      </aside>
    </div>
  );
}
