import KpiPill from "./KpiPill";

interface KpiItem {
  key: string;
  label: string;
  value: string;
  positive?: boolean;
}

interface TopAccountBarProps {
  accountId?: string;
  accountType?: string;
  kpis?: KpiItem[];
}

const TopAccountBar = ({ accountId, accountType, kpis = [] }: TopAccountBarProps) => {
  return (
    <div className="sticky top-0 z-30 -mx-6 px-6 pt-4 pb-3 backdrop-blur-xl bg-[#050b18]/85 border-b border-white/10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-sm text-white/60">Trading Dashboard</div>
          <div className="text-lg font-semibold text-white">Portfolio Overview</div>
        </div>
        <div className="flex flex-wrap gap-3 flex-1 justify-center min-w-[240px]">
          {kpis.map((kpi) => (
            <KpiPill key={kpi.key} label={kpi.label} value={kpi.value} positive={kpi.positive} />
          ))}
        </div>
        <div className="flex gap-2">
          <button className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 text-white text-sm font-semibold ring-1 ring-brand-400/40 shadow-[0_10px_30px_rgba(0,102,255,0.25)] hover:translate-y-[-1px] hover:shadow-[0_14px_40px_rgba(0,102,255,0.35)] transition">
            Deposit
          </button>
          <button className="px-3.5 py-2 rounded-xl border border-white/15 font-semibold text-white/85 bg-white/5 backdrop-blur-md hover:border-white/30 hover:bg-white/10 text-sm transition">
            New order
          </button>
        </div>
      </div>
    </div>
  );
};;

export default TopAccountBar;
