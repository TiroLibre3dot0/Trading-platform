import { createContext, useContext, useMemo, useState, ReactNode, useEffect } from "react";
import { useLocalStorage } from "../lib/useLocalStorage";

type User = {
  email: string;
  name: string;
  tier?: "Base" | "Pro" | "ECN";
};

type AuthContextShape = {
  user: User | null;
  signIn: (email?: string) => void;
  signOut: () => void;
  streak: number;
};

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useLocalStorage<User | null>("vt:user", null);
  const [streak, setStreak] = useLocalStorage<number>("vt:streak", 0);
  const [lastVisit, setLastVisit] = useLocalStorage<string | null>("vt:lastVisit", null);

  const signIn = (email?: string) => {
    setUser({ email: email || "demo@bullwaves.com", name: "Trader Demo", tier: "Base" });
  };

  const signOut = () => setUser(null);

  useEffect(() => {
    if (!user) return;
    const today = new Date().toDateString();
    if (lastVisit === today) return;
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    if (lastVisit === yesterday) {
      setStreak((s) => s + 1);
    } else {
      setStreak(1);
    }
    setLastVisit(today);
  }, [user, lastVisit, setLastVisit, setStreak]);

  const value = useMemo(() => ({ user, signIn, signOut, streak }), [user, streak]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
