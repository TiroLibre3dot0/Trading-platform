import { useMemo } from "react";
import { useI18n } from "../context/I18nContext";

interface Step {
  id: string;
  title: string;
  description: string;
  done: boolean;
}

interface OnboardingPanelProps {
  steps?: Step[];
  progressPct?: number;
  onToggle?: (id: string, nextDone: boolean) => void;
}

const OnboardingPanel = ({ steps, progressPct, onToggle }: OnboardingPanelProps) => {
  const { t } = useI18n();
  const defaultSteps = steps ?? t.journey.steps.map((s: any) => ({ ...s, done: false }));

  const progress = useMemo(() => {
    if (typeof progressPct === "number") return progressPct;
    const total = defaultSteps.length || 1;
    const done = defaultSteps.filter((s) => s.done).length;
    return Math.round((done / total) * 100);
  }, [progressPct, defaultSteps]);

  const toggle = (id: string) => {
    const current = defaultSteps.find((s) => s.id === id);
    const nextDone = !(current?.done ?? false);
    onToggle?.(id, nextDone);
  };

  return (
    <div className="card p-5 space-y-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-brand-200">{t.journey.label}</div>
          <div className="text-lg font-semibold text-white">{t.journey.title}</div>
        </div>
        <div className="text-sm text-brand-100 font-semibold">{progress}%</div>
      </div>
      <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden border border-white/20">
        <div className="h-full bg-gradient-to-r from-brand-400 to-brand-600" style={{ width: `${progress}%` }} />
      </div>
      <ul className="space-y-3 text-sm text-white/75">
        {defaultSteps.map((step) => (
          <li key={step.id} className="flex items-start gap-3">
            <button
              onClick={() => toggle(step.id)}
              className={`mt-1 h-5 w-5 rounded-full border ${step.done ? "bg-emerald-400/30 border-emerald-300/60" : "border-white/25 bg-white/10"}`}
              aria-label={`Completa ${step.title}`}
            />
            <div>
              <div className="font-semibold flex items-center gap-2 text-white">
                {step.title}
                {step.done && <span className="text-xs text-emerald-200">Fatto</span>}
              </div>
              <div className="text-white/60 text-xs">{(step as any).desc ?? step.description}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnboardingPanel;
