import React from 'react';

export default function Drawer({ open, children, onClose, width = 420 }) {
  return (
    <div className={`fixed top-0 right-0 h-full z-40 transform ${open ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300`} style={{ width }}>
      <div className="h-full bg-slate-900 border-l border-slate-800 p-4 overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">Details</div>
          <button onClick={onClose} className="text-slate-400">✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
