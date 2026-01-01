import React, { useState, useEffect, useRef } from 'react';
import { accounts, user } from '../../mock/dashboardMock';
import mock from '../../mock/userDashboardMock';
import { useAppPreferences } from '../../context/AppPreferencesContext';
import { Bell, User, CheckCircle, AlertTriangle, TrendingUp, Shield, ChevronDown, Eye, EyeOff, Crown, Star, Menu, XCircle } from 'lucide-react';

const UserAvatar = ({ name }) => (
  <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold text-white">{name.split(' ')[0][0]}</div>
);

// Professional number formatting function - minimal style
const formatCurrency = (value, showSign = false) => {
  const num = Number(value) || 0;
  const formatted = Math.abs(num).toLocaleString('en-US');
  
  if (showSign) {
    if (num > 0) return `+$${formatted}`;
    if (num < 0) return `-$${formatted}`;
    return `$${formatted}`;
  }
  
  return `$${formatted}`;
};

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

// Mock economic data
const mockEconomicData = [
  {
    id: 1,
    country: 'United States',
    indicator: 'Non-Farm Payrolls',
    value: '216K',
    expected: '200K',
    previous: '199K',
    impact: 'high',
    time: '8:30 AM',
    date: 'Jan 5, 2024'
  },
  {
    id: 2,
    country: 'Eurozone',
    indicator: 'CPI m/m',
    value: '0.1%',
    expected: '0.1%',
    previous: '0.1%',
    impact: 'high',
    time: '11:00 AM',
    date: 'Jan 5, 2024'
  },
  {
    id: 3,
    country: 'United Kingdom',
    indicator: 'GDP q/q',
    value: '0.3%',
    expected: '0.2%',
    previous: '0.2%',
    impact: 'medium',
    time: '7:00 AM',
    date: 'Jan 5, 2024'
  },
  {
    id: 4,
    country: 'Japan',
    indicator: 'Unemployment Rate',
    value: '2.4%',
    expected: '2.5%',
    previous: '2.5%',
    impact: 'medium',
    time: '12:30 AM',
    date: 'Jan 5, 2024'
  },
  {
    id: 5,
    country: 'Canada',
    indicator: 'CPI m/m',
    value: '0.2%',
    expected: '0.2%',
    previous: '0.1%',
    impact: 'medium',
    time: '8:30 AM',
    date: 'Jan 5, 2024'
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
  const [hideNumbers, setHideNumbers] = useState(false);
  const [showEconomicData, setShowEconomicData] = useState(false);
  const notificationsRef = useRef(null);
  const accountDropdownRef = useRef(null);

  // User status effects configuration
  const getStatusEffect = (status) => {
    switch (status) {
      case 'Premium':
        return {
          glowColor: 'rgba(59, 130, 246, 0.9)',
          shimmerColor: 'rgba(59, 130, 246, 0.8)',
          textColor: 'text-blue-300',
          bgColor: 'bg-blue-500/18',
          borderColor: 'border-blue-500/45',
          icon: Crown
        };
      case 'Next':
        return {
          glowColor: 'rgba(245, 158, 11, 0.9)',
          shimmerColor: 'rgba(245, 158, 11, 0.8)',
          textColor: 'text-amber-300',
          bgColor: 'bg-amber-500/18',
          borderColor: 'border-amber-500/45',
          icon: Star
        };
      case 'Elite':
        return {
          glowColor: 'rgba(34, 197, 94, 0.9)',
          shimmerColor: 'rgba(34, 197, 94, 0.8)',
          textColor: 'text-green-200',
          bgColor: 'bg-green-500/18',
          borderColor: 'border-green-500/45',
          icon: Star
        };
      default:
        return {
          glowColor: 'rgba(255, 255, 255, 0.7)',
          shimmerColor: 'rgba(255, 255, 255, 0.6)',
          textColor: 'text-white',
          bgColor: 'bg-gray-600',
          borderColor: 'border-gray-400',
          icon: Star
        };
    }
  };

  const statusEffect = getStatusEffect(user.status);

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
    <header className="h-[72px] w-full bg-theme-primary/95 backdrop-blur-sm border-b border-theme-secondary/10 shadow-sm flex items-center px-4 md:px-8 relative z-40">
      {/* Left section - Logo and Mobile Controls */}
      <div className="flex items-center gap-2 md:gap-6">
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-lg hidden md:flex">
          <img 
            src="/Logo.png" 
            alt="Bullwaves" 
            className="h-10 w-auto transition-all duration-300 hover:scale-105 cursor-pointer"
          />
        </div>

        {/* Mobile Controls Row */}
        <div className="flex md:hidden items-center gap-1">
          {/* Hamburger Menu Button */}
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg bg-theme-secondary/50 hover:bg-theme-secondary hover:shadow-sm transition-all duration-200 group"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-theme-secondary group-hover:text-theme-primary transition-colors" />
          </button>

          {/* Account Button - Thin */}
          <button
            onClick={() => setShowAccountDropdown(!showAccountDropdown)}
            className="h-9 px-2 bg-theme-secondary/50 hover:bg-theme-secondary text-theme-primary text-xs outline-none border border-theme-secondary/30 hover:border-theme-secondary/60 focus:border-theme-primary rounded transition-all duration-200 min-w-[56px]"
          >
            <span className="font-medium truncate">{acct.id}</span>
          </button>

          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="p-2 rounded-lg bg-theme-secondary/50 hover:bg-theme-secondary hover:shadow-sm transition-all duration-200 relative group"
          >
            <Bell className="w-4 h-4 text-theme-secondary group-hover:text-theme-primary transition-colors" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full px-1 min-w-[16px] h-4 flex items-center justify-center font-semibold shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Economic Data Toggle */}
          <button
            onClick={() => setShowEconomicData(true)}
            aria-label="Economic Data"
            className="p-2 rounded-lg bg-theme-secondary/50 hover:bg-theme-secondary hover:shadow-sm transition-all duration-200 group"
            title="View account metrics"
          >
            <Eye className="w-4 h-4 text-theme-secondary group-hover:text-theme-primary transition-colors" />
          </button>
        </div>

        {/* Desktop Hamburger Menu Button */}
        <button
          onClick={onMenuToggle}
          className="hidden md:flex p-2 rounded-lg bg-theme-secondary/50 hover:bg-theme-secondary hover:shadow-sm transition-all duration-200 group"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-theme-secondary group-hover:text-theme-primary transition-colors" />
        </button>
      </div>

      {/* Center section - Financial Metrics */}
      <div className="flex-1 md:flex justify-center hidden">
        <div className="flex items-center gap-16">
        {/* Toggle Numbers Visibility */}
        <button
          onClick={() => setHideNumbers(!hideNumbers)}
          aria-label={hideNumbers ? "Show numbers" : "Hide numbers"}
          className="p-2 rounded-lg bg-theme-secondary/50 hover:bg-theme-secondary hover:shadow-sm transition-all duration-200 group"
          title={hideNumbers ? "Show financial numbers" : "Hide financial numbers"}
        >
          {hideNumbers ? (
            <EyeOff className="w-4 h-4 text-theme-secondary group-hover:text-theme-primary transition-colors" />
          ) : (
            <Eye className="w-4 h-4 text-theme-secondary group-hover:text-theme-primary transition-colors" />
          )}
        </button>

        {/* Financial Metrics - Centered layout */}
        <div className="flex items-center gap-12">
          {/* Primary metrics - Equity and Available */}
          <div className="flex items-center gap-10">
            <div className="text-center group cursor-pointer transition-all duration-300 hover:scale-105 hover:drop-shadow-lg">
              <div className="text-xs text-theme-secondary mb-1 uppercase tracking-wide font-medium bg-gradient-to-r from-theme-secondary to-theme-primary bg-clip-text text-transparent transition-all duration-300 group-hover:from-theme-primary group-hover:to-theme-secondary">
                Equity
              </div>
              <div className="text-lg text-theme-primary font-semibold transition-all duration-300 group-hover:text-theme-primary group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                {hideNumbers ? '••••••' : formatCurrency(display?.equity || 0)}
              </div>
            </div>
            <div className="text-center group cursor-pointer transition-all duration-300 hover:scale-105 hover:drop-shadow-lg">
              <div className="text-xs text-theme-secondary mb-1 uppercase tracking-wide font-medium bg-gradient-to-r from-theme-secondary to-theme-primary bg-clip-text text-transparent transition-all duration-300 group-hover:from-theme-primary group-hover:to-theme-secondary">
                Available
              </div>
              <div className="text-lg text-theme-primary font-semibold transition-all duration-300 group-hover:text-theme-primary group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                {hideNumbers ? '••••••' : formatCurrency(display?.balance || 0)}
              </div>
            </div>
          </div>

          {/* Separator via spacing */}
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-theme-secondary/30 to-transparent transition-all duration-300 hover:via-theme-secondary/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent translate-y-[-100%] hover:translate-y-[100%] transition-transform duration-1000 ease-out"></div>
          </div>

          {/* Secondary metrics - P/L and Margin */}
          <div className="flex items-center gap-10">
            <div className="text-center group cursor-pointer transition-all duration-300 hover:scale-105 hover:drop-shadow-lg">
              <div className="text-xs text-theme-secondary mb-1 uppercase tracking-wide font-medium bg-gradient-to-r from-theme-secondary to-theme-primary bg-clip-text text-transparent transition-all duration-300 group-hover:from-theme-primary group-hover:to-theme-secondary">
                P/L
              </div>
              <div className={`text-lg font-semibold transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] ${
                !hideNumbers && (mock.plLast30 || 0) >= 0 
                  ? 'text-green-400 group-hover:text-green-300 group-hover:drop-shadow-[0_0_12px_rgba(34,197,94,0.4)] animate-pulse' 
                  : 'text-red-400 group-hover:text-red-300 group-hover:drop-shadow-[0_0_12px_rgba(239,68,68,0.4)]'
              }`}>
                {hideNumbers ? '••••••' : formatCurrency(mock.plLast30 || 0, true)}
              </div>
            </div>
            <div className="text-center group cursor-pointer transition-all duration-300 hover:scale-105 hover:drop-shadow-lg">
              <div className="text-xs text-theme-secondary mb-1 uppercase tracking-wide font-medium bg-gradient-to-r from-theme-secondary to-theme-primary bg-clip-text text-transparent transition-all duration-300 group-hover:from-theme-primary group-hover:to-theme-secondary">
                Margin
              </div>
              <div className="text-lg text-theme-primary font-semibold transition-all duration-300 group-hover:text-theme-primary group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                {hideNumbers ? '••••••' : formatCurrency(mock.kpis?.marginUsed || 0)}
              </div>
            </div>
          </div>

          {/* Separator via spacing */}
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-theme-secondary/20 to-transparent transition-all duration-300 hover:via-theme-secondary/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent translate-y-[-100%] hover:translate-y-[100%] transition-transform duration-1000 ease-out"></div>
          </div>

          {/* Tertiary metric - Bonus */}
          <div className="text-center group cursor-pointer transition-all duration-300 hover:scale-105 hover:drop-shadow-lg">
            <div className="text-xs text-theme-secondary mb-1 uppercase tracking-wide font-medium bg-gradient-to-r from-theme-secondary to-theme-primary bg-clip-text text-transparent transition-all duration-300 group-hover:from-theme-primary group-hover:to-theme-secondary">
              Bonus
            </div>
            <div className="text-lg text-theme-primary font-semibold transition-all duration-300 group-hover:text-theme-primary group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] relative">
              {hideNumbers ? '••••••' : formatCurrency(mock.kpis?.bonus || 0)}
              {/* Subtle shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>
            </div>
          </div>
        </div>
        </div>
        </div>

      {/* Right section - Desktop Controls */}
      <div className="hidden md:flex items-center gap-6">
        {/* Toggle Numbers Visibility */}
        <button
          onClick={() => setHideNumbers(!hideNumbers)}
          aria-label={hideNumbers ? "Show numbers" : "Hide numbers"}
          className="p-2 rounded-lg bg-theme-secondary/50 hover:bg-theme-secondary hover:shadow-sm transition-all duration-200 group hover:scale-110 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] animate-pulse"
          title={hideNumbers ? "Show financial numbers" : "Hide financial numbers"}
        >
          {hideNumbers ? (
            <EyeOff className="w-4 h-4 text-theme-secondary group-hover:text-theme-primary transition-colors" />
          ) : (
            <Eye className="w-4 h-4 text-theme-secondary group-hover:text-theme-primary transition-colors" />
          )}
        </button>

        {/* Account Selector */}
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
              className="absolute top-full right-0 mt-2 w-48 bg-theme-secondary backdrop-blur-sm border border-theme-secondary/50 rounded-lg shadow-xl z-50"
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
                      <span className="text-theme-secondary text-xs">
                        {hideNumbers ? '••••••' : formatCurrency(account.balance)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

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

        <UserAvatar name={user.name} />

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

      {/* Economic Data Modal - Full Screen Mobile */}
      {showEconomicData && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden">
          <div className="fixed inset-0 bg-theme-primary flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-theme-secondary/20">
              <h2 className="text-lg font-semibold text-theme-primary">Account Metrics</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHideNumbers(!hideNumbers)}
                  aria-label={hideNumbers ? "Show numbers" : "Hide numbers"}
                  className="p-2 rounded-lg bg-theme-secondary/50 hover:bg-theme-secondary transition-colors"
                  title={hideNumbers ? "Show financial numbers" : "Hide financial numbers"}
                >
                  {hideNumbers ? (
                    <EyeOff className="w-5 h-5 text-theme-secondary" />
                  ) : (
                    <Eye className="w-5 h-5 text-theme-secondary" />
                  )}
                </button>
                <button
                  onClick={() => setShowEconomicData(false)}
                  className="p-2 rounded-lg bg-theme-secondary/50 hover:bg-theme-secondary transition-colors"
                  aria-label="Close"
                >
                  <XCircle className="w-5 h-5 text-theme-secondary" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="bg-theme-secondary/20 border border-theme-secondary/20 rounded-lg p-4">
                <div className="text-xs text-theme-secondary mb-1">Selected account</div>
                <div className="text-sm font-semibold text-theme-primary">{acct.id} • {accountMode === 'demo' ? 'Demo' : 'Live'}</div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-theme-secondary/30 rounded-lg p-4 border border-theme-secondary/20">
                  <div className="text-xs text-theme-secondary mb-1">Equity</div>
                  <div className="text-lg font-semibold text-theme-primary">{hideNumbers ? '••••••' : formatCurrency(display?.equity || 0)}</div>
                </div>
                <div className="bg-theme-secondary/30 rounded-lg p-4 border border-theme-secondary/20">
                  <div className="text-xs text-theme-secondary mb-1">Available</div>
                  <div className="text-lg font-semibold text-theme-primary">{hideNumbers ? '••••••' : formatCurrency(display?.balance || 0)}</div>
                </div>
                <div className="bg-theme-secondary/30 rounded-lg p-4 border border-theme-secondary/20">
                  <div className="text-xs text-theme-secondary mb-1">P/L</div>
                  <div className={`text-lg font-semibold ${
                    hideNumbers ? 'text-theme-primary' : (mock.plLast30 || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {hideNumbers ? '••••••' : formatCurrency(mock.plLast30 || 0, true)}
                  </div>
                </div>
                <div className="bg-theme-secondary/30 rounded-lg p-4 border border-theme-secondary/20">
                  <div className="text-xs text-theme-secondary mb-1">Margin</div>
                  <div className="text-lg font-semibold text-theme-primary">{hideNumbers ? '••••••' : formatCurrency(kpis?.marginUsed || 0)}</div>
                </div>
              </div>

              <div className="mt-3 bg-theme-secondary/30 rounded-lg p-4 border border-theme-secondary/20">
                <div className="text-xs text-theme-secondary mb-1">Bonus</div>
                <div className="text-lg font-semibold text-theme-primary">{hideNumbers ? '••••••' : formatCurrency(kpis?.bonus || 0)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
