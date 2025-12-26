import React from 'react';

interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  children?: React.ReactNode;
}

export default function Modal({ open, title, onClose, onConfirm, confirmLabel = 'Confirm', children }: ModalProps){
  if(!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 z-10 w-96">
        {title && <div className="text-lg font-semibold mb-2">{title}</div>}
        <div className="text-sm text-slate-300">{children}</div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 rounded bg-slate-800">Cancel</button>
          {onConfirm && <button onClick={onConfirm} className="px-3 py-2 rounded bg-emerald-600 text-black">{confirmLabel}</button>}
        </div>
      </div>
    </div>
  );
}
