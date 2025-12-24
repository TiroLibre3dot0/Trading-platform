import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import DashboardLayout from '../dashboard/DashboardLayout';
import SettingsSlideover from './SettingsSlideover';

export default function AppShell(){
  const navigate = useNavigate();
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [secondaryOpen, setSecondaryOpen] = useState(false);
  const [primarySelection, setPrimarySelection] = useState('trade');
  const [secondarySelection, setSecondarySelection] = useState(null as any);
  const [selectedAccount, setSelectedAccount] = useState('ACC-9981');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handlePrimarySelect = (id:string) => {
    setPrimarySelection(id);
    const map:any = {
      trade: '/trade',
      markets: '/markets',
      open: '/open-positions',
      closed: '/closed-positions',
      funds: '/funds',
      withdrawals: '/withdrawals',
      transactions: '/transactions',
      support: '/support'
    };
    const p = map[id] || '/dashboard';
    navigate(p);
  };

  const handleSecondarySelect = (key:any) => {
    setSecondarySelection(key);
    const normalized = (''+key).toLowerCase();
    if (normalized.includes('overview')) navigate('/dashboard');
    else if (normalized.includes('premium')) navigate('/premium');
    else if (normalized.includes('social')) navigate('/social');
    else if (normalized.includes('document')) navigate('/documents');
    else if (normalized.includes('statement')) navigate('/statements');
    else if (normalized.includes('profile')) navigate('/profile');
    else if (normalized.includes('security')) navigate('/security');
  };

  const handleMenuToggle = () => {
    setMenuCollapsed(v => !v);
    setSecondaryOpen(v => !v);
  };

  return (
    <>
      <DashboardLayout
        menuCollapsed={menuCollapsed}
        setMenuCollapsed={setMenuCollapsed}
        secondaryOpen={secondaryOpen}
        setSecondaryOpen={setSecondaryOpen}
        primarySelection={primarySelection}
        setPrimarySelection={handlePrimarySelect}
        secondarySelection={secondarySelection}
        setSecondarySelection={handleSecondarySelect}
        selectedAccount={selectedAccount}
        setSelectedAccount={setSelectedAccount}
        onSettings={() => setSettingsOpen(true)}
        onMenuToggle={handleMenuToggle}
      >
        <div className="h-full min-w-0 flex flex-col">
          <div className="flex-1 overflow-hidden min-w-0">
            <Outlet />
          </div>
        </div>
      </DashboardLayout>

      <SettingsSlideover open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
