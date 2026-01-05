import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import mock from '../mock/userDashboardMock';
import { User, Zap, BarChart2, TrendingUp, List, Wallet, Star, Activity, MessageSquare } from 'lucide-react';
import TradePage from './TradePage';
import { useAppPreferences } from '../context/AppPreferencesContext';

function Header({ title, subtitle, Icon }: { title: string, subtitle?: string, Icon?: any }){
  return (
    <div className="mb-4 flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-slate-300" />}
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        {subtitle && <div className="text-slate-400 text-sm mt-1">{subtitle}</div>}
      </div>
    </div>
  );
}

function Badge({ children, color='slate' }){
  return <span className={`px-2 py-0.5 rounded-full text-xs bg-${color}-800 text-${color}-200`}>{children}</span>;
}

export default function PlaceholderPage({ title }:{title?:string}){
  const location = useLocation();
  const navigate = useNavigate();
  const page = (title||'').toLowerCase();

  const { accountMode } = useAppPreferences();

  // Shared small helpers
  const bonusFormatter = useMemo(() => new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }), []);

  const fmtMoney = (v: any) => typeof v === 'number' ? `$${v.toLocaleString()}` : v;
  const fmtBonus = (v: any) => typeof v === 'number' ? bonusFormatter.format(v) : v;

  const activeAccount = useMemo(() => {
    const desired = accountMode === 'demo' ? 'Demo' : 'Live';
    return mock.accounts.find(a => a.type === desired) || mock.accounts[0];
  }, [accountMode]);

  const derivedFunds = useMemo(() => {
    if (accountMode === 'demo') {
      const total = activeAccount.balance || 0;
      return {
        total,
        available: total,
        marginUsed: 0,
        freeMargin: total,
      };
    }

    const summary = mock.funds?.summary || { total: 0, available: 0, marginUsed: 0 };
    return {
      total: summary.total ?? 0,
      available: summary.available ?? 0,
      marginUsed: summary.marginUsed ?? 0,
      freeMargin: mock.kpis?.freeMargin ?? summary.available ?? 0,
    };
  }, [accountMode, activeAccount]);

  const derivedBonus = accountMode === 'demo' ? 0 : (mock.kpis?.bonus ?? 0);
  const recentInstruments = useMemo(()=> mock.markets.slice(0,10), []);

  // Trade view now extracted to TradePage.tsx

  const SectionTabs = ({ value, onChange, items }: { value: string; onChange: (v: string) => void; items: Array<{ value: string; label: string }> }) => (
    <div className="flex flex-wrap gap-2 mb-4">
      {items.map(it => (
        <button
          key={it.value}
          onClick={() => onChange(it.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            value === it.value ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700/60'
          }`}
        >
          {it.label}
        </button>
      ))}
    </div>
  );

  const PaymentCardIllustration = ({ className }: { className?: string }) => (
    <svg
      viewBox="0 0 200 120"
      className={className}
      role="img"
      aria-label="Credit and debit cards"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Back card (blue) */}
      <rect className="text-blue-400" x="20" y="24" width="140" height="84" rx="14" stroke="currentColor" strokeWidth="3" opacity="0.9" />
      <path className="text-blue-400" d="M28 46h124" stroke="currentColor" strokeWidth="3" opacity="0.35" />

      {/* Front card (emerald) */}
      <rect className="text-emerald-300" x="48" y="12" width="140" height="84" rx="14" stroke="currentColor" strokeWidth="3" opacity="0.95" />
      <path className="text-emerald-300" d="M56 34h124" stroke="currentColor" strokeWidth="3" opacity="0.4" />

      {/* Chip */}
      <rect className="text-amber-300" x="62" y="56" width="46" height="12" rx="6" fill="currentColor" opacity="0.28" />

      {/* Masked number */}
      <rect className="text-slate-200" x="62" y="74" width="10" height="10" rx="5" fill="currentColor" opacity="0.22" />
      <rect className="text-slate-200" x="76" y="74" width="10" height="10" rx="5" fill="currentColor" opacity="0.22" />
      <rect className="text-slate-200" x="90" y="74" width="10" height="10" rx="5" fill="currentColor" opacity="0.22" />
      <rect className="text-slate-200" x="104" y="74" width="10" height="10" rx="5" fill="currentColor" opacity="0.22" />

      <circle className="text-slate-200" cx="154" cy="78" r="10" stroke="currentColor" strokeWidth="3" opacity="0.35" />
      <circle className="text-slate-200" cx="168" cy="78" r="10" stroke="currentColor" strokeWidth="3" opacity="0.35" />
    </svg>
  );

  // Markets view
  const MarketsView = () => {
    const categories = ['all','forex','crypto','indices','commodities'];
    const [cat, setCat] = useState('forex');
    const [selected, setSelected] = useState(mock.markets[0]?.symbol || '');

    const list = useMemo(()=> mock.markets.filter(m => cat==='all' ? true : m.category===cat), [cat]);

    return (
      <div className="h-full min-w-0 p-4">
        <Header title="Markets" subtitle="Discover instruments and trade with price transparency" Icon={BarChart2} />
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex gap-3">
          <div className="w-2/3" style={{minHeight:0}}>
            <div className="flex gap-2 mb-3">
              {categories.map(c=> (
                <button key={c} onClick={()=>setCat(c)} className={`text-xs px-3 py-1 rounded-full ${cat===c? 'bg-slate-700 text-white' : 'bg-transparent text-slate-400'}`}>{c==='all'? 'All' : c.charAt(0).toUpperCase()+c.slice(1)}</button>
              ))}
            </div>
            <table className="w-full text-sm table-fixed">
              <thead>
                <tr className="text-slate-400 text-left text-xs">
                  <th>Symbol</th><th>Bid</th><th>Ask</th><th>Spread</th><th>Daily</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {list.map(m=> (
                  <tr key={m.symbol} onClick={()=>setSelected(m.symbol)} className={`border-t border-slate-800 hover:bg-slate-800 cursor-pointer ${selected===m.symbol ? 'bg-slate-800' : ''}`}>
                    <td className="py-2">{m.symbol}<div className="text-xs text-slate-400">{m.name}</div></td>
                    <td className="py-2">{m.bid}</td>
                    <td className="py-2">{m.ask}</td>
                    <td className="py-2">{m.spread}</td>
                    <td className={`py-2 ${m.changePct>=0? 'text-emerald-300' : 'text-rose-300'}`}>{m.changePct}%</td>
                    <td className="py-2 text-xs text-slate-400">{m.tradable? 'Open' : 'Closed'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="w-1/3 bg-slate-800 p-3 rounded" style={{minHeight:0}}>
            <div className="text-sm text-slate-300">Preview</div>
            {mock.markets.filter(m=>m.symbol===selected).map(m=> (
              <div key={m.symbol} className="mt-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{m.symbol}</div>
                  <div className={`text-sm ${m.changePct>=0? 'text-emerald-300' : 'text-rose-300'}`}>{m.changePct}%</div>
                </div>
                <div className="text-xs text-slate-400 mt-1">{m.name}</div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="bg-slate-900 p-2 rounded">Bid<br/><div className="font-medium">{m.bid}</div></div>
                  <div className="bg-slate-900 p-2 rounded">Ask<br/><div className="font-medium">{m.ask}</div></div>
                </div>
                <div className="mt-4">
                  <button className="w-full py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded transition-colors">Quick Buy</button>
                  <button className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded mt-2 transition-colors">Quick Sell</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Menu (central profile overview)
  const MenuView = () => {
    const user = mock.user;
    const account = mock.accounts?.[0];
    const { accountMode, setAccountMode } = useAppPreferences();
    const initials = (user?.name || 'User')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n: string) => n[0])
      .join('')
      .toUpperCase();

    const InfoRow = ({ label, value }: { label: string; value: any }) => (
      <div className="flex items-center gap-3 py-1.5">
        <div className="text-sm text-slate-300 whitespace-nowrap">{label}</div>
        <div className="flex-1 border-b border-dotted border-slate-600/70" />
        <div className="text-sm font-medium text-slate-100 whitespace-nowrap">{value}</div>
      </div>
    );

    const go = (path: string) => {
      try {
        navigate(path);
      } catch (_err) {
        // ignore
      }
    };

    const QuickAction = ({
      title,
      description,
      onClick,
      primary,
      disabled,
    }: {
      title: string;
      description: string;
      onClick: () => void;
      primary?: boolean;
      disabled?: boolean;
    }) => (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`text-left rounded-2xl p-4 border transition-colors ${
          primary
            ? 'bg-blue-600/15 border-blue-600/30 hover:bg-blue-600/20'
            : 'bg-slate-800/70 border-slate-700/60 hover:bg-slate-700/60'
        } ${disabled ? 'opacity-60 cursor-not-allowed hover:bg-slate-800/70' : ''}`}
      >
        <div className="text-sm font-semibold text-slate-100">{title}</div>
        <div className="text-xs text-slate-400 mt-1">{description}</div>
      </button>
    );

    const SupportCard = () => (
      <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-100">Supporto sempre disponibile</div>
            <div className="text-xs text-slate-400 mt-1">Siamo qui per aiutarti nella fase iniziale di onboarding.</div>
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-center text-slate-200">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          <button
            onClick={() => go('/support')}
            className="px-4 py-3 rounded-2xl bg-slate-800/70 hover:bg-slate-700/60 transition-colors border border-slate-700/60 text-left"
          >
            <div className="text-sm font-medium text-slate-100">Contatta il supporto</div>
            <div className="text-xs text-slate-400 mt-1">Ticket e FAQ — risposta rapida</div>
          </button>
        </div>
      </div>
    );

    return (
      <div className="h-full min-w-0 p-4">
        <Header title="Menu" subtitle="Profile overview" Icon={User} />

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
          <div className="max-w-5xl mx-auto">
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 mb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold">Benvenuto{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</div>
                    <div className="text-xs text-slate-400 mt-1">Se è la tua prima volta, ecco il percorso più semplice per partire.</div>
                  </div>
                  <div className="hidden sm:block">
                    <PaymentCardIllustration className="w-24 h-16" />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <QuickAction
                        title={accountMode === 'live' ? '1) Gestisci account Live' : '1) Crea account Live'}
                        description={accountMode === 'live' ? 'Crea un nuovo account MT5 o aggiorna le credenziali' : 'Serve per tradare con fondi reali su MT5'}
                        onClick={() => go('/account-settings?type=live&platform=mt5')}
                        primary
                      />
                      <QuickAction
                        title="2) Deposita fondi"
                        description="Bonifico o carta (credito/debito)"
                        onClick={() => go('/funds?tab=deposits&method=Credit%20Card')}
                      />
                      <QuickAction
                        title="3) Inizia a tradare"
                        description="Apri Trade e fai la prima operazione"
                        onClick={() => go('/trade')}
                      />
                    </div>
                    <div className="text-[11px] text-slate-400 mt-3">Tip: puoi completare la verifica KYC dal menu laterale (Profile/Verification) quando ti è comodo.</div>
                  </div>

                  <SupportCard />
                </div>
              </div>

              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-slate-800 border border-slate-700/70 flex items-center justify-center text-lg font-semibold text-slate-100">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg font-semibold truncate">{user?.name}</div>
                    <div className="text-xs text-slate-400 truncate">{user?.email}</div>
                    <div className="text-xs text-slate-400 mt-1">Status: <span className="text-slate-200 font-medium">{user?.status}</span></div>
                  </div>
                </div>

                <div className="hidden sm:block">
                  <PaymentCardIllustration className="w-28 h-20" />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                  <div className="text-xs text-slate-400 mb-3">Account snapshot</div>
                  <InfoRow label="Account" value={account?.id || '—'} />
                  <InfoRow label="Modalità" value={accountMode === 'live' ? 'Live' : 'Demo'} />
                  <InfoRow label="Balance" value={fmtMoney(account?.balance ?? '—')} />
                  <InfoRow label="Location" value={user?.location || '—'} />
                  <InfoRow label="Risk profile" value={user?.risk || '—'} />

                  <div className="mt-4 border-t border-slate-700/60 pt-3">
                    <div className="text-xs text-slate-400">Azioni consigliate</div>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        onClick={() => go('/funds?tab=deposits')}
                        className="px-4 py-3 rounded-2xl bg-slate-800/70 hover:bg-slate-700/60 transition-colors border border-slate-700/60 text-left"
                      >
                        <div className="text-sm font-medium text-slate-100">Deposita</div>
                        <div className="text-xs text-slate-400 mt-1">Bonifico o carta credito/debito</div>
                      </button>
                      <button
                        onClick={() => go('/profile')}
                        className="px-4 py-3 rounded-2xl bg-slate-800/70 hover:bg-slate-700/60 transition-colors border border-slate-700/60 text-left"
                      >
                        <div className="text-sm font-medium text-slate-100">Completa verifica</div>
                        <div className="text-xs text-slate-400 mt-1">Carica i documenti KYC</div>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4">
                  <div className="text-xs text-slate-400 mb-3">Verification</div>
                  <div className="text-sm text-slate-200">KYC status</div>
                  <div className="text-xs text-slate-400 mt-1">Check your documents and verification steps in the sidebar.</div>
                  <div className="mt-4 border-t border-slate-700/60 pt-3">
                    <div className="text-xs text-slate-400">Security</div>
                    <div className="text-sm text-slate-200 mt-1">2FA & password</div>
                    <div className="text-xs text-slate-400 mt-1">Review security settings from the menu.</div>
                  </div>
                </div>
              </div>

          </div>
        </div>
      </div>
    );
  };

  // Account Settings (create a new MetaTrader account)
  const AccountSettingsView = () => {
    const { accountMode, setAccountMode } = useAppPreferences();
    const [platform, setPlatform] = useState<'mt5'>(() => {
      const params = new URLSearchParams(location.search);
      const p = (params.get('platform') || '').toLowerCase();
      return p === 'mt5' ? 'mt5' : 'mt5';
    });
    const [type, setType] = useState<'live' | 'demo'>(() => {
      const params = new URLSearchParams(location.search);
      const t = (params.get('type') || '').toLowerCase();
      if (t === 'demo') return 'demo';
      if (t === 'live') return 'live';
      return accountMode === 'demo' ? 'demo' : 'live';
    });
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [investorPassword, setInvestorPassword] = useState('');
    const [investorPasswordConfirm, setInvestorPasswordConfirm] = useState('');
    const [created, setCreated] = useState<null | { id: string; server: string; platform: string; type: string }>(null);

    useEffect(() => {
      // Keep global preference in sync (used elsewhere in UI)
      setAccountMode(type);
    }, [type, setAccountMode]);

    useEffect(() => {
      // Update initial selection when landing with query params
      const params = new URLSearchParams(location.search);
      const t = (params.get('type') || '').toLowerCase();
      if (t === 'demo' || t === 'live') setType(t as any);
      const p = (params.get('platform') || '').toLowerCase();
      if (p === 'mt5') setPlatform('mt5');
    }, [location.search]);

    const passwordOk = password.length >= 8 && password === passwordConfirm;
    const investorOk = investorPassword.length >= 8 && investorPassword === investorPasswordConfirm;

    const canCreate = passwordOk && investorOk;

    const createAccount = () => {
      if (!canCreate) return;
      // Placeholder (no backend): emulate account creation
      const suffix = String(Math.floor(1000 + Math.random() * 9000));
      setCreated({
        id: `MT5-${type.toUpperCase()}-${suffix}`,
        server: type === 'live' ? 'Bullwaves-Live' : 'Bullwaves-Demo',
        platform: platform === 'mt5' ? 'MetaTrader 5' : 'MetaTrader 5',
        type: type === 'live' ? 'Live' : 'Demo',
      });
    };

    const FieldHint = ({ children }: { children: React.ReactNode }) => (
      <div className="text-[11px] text-slate-400 mt-1">{children}</div>
    );

    return (
      <div className="h-full min-w-0 overflow-auto p-4">
        <Header title="Account settings" subtitle="Create a new trading account for MetaTrader" Icon={User} />

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 h-[calc(100%-64px)] overflow-auto flex flex-col">
          <div className="flex-1 overflow-auto" style={{ minHeight: 0 }}>
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold">Create new account</div>
                      <div className="text-xs text-slate-400 mt-1">Select platform, account type, and set your passwords.</div>
                    </div>
                    <div className="hidden sm:block">
                      <PaymentCardIllustration className="w-28 h-20" />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300">Trading platform</label>
                      <select
                        value={platform}
                        onChange={(e) => setPlatform((e.target.value as any) || 'mt5')}
                        className="w-full bg-slate-800/70 border border-slate-700/70 focus:border-slate-500 outline-none p-3 rounded-2xl mt-1 text-slate-100"
                      >
                        <option value="mt5">MetaTrader 5</option>
                      </select>
                      <FieldHint>Clients will operate from MetaTrader 5.</FieldHint>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300">Account type</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        className="w-full bg-slate-800/70 border border-slate-700/70 focus:border-slate-500 outline-none p-3 rounded-2xl mt-1 text-slate-100"
                      >
                        <option value="live">Live</option>
                        <option value="demo">Demo</option>
                      </select>
                      <FieldHint>{type === 'live' ? 'Live account required to trade real funds.' : 'Demo account for practice.'}</FieldHint>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300">Trading password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-800/70 border border-slate-700/70 focus:border-slate-500 outline-none p-3 rounded-2xl mt-1 text-slate-100"
                        placeholder="Minimum 8 characters"
                      />
                      {!passwordOk && password.length > 0 && (
                        <FieldHint>Password must be at least 8 chars and match confirmation.</FieldHint>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300">Confirm trading password</label>
                      <input
                        type="password"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        className="w-full bg-slate-800/70 border border-slate-700/70 focus:border-slate-500 outline-none p-3 rounded-2xl mt-1 text-slate-100"
                        placeholder="Repeat password"
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300">Investor password (read-only)</label>
                      <input
                        type="password"
                        value={investorPassword}
                        onChange={(e) => setInvestorPassword(e.target.value)}
                        className="w-full bg-slate-800/70 border border-slate-700/70 focus:border-slate-500 outline-none p-3 rounded-2xl mt-1 text-slate-100"
                        placeholder="Minimum 8 characters"
                      />
                      {!investorOk && investorPassword.length > 0 && (
                        <FieldHint>Password must be at least 8 chars and match confirmation.</FieldHint>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300">Confirm investor password</label>
                      <input
                        type="password"
                        value={investorPasswordConfirm}
                        onChange={(e) => setInvestorPasswordConfirm(e.target.value)}
                        className="w-full bg-slate-800/70 border border-slate-700/70 focus:border-slate-500 outline-none p-3 rounded-2xl mt-1 text-slate-100"
                        placeholder="Repeat password"
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={createAccount}
                      disabled={!canCreate}
                      className={`min-w-[220px] px-8 py-3 rounded-full font-medium transition-colors ${
                        canCreate ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-700 text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      Create account
                    </button>
                    <button
                      onClick={() => navigate('/support')}
                      className="min-w-[220px] px-8 py-3 rounded-full bg-slate-800 hover:bg-slate-700/70 transition-colors text-slate-100 font-medium border border-slate-700/70"
                    >
                      Need help?
                    </button>
                  </div>

                  {created && (
                    <div className="mt-4 bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4">
                      <div className="text-sm font-semibold text-slate-100">Account created</div>
                      <div className="text-xs text-slate-400 mt-1">Use these details in MetaTrader 5.</div>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <div className="text-slate-300">Account ID</div>
                          <div className="text-slate-100 font-medium">{created.id}</div>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <div className="text-slate-300">Server</div>
                          <div className="text-slate-100 font-medium">{created.server}</div>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <div className="text-slate-300">Type</div>
                          <div className="text-slate-100 font-medium">{created.type}</div>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <div className="text-slate-300">Platform</div>
                          <div className="text-slate-100 font-medium">{created.platform}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4">
                  <div className="text-xs text-slate-400 mb-2">What you need</div>
                  <div className="text-sm text-slate-200">MetaTrader 5 login</div>
                  <div className="text-xs text-slate-400 mt-1">After creating the account, you’ll log in from MT5 using the server and account ID.</div>

                  <div className="mt-4 border-t border-slate-700/60 pt-3">
                    <div className="text-xs text-slate-400">Security tip</div>
                    <div className="text-xs text-slate-400 mt-1">Keep your trading password private. Use the investor password for read-only sharing.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Open Positions
  const OpenPositionsView = () => {
    return (
      <div className="h-full min-w-0 overflow-auto p-4">
        <Header title="Open Positions" subtitle="Monitor and manage your active market exposure in real time" Icon={TrendingUp} />
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 h-[calc(100%-64px)] overflow-auto flex flex-col">
          <div className="overflow-auto" style={{minHeight:0}}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-left text-xs">
                  <th>Symbol</th><th>Dir</th><th>Size</th><th>Entry</th><th>Current</th><th>Unrealized</th><th>SL/TP</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mock.openPositions.map(p=> (
                  <tr key={p.id} className="border-t border-slate-800 hover:bg-slate-800">
                    <td className="py-2">{p.symbol}</td>
                    <td className={`py-2 ${p.side==='Buy' ? 'text-emerald-300' : 'text-rose-300'}`}>{p.side}</td>
                    <td className="py-2">{p.size}</td>
                    <td className="py-2">{p.entry}</td>
                    <td className="py-2">{p.current}</td>
                    <td className={`py-2 ${p.pl>=0? 'text-emerald-300' : 'text-rose-300'}`}>{p.pl>=0? '+' : ''}{p.pl}</td>
                    <td className="py-2 text-xs">SL: - / TP: -</td>
                    <td className="py-2">
                      <button className="px-2 py-1 bg-rose-600 rounded text-xs mr-2">Close</button>
                      <button className="px-2 py-1 bg-slate-800 rounded text-xs">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 border-t border-slate-800 pt-3 flex items-center justify-between text-sm">
            <div>Total exposure: <span className="font-medium">{fmtMoney(derivedFunds.total - derivedFunds.freeMargin)}</span></div>
            <div>Floating P/L: <span className={`font-medium ${mock.positions.reduce((s,p)=>s+p.pl,0)>=0 ? 'text-emerald-300' : 'text-rose-300'}`}>{(mock.positions.reduce((s,p)=>s+p.pl,0))>=0? '+' : ''}{mock.positions.reduce((s,p)=>s+p.pl,0)}</span></div>
          </div>
        </div>
      </div>
    );
  };

  // Closed Positions (derive a history from transactions)
  const ClosedPositionsView = () => {
    const [range, setRange] = useState(30);
    const closed = mock.transactions.filter(t=> t.type==='Trade').slice(0,20);
    const wins = closed.filter(c=> c.amount>0).length;
    const winRate = Math.round(100 * wins / Math.max(1, closed.length));
    const avg = Math.round((closed.reduce((s,c)=>s+c.amount,0))/Math.max(1,closed.length));
    const best = Math.max(...closed.map(c=>c.amount));
    const worst = Math.min(...closed.map(c=>c.amount));

    return (
      <div className="h-full min-w-0 overflow-auto p-4">
        <Header title="Closed Positions" subtitle="Review completed trades, performance and summaries" Icon={TrendingUp} />
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-slate-900 border border-slate-800 rounded p-3">
            <div className="text-xs text-slate-400">Win rate</div>
            <div className="text-2xl font-semibold mt-1">{winRate}%</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded p-3">
            <div className="text-xs text-slate-400">Average P/L</div>
            <div className="text-2xl font-semibold mt-1">{fmtMoney(avg)}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded p-3">
            <div className="text-xs text-slate-400">Best / Worst</div>
            <div className="mt-1">{fmtMoney(best)} / <span className="text-rose-300">{fmtMoney(worst)}</span></div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 h-[calc(100%-220px)] overflow-auto" style={{minHeight:0}}>
          <div className="flex items-center gap-3 mb-3">
            <select value={range} onChange={e=>setRange(Number(e.target.value))} className="bg-slate-800 p-2 rounded text-sm">
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
            </select>
            <select className="bg-slate-800 p-2 rounded text-sm">
              <option>All instruments</option>
              {recentInstruments.map(i=> <option key={i.symbol}>{i.symbol}</option>)}
            </select>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-left text-xs"><th>Symbol</th><th>Side</th><th>Size</th><th>Open</th><th>Close</th><th>Net P/L</th><th>Duration</th></tr>
            </thead>
            <tbody>
              {closed.map((c,idx)=> (
                <tr key={c.id||idx} className="border-t border-slate-800 hover:bg-slate-800">
                  <td className="py-2">{c.symbol || '-'}</td>
                  <td className={`py-2 ${c.amount>0? 'text-emerald-300' : 'text-rose-300'}`}>{c.amount>0? 'Buy' : 'Sell'}</td>
                  <td className="py-2">—</td>
                  <td className="py-2">—</td>
                  <td className="py-2">{c.date}</td>
                  <td className={`py-2 ${c.amount>=0? 'text-emerald-300' : 'text-rose-300'}`}>{fmtMoney(c.amount)}</td>
                  <td className="py-2">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Positions (Open + Closed in one section)
  const PositionsView = () => {
    const path = (location.pathname || '').toLowerCase();
    const [tab, setTab] = useState<'open' | 'closed'>(() => {
      const t = (new URLSearchParams(location.search).get('tab') || '').toLowerCase();
      if (t === 'closed') return 'closed';
      if (t === 'open') return 'open';
      if (path.includes('closed-positions')) return 'closed';
      if (path.includes('open-positions')) return 'open';
      return 'open';
    });

    useEffect(() => {
      const t = (new URLSearchParams(location.search).get('tab') || '').toLowerCase();
      if (t === 'closed') return setTab('closed');
      if (t === 'open') return setTab('open');
      if (path.includes('closed-positions')) return setTab('closed');
      if (path.includes('open-positions')) return setTab('open');
    }, [location.search, path]);

    const closed = mock.transactions.filter(t=> t.type==='Trade').slice(0,20);
    const wins = closed.filter(c=> c.amount>0).length;
    const winRate = Math.round(100 * wins / Math.max(1, closed.length));
    const avg = Math.round((closed.reduce((s,c)=>s+c.amount,0))/Math.max(1,closed.length));

    return (
      <div className="h-full min-w-0 overflow-auto p-4">
        <Header title="Positions" subtitle="Open and closed positions" Icon={TrendingUp} />

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 h-[calc(100%-64px)] flex flex-col overflow-auto">
          <SectionTabs
            value={tab}
            onChange={(v) => setTab(v as any)}
            items={[
              { value: 'open', label: 'Open Positions' },
              { value: 'closed', label: 'Closed Positions' }
            ]}
          />

          {tab === 'open' && (
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="text-xs text-slate-400">
                  Floating P/L:{' '}
                  <span className={`${mock.positions.reduce((s,p)=>s+p.pl,0)>=0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {(mock.positions.reduce((s,p)=>s+p.pl,0))>=0? '+' : ''}{mock.positions.reduce((s,p)=>s+p.pl,0)}
                  </span>
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-auto scrollbar-invisible" style={{minHeight:0}}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 text-left text-xs">
                      <th>Symbol</th><th>Dir</th><th>Size</th><th>Entry</th><th>Current</th><th>Unrealized</th><th>SL/TP</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mock.openPositions.map(p=> (
                      <tr key={p.id} className="border-t border-slate-800 hover:bg-slate-800">
                        <td className="py-2">{p.symbol}</td>
                        <td className={`py-2 ${p.side==='Buy' ? 'text-emerald-300' : 'text-rose-300'}`}>{p.side}</td>
                        <td className="py-2">{p.size}</td>
                        <td className="py-2">{p.entry}</td>
                        <td className="py-2">{p.current}</td>
                        <td className={`py-2 ${p.pl>=0? 'text-emerald-300' : 'text-rose-300'}`}>{p.pl>=0? '+' : ''}{p.pl}</td>
                        <td className="py-2 text-xs">SL: - / TP: -</td>
                        <td className="py-2">
                          <button className="px-2 py-1 bg-rose-600 rounded text-xs mr-2">Close</button>
                          <button className="px-2 py-1 bg-slate-800 rounded text-xs">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 border-t border-slate-800 pt-3 flex items-center justify-between text-sm">
                <div>Total exposure: <span className="font-medium">{fmtMoney(derivedFunds.total - derivedFunds.freeMargin)}</span></div>
                <div>Floating P/L: <span className={`font-medium ${mock.positions.reduce((s,p)=>s+p.pl,0)>=0 ? 'text-emerald-300' : 'text-rose-300'}`}>{(mock.positions.reduce((s,p)=>s+p.pl,0))>=0? '+' : ''}{mock.positions.reduce((s,p)=>s+p.pl,0)}</span></div>
              </div>
            </div>
          )}

          {tab === 'closed' && (
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-slate-800/60 border border-slate-700/60 rounded p-3">
                  <div className="text-xs text-slate-400">Win rate</div>
                  <div className="text-2xl font-semibold mt-1">{winRate}%</div>
                </div>
                <div className="bg-slate-800/60 border border-slate-700/60 rounded p-3">
                  <div className="text-xs text-slate-400">Average P/L</div>
                  <div className="text-2xl font-semibold mt-1">{fmtMoney(avg)}</div>
                </div>
                <div className="bg-slate-800/60 border border-slate-700/60 rounded p-3">
                  <div className="text-xs text-slate-400">Trades</div>
                  <div className="text-2xl font-semibold mt-1">{closed.length}</div>
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-auto scrollbar-invisible" style={{minHeight:0}}>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 text-left text-xs"><th>Symbol</th><th>Side</th><th>Size</th><th>Open</th><th>Close</th><th>Net P/L</th><th>Duration</th></tr>
                  </thead>
                  <tbody>
                    {closed.map((c,idx)=> (
                      <tr key={c.id||idx} className="border-t border-slate-800 hover:bg-slate-800">
                        <td className="py-2">{c.symbol || '-'}</td>
                        <td className={`py-2 ${c.amount>0? 'text-emerald-300' : 'text-rose-300'}`}>{c.amount>0? 'Buy' : 'Sell'}</td>
                        <td className="py-2">—</td>
                        <td className="py-2">—</td>
                        <td className="py-2">{c.date}</td>
                        <td className={`py-2 ${c.amount>=0? 'text-emerald-300' : 'text-rose-300'}`}>{fmtMoney(c.amount)}</td>
                        <td className="py-2">—</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Funds
  const FundsView = () => {
    const [showDeposit, setShowDeposit] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [amountDeposit, setAmountDeposit] = useState(1000);
    const [promoCodeDeposit, setPromoCodeDeposit] = useState('');
    const [amountWithdraw, setAmountWithdraw] = useState(500);
    const [methodDeposit, setMethodDeposit] = useState('Bank Transfer');
    const [methodWithdraw, setMethodWithdraw] = useState('Bank');
    const [notesWithdraw, setNotesWithdraw] = useState('');
    const [tab, setTab] = useState(() => {
      const t = new URLSearchParams(location.search).get('tab');
      const allowed = new Set(['overview', 'deposits', 'withdrawals', 'transactions']);
      return t && allowed.has(t) ? t : 'overview';
    });
    const [selectedTx, setSelectedTx] = useState<any|null>(null);

    useEffect(() => {
      const t = new URLSearchParams(location.search).get('tab');
      const allowed = new Set(['overview', 'deposits', 'withdrawals', 'transactions']);
      if (t && allowed.has(t)) setTab(t);
    }, [location.search]);

    useEffect(() => {
      const params = new URLSearchParams(location.search);
      const amountParam = params.get('amount');
      const promoParam = params.get('promo');
      const methodParam = params.get('method');

      const normalizedPromo = (promoParam || '').trim();
      const parsedAmount = amountParam ? Number(amountParam) : NaN;
      const normalizedMethod = (methodParam || '').trim();

      if (tab === 'deposits' && (normalizedPromo || Number.isFinite(parsedAmount) || normalizedMethod)) {
        if (Number.isFinite(parsedAmount) && parsedAmount > 0) setAmountDeposit(parsedAmount);
        if (normalizedPromo) setPromoCodeDeposit(normalizedPromo);
        if (normalizedMethod) setMethodDeposit(normalizedMethod);
        setShowDeposit(true);
      }
    }, [location.search, tab]);

    const PROMO_REQUIRED_DEPOSIT_EUR = 500;
    const PROMO_BONUS_EUR = 300;
    const PROMO_CODE = 'BW300';
    const promoMatches = promoCodeDeposit.trim().toUpperCase() === PROMO_CODE;
    const promoEligible = promoMatches && Number(amountDeposit) >= PROMO_REQUIRED_DEPOSIT_EUR;

    const openDeposit = (method = 'Bank Transfer') => {
      setMethodDeposit(method);
      setTab('deposits');
      setShowDeposit(true);
    };

    const openWithdraw = (method = 'Bank') => {
      setMethodWithdraw(method);
      setTab('withdrawals');
      setShowWithdraw(true);
    };

    const depositMethodDetail = (method: string) => {
      if (method === 'Bank Transfer') return 'IBAN •••• 8891';
      if (method === 'Credit Card') return 'VISA •••• 4242';
      if (method === 'Crypto') return 'Wallet •••• 9A3F';
      return '';
    };

    const withdrawDestinationDetail = (method: string) => {
      if (method === 'Bank') return 'Bank account • IBAN •••• 8891';
      if (method === 'Card') return 'Debit card • Mastercard •••• 1189';
      if (method === 'Crypto') return 'Crypto wallet • USDT (TRC20) •••• 7B1C';
      return '';
    };

    const applyPromoAndDeposit = () => {
      setAmountDeposit(PROMO_REQUIRED_DEPOSIT_EUR);
      setPromoCodeDeposit(PROMO_CODE);
      openDeposit('Credit Card');
    };

    const SummaryRow = ({ label, value }: { label: string; value: any }) => (
      <div className="flex items-center gap-3 py-1.5">
        <div className="text-sm text-slate-300 whitespace-nowrap">{label}</div>
        <div className="flex-1 border-b border-dotted border-slate-600/70" />
        <div className="text-sm font-medium text-slate-100 whitespace-nowrap">{value}</div>
      </div>
    );

    return (
      <div className="h-full min-w-0 p-4">
        <Header title="Funds" subtitle="Manage your funds, deposits, withdrawals, and transaction history" Icon={Wallet} />
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col">
          <SectionTabs
            value={tab}
            onChange={setTab}
            items={[
              { value: 'overview', label: 'Overview' },
              { value: 'deposits', label: 'Deposits' },
              { value: 'withdrawals', label: 'Withdrawals' },
              { value: 'transactions', label: 'Transactions' }
            ]}
          />

          {tab === 'overview' && (
            <div className="max-w-5xl mx-auto">
                <div className="text-center mt-1 mb-4">
                  <div className="text-lg font-semibold">Funds management</div>
                  <div className="text-xs text-slate-400 mt-1">Deposit, withdraw, and keep track of your account balances.</div>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 md:p-5 max-w-3xl mx-auto">
                  <SummaryRow label="Capital" value={fmtMoney(activeAccount.balance)} />
                  <SummaryRow label="Initial margin" value={fmtMoney(derivedFunds.marginUsed)} />
                  <SummaryRow label="Maintenance margin" value={fmtMoney(Math.round((derivedFunds.marginUsed || 0) * 0.2))} />
                  <SummaryRow label="Live bonus" value={fmtBonus(derivedBonus)} />
                  <SummaryRow label="Pending bonus" value={fmtMoney(0)} />
                  <SummaryRow label="Refunds" value={fmtMoney(0)} />
                  <SummaryRow label="Available to withdraw" value={fmtMoney(derivedFunds.available)} />
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => openDeposit('Bank Transfer')}
                    className="min-w-[220px] px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors text-white font-medium"
                  >
                    Deposit
                  </button>
                  <button
                    onClick={() => openWithdraw('Bank')}
                    className="min-w-[220px] px-8 py-3 rounded-full bg-slate-800 hover:bg-slate-700/70 transition-colors text-slate-100 font-medium border border-slate-700/70"
                  >
                    Withdraw
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
                  <button
                    onClick={applyPromoAndDeposit}
                    className="bg-slate-800/70 hover:bg-slate-700/60 transition-colors border border-slate-700/60 rounded-2xl p-4 text-left"
                    title={`Deposit €${PROMO_REQUIRED_DEPOSIT_EUR} with promo code ${PROMO_CODE}`}
                  >
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-blue-400" />
                      <div className="text-sm font-medium">Bonus offer</div>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Deposit €{PROMO_REQUIRED_DEPOSIT_EUR} → +€{PROMO_BONUS_EUR}</div>
                  </button>

                  <button
                    onClick={() => setTab('transactions')}
                    className="bg-slate-800/70 hover:bg-slate-700/60 transition-colors border border-slate-700/60 rounded-2xl p-4 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <List className="w-4 h-4 text-slate-300" />
                      <div className="text-sm font-medium">Transaction history</div>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">View deposits, withdrawals, and fees</div>
                  </button>

                  <button
                    onClick={() => openDeposit('Credit Card')}
                    className="bg-slate-800/70 hover:bg-slate-700/60 transition-colors border border-slate-700/60 rounded-2xl p-4 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-300" />
                      <div className="text-sm font-medium">Instant deposit</div>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Card top-up with immediate credit</div>
                  </button>

                  <button
                    onClick={() => setTab('deposits')}
                    className="bg-slate-800/70 hover:bg-slate-700/60 transition-colors border border-slate-700/60 rounded-2xl p-4 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-slate-200" />
                      <div className="text-sm font-medium">Payment methods</div>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">Bank transfer, card, crypto</div>
                  </button>
                </div>

                <div className="mt-6 bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4 max-w-4xl mx-auto">
                  <div className="text-xs text-slate-400 mb-2">Recent activity</div>
                  <table className="w-full text-sm">
                    <tbody>
                      {mock.funds.history.slice(0, 10).map(h=> (
                        <tr key={h.id} className="border-t border-slate-700/70">
                          <td className="py-2 text-slate-300">{h.date}</td>
                          <td className="py-2 text-slate-200">{h.method}</td>
                          <td className="py-2 text-slate-100">{fmtMoney(h.amount)}</td>
                          <td className="py-2 text-slate-400 text-xs">{h.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </div>
          )}

          {tab === 'deposits' && (
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between gap-4 mt-1 mb-4">
                  <div>
                    <div className="text-lg font-semibold">Deposits</div>
                    <div className="text-xs text-slate-400 mt-1">Choose a method and review your deposit history.</div>
                  </div>
                  <PaymentCardIllustration className="hidden sm:block w-28 h-20" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                    <div className="text-xs text-slate-400 mb-3">Deposit methods</div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => openDeposit('Bank Transfer')}
                        className="bg-slate-800/70 hover:bg-slate-700/60 transition-colors border border-slate-700/60 rounded-2xl p-4 text-left"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium text-slate-100">Bank Transfer</div>
                            <div className="text-xs text-slate-400 mt-1">SEPA / wire transfer</div>
                          </div>
                          <div className="text-xs text-slate-300 whitespace-nowrap">{depositMethodDetail('Bank Transfer')}</div>
                        </div>
                      </button>
                      <button
                        onClick={() => openDeposit('Credit Card')}
                        className="bg-slate-800/70 hover:bg-slate-700/60 transition-colors border border-slate-700/60 rounded-2xl p-4 text-left"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium text-slate-100">Credit / Debit Card</div>
                            <div className="text-xs text-slate-400 mt-1">Instant top-up • {depositMethodDetail('Credit Card')}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="hidden sm:block px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600/70 to-emerald-500/60 border border-slate-700/60">
                              <div className="text-[10px] text-white/90 leading-none">VISA</div>
                              <div className="text-[11px] text-white font-medium mt-1">•••• 4242</div>
                            </div>
                            <PaymentCardIllustration className="w-14 h-10" />
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() => openDeposit('Crypto')}
                        className="bg-slate-800/70 hover:bg-slate-700/60 transition-colors border border-slate-700/60 rounded-2xl p-4 text-left"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium text-slate-100">Crypto</div>
                            <div className="text-xs text-slate-400 mt-1">USDT / BTC / ETH</div>
                          </div>
                          <div className="text-xs text-slate-300 whitespace-nowrap">{depositMethodDetail('Crypto')}</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4">
                    <div className="text-xs text-slate-400 mb-2">Deposit history</div>
                    <div className="overflow-auto" style={{ maxHeight: 360 }}>
                      <table className="w-full text-sm">
                        <tbody>
                          {mock.funds.history
                            .filter(h => h.amount > 0)
                            .map(h => (
                              <tr key={h.id} className="border-t border-slate-700/70">
                                <td className="py-2 text-slate-300">{h.date}</td>
                                <td className="py-2 text-slate-200">{h.method}</td>
                                <td className="py-2 text-emerald-300">{fmtMoney(h.amount)}</td>
                                <td className="py-2 text-slate-400 text-xs">{h.status}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
            </div>
          )}

          {tab === 'withdrawals' && (
            <div className="flex-1 overflow-auto" style={{ minHeight: 0 }}>
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between gap-4 mt-1 mb-4">
                  <div>
                    <div className="text-lg font-semibold">Withdrawals</div>
                    <div className="text-xs text-slate-400 mt-1">Request a withdrawal and review fees and processing times.</div>
                  </div>
                  <PaymentCardIllustration className="hidden sm:block w-28 h-20" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                    <div className="text-xs text-slate-400 mb-3">Withdrawal request</div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-300">Amount (EUR)</label>
                        <input
                          type="number"
                          value={amountWithdraw}
                          onChange={(e) => setAmountWithdraw(Number(e.target.value))}
                          className="w-full bg-slate-800/70 border border-slate-700/70 focus:border-slate-500 outline-none p-3 rounded-2xl mt-1 text-slate-100"
                          min={0}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300">Destination</label>
                        <select
                          value={methodWithdraw}
                          onChange={(e) => setMethodWithdraw(e.target.value)}
                          className="w-full bg-slate-800/70 border border-slate-700/70 focus:border-slate-500 outline-none p-3 rounded-2xl mt-1 text-slate-100"
                        >
                          <option>Bank</option>
                          <option>Crypto</option>
                          <option>Card</option>
                        </select>
                        <div className="mt-2 flex items-center justify-between gap-3">
                          <div className="text-[11px] text-slate-400">Destination details</div>
                          <div className="text-[11px] text-slate-200 whitespace-nowrap">{withdrawDestinationDetail(methodWithdraw)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs font-medium text-slate-300">Notes (optional)</label>
                      <textarea
                        value={notesWithdraw}
                        onChange={(e) => setNotesWithdraw(e.target.value)}
                        className="w-full bg-slate-800/70 border border-slate-700/70 focus:border-slate-500 outline-none p-3 rounded-2xl mt-1 text-slate-100"
                        rows={4}
                      />
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => {
                          setShowWithdraw(true);
                        }}
                        className="min-w-[220px] px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors text-white font-medium"
                      >
                        Request withdrawal
                      </button>
                      <button
                        onClick={() => openWithdraw(methodWithdraw)}
                        className="min-w-[220px] px-8 py-3 rounded-full bg-slate-800 hover:bg-slate-700/70 transition-colors text-slate-100 font-medium border border-slate-700/70"
                      >
                        Review & confirm
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-4">
                    <div className="text-xs text-slate-400 mb-2">Fees & processing</div>
                    <div className="text-sm text-slate-200">Fees</div>
                    <div className="text-xs text-slate-400 mt-1">Bank: $15, Crypto: 0.0005 BTC, Card: $5</div>
                    <div className="text-sm text-slate-200 mt-4">Processing time</div>
                    <div className="text-xs text-slate-400 mt-1">Bank: 1–3 business days • Crypto: ~1 hour • Card: 1–2 days</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'transactions' && (
            <div className="flex-1 flex">
              <div className="w-full overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 text-left text-xs">
                      <th>ID</th><th>Type</th><th>Ref</th><th>Amount</th><th>Status</th><th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mock.transactions.map(tx=> (
                      <tr key={tx.id} onClick={()=>setSelectedTx(tx)} className="border-t border-slate-800 hover:bg-slate-800 cursor-pointer">
                        <td className="py-2">{tx.id}</td>
                        <td className="py-2">{tx.type}</td>
                        <td className="py-2">{tx.method || '-'}</td>
                        <td className={`py-2 ${tx.amount>=0? 'text-emerald-300' : 'text-rose-300'}`}>{tx.amount>=0? '+' : ''}{tx.amount}</td>
                        <td className="py-2 text-xs">{tx.status}</td>
                        <td className="py-2 text-xs text-slate-400">{tx.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedTx && (
                <div className="w-96 bg-slate-800 p-3 rounded ml-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{selectedTx.id}</div>
                    <div className="text-xs text-slate-400">{selectedTx.status}</div>
                  </div>
                  <div className="text-sm text-slate-300 mt-2">Type: {selectedTx.type}</div>
                  <div className="text-sm text-slate-300 mt-1">Amount: {fmtMoney(selectedTx.amount)}</div>
                  <div className="text-sm text-slate-300 mt-1">Reference: {selectedTx.method}</div>
                  <div className="mt-4">
                    <button onClick={()=>setSelectedTx(null)} className="px-3 py-2 bg-slate-700 rounded">Close</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {showDeposit && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={()=>setShowDeposit(false)} />
            <div className="relative bg-slate-900 border border-slate-700/70 rounded-2xl p-5 z-10 w-full max-w-md shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold tracking-tight">Deposit</div>
                  <div className="text-xs text-slate-400 mt-1">Method: <span className="text-slate-200">{methodDeposit}</span></div>
                </div>
                <button
                  onClick={()=>setShowDeposit(false)}
                  className="h-9 w-9 rounded-full bg-slate-800/80 hover:bg-slate-700/70 transition-colors text-slate-200"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-slate-300">Amount (EUR)</label>
                <input
                  type="number"
                  value={amountDeposit}
                  onChange={e=>setAmountDeposit(Number(e.target.value))}
                  className="w-full bg-slate-800/70 border border-slate-700/70 focus:border-slate-500 outline-none p-3 rounded-2xl mt-1 text-slate-100"
                  min={0}
                />
                <div className="text-[11px] text-slate-400 mt-1">Funds are credited according to the selected method.</div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-slate-300">Promo code (optional)</label>
                <input
                  type="text"
                  value={promoCodeDeposit}
                  onChange={e=>setPromoCodeDeposit(e.target.value)}
                  className="w-full bg-slate-800/70 border border-slate-700/70 focus:border-slate-500 outline-none p-3 rounded-2xl mt-1 uppercase text-slate-100"
                  placeholder={PROMO_CODE}
                />

                {promoCodeDeposit.trim() !== '' && !promoMatches && (
                  <div className="mt-2 text-xs text-rose-300">Invalid promo code.</div>
                )}

                {promoMatches && !promoEligible && (
                  <div className="mt-2 text-xs text-amber-300">Minimum deposit for this promo is €{PROMO_REQUIRED_DEPOSIT_EUR}.</div>
                )}

                {promoEligible && (
                  <div className="mt-2 text-xs text-emerald-300">Promo applied: +€{PROMO_BONUS_EUR} bonus.</div>
                )}
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={()=>{ setShowDeposit(false); }}
                  className={`flex-1 px-5 py-2.5 rounded-full font-medium transition-colors ${promoMatches && !promoEligible ? 'bg-slate-700 text-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                  disabled={promoMatches && !promoEligible}
                >
                  Confirm deposit
                </button>
                <button
                  onClick={()=>setShowDeposit(false)}
                  className="px-5 py-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700/70 transition-colors text-slate-100 border border-slate-700/70"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showWithdraw && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={()=>setShowWithdraw(false)} />
            <div className="relative bg-slate-900 border border-slate-700/70 rounded-2xl p-5 z-10 w-full max-w-md shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold tracking-tight">Withdraw</div>
                  <div className="text-xs text-slate-400 mt-1">Destination: <span className="text-slate-200">{methodWithdraw}</span></div>
                </div>
                <button
                  onClick={()=>setShowWithdraw(false)}
                  className="h-9 w-9 rounded-full bg-slate-800/80 hover:bg-slate-700/70 transition-colors text-slate-200"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-slate-300">Amount (EUR)</label>
                <input
                  type="number"
                  value={amountWithdraw}
                  onChange={e=>setAmountWithdraw(Number(e.target.value))}
                  className="w-full bg-slate-800/70 border border-slate-700/70 focus:border-slate-500 outline-none p-3 rounded-2xl mt-1 text-slate-100"
                  min={0}
                />
                <div className="text-[11px] text-slate-400 mt-1">Processing time depends on the selected destination.</div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-slate-300">Destination</label>
                <select
                  value={methodWithdraw}
                  onChange={e=>setMethodWithdraw(e.target.value)}
                  className="w-full bg-slate-800/70 border border-slate-700/70 focus:border-slate-500 outline-none p-3 rounded-2xl mt-1 text-slate-100"
                >
                  <option>Bank</option>
                  <option>Crypto</option>
                  <option>Card</option>
                </select>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={()=>{ setShowWithdraw(false); }}
                  className="flex-1 px-5 py-2.5 rounded-full font-medium bg-blue-600 hover:bg-blue-500 transition-colors text-white"
                >
                  Confirm withdrawal
                </button>
                <button
                  onClick={()=>setShowWithdraw(false)}
                  className="px-5 py-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700/70 transition-colors text-slate-100 border border-slate-700/70"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Withdrawals
  const WithdrawalsView = () => {
    const [amount, setAmount] = useState(500);
    const [method, setMethod] = useState('Bank');
    const [notes, setNotes] = useState('');

    return (
      <div className="h-full min-w-0 overflow-auto p-4">
        <Header title="Withdrawals" subtitle="Request fund withdrawal" Icon={Wallet} />
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-slate-900 border border-slate-800 rounded p-4">
            <div className="text-sm text-slate-400">Amount</div>
            <input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} className="w-48 bg-slate-800 p-2 rounded mt-1" />
            <div className="text-sm text-slate-400 mt-3">Destination</div>
            <select value={method} onChange={e=>setMethod(e.target.value)} className="bg-slate-800 p-2 rounded mt-1 w-48">
              <option>Bank</option>
              <option>Crypto</option>
              <option>Card</option>
            </select>
            <div className="mt-3 text-sm text-slate-400">Notes</div>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} className="w-full bg-slate-800 p-2 rounded mt-1" rows={4} />
            <div className="mt-4"><button className="px-4 py-2 bg-emerald-600 rounded">Request Withdrawal</button></div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded p-4">
            <div className="text-sm text-slate-400">Fees</div>
            <div className="mt-1">Bank: $15, Crypto: 0.0005 BTC</div>
            <div className="text-sm text-slate-400 mt-3">Processing time</div>
            <div className="mt-1">Bank: 1-3 business days, Crypto: ~1 hour</div>
          </div>
        </div>

        <div className="mt-4 bg-slate-900 border border-slate-800 rounded p-3 overflow-auto" style={{minHeight:0, maxHeight:200}}>
          <div className="text-sm text-slate-400 mb-2">Withdrawal history</div>
          <table className="w-full text-sm">
            <tbody>
              {mock.funds.history.map(h=> (
                <tr key={h.id} className="border-t border-slate-700"><td className="py-2">{h.date}</td><td className="py-2">{fmtMoney(h.amount)}</td><td className="py-2">{h.method}</td><td className="py-2 text-xs">{h.status}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Transactions
  const TransactionsView = () => {
    const [selected, setSelected] = useState<any|null>(null);
    return (
      <div className="h-full min-w-0 overflow-auto p-4">
        <Header title="Transactions" subtitle="Account activity and detailed ledger" Icon={List} />
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 h-[calc(100%-64px)] flex overflow-auto">
          <div className="w-full overflow-auto" style={{minHeight:0}}>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-left text-xs"><th>ID</th><th>Type</th><th>Ref</th><th>Amount</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {mock.transactions.map(tx=> (
                  <tr key={tx.id} onClick={()=>setSelected(tx)} className="border-t border-slate-800 hover:bg-slate-800 cursor-pointer">
                    <td className="py-2">{tx.id}</td>
                    <td className="py-2">{tx.type}</td>
                    <td className="py-2">{tx.method || '-'}</td>
                    <td className={`py-2 ${tx.amount>=0? 'text-emerald-300' : 'text-rose-300'}`}>{tx.amount>=0? '+' : ''}{tx.amount}</td>
                    <td className="py-2 text-xs">{tx.status}</td>
                    <td className="py-2 text-xs text-slate-400">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selected && (
            <div className="w-96 bg-slate-800 p-3 rounded ml-3 overflow-auto" style={{minHeight:0}}>
              <div className="flex items-center justify-between"><div className="font-semibold">{selected.id}</div><div className="text-xs text-slate-400">{selected.status}</div></div>
              <div className="text-sm text-slate-300 mt-2">Type: {selected.type}</div>
              <div className="text-sm text-slate-300 mt-1">Amount: {fmtMoney(selected.amount)}</div>
              <div className="text-sm text-slate-300 mt-1">Reference: {selected.method}</div>
              <div className="mt-4"><button onClick={()=>setSelected(null)} className="px-3 py-2 bg-slate-700 rounded">Close</button></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Support
  const SupportView = () => {
    const [tickets, setTickets] = useState([
      { id: 'T-1', subject: 'Unable to withdraw', category: 'Withdrawals', status: 'Open', updated: '2025-12-22' },
      { id: 'T-2', subject: 'KYC address verification', category: 'Account', status: 'Closed', updated: '2025-12-10' }
    ]);
    const [openForm, setOpenForm] = useState(false);

    return (
      <div className="h-full min-w-0 overflow-auto p-4">
        <Header title="Support" subtitle="Open tickets and customer help resources" Icon={Activity} />
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-slate-900 border border-slate-800 rounded p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-slate-300">Tickets</div>
              <button onClick={()=>setOpenForm(true)} className="px-3 py-1 bg-emerald-600 rounded text-sm">Open new ticket</button>
            </div>
            <div className="overflow-auto" style={{minHeight:0, maxHeight:360}}>
              <table className="w-full text-sm">
                <thead><tr className="text-slate-400 text-left text-xs"><th>Subject</th><th>Category</th><th>Status</th><th>Last update</th></tr></thead>
                <tbody>{tickets.map(t=> <tr key={t.id} className="border-t border-slate-800"><td className="py-2">{t.subject}</td><td className="py-2">{t.category}</td><td className="py-2">{t.status}</td><td className="py-2 text-xs">{t.updated}</td></tr>)}</tbody>
              </table>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded p-3">
            <div className="text-sm text-slate-300">Overview</div>
            <div className="mt-3">Open: <span className="font-medium">{tickets.filter(t=>t.status==='Open').length}</span></div>
            <div className="mt-2">Closed: <span className="font-medium">{tickets.filter(t=>t.status==='Closed').length}</span></div>
            <div className="mt-3 text-sm text-slate-400">Avg response time</div>
            <div className="mt-1">{Math.round(24)} hours</div>
          </div>
        </div>

        {openForm && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={()=>setOpenForm(false)} />
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 z-10 w-96">
              <div className="text-lg font-semibold">Open ticket</div>
              <div className="mt-2"><input placeholder="Subject" className="w-full bg-slate-800 p-2 rounded" /></div>
              <div className="mt-2"><select className="w-full bg-slate-800 p-2 rounded"><option>Account</option><option>Trading</option><option>Withdrawals</option></select></div>
              <div className="mt-2"><textarea placeholder="Message" className="w-full bg-slate-800 p-2 rounded" rows={4} /></div>
              <div className="mt-4 flex gap-2"><button onClick={()=>setOpenForm(false)} className="px-3 py-2 bg-emerald-600 rounded">Send</button><button onClick={()=>setOpenForm(false)} className="px-3 py-2 bg-slate-800 rounded">Cancel</button></div>
            </div>
          </div>
        )}

        <div className="mt-6 bg-slate-900 border border-slate-800 rounded p-3">
          <div className="text-sm text-slate-300 mb-2">FAQ</div>
          <div className="space-y-2 text-sm">
            <details className="bg-slate-800 p-2 rounded"><summary className="cursor-pointer">How do I deposit funds?</summary><div className="mt-2 text-slate-400">Use the Deposits panel. Bank transfers appear in 1-3 business days.</div></details>
            <details className="bg-slate-800 p-2 rounded"><summary>How do I verify my address?</summary><div className="mt-2 text-slate-400">Upload a recent utility bill under Documents.</div></details>
            <details className="bg-slate-800 p-2 rounded"><summary>What are trading fees?</summary><div className="mt-2 text-slate-400">Fees are shown on the Trade ticket and in Transactions.</div></details>
            <details className="bg-slate-800 p-2 rounded"><summary>How long do withdrawals take?</summary><div className="mt-2 text-slate-400">Bank: 1-3 days, Crypto: ~1 hour.</div></details>
            <details className="bg-slate-800 p-2 rounded"><summary>Can I trade crypto 24/7?</summary><div className="mt-2 text-slate-400">Yes, markets marked Open are tradable.</div></details>
          </div>
        </div>
      </div>
    );
  };

  // choose view
  switch(page){
    case 'menu': return <MenuView />;
    case 'account settings': return <AccountSettingsView />;
    case 'account-settings': return <AccountSettingsView />;
    case 'trade': return <TradePage />;
    case 'negotiate': return <TradePage />;
    case 'markets': return <MarketsView />;
    case 'positions': return <PositionsView />;
    case 'open positions': return <PositionsView />;
    case 'open-positions': return <PositionsView />;
    case 'closed positions': return <PositionsView />;
    case 'closed-positions': return <PositionsView />;
    case 'funds': return <FundsView />;
    case 'withdrawals': return <WithdrawalsView />;
    case 'transactions': return <TransactionsView />;
    case 'support': return <SupportView />;
    case 'profile & kyc': return <ProfileView />;
    case 'profile': return <ProfileView />;
    default:
      return (
        <div className="h-full min-w-0 overflow-auto p-4">
          <Header title={title || 'Page'} />
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 h-full">
            <div className="text-slate-300">Content implemented for this route.</div>
          </div>
        </div>
      );
  }
}

function ProfileView(){
  const { accountMode } = useAppPreferences();
  const user = mock.user;

  const activeAccount = useMemo(() => {
    const desired = accountMode === 'demo' ? 'Demo' : 'Live';
    return mock.accounts.find(a => a.type === desired) || mock.accounts[0];
  }, [accountMode]);

  const freeMargin = accountMode === 'demo'
    ? (activeAccount.balance || 0)
    : (mock.kpis?.freeMargin ?? 0);

  const fmtMoney = (v: any) => typeof v === 'number' ? `$${v.toLocaleString()}` : v;

  return (
    <div className="h-full min-w-0 overflow-auto p-4">
      <Header title="Account" subtitle="Manage your profile, documents, security and preferences" Icon={User} />

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-400">Profile overview</div>
              <div className="text-xl font-semibold mt-1">{user.name} — {activeAccount.id}</div>
              <div className="text-sm text-slate-400 mt-1">{user.location} • Risk profile: {user.risk}</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 bg-slate-800 rounded">Edit profile</button>
              <button className="px-3 py-2 bg-emerald-600 rounded text-black">Upgrade</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 p-3 rounded">
              <div className="text-xs text-slate-400">Personal information</div>
              <div className="mt-2 text-sm">Email: <span className="font-medium">user@example.com</span></div>
              <div className="text-sm">Phone: <span className="font-medium">+1 •••• 1234</span></div>
              <div className="text-sm">Address: <span className="font-medium">—</span></div>
            </div>
            <div className="bg-slate-800 p-3 rounded">
              <div className="text-xs text-slate-400">Account balances</div>
              <div className="mt-2 text-lg font-semibold">{fmtMoney(activeAccount.balance)}</div>
              <div className="text-sm text-slate-400">Free margin: {fmtMoney(freeMargin)}</div>
            </div>
          </div>

          <div className="mt-3 bg-slate-800 p-3 rounded">
            <div className="text-sm font-semibold">Documents & KYC status</div>
            <div className="text-xs text-slate-400 mt-1">ID: {mock.user.kyc.idVerification} • Address: {mock.user.kyc.address}</div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {mock.documents.map(d=> (
                <div key={d.id} className="bg-slate-900 p-2 rounded text-sm">
                  <div className="font-medium">{d.type}</div>
                  <div className="text-xs text-slate-400">{d.name}</div>
                  <div className="text-xs text-slate-400 mt-1">{d.status}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 bg-slate-900 p-3 rounded">
            <div className="text-sm font-semibold">Statements & reports</div>
            <div className="text-xs text-slate-400 mt-1">Monthly statements, trade reports and tax documents are available here.</div>
            <div className="mt-3 space-y-2">
              <button className="px-3 py-2 bg-slate-800 rounded">Download monthly statement</button>
              <button className="px-3 py-2 bg-slate-800 rounded">Generate tax report</button>
            </div>
          </div>
        </div>

        <aside className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
          <div>
            <div className="text-xs text-slate-400">Security</div>
            <div className="mt-2 text-sm">Password: <span className="font-medium">Last changed 2025-09-02</span></div>
            <div className="mt-1 text-sm">2FA: <span className="font-medium">Enabled</span></div>
            <div className="mt-3"><button className="px-3 py-2 bg-slate-800 rounded">Manage security</button></div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Preferences & notifications</div>
            <div className="mt-2 text-sm">Email alerts: <span className="font-medium">Enabled</span></div>
            <div className="mt-1 text-sm">Push notifications: <span className="font-medium">Disabled</span></div>
            <div className="mt-3"><button className="px-3 py-2 bg-slate-800 rounded">Edit preferences</button></div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Recent sessions</div>
            <div className="mt-2 text-sm">Active session: Chrome • US • 2025-12-24</div>
            <div className="text-sm mt-1">Last login: 2025-12-24 11:05</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
