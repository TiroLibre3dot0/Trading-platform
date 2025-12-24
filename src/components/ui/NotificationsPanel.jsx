import React from 'react';

export default function NotificationsPanel({ open, notifications = [], onClose }){
  if(!open) return null;
  return (
    <div style={{ top: 64 }} className="fixed right-4 z-50 w-96 bg-slate-900 border border-slate-800 rounded shadow-lg overflow-hidden">
      <div className="p-3 border-b border-slate-800 flex items-center justify-between">
        <div className="font-semibold text-slate-100">Notifications</div>
        <button onClick={onClose} className="text-slate-400 text-sm">Close</button>
      </div>
      <div className="max-h-72 overflow-auto">
        {notifications.length === 0 && <div className="p-3 text-slate-400 text-sm">No notifications</div>}
        {notifications.map(n => (
          <div key={n.id} className="p-3 border-b last:border-b-0 border-slate-800 hover:bg-slate-800">
            <div className="flex items-center justify-between">
              <div className="text-slate-100 font-medium">{n.title}</div>
              <div className="text-xs text-slate-400">{n.time}</div>
            </div>
            <div className="text-slate-400 text-sm mt-1">{n.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
