import { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import Card from "../../components/common/Card";
import NextBestActions from "../../components/NextBestActions";
import OnboardingPanel from "../../components/OnboardingPanel";
import SimpleTable from "../../features/profile/components/SimpleTable";
import { getEconomicChurn, getEconomicChurnActions, trackProfileEvent } from "../../services/profileApi";
import { MdLightbulb, MdWarning, MdStar, MdTrendingUp, MdAccountBalanceWallet, MdSecurity, MdHistory } from "react-icons/md";

const Overview = () => {
  const ctx = useOutletContext<any>();
  const data = ctx?.data;
  const handleToggleStep = ctx?.handleToggleStep;
  const insights = ctx?.insights;
  const insightsError = ctx?.insightsError;
  const [churn, setChurn] = useState<any>(null);
  const [churnError, setChurnError] = useState<string | null>(null);
  const [churnActions, setChurnActions] = useState<any>(null);
  const [churnActionsError, setChurnActionsError] = useState<string | null>(null);
  const loggedPositions = useRef(false);

  useEffect(() => {
    if (!loggedPositions.current && Array.isArray(data?.openPositions)) {
      console.log("openPositions", data.openPositions);
      loggedPositions.current = true;
    }
  }, [data?.openPositions]);
  const nextActions = data?.nextActions ?? [];
  const formatter = useMemo(() => new Intl.NumberFormat("en-US", { maximumFractionDigits: 3 }), []);
  const currencyFormatter = useMemo(() => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }), []);

  useEffect(() => {
    let mounted = true;
    const loadChurn = async () => {
      try {
        const res = await getEconomicChurn();
        if (mounted) setChurn(res);
      } catch (err: any) {
        if (mounted) setChurnError(err?.message ?? "Economic churn data unavailable");
      }
    };
    const loadActions = async () => {
      try {
        const res = await getEconomicChurnActions();
        if (mounted) setChurnActions(res);
      } catch (err: any) {
        if (mounted) setChurnActionsError(err?.message ?? "Actions unavailable");
      }
    };
    loadChurn();
    loadActions();
    return () => {
      mounted = false;
    };
  }, []);

  const watchlistRows = (data?.watchlist ?? []).map((row: any) => ({
    __key: String(row.symbol ?? "watch") + String(row.price ?? ""),
    symbol: String(row.symbol ?? "").trim(),
    price: formatter.format(Number.parseFloat(row.price ?? 0)),
    change: `${Number(row.changePct) > 0 ? "+" : ""}${Number(row.changePct ?? 0).toFixed(2)}%`,
    sentiment: `${row.sentiment?.buyPct ?? 0}% ${row.sentiment?.label ?? ""}`.trim(),
  }));

  const positionsRows = (data?.openPositions ?? []).map((row: any) => {
    const symbol = String(row?.symbol ?? "").trim();
    const side = String(row?.side ?? "").trim();
    const sizeNum = Number.parseFloat(row?.size ?? 0);
    const entryNum = Number.parseFloat(row?.entry ?? 0);
    const plNum = Number.parseFloat(row?.pl ?? 0);
    const size = Number.isFinite(sizeNum) ? formatter.format(sizeNum) : "";
    const entry = Number.isFinite(entryNum) ? formatter.format(entryNum) : "";
    const pnlAbs = Number.isFinite(plNum) ? new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(Math.abs(plNum)) : "";
    const pnl = `${plNum >= 0 ? "+" : "-"}$${pnlAbs}`;
    return {
      __key: `${symbol}-${side}-${entryNum}-${sizeNum}`,
      symbol,
      side,
      size,
      entry,
      pnl,
    };
  });
  const topFlag = insights?.flags?.[0];
  const badgeClass = !topFlag
    ? "bg-white/10 text-white/60 border-white/20"
    : topFlag.level === "red"
      ? "bg-red-500/20 text-red-200 border-red-300/40"
      : topFlag.level === "orange"
        ? "bg-amber-500/20 text-amber-200 border-amber-300/40"
        : "bg-emerald-500/20 text-emerald-200 border-emerald-300/40";
  const churnBadgeClass = !churn
    ? "bg-white/10 text-white/60 border-white/20"
    : churn.level === "red"
      ? "bg-red-500/20 text-red-200 border-red-300/40"
      : churn.level === "orange"
        ? "bg-amber-500/20 text-amber-200 border-amber-300/40"
        : "bg-emerald-500/20 text-emerald-200 border-emerald-300/40";
  const onboarding = data?.onboarding;
  const activityItems = data?.recentActivity ?? [];
  const summaryCards = data?.summaryCards ?? {};

  const handleChurnActionClick = async (actionId: string) => {
    try {
      await trackProfileEvent({ eventType: "economic_churn_action_click", actionId });
    } catch (err) {
      console.warn("Failed to track event", err);
    }
  };

  return (
    <div className="space-y-6 text-white">
      <div className="grid gap-6 lg:grid-cols-2">
        <NextBestActions actions={nextActions} />
        <OnboardingPanel steps={onboarding?.steps} progressPct={onboarding?.progressPct} onToggle={handleToggleStep} />
      </div>

      <div data-testid="insight-card">
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-white leading-snug">
              <MdLightbulb className="w-5 h-5 text-yellow-400" />
              Insight
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeClass}`} data-testid="insight-badge">
              {topFlag?.level ?? ""}
            </span>
          </div>
          {topFlag ? (
            <div className="space-y-3 text-sm text-white/80">
              <div>
                <div className="text-white font-semibold text-base" data-testid="insight-title">
                  {topFlag.title}
                </div>
                <div className="text-white/70 text-sm mt-1" data-testid="insight-reason">
                  {topFlag.reason}
                </div>
              </div>
              {Array.isArray(topFlag.nextSteps) && topFlag.nextSteps.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-wide text-white/60">Next steps</div>
                  <ul className="space-y-1" data-testid="insight-steps">
                    {topFlag.nextSteps.map((step: string) => (
                      <li key={`${topFlag.id}-${step}`} className="flex items-start gap-2" data-testid="insight-step">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/40" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-white/60">{insightsError ?? "Insights unavailable"}</div>
          )}
        </Card>
      </div>

      <div data-testid="churn-card">
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-white leading-snug">
              <MdWarning className="w-5 h-5 text-orange-400" />
              Economic churn risk
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${churnBadgeClass}`} data-testid="churn-badge">
              {churn?.level ?? ""}
            </span>
          </div>
          {churn ? (
            <div className="space-y-3 text-sm text-white/80">
              <div className="text-white/70" data-testid="churn-reason">
                {churn.reason}
              </div>
              <div className="space-y-1">
                <div data-testid="churn-lifetime">Estimated lifetime: {churn.estimatedLifetimeDays} days</div>
                <div data-testid="churn-value">Estimated value: {currencyFormatter.format(churn.estimatedEconomicValue)}</div>
              </div>
              {Array.isArray(churn.drivers) && churn.drivers.length > 0 && (
                <div className="space-y-1">
                  <div className="text-xs uppercase tracking-wide text-white/60">Drivers</div>
                  <ul className="space-y-1">
                    {churn.drivers.slice(0, 3).map((driver: string) => (
                      <li key={driver} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/40" />
                        <span>{driver}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {churnActions ? (
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-wide text-white/60">Take action</div>
                  <div className="flex flex-wrap items-center gap-2">
                    {churnActions.primaryAction && (
                      <button
                        className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white text-sm font-semibold transition"
                        data-testid="churn-primary-cta"
                        onClick={() => handleChurnActionClick(churnActions.primaryAction.id)}
                      >
                        {churnActions.primaryAction.label}
                      </button>
                    )}
                    {Array.isArray(churnActions.secondaryActions) &&
                      churnActions.secondaryActions.slice(0, 2).map((action: any) => (
                        <button
                          key={action.id}
                          className="px-3 py-2 rounded-lg border border-white/20 text-white text-sm hover:border-white/40 transition"
                          data-testid="churn-secondary-cta"
                          onClick={() => handleChurnActionClick(action.id)}
                        >
                          {action.label}
                        </button>
                      ))}
                  </div>
                  {churnActions.primaryAction?.why && (
                    <div className="text-xs text-white/60">{churnActions.primaryAction.why}</div>
                  )}
                  {Array.isArray(churnActions.secondaryActions) && churnActions.secondaryActions.length > 0 && (
                    <ul className="text-xs text-white/60 space-y-1">
                      {churnActions.secondaryActions.slice(0, 2).map((action: any) => (
                        <li key={`${action.id}-why`} className="flex items-start gap-2">
                          <span className="mt-1 h-1 w-1 rounded-full bg-white/40" />
                          <span>{action.why}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <div className="text-xs text-white/60">{churnActionsError ?? "Actions unavailable"}</div>
              )}
            </div>
          ) : (
            <div className="text-sm text-white/60">{churnError ?? "Economic churn data unavailable"}</div>
          )}
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-white leading-snug">
              <MdStar className="w-5 h-5 text-yellow-400" />
              Watchlist
            </div>
            <button className="text-sm text-brand-200 hover:text-white transition">Add</button>
          </div>
          <SimpleTable
            columns={[
              { header: "Symbol", accessor: "symbol" },
              { header: "Price", accessor: "price" },
              { header: "Change", accessor: "change", align: "right" },
              { header: "Sentiment", accessor: "sentiment", align: "right" },
            ]}
            rows={watchlistRows}
          />
        </Card>

        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-white leading-snug">
              <MdTrendingUp className="w-5 h-5 text-green-400" />
              Open positions
            </div>
            <button className="text-sm text-brand-200 hover:text-white transition">Close all</button>
          </div>
          <SimpleTable
            columns={[
              { header: "Symbol", accessor: "symbol", className: "whitespace-nowrap" },
              { header: "Side", accessor: "side", className: "whitespace-nowrap" },
              { header: "Size", accessor: "size", align: "right", className: "whitespace-nowrap" },
              { header: "Entry", accessor: "entry", align: "right", className: "whitespace-nowrap" },
              { header: "P/L", accessor: "pnl", align: "right", className: "whitespace-nowrap" },
            ]}
            rows={positionsRows}
          />
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <MdAccountBalanceWallet className="w-4 h-4 text-blue-400" />
            Deposits & withdrawals
          </div>
          <div className="text-sm text-white/70">{summaryCards.depositsWithdrawals}</div>
        </Card>
        <Card className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <MdSecurity className="w-4 h-4 text-red-400" />
            Risk management
          </div>
          <div className="text-sm text-white/70">{summaryCards.riskManagement}</div>
        </Card>
        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <MdHistory className="w-4 h-4 text-purple-400" />
            Recent activity
          </div>
          <ul className="text-sm text-white/70 space-y-1">
            {activityItems.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
