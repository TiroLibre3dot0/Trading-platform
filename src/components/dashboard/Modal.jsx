import React from 'react';

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-800 rounded p-6 w-96 z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">{title}</div>
          <button onClick={onClose} className="text-slate-400">✕</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
