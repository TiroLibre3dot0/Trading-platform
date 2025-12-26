import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const THEME_KEY = 'bw_theme_v1';
const ACCOUNT_KEY = 'bw_account_mode_v1';

type Theme = 'dark' | 'light';
type AccountMode = 'live' | 'demo';

interface Prefs {
  theme: Theme;
  accountMode: AccountMode;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  setAccountMode: (m: AccountMode) => void;
}

const defaultState: Prefs = {
  theme: 'dark',
  accountMode: 'live',
  toggleTheme: () => {},
  setTheme: () => {},
  setAccountMode: () => {}
};

const Ctx = createContext<Prefs>(defaultState);

export const AppPreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const v = localStorage.getItem(THEME_KEY);
      return (v === 'light' || v === 'dark') ? v : 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  const [accountMode, setAccountModeState] = useState<AccountMode>(() => {
    try {
      const v = localStorage.getItem(ACCOUNT_KEY);
      return (v === 'demo' || v === 'live') ? v : 'live';
    } catch (e) {
      return 'live';
    }
  });

  useEffect(() => {
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  }, [theme]);

  useEffect(() => {
    try { localStorage.setItem(ACCOUNT_KEY, accountMode); } catch (e) {}
  }, [accountMode]);

  const toggleTheme = () => setThemeState(t => t === 'dark' ? 'light' : 'dark');
  const setAccountMode = (m: AccountMode) => setAccountModeState(m);
  const setTheme = (t: Theme) => setThemeState(t);

  const value = useMemo(() => ({ theme, accountMode, toggleTheme, setTheme, setAccountMode }), [theme, accountMode]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAppPreferences = () => useContext(Ctx);

export default Ctx;
