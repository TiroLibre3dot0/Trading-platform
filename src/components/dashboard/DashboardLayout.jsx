import React from 'react';
import TopNavbar from '../layout/TopNavbar';
import PrimarySidebar from '../layout/PrimarySidebar';
import SecondarySidebar from '../layout/SecondarySidebar';

// DashboardLayout handles the fixed viewport layout: sticky navbar, left sidebars and main area.
export default function DashboardLayout({ children, menuCollapsed, setMenuCollapsed, secondaryOpen, setSecondaryOpen, primarySelection, setPrimarySelection, secondarySelection, setSecondarySelection, selectedAccount, setSelectedAccount, onSettings, onMenuToggle }) {
  const handleMenuToggle = () => {
    if (typeof onMenuToggle === 'function') return onMenuToggle();
    setMenuCollapsed(v => !v);
    setSecondaryOpen(v => !v);
  };

  return (
    <div className="h-screen bg-slate-950 text-slate-200 overflow-hidden">
      <TopNavbar selectedAccountId={selectedAccount} onAccountChange={setSelectedAccount} onSettings={onSettings || (()=>{})} onMenuToggle={handleMenuToggle} />

      <div className="h-[calc(100vh-64px)] flex overflow-hidden">
        <div className="flex" style={{minWidth:0}}>
          <PrimarySidebar collapsed={menuCollapsed} active={primarySelection} onSelect={setPrimarySelection} onToggleMenu={handleMenuToggle} />
          <SecondarySidebar open={secondaryOpen} onClose={() => { setSecondaryOpen(false); setMenuCollapsed(false); }} active={secondarySelection} onSelect={setSecondarySelection} />
        </div>

        <main className="flex-1 p-4 overflow-hidden" style={{minWidth:0}}>
          {children}
        </main>
      </div>
    </div>
  );
}
