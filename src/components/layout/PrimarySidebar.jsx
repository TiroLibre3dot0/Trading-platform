import React from 'react';
import { User, Zap, BarChart2, TrendingUp, Wallet, List, Activity, Star, Sun, Moon } from 'lucide-react';
import { useAppPreferences } from '../../context/AppPreferencesContext';

const IconWrap = ({ children }) => (
  <div className="h-8 w-8 flex items-center justify-center text-theme-primary">{children}</div>
);

export default function PrimarySidebar({ collapsed, active, onSelect, onToggleMenu, secondaryOpen }) {
  const { accountMode, setAccountMode, theme, toggleTheme } = useAppPreferences();

  const items = [
    { id: 'menu', label: 'Menu', icon: User, action: () => onToggleMenu && onToggleMenu() },
    { id: 'trade', label: 'Negotiate', icon: Zap },
    { id: 'open', label: 'Open Positions', icon: TrendingUp },
    { id: 'closed', label: 'Closed Positions', icon: TrendingUp },
    { id: 'funds', label: 'Funds', icon: Wallet },
    { id: 'social', label: 'Social Trading', icon: Star },
    { id: 'support', label: 'Support', icon: Activity }
  ];

  return (
    <aside className={`bg-theme-primary border-r border-theme-secondary flex flex-col ${collapsed || secondaryOpen ? 'w-20' : 'w-64'} transition-all duration-300 ease-in-out`}>
      <div className="p-3 flex items-center justify-between">
        {!(collapsed || secondaryOpen) && <div className="text-xs text-theme-secondary uppercase tracking-wide">Navigation</div>}
        <div className="text-xs text-theme-secondary"> </div>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-1 overflow-auto panel-scroll relative">
        {items.map(it => (
          <button key={it.id} onClick={() => (it.action ? it.action() : onSelect && onSelect(it.id))} className={`w-full flex items-center gap-3 rounded px-3 py-2 text-left hover:bg-theme-secondary transition-colors ${active===it.id ? 'bg-blue-600/10 border-r-2 border-blue-600' : ''}`}>
            <IconWrap><it.icon className="w-5 h-5 text-theme-secondary" /></IconWrap>
            {!(collapsed || secondaryOpen) && <span className={`text-theme-secondary ${active===it.id ? 'text-blue-400 font-medium' : ''}`}>{it.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-3 space-y-4">
        <div className="flex items-center justify-between">
          {!(collapsed || secondaryOpen) && <div className="text-xs text-theme-secondary uppercase tracking-wide">Account</div>}
          {!(collapsed || secondaryOpen) && <div className="text-xs text-theme-secondary">{accountMode==='live' ? 'Live' : 'Demo'}</div>}
        </div>
        <div className="flex gap-2">
          <button onClick={()=>setAccountMode('live')} className={`flex-1 px-2 py-2 rounded text-sm transition-all duration-200 ${accountMode==='live' ? 'bg-blue-600 text-white' : 'bg-theme-secondary text-theme-secondary hover:bg-theme-tertiary'}`}>{!(collapsed || secondaryOpen) ? 'Live' : 'L'}</button>
          <button onClick={()=>setAccountMode('demo')} className={`flex-1 px-2 py-2 rounded text-sm transition-all duration-200 ${accountMode==='demo' ? 'bg-blue-600 text-white' : 'bg-theme-secondary text-theme-secondary hover:bg-theme-tertiary'}`}>{!(collapsed || secondaryOpen) ? 'Demo' : 'D'}</button>
        </div>

        <div className="flex items-center justify-between">
          <button onClick={() => onSelect && onSelect('support')} className="px-2 py-2 rounded bg-theme-secondary hover:bg-theme-tertiary w-full text-left text-theme-secondary transition-all duration-200 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            {!(collapsed || secondaryOpen) && <span>Support</span>}
          </button>
        </div>

        <div className="flex items-center justify-between">
          {!(collapsed || secondaryOpen) && <div className="text-xs text-theme-secondary uppercase tracking-wide">Theme</div>}
          <button
            onClick={() => toggleTheme()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-theme-secondary hover:bg-theme-tertiary transition-all duration-200"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-yellow-400" />
                {!(collapsed || secondaryOpen) && <span className="text-sm text-theme-secondary">Light</span>}
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-blue-400" />
                {!(collapsed || secondaryOpen) && <span className="text-sm text-theme-secondary">Dark</span>}
              </>
            )}
          </button>
        </div>

        {!(collapsed || secondaryOpen) && <div className="text-theme-secondary text-xs pt-2">© Bullwaves</div>}
      </div>
    </aside>
  );
}
