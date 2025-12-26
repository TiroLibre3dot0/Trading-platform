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
    <div className="h-screen bg-theme-background text-theme-primary overflow-hidden">
      <TopNavbar selectedAccountId={selectedAccount} onAccountChange={setSelectedAccount} onMenuToggle={handleMenuToggle} />

      <div className="h-[calc(100vh-72px)] flex overflow-hidden relative">
        <div className="flex" style={{minWidth:0}}>
          <PrimarySidebar collapsed={menuCollapsed || secondaryOpen} active={primarySelection} onSelect={setPrimarySelection} onToggleMenu={handleMenuToggle} secondaryOpen={secondaryOpen} />
          <SecondarySidebar open={secondaryOpen} onClose={() => { setSecondaryOpen(false); setMenuCollapsed(false); }} active={secondarySelection} onSelect={setSecondarySelection} />
        </div>

        <main className="flex-1 overflow-hidden transition-all duration-300 relative" style={{minWidth:0}}>
          <div className="h-full p-6 relative z-0">
            {children}
          </div>
          {/* Overlay for secondary sidebar */}
          {secondaryOpen && (
            <div 
              className="absolute inset-0 bg-black/5 backdrop-blur-[0.5px] z-20"
              onClick={() => { setSecondaryOpen(false); setMenuCollapsed(false); }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
