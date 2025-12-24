import { useI18n } from "../context/I18nContext";
import Card from "./common/Card";

interface ActionItem {
  id?: string;
  title: string;
  description: string;
  cta: string;
}

interface NextBestActionsProps {
  actions?: ActionItem[];
}

const NextBestActions = ({ actions }: NextBestActionsProps) => {
  const { t } = useI18n();
  const list = actions ?? t.nba.actions;

  return (
    <Card className="p-5 space-y-4 text-white">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-white leading-snug">{t.nba.title}</div>
        <div className="text-xs text-white/60">{t.nba.subtitle}</div>
      </div>
      <div className="space-y-3 text-sm">
        {list.map((a) => (
          <div key={a.title} className="flex items-center justify-between rounded-xl bg-white/5 p-3 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
            <div>
              <div className="font-semibold text-white">{a.title}</div>
              <div className="text-white/70 text-xs">{(a as any).desc ?? a.description}</div>
            </div>
            <button className="px-3 py-2 rounded-lg bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 text-white text-xs font-semibold ring-1 ring-brand-400/40 shadow-[0_10px_30px_rgba(0,102,255,0.25)] hover:translate-y-[-1px] hover:shadow-[0_14px_40px_rgba(0,102,255,0.35)] transition">
              {a.cta}
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default NextBestActions;
