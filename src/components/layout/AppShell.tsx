import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import DashboardLayout from '../dashboard/DashboardLayout';
import SettingsSlideover from './SettingsSlideover';
import { DemoProvider, useDemo } from '../../context/DemoContext';
import DemoNarrativa from '../demo/DemoNarrativa';

// Component to render DemoNarrativa with access to demo context
function DemoNarrativaWrapper() {
  const { showDemo } = useDemo();
  return <DemoNarrativa isOpen={showDemo} />;
}

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
      open: '/open-positions',
      closed: '/closed-positions',
      funds: '/funds',
      social: '/social',
      support: '/support'
    };
    const p = map[id] || '/dashboard';
    navigate(p);
  };

  const handleSecondarySelect = (key:any) => {
    setSecondarySelection(key);
    const normalized = (''+key).toLowerCase();
    if (normalized.includes('profile')) navigate('/profile');
    else if (normalized.includes('document')) navigate('/documents');
    else if (normalized.includes('security')) navigate('/security');
    else if (normalized.includes('premium')) navigate('/premium');
  };

  const handleMenuToggle = () => {
    setMenuCollapsed(v => !v);
    setSecondaryOpen(v => !v);
  };

  // handleDemoStart is now handled by the DemoContext in the sidebar

  return (
    <DemoProvider>
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

      <DemoNarrativaWrapper />
      <SettingsSlideover open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </DemoProvider>
  );
}
