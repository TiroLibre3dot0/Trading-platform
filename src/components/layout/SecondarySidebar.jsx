import React, { useState } from 'react';
import { User, LogOut, Settings, ChevronDown, ChevronRight, UserCheck, FileText, Shield, BarChart3, Download, MessageSquare, HelpCircle, Settings2, ToggleLeft, ToggleRight, Crown, Star, Award } from 'lucide-react';
import mock from '../../mock/userDashboardMock';

export default function SecondarySidebar({ open, onClose, active, onSelect }) {
  const [expandedSections, setExpandedSections] = useState({
    account: true,
    tools: false,
    help: false,
    settings: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => {
      const isCurrentlyExpanded = prev[section];
      const newState = { ...prev };
      
      // Close all sections first
      Object.keys(newState).forEach(key => {
        newState[key] = false;
      });
      
      // If the clicked section was closed, open it
      if (!isCurrentlyExpanded) {
        newState[section] = true;
      }
      
      return newState;
    });
  };

  const menuSections = [
    {
      key: 'account',
      title: 'Account',
      icon: User,
      items: [
        { key: 'profile', label: 'Profile', icon: User },
        { key: 'personal-info', label: 'Personal information', icon: UserCheck },
        { key: 'verification', label: 'Verification / KYC', icon: Shield },
        { key: 'documents', label: 'Documents', icon: FileText }
      ]
    },
    {
      key: 'tools',
      title: 'Tools',
      icon: BarChart3,
      items: [
        { key: 'statements', label: 'Statements', icon: FileText },
        { key: 'reports', label: 'Reports', icon: BarChart3 },
        { key: 'download-history', label: 'Download history', icon: Download }
      ]
    },
    {
      key: 'help',
      title: 'Help',
      icon: HelpCircle,
      items: [
        { key: 'support', label: 'Support', icon: MessageSquare },
        { key: 'faq', label: 'FAQ', icon: HelpCircle },
        { key: 'contact', label: 'Contact', icon: MessageSquare }
      ]
    },
    {
      key: 'settings',
      title: 'Settings',
      icon: Settings2,
      items: [
        { key: 'preferences', label: 'Preferences', icon: Settings2 },
        { key: 'notifications', label: 'Notifications', icon: Settings },
        { key: 'security', label: 'Security', icon: Shield }
      ]
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      Premium: { 
        bg: 'bg-gradient-to-r from-blue-900/60 to-blue-800/60', 
        border: 'border-blue-500/50', 
        text: 'text-blue-200', 
        icon: Crown,
        glow: 'shadow-blue-500/20'
      },
      Elite: { 
        bg: 'bg-gradient-to-r from-purple-900/60 to-purple-800/60', 
        border: 'border-purple-500/50', 
        text: 'text-purple-200', 
        icon: Star,
        glow: 'shadow-purple-500/20'
      },
      Top: { 
        bg: 'bg-gradient-to-r from-amber-900/60 to-amber-800/60', 
        border: 'border-amber-500/50', 
        text: 'text-amber-200', 
        icon: Award,
        glow: 'shadow-amber-500/20'
      }
    };
    return statusConfig[status] || statusConfig.Premium;
  };

  const statusConfig = getStatusBadge(mock.user.status);

  return (
    <aside className={`bg-theme-primary border-r border-theme-secondary p-0 flex flex-col transition-all duration-300 ${open ? 'w-64 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-4 overflow-hidden'}`} data-tour="navigator">

      {/* User Identity Block */}
      <div className="p-4 bg-theme-secondary/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-12 w-12 rounded-full bg-theme-tertiary flex items-center justify-center text-lg font-semibold text-theme-primary">
            {mock.user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-theme-primary text-sm truncate">{mock.user.name}</div>
            <div className="text-xs text-theme-secondary truncate">{mock.user.email}</div>
          </div>
        </div>
        <div 
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border cursor-pointer hover:scale-105 transition-all duration-200 shadow-lg ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text} ${statusConfig.glow}`}
          onClick={() => onSelect && onSelect('premium')}
          title="Click to view Premium Rewards"
        >
          <statusConfig.icon className="w-3 h-3" />
          <span>{mock.user.status}</span>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="flex-1 overflow-hidden">
        {menuSections.map(section => {
          const Icon = section.icon;
          const isExpanded = expandedSections[section.key];

          return (
            <div key={section.key} className="mb-1">
              <button
                onClick={() => toggleSection(section.key)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-theme-secondary/50 transition-colors rounded-lg mx-2"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-theme-secondary" />
                  <span className="text-sm font-medium text-theme-primary">{section.title}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-theme-secondary" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-theme-secondary" />
                )}
              </button>

              {isExpanded && (
                <div className="px-2 pb-2">
                  {section.items.map(item => {
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.key}
                        onClick={() => onSelect && onSelect(item.key)}
                        className={`w-full text-left px-3 py-2 rounded text-sm flex items-center gap-3 transition-colors ${
                          active === item.key
                            ? 'bg-blue-600/10 text-blue-400 border-r-2 border-blue-600'
                            : 'text-theme-secondary hover:bg-theme-secondary hover:text-theme-primary'
                        }`}
                      >
                        <ItemIcon className="w-4 h-4 text-theme-secondary" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 space-y-3">
        <button className="w-full px-3 py-2 bg-theme-secondary hover:bg-theme-tertiary rounded text-sm text-theme-secondary flex items-center justify-center gap-2 transition-colors">
          <ToggleRight className="w-4 h-4" />
          Switch to Demo
        </button>
        <button
          onClick={() => onSelect && onSelect('logout')}
          className="w-full px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded text-sm text-red-400 flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
