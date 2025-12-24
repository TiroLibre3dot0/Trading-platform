import React, { useState } from 'react';

export default function AlertsCompliance({ alerts, kyc }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-slate-100 font-semibold">Alerts & Compliance</div>
        <button onClick={() => setOpen(v => !v)} className="text-slate-400 text-xs">{open ? 'Collapse' : 'Expand'}</button>
      </div>
      {open && (
        <div className="space-y-2 text-sm">
          <div className="text-slate-200">KYC</div>
          <div className="text-xs text-slate-400">ID: {kyc.idVerification} • Address: {kyc.proofOfAddress}</div>
          <div className="pt-2">
            {alerts.map(a => (
              <div key={a.id} className={`p-2 rounded ${a.level==='warning' ? 'bg-amber-900/20 text-amber-300' : 'bg-slate-800 text-slate-300'}`}>
                {a.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
