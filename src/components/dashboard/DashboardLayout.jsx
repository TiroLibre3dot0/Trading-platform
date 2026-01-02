import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift } from 'lucide-react';
import TopNavbar from '../layout/TopNavbar';
import PrimarySidebar from '../layout/PrimarySidebar';
import SecondarySidebar from '../layout/SecondarySidebar';

// DashboardLayout handles the fixed viewport layout: sticky navbar, left sidebars and main area.
export default function DashboardLayout({ children, menuCollapsed, setMenuCollapsed, secondaryOpen, setSecondaryOpen, primarySelection, setPrimarySelection, secondarySelection, setSecondarySelection, selectedAccount, setSelectedAccount, onSettings, onMenuToggle }) {
  const navigate = useNavigate();

  const NAVBAR_H = 72;
  const BANNER_H = 0;

  const PROMO_MIN_DEPOSIT_EUR = 500;
  const PROMO_BONUS_EUR = 300;
  const PROMO_CODE = 'BW300';

  const promoText =
    `Fund your account with at least €${PROMO_MIN_DEPOSIT_EUR} and get a €${PROMO_BONUS_EUR} bonus. Promo code: ${PROMO_CODE}. T&Cs apply.`;

  const handleMenuToggle = () => {
    if (typeof onMenuToggle === 'function') return onMenuToggle();
    setMenuCollapsed(v => !v);
    setSecondaryOpen(v => !v);
  };

  const goToDeposits = () => {
    try {
      navigate(`/funds?tab=deposits&amount=${PROMO_MIN_DEPOSIT_EUR}&promo=${encodeURIComponent(PROMO_CODE)}`);
    } catch (_err) {
      // ignore
    }
  };

  return (
    <div className="h-screen bg-theme-background text-theme-primary overflow-hidden">
      <TopNavbar selectedAccountId={selectedAccount} onAccountChange={setSelectedAccount} onMenuToggle={handleMenuToggle} />

      {/* Floating promo banner */}
      <div
        className="fixed inset-x-4 md:inset-x-6 z-30 pointer-events-none"
        style={{ top: `${NAVBAR_H + 12}px` }}
      >
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <div
            className="bg-theme-tertiary/90 text-theme-primary border border-theme-secondary/20 rounded-full px-4 py-2 md:px-5 md:py-2.5 shadow-lg backdrop-blur flex items-center gap-3 min-w-0 cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={goToDeposits}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') goToDeposits();
            }}
            title={promoText}
            aria-label={promoText}
          >
            <Gift className="w-4 h-4 flex-shrink-0 text-blue-400" />
            <div className="min-w-0 text-sm md:text-base font-medium truncate">
              {promoText}
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex overflow-hidden relative"
        style={{ height: `calc(var(--app-vh, 1vh) * 100 - ${NAVBAR_H + BANNER_H}px)` }}
      >
        <div className="md:flex hidden" style={{minWidth:0}}>
          <PrimarySidebar collapsed={menuCollapsed || secondaryOpen} active={primarySelection} onSelect={setPrimarySelection} onToggleMenu={handleMenuToggle} secondaryOpen={secondaryOpen} />
          <SecondarySidebar open={secondaryOpen} onClose={() => { setSecondaryOpen(false); setMenuCollapsed(false); }} active={secondarySelection} onSelect={setSecondarySelection} />
        </div>

        <main className="flex-1 overflow-y-auto md:overflow-hidden transition-all duration-300 relative" style={{minWidth:0}}>
          <div className="h-full min-h-0 p-3 md:p-6 relative z-0">
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

        {/* Mobile Menu Overlay */}
        {(secondaryOpen || !menuCollapsed) && (
          <div className="fixed inset-0 z-50 md:hidden" style={{top: `${NAVBAR_H + BANNER_H}px`}}>
              <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => { setSecondaryOpen(false); setMenuCollapsed(true); }}
              />
              <div className="relative flex h-full">
                <PrimarySidebar collapsed={false} active={primarySelection} onSelect={(id) => { setPrimarySelection(id); setSecondaryOpen(false); setMenuCollapsed(true); }} onToggleMenu={handleMenuToggle} secondaryOpen={secondaryOpen} />
                {secondaryOpen && (
                  <SecondarySidebar open={true} onClose={() => { setSecondaryOpen(false); setMenuCollapsed(true); }} active={secondarySelection} onSelect={(key) => { setSecondarySelection(key); setSecondaryOpen(false); setMenuCollapsed(true); }} />
                )}
              </div>
            </div>
        )}
      </div>
    </div>
  );
}
