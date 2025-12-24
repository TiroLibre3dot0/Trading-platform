interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const SectionHeader = ({ title, subtitle, action }: SectionHeaderProps) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <div className="text-sm font-semibold text-white">{title}</div>
      {subtitle && <div className="text-xs text-white/60">{subtitle}</div>}
    </div>
    {action}
  </div>
);

export default SectionHeader;
