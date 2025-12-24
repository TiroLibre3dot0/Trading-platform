import AssetTicker from "../components/AssetTicker";
import { useMockFeed } from "../lib/useMockFeed";
import OrderForm from "../components/OrderForm";
import OnboardingPanel from "../components/OnboardingPanel";
import GoalPanel from "../components/GoalPanel";
import { useI18n } from "../context/I18nContext";
import { Link } from "react-router-dom";
import Card from "../components/common/Card";

const Home = () => {
  const { t } = useI18n();
  const assets = useMockFeed();
  const accounts = t.accounts.items;
  const highlights = t.why.highlights;

  return (
    <>
      <section
        id="hero"
        className="section-shell animate-section relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-[#0b142c]/65 to-[#050b18] shadow-[0_30px_140px_rgba(0,0,0,0.6)]"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,rgba(0,136,255,0.22),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(52,211,153,0.14),transparent_30%),radial-gradient(circle_at_40%_70%,rgba(255,255,255,0.08),transparent_35%)]" />
        <div className="absolute -right-32 top-10 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" aria-hidden />
        <div className="relative grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs text-white/80 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
              <img src="/Logo.png" alt="Bullwaves" className="h-4 w-4" />
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(16,185,129,0.15)] animate-pulse" />
              <span className="font-semibold text-white">{t.hero.badge}</span>
            </div>
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-semibold leading-[1.05] tracking-tight text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
              {t.hero.title}
            </h1>
            <p className="text-lg lg:text-xl text-white/70 max-w-2xl leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="relative flex flex-wrap gap-3" id="cta">
              <Link
                to="/register"
                className="relative z-10 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 shadow-[0_12px_38px_rgba(0,102,255,0.35)] ring-1 ring-brand-400/40 hover:translate-y-[-1px] hover:shadow-[0_16px_46px_rgba(0,102,255,0.45)] transition-transform"
              >
                {t.hero.ctaPrimary}
              </Link>
              <Link
                to="/register-demo"
                className="relative z-10 px-6 py-3.5 rounded-xl font-semibold text-white/80 border border-white/20 bg-white/5 backdrop-blur-md hover:border-white/30 hover:bg-white/10 transition"
              >
                {t.hero.ctaSecondary}
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm text-white/70 max-w-xl">
              {[
                { label: "15+", desc: t.hero.metrics.licenses },
                { label: "0$", desc: t.hero.metrics.deposits },
                { label: "24/7", desc: t.hero.metrics.support },
              ].map((item) => (
                <Card key={item.label} className="p-4 text-white/75">
                  <div className="text-2xl font-semibold text-white leading-tight">{item.label}</div>
                  {item.desc}
                </Card>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-hero-grid bg-[length:18px_18px] opacity-25" />
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 via-[#0d1938] to-[#090f20] shadow-[0_20px_60px_rgba(0,0,0,0.55)] p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-white/60">Equity</div>
                  <div className="text-4xl font-bold text-white">$48,230</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs border border-emerald-400/30 shadow-[0_10px_30px_rgba(16,185,129,0.25)]">
                  +1.8% oggi
                </span>
              </div>
              <div className="relative mt-2 mb-4 h-52 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 via-white/0 to-white/0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(0,102,255,0.28),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.22),transparent_35%)] opacity-70" />
                <svg viewBox="0 0 600 260" className="absolute inset-0 h-full w-full opacity-80">
                  <defs>
                    <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="rgba(0,102,255,0.4)" />
                      <stop offset="100%" stopColor="rgba(0,102,255,0)" />
                    </linearGradient>
                  </defs>
                  <polyline
                    fill="url(#chartFill)"
                    stroke="rgba(0,102,255,0.5)"
                    strokeWidth="2"
                    points="0,200 80,170 140,195 220,130 300,165 360,120 430,150 500,95 580,130 600,130 600,260 0,260"
                  />
                  <polyline
                    fill="none"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    points="0,190 80,155 140,185 220,115 300,155 360,105 430,140 500,85 580,120"
                  />
                  <polyline
                    fill="none"
                    stroke="rgba(16,185,129,0.8)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    points="0,205 60,180 140,210 220,150 300,185 360,150 440,175 520,130 600,160"
                  />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a1020]" />
              </div>
              <AssetTicker assets={assets} />
              <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-white/70">
                <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                  <div className="text-white/60">Margine usato</div>
                  <div className="text-lg font-semibold text-white">$4,120</div>
                </div>
                <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                  <div className="text-white/60">P/L giornaliero</div>
                  <div className="text-lg font-semibold text-emerald-200">+$820</div>
                </div>
                <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                  <div className="text-white/60">Alert attivi</div>
                  <div className="text-lg font-semibold text-white">6</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="why-us"
        className="section-shell animate-section relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-[#0a1328] to-[#050b18] shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(0,102,255,0.12),transparent_35%),radial-gradient(circle_at_90%_20%,rgba(16,185,129,0.12),transparent_30%)] opacity-80" />
        <div className="relative grid lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-200">{t.nav.why}</p>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-white">{t.why.title}</h2>
            <p className="text-white/70 leading-relaxed">{t.why.desc}</p>
          </div>
          {highlights.map((item) => (
            <Card key={item.label} className="p-5">
              <div className="text-base font-semibold text-white leading-snug">{item.label}</div>
              <div className="text-sm text-white/70 leading-relaxed">{item.desc}</div>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="journey"
        className="section-shell animate-section relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm grid lg:grid-cols-3 gap-5 lg:gap-6"
      >
        <div className="absolute inset-x-6 top-0 h-px bg-white/10" aria-hidden />
        <div className="lg:col-span-2 space-y-4 lg:space-y-5">
          <OnboardingPanel />
        </div>
        <GoalPanel />
      </section>

      <section
        id="markets"
        className="section-shell animate-section relative rounded-3xl border border-white/10 bg-gradient-to-r from-[#060f22] via-[#0a142a] to-[#050b18] shadow-[0_26px_90px_rgba(0,0,0,0.5)] space-y-5"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_10%,rgba(0,136,255,0.16),transparent_36%),radial-gradient(circle_at_85%_0%,rgba(16,185,129,0.12),transparent_32%)]" aria-hidden />
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" aria-hidden />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-200">{t.markets.label}</p>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-white">{t.markets.title}</h2>
          </div>
          <a href="#demo" className="text-sm text-white/75 hover:text-white">{t.markets.cta}</a>
        </div>
        <Card className="p-4">
          <AssetTicker assets={assets} />
        </Card>
      </section>

      <section
        id="accounts"
        className="section-shell animate-section relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-[#0d1733] to-[#050b18] shadow-[0_28px_110px_rgba(0,0,0,0.55)]"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_0%,rgba(0,136,255,0.14),transparent_35%),radial-gradient(circle_at_90%_15%,rgba(16,185,129,0.1),transparent_32%),radial-gradient(circle_at_45%_80%,rgba(255,255,255,0.07),transparent_35%)]" aria-hidden />
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" aria-hidden />
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-200">{t.accounts.label}</p>
            <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-white">{t.accounts.title}</h2>
          </div>
          <a href="#cta" className="text-sm text-white/75 hover:text-white">{t.accounts.cta}</a>
        </div>
        <div className="grid gap-5 lg:gap-6 lg:grid-cols-3">
          {accounts.map((acc) => (
            <Card key={acc.name} className="p-5 lg:p-6 flex flex-col gap-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-lg font-semibold text-white leading-snug">{acc.name}</div>
                  <div className="text-white/70 text-sm">{acc.badge}</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs border border-white/20">{acc.price}</span>
              </div>
              <div className="space-y-2 text-sm text-white/70 leading-relaxed">
                <div>Spread {acc.spread} | Leva {acc.leverage}</div>
                <div>Stop out {acc.stopOut}</div>
                <div>Copertura, hedging e trailing stop</div>
                <div>Segnalazioni via push e mail</div>
              </div>
              <button className="mt-auto w-full rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 text-white font-semibold py-3 ring-1 ring-brand-400/40 shadow-[0_10px_30px_rgba(0,102,255,0.3)] hover:translate-y-[-1px] hover:shadow-[0_14px_42px_rgba(0,102,255,0.4)] transition-transform">
                {t.accounts.cta} {acc.name}
              </button>
            </Card>
          ))}
        </div>
      </section>

      <section
        id="demo"
        className="section-shell animate-section relative rounded-3xl border border-white/10 bg-gradient-to-r from-[#050b18] via-[#0a1328] to-[#050b18] grid lg:grid-cols-2 gap-6 lg:gap-8 items-center shadow-[0_24px_90px_rgba(0,0,0,0.45)]"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" aria-hidden />
        <div className="space-y-4 lg:space-y-5">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-200">{t.demo.label}</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-white">{t.demo.title}</h2>
          <p className="text-white/70 leading-relaxed">{t.demo.desc}</p>
          <div className="flex flex-wrap gap-3">
            <button className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 text-white font-semibold ring-1 ring-brand-400/40 shadow-[0_10px_30px_rgba(0,102,255,0.3)] hover:translate-y-[-1px] hover:shadow-[0_14px_42px_rgba(0,102,255,0.4)] transition-transform">{t.demo.ctaPrimary}</button>
            <button className="px-5 py-3.5 rounded-xl border border-white/20 font-semibold text-white/80 bg-white/5 backdrop-blur-md hover:border-white/30 hover:bg-white/10 transition">{t.demo.ctaSecondary}</button>
          </div>
        </div>
        <Card className="p-5 lg:p-6 grid gap-4">
          <OrderForm assets={assets} />
        </Card>
      </section>

      <section
        id="support"
        className="section-shell animate-section relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#060c18] via-[#0a1224] to-[#050b18] grid lg:grid-cols-3 gap-5 lg:gap-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
      >
        <div className="absolute inset-x-0 top-0 h-px bg-white/10" aria-hidden />
        <div className="lg:col-span-1 space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-200">{t.support.label}</p>
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight text-white">{t.support.title}</h2>
          <p className="text-white/70 leading-relaxed">{t.support.desc}</p>
        </div>
        <div className="lg:col-span-2 grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <div className="font-semibold mb-2 text-white leading-snug">{t.support.contact.title}</div>
            <ul className="space-y-1 text-sm text-white/70 leading-relaxed">
              {t.support.contact.lines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </Card>
          <Card className="p-5">
            <div className="font-semibold mb-2 text-white leading-snug">{t.support.edu.title}</div>
            <ul className="space-y-1 text-sm text-white/70 leading-relaxed">
              {t.support.edu.lines.map((line) => (
                <li key={line}>{line}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>
    </>
  );
};

export default Home;
