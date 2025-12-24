import { useState } from "react";
import TopAccountBar from "./TopAccountBar";
import ProfileSidebar from "./ProfileSidebar";

interface AccountData {
  accountId?: string;
  tier?: string;
  location?: string;
}

interface KpiData {
  key: string;
  label: string;
  value: string;
  positive?: boolean;
}

interface UserData {
  email: string;
  name: string;
  tier?: "Base" | "Pro" | "ECN";
}

interface DashboardShellProps {
  children: React.ReactNode;
  account?: AccountData;
  kpis?: KpiData[];
  user?: UserData | null;
}

const DashboardShell = ({ children, account, kpis, user }: DashboardShellProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="section-shell relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#050b18] via-[#0a1328] to-[#050b18] shadow-[0_32px_120px_rgba(0,0,0,0.55)] overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_10%,rgba(0,136,255,0.18),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.12),transparent_35%),radial-gradient(circle_at_50%_85%,rgba(255,255,255,0.08),transparent_36%)]" aria-hidden />
      <div className="grid lg:grid-cols-[auto,1fr] gap-4 lg:gap-6 py-6">
        <ProfileSidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} user={user} />
        <div className="min-w-0">
          <TopAccountBar accountId={account?.accountId} accountType={account?.tier && account?.location ? `${account.tier} | ${account.location}` : account?.tier} kpis={kpis} />
          <div className="px-1 sm:px-2 lg:px-4 pb-4 pt-4 lg:pt-6 space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardShell;
