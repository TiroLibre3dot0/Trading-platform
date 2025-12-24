import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocalStorage } from "../lib/useLocalStorage";
import { useI18n } from "../context/I18nContext";
import { Card } from "./common/Card";

const GoalPanel = () => {
  const { streak } = useAuth();
  const { t } = useI18n();
  const [goal, setGoal] = useLocalStorage<string>("vt:goal", t.retention.defaultGoal);
  const [input, setInput] = useState(goal);

  return (
    <Card className="p-5 space-y-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-brand-200">Retention</div>
          <div className="text-lg font-semibold text-white">{t.retention.title}</div>
        </div>
        <div className="rounded-full border border-brand-400/40 bg-brand-500/20 px-3 py-1 text-xs text-brand-50 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
          {t.retention.streak} {streak}d
        </div>
      </div>
      <p className="text-sm text-white/70">{t.retention.subtitle}</p>
      <div className="space-y-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded-xl bg-white/5 border border-white/20 px-3 py-2 text-sm text-white placeholder-white/40 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/35"
        />
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-semibold shadow-[0_10px_40px_rgba(20,81,255,0.35)] transition hover:shadow-[0_14px_50px_rgba(20,81,255,0.45)]"
            onClick={() => setGoal(input)}
          >
            {t.retention.save}
          </button>
          <button
            className="px-3 py-2 rounded-lg border border-white/20 text-sm text-white/80 bg-white/5 hover:border-white/35 transition"
            onClick={() => setInput(t.retention.defaultGoal)}
          >
            {t.retention.reset}
          </button>
        </div>
      </div>
      <div className="text-xs text-white/60">{t.retention.hint}</div>
    </Card>
  );
};

export default GoalPanel;
