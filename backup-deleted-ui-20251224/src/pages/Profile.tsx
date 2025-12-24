import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardShell from "../features/profile/components/DashboardShell";
import { getProfileDashboard, getProfileInsights, updateProfileDashboard } from "../services/profileApi";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const [dashboardRes, insightsRes] = await Promise.all([
          getProfileDashboard(),
          getProfileInsights().catch((e: any) => {
            setInsightsError(e?.message ?? "Insights unavailable");
            return null;
          }),
        ]);
        setData(dashboardRes);
        setInsights(insightsRes);
      } catch (e: any) {
        setError(e?.message ?? "Errore di caricamento profilo");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user, navigate]);

  const handleToggleStep = async (id: string, done: boolean) => {
    if (!data?.onboarding?.steps) return;
    const steps = data.onboarding.steps.map((s: any) => (s.id === id ? { ...s, done } : s));
    const progressPct = Math.round((steps.filter((s: any) => s.done).length / steps.length) * 100);
    const updated = await updateProfileDashboard({ onboarding: { steps, progressPct } });
    setData(updated);
  };

  const kpis = useMemo(() => {
    if (!data?.kpis) return [];
    const { balance, equity, freeMargin, dailyPL, currency } = data.kpis;
    const fmt = (v: number) => `${currency ? `${currency} ` : ""}${typeof v === "number" ? v.toLocaleString() : v}`.trim();
    return [
      { key: "balance", label: "Balance", value: fmt(balance) },
      { key: "equity", label: "Equity", value: fmt(equity) },
      { key: "freeMargin", label: "Free margin", value: fmt(freeMargin) },
      { key: "dailyPL", label: "Daily P/L", value: `${dailyPL >= 0 ? "+" : ""}${fmt(dailyPL)}`, positive: dailyPL >= 0 },
    ];
  }, [data?.kpis]);

  if (!user) return null;

  if (loading) {
    return (
      <DashboardShell account={data?.account} kpis={kpis}>
        <div className="text-white/70 text-sm">Loading profile...</div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell account={data?.account} kpis={kpis}>
        <div className="text-red-300 text-sm">{error}</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell account={data?.account} kpis={kpis} user={user}>
      <Outlet context={{ data, handleToggleStep, insights, insightsError }} />
    </DashboardShell>
  );
};

export default Profile;
