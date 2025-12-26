import React, { useState, useEffect, useRef } from 'react';
import { accounts, user } from '../../mock/dashboardMock';
import mock from '../../mock/userDashboardMock';
import { useAppPreferences } from '../../context/AppPreferencesContext';
import { Bell, User, CheckCircle, AlertTriangle, TrendingUp, Shield, ChevronDown } from 'lucide-react';

const UserAvatar = ({ name }) => (
  <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold text-white">{name.split(' ')[0][0]}</div>
);

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: 'success',
    icon: CheckCircle,
    title: 'Trade Executed',
    message: 'EUR/USD buy order filled at 1.0825',
    timestamp: '2 min ago',
    read: false
  },
  {
    id: 2,
    type: 'warning',
    icon: AlertTriangle,
    title: 'Margin Warning',
    message: 'Your margin level is below 20%',
    timestamp: '15 min ago',
    read: false
  },
  {
    id: 3,
    type: 'info',
    icon: TrendingUp,
    title: 'New Social Trader',
    message: 'ProTrader123 started following you',
    timestamp: '1 hour ago',
    read: true
  },
  {
    id: 4,
    type: 'success',
    icon: Shield,
    title: 'Verification Complete',
    message: 'Your account verification is now complete',
    timestamp: '2 hours ago',
    read: true
  }
];

