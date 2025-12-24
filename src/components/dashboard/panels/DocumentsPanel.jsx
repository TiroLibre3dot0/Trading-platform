import React from 'react';

export default function DocumentsPanel({ compliance }){
  return (
    <div className="bg-slate-900 border border-slate-800 rounded p-4 h-full">
      <div className="text-lg font-semibold mb-2">Documents & KYC</div>
      <div className="text-slate-400 text-sm mb-3">Status</div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-slate-100">ID Verification</div>
          <div className={`text-xs ${compliance.idVerification==='verified' ? 'text-emerald-400' : 'text-amber-400'}`}>{compliance.idVerification}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-slate-100">Proof of Address</div>
          <div className={`text-xs ${compliance.address==='verified' ? 'text-emerald-400' : 'text-amber-400'}`}>{compliance.address}</div>
        </div>
      </div>
    </div>
  );
}
