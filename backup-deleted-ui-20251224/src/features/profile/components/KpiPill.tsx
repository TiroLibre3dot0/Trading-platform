interface KpiPillProps {
  label: string;
  value: string;
  positive?: boolean;
}

const KpiPill = ({ label, value, positive }: KpiPillProps) => {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white/80 shadow-[0_12px_36px_rgba(0,0,0,0.35)]">
      <span className="text-sm">{label}</span>
      <span className={`font-semibold ${positive ? "text-emerald-300" : "text-white"}`}>{value}</span>
    </div>
  );
};

export default KpiPill;