export default function TopNavbar({ selectedAccountId, onAccountChange, onMenuToggle }) {
  const acct = accounts.find(a => a.id === selectedAccountId) || accounts[0];
  const { accountMode } = useAppPreferences();
  const acctData = mock.accounts.find(a => (accountMode==='demo' ? a.type==='Demo' : a.type==='Live')) || mock.accounts[0];
  const kpis = mock.kpis || {};
  const display = accountMode === 'demo' ? mock.accounts.find(a=>a.type==='Demo') : mock.accounts.find(a=>a.type==='Live');
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const notificationsRef = useRef(null);
  const accountDropdownRef = useRef(null);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        setShowAccountDropdown(false);
      }
    };

    if (showNotifications || showAccountDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showAccountDropdown]);

  const unreadCount = mockNotifications.filter(n => !n.read).length;
  return (
    <header className="h-18 w-full bg-theme-primary/95 backdrop-blur-sm border-b border-theme-secondary/20 shadow-sm flex items-center px-8 justify-between relative z-40">
      <div className="flex items-center gap-6">
        <img src="/Logo.png" alt="Bullwaves" className="h-8 w-auto" />
      </div>

      <div className="flex items-center gap-12">
        <div className="relative">
          <button
            onClick={() => setShowAccountDropdown(!showAccountDropdown)}
            className="flex items-center gap-2 bg-theme-secondary/50 hover:bg-theme-secondary text-theme-primary text-sm outline-none border border-theme-secondary/30 hover:border-theme-secondary/60 focus:border-theme-primary rounded-lg px-3 py-2 transition-all duration-200"
          >
            <span className="font-medium">Account:</span>
            <span className="text-theme-primary">{acct.id}</span>
            <ChevronDown className={`w-4 h-4 text-theme-secondary transition-transform duration-200 ${showAccountDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Account Dropdown */}
          {showAccountDropdown && (
            <div
              ref={accountDropdownRef}
              className="absolute top-full left-0 mt-2 w-48 bg-theme-secondary backdrop-blur-sm border border-theme-secondary/50 rounded-lg shadow-xl z-50"
            >
              <div className="py-1">
                {accounts.map(account => (
                  <button
                    key={account.id}
                    onClick={() => {
                      onAccountChange && onAccountChange(account.id);
                      setShowAccountDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-theme-tertiary transition-colors ${
                      account.id === acct.id ? 'bg-theme-primary/10 text-theme-primary font-medium' : 'text-theme-primary'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{account.id}</span>
                      <span className="text-theme-secondary text-xs">${account.balance.toLocaleString()}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Financial Metrics - Fluid layout without boxes */}
        <div className="flex items-center gap-12">
          {/* Primary metrics - Equity and Available */}
          <div className="flex items-center gap-10">
            <div className="text-center group">
              <div className="text-xs text-theme-secondary mb-1 uppercase tracking-wide font-medium">Equity</div>
              <div className="text-2xl font-bold text-theme-primary group-hover:scale-105 transition-transform duration-200">${(display?.equity || 0).toLocaleString()}</div>
            </div>
            <div className="text-center group">
              <div className="text-xs text-theme-secondary mb-1 uppercase tracking-wide font-medium">Available</div>
              <div className="text-lg font-semibold text-theme-primary group-hover:scale-105 transition-transform duration-200">${(display?.balance || 0).toLocaleString()}</div>
            </div>
          </div>

          {/* Separator via spacing */}
          <div className="w-px h-12 bg-theme-secondary/30"></div>

          {/* Secondary metrics - P/L and Margin */}
          <div className="flex items-center gap-10">
            <div className="text-center group">
              <div className="text-xs text-theme-secondary mb-1 uppercase tracking-wide font-medium">P/L</div>
              <div className={`text-base font-bold group-hover:scale-105 transition-transform duration-200 ${(mock.plLast30 && mock.plLast30>=0) ? 'text-green-400' : 'text-red-400'}`}>
                {mock.plLast30>=0? '+' : ''}${mock.plLast30?.toLocaleString()}
              </div>
            </div>
            <div className="text-center group">
              <div className="text-xs text-theme-secondary mb-1 uppercase tracking-wide font-medium">Margin</div>
              <div className="text-sm text-theme-secondary font-medium group-hover:text-theme-primary transition-colors duration-200">${(mock.kpis?.marginUsed || 0).toLocaleString()}</div>
            </div>
          </div>

          {/* Separator via spacing */}
          <div className="w-px h-10 bg-theme-secondary/20"></div>

          {/* Tertiary metric - Bonus */}
          <div className="text-center">
            <div className="text-xs text-theme-secondary mb-1 uppercase tracking-wide">Bonus</div>
            <div className="text-base text-theme-secondary font-medium">${(mock.kpis?.bonus || 0).toLocaleString()}</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-theme-primary text-sm font-medium">{user.name}</div>
            <div className="text-theme-secondary text-xs">{user.location}</div>
          </div>
          <UserAvatar name={user.name} />
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="p-2.5 rounded-lg bg-theme-secondary/50 hover:bg-theme-secondary hover:shadow-sm transition-all duration-200 relative group"
          >
            <Bell className="w-4 h-4 text-theme-secondary group-hover:text-theme-primary transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full px-1.5 min-w-[18px] h-4 flex items-center justify-center font-semibold shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              ref={notificationsRef}
              className="absolute top-full right-0 mt-3 w-80 bg-theme-secondary backdrop-blur-sm border border-theme-secondary/50 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto animate-in slide-in-from-top-2 duration-200"
            >
              <div className="p-4 border-b border-theme-secondary/30">
                <h3 className="text-sm font-semibold text-theme-primary">Notifications</h3>
                <p className="text-xs text-theme-secondary mt-1">You have {unreadCount} unread notifications</p>
              </div>
              <div className="divide-y divide-theme-secondary/20">
                {mockNotifications.map(notification => {
                  const IconComponent = notification.icon;
                  return (
                    <div key={notification.id} className={`p-4 hover:bg-theme-tertiary/50 transition-all duration-200 cursor-pointer ${!notification.read ? 'bg-blue-600/5 border-l-2 border-blue-500/50' : ''}`}>
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${notification.type === 'success' ? 'bg-green-500/20' : notification.type === 'warning' ? 'bg-yellow-500/20' : 'bg-blue-500/20'} transition-colors`}>
                          <IconComponent className={`w-4 h-4 ${notification.type === 'success' ? 'text-green-400' : notification.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-theme-primary truncate">{notification.title}</h4>
                            <span className="text-xs text-theme-secondary ml-2 flex-shrink-0">{notification.timestamp}</span>
                          </div>
                          <p className="text-xs text-theme-secondary mt-1.5 leading-relaxed">{notification.message}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2 animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 border-t border-theme-secondary/30">
                <button className="w-full text-center text-sm text-theme-secondary hover:text-theme-primary transition-colors py-2 rounded-lg hover:bg-theme-tertiary/30">
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
