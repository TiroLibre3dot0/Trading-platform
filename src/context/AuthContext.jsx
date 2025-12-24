import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('bw_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  const signIn = (email) => {
    const u = { id: 'WLX-4521', name: 'Wilson Alex', email };
    setUser(u);
    try { localStorage.setItem('bw_user', JSON.stringify(u)); } catch(e){}
  };

  const signOut = () => {
    setUser(null);
    try { localStorage.removeItem('bw_user'); } catch(e){}
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
