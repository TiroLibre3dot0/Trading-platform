import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MdLanguage, MdMailOutline, MdLock } from "react-icons/md";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Login = () => {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = (location.state as any)?.from?.pathname as string | undefined;

  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [platform, setPlatform] = useState("MetaTrader 5");
  const [currency, setCurrency] = useState("USD");
  const [dobYear, setDobYear] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [promo, setPromo] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate(fromPath || "/trade", { replace: true });
  }, [user, navigate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return setError("Inserisci una email valida");
    if (mode === 'signup') {
      if (!firstName.trim() || !lastName.trim()) return setError("Inserisci nome e cognome");
      if (!password || password.length < 4) return setError("Inserisci una password valida");
      if (password !== password2) return setError("Le password non coincidono");
      if (!dobYear || !dobMonth || !dobDay) return setError("Inserisci la data di nascita");
    }
    setError("");
    signIn(email);
    navigate(fromPath || "/trade");
  };

  // Live trading demo (right panel)
    <div data-theme="light" className="min-h-screen bg-theme-secondary text-theme-primary">
      <div className="min-h-screen flex items-center justify-center px-4 py-10 lg:py-16">
        <div className="w-full max-w-6xl bg-theme-primary border border-theme-primary rounded-3xl overflow-hidden shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Form */}
            <div className="px-6 sm:px-10 py-10">
              <div className="w-full max-w-md">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center font-bold text-white">BW</div>
                    <div>
                      <div className="text-sm font-semibold text-theme-primary leading-tight">Bullwaves</div>
                      <div className="text-xs text-theme-secondary">Client portal</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-theme-secondary hover:text-theme-primary p-2 rounded-md bg-theme-tertiary border border-theme-secondary" aria-label="Language"><MdLanguage /></button>
                    <div className="w-8 h-8 rounded-full bg-theme-tertiary flex items-center justify-center text-theme-secondary border border-theme-secondary">v</div>
                  </div>
                </div>

                <div className="bg-theme-secondary border border-theme-secondary rounded-2xl p-6 sm:p-8">
                  <div className="flex items-center gap-2 rounded-xl bg-theme-tertiary border border-theme-secondary p-1 mb-6">
                    <button
                      type="button"
                      onClick={() => { setMode('login'); setError(''); }}
                      className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${mode === 'login' ? 'bg-theme-secondary shadow-sm text-theme-primary' : 'text-theme-secondary hover:text-theme-primary'}`}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={() => { setMode('signup'); setError(''); }}
                      className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${mode === 'signup' ? 'bg-theme-secondary shadow-sm text-theme-primary' : 'text-theme-secondary hover:text-theme-primary'}`}
                    >
                      Sign up
                    </button>
                  </div>

                  <h2 className="text-2xl font-bold mb-1 text-theme-primary">
                    {mode === 'login' ? 'Welcome back!' : 'Create your account'}
                  </h2>
                  <p className="text-sm text-theme-secondary mb-6">
                    {mode === 'login'
                      ? 'Sign in to access your trading platform.'
                      : 'Fill in your details to create a trading account.'}
                  </p>

                  <form onSubmit={onSubmit} className="space-y-4">
                    {mode === 'signup' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-theme-secondary">First name *</label>
                          <input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First Name"
                            className="mt-2 w-full bg-theme-tertiary rounded-xl px-3 py-2 border border-theme-secondary outline-none placeholder:text-slate-400 text-theme-primary"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-theme-secondary">Last name *</label>
                          <input
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last Name"
                            className="mt-2 w-full bg-theme-tertiary rounded-xl px-3 py-2 border border-theme-secondary outline-none placeholder:text-slate-400 text-theme-primary"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-xs text-theme-secondary">Email *</label>
                      <div className="mt-2 flex items-center gap-3 bg-theme-tertiary rounded-xl px-3 py-2 border border-theme-secondary">
                        <MdMailOutline className="w-5 h-5 text-theme-secondary" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@bullwaves.com"
                          className="bg-transparent outline-none w-full placeholder:text-slate-400 text-theme-primary"
                          required
                        />
                      </div>
                    </div>

                    <div className={mode === 'signup' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : ''}>
                      <div>
                        <label className="text-xs text-theme-secondary">Password *</label>
                        <div className="mt-2 flex items-center gap-3 bg-theme-tertiary rounded-xl px-3 py-2 border border-theme-secondary">
                          <MdLock className="w-5 h-5 text-theme-secondary" />
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-transparent outline-none w-full placeholder:text-slate-400 text-theme-primary"
                            required
                          />
                          {mode === 'login' && (
                            <button type="button" className="text-theme-secondary hover:text-theme-primary text-xs">Forgot?</button>
                          )}
                        </div>
                      </div>

                      {mode === 'signup' && (
                        <div>
                          <label className="text-xs text-theme-secondary">Password confirmation *</label>
                          <div className="mt-2 flex items-center gap-3 bg-theme-tertiary rounded-xl px-3 py-2 border border-theme-secondary">
                            <MdLock className="w-5 h-5 text-theme-secondary" />
                            <input
                              type="password"
                              value={password2}
                              onChange={(e) => setPassword2(e.target.value)}
                              placeholder="••••••••"
                              className="bg-transparent outline-none w-full placeholder:text-slate-400 text-theme-primary"
                              required
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {mode === 'signup' && (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs text-theme-secondary">Platform</label>
                            <input
                              value={platform}
                              onChange={(e) => setPlatform(e.target.value)}
                              className="mt-2 w-full bg-theme-tertiary rounded-xl px-3 py-2 border border-theme-secondary outline-none placeholder:text-slate-400 text-theme-primary"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-theme-secondary">Currency</label>
                            <input
                              value={currency}
                              onChange={(e) => setCurrency(e.target.value)}
                              className="mt-2 w-full bg-theme-tertiary rounded-xl px-3 py-2 border border-theme-secondary outline-none placeholder:text-slate-400 text-theme-primary"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-theme-secondary">Date of birth *</label>
                          <div className="mt-2 grid grid-cols-3 gap-2">
                            <input
                              value={dobYear}
                              onChange={(e) => setDobYear(e.target.value)}
                              placeholder="Year"
                              className="w-full bg-theme-tertiary rounded-xl px-3 py-2 border border-theme-secondary outline-none placeholder:text-slate-400 text-theme-primary"
                            />
                            <input
                              value={dobMonth}
                              onChange={(e) => setDobMonth(e.target.value)}
                              placeholder="Month"
                              className="w-full bg-theme-tertiary rounded-xl px-3 py-2 border border-theme-secondary outline-none placeholder:text-slate-400 text-theme-primary"
                            />
                            <input
                              value={dobDay}
                              onChange={(e) => setDobDay(e.target.value)}
                              placeholder="Day"
                              className="w-full bg-theme-tertiary rounded-xl px-3 py-2 border border-theme-secondary outline-none placeholder:text-slate-400 text-theme-primary"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-theme-secondary">Promocode</label>
                          <input
                            value={promo}
                            onChange={(e) => setPromo(e.target.value)}
                            placeholder="Promocode"
                            className="mt-2 w-full bg-theme-tertiary rounded-xl px-3 py-2 border border-theme-secondary outline-none placeholder:text-slate-400 text-theme-primary"
                          />
                        </div>
                      </>
                    )}

                    {error && (
                      <div className="text-sm text-red-200 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">{error}</div>
                    )}

                    <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/40">
                      {mode === 'login' ? 'Sign In' : 'Next'}
                    </button>
                  </form>

                  <div className="mt-6 text-center text-xs text-theme-secondary">Connect</div>
                  <div className="flex items-center justify-center gap-3 mt-3">
                    <button className="p-2 bg-theme-tertiary text-theme-secondary hover:text-theme-primary rounded-full border border-theme-secondary" aria-label="Facebook"><FaFacebookF /></button>
                    <button className="p-2 bg-theme-tertiary text-theme-secondary hover:text-theme-primary rounded-full border border-theme-secondary" aria-label="Twitter"><FaTwitter /></button>
                    <button className="p-2 bg-theme-tertiary text-theme-secondary hover:text-theme-primary rounded-full border border-theme-secondary" aria-label="LinkedIn"><FaLinkedinIn /></button>
                  </div>

                  <div className="mt-6 text-center text-xs text-theme-secondary">
                    {mode === 'login' ? (
                      <>Don't have an account? <button type="button" onClick={() => setMode('signup')} className="text-blue-400 hover:text-blue-300">Create account</button></>
                    ) : (
                      <>Already have an account? <button type="button" onClick={() => setMode('login')} className="text-blue-400 hover:text-blue-300">Log in</button></>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Dynamic trading content */}
            <div className="bg-theme-secondary border-t border-theme-primary lg:border-t-0 lg:border-l px-6 sm:px-10 py-10">
              <div className="w-full max-w-xl">
                <div className="mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center font-bold text-white">BW</div>
                  <div>
                    <div className="text-sm font-semibold text-theme-primary">Bullwaves</div>
                    <div className="text-xs text-theme-secondary">Live trading demo</div>
                  </div>
                </div>

                <h1 className="text-3xl font-semibold mb-3 text-theme-primary">Trade with clarity</h1>
                <p className="text-theme-secondary leading-relaxed mb-8">
                  A realistic execution simulation: price updates, entries, exits and live P/L — no backend required.
                </p>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-theme-primary border border-theme-secondary rounded-2xl p-4 shadow-sm">
                    <div className="text-xs text-theme-secondary">Daily P/L</div>
                    <div className="mt-2 text-xl font-bold text-theme-primary">+2.14%</div>
                    <div className="mt-1 text-xs text-green-400">Low volatility</div>
                  </div>
                  <div className="bg-theme-primary border border-theme-secondary rounded-2xl p-4 shadow-sm">
                    <div className="text-xs text-theme-secondary">Win rate</div>
                    <div className="mt-2 text-xl font-bold text-theme-primary">58%</div>
                    <div className="mt-1 text-xs text-theme-secondary">Last 30 days</div>
                  </div>
                  <div className="bg-theme-primary border border-theme-secondary rounded-2xl p-4 shadow-sm">
                    <div className="text-xs text-theme-secondary">Risk</div>
                    <div className="mt-2 text-xl font-bold text-theme-primary">1.2x</div>
                    <div className="mt-1 text-xs text-theme-secondary">Balanced</div>
                  </div>
                </div>

                <div className="bg-theme-primary border border-theme-secondary rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-sm font-semibold text-theme-primary">Analytics</div>
                      <div className="text-xs text-theme-secondary">Live execution simulation</div>
                    </div>
                    <div className="text-xs text-theme-secondary">{demoTrade.statusText}</div>
                  </div>

                  <div className="rounded-xl bg-theme-tertiary border border-theme-secondary p-3 relative">
                    <div ref={demoWrapRef} className="relative w-full h-[150px]">
                      <canvas ref={demoCanvasRef} className="absolute inset-0 w-full h-full" />
                    </div>

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <div className="px-2 py-1 rounded-lg bg-theme-primary border border-theme-secondary text-xs font-semibold text-theme-primary">
                        {demoTrade.symbol}
                      </div>
                      <div className={`px-2 py-1 rounded-lg bg-theme-primary border border-theme-secondary text-xs font-semibold ${demoTrade.dir === 1 ? 'text-green-600' : 'text-blue-600'}`}>
                        {demoTrade.dir === 1 ? 'BUY' : 'SELL'}
                      </div>
                      <div className="px-2 py-1 rounded-lg bg-theme-primary border border-theme-secondary text-xs font-semibold text-theme-secondary">
                        {demoTrade.size.toFixed(1)} lot
                      </div>
                    </div>

                    <div className="absolute top-3 right-3 text-right">
                      <div className="text-[11px] text-theme-secondary">P/L</div>
                      <div className={`text-sm font-bold ${demoTrade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(demoTrade.pnl >= 0 ? '+' : '') + demoTrade.pnl.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-theme-tertiary border border-theme-secondary p-3">
                      <div className="text-xs text-theme-secondary">Equity</div>
                      <div className="mt-1 text-sm font-semibold text-theme-primary">$12,480</div>
                    </div>
                    <div className="rounded-xl bg-theme-tertiary border border-theme-secondary p-3">
                      <div className="text-xs text-theme-secondary">Exposure</div>
                      <div className="mt-1 text-sm font-semibold text-theme-primary">$3,210</div>
                    </div>
                    <div className="rounded-xl bg-theme-tertiary border border-theme-secondary p-3">
                      <div className="text-xs text-theme-secondary">Drawdown</div>
                      <div className="mt-1 text-sm font-semibold text-theme-primary">-0.8%</div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {demoEvents.map((ev) => (
                      <div key={ev.id} className="rounded-xl bg-theme-tertiary border border-theme-secondary px-3 py-2 text-xs text-theme-secondary flex items-center justify-between">
                        <span className="truncate">{ev.text}</span>
                        <span className="ml-3 text-[11px] text-theme-muted">live</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      const cX = sx(cIdx);
      const cY = sy(vals[cIdx] ?? next);
      ctx.save();
      ctx.strokeStyle = hexToRgba(textMuted, 0.35);
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(cX, padY);
      ctx.lineTo(cX, padY + chartH);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = hexToRgba(accentA, 0.9);
      ctx.beginPath();
      ctx.arc(cX, cY, 3.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = hexToRgba(textPrimary, 0.75);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cX, cY, 7.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div data-theme="light" className="min-h-screen bg-theme-secondary text-theme-primary">
      <div className="min-h-screen flex items-center justify-center px-4 py-10 lg:py-16">
        <div className="w-full max-w-6xl bg-theme-primary border border-theme-primary rounded-3xl overflow-hidden shadow-card">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: Form */}
            <div className="px-6 sm:px-10 py-10">
              <div className="w-full max-w-md">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center font-bold text-white">BW</div>
                <div>
                  <div className="text-sm font-semibold text-theme-primary leading-tight">Bullwaves</div>
                  <div className="text-xs text-theme-secondary">Client portal</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-theme-secondary hover:text-theme-primary p-2 rounded-md bg-theme-tertiary border border-theme-secondary" aria-label="Language"><MdLanguage /></button>
                <div className="w-8 h-8 rounded-full bg-theme-tertiary flex items-center justify-center text-theme-secondary border border-theme-secondary">v</div>
              </div>
            </div>

            <div className="bg-theme-secondary border border-theme-secondary rounded-2xl p-6 sm:p-8">
              <div className="flex items-center gap-2 rounded-xl bg-theme-tertiary border border-theme-secondary p-1 mb-6">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${mode === 'login' ? 'bg-theme-secondary shadow-sm text-theme-primary' : 'text-theme-secondary hover:text-theme-primary'}`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(''); }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${mode === 'signup' ? 'bg-theme-secondary shadow-sm text-theme-primary' : 'text-theme-secondary hover:text-theme-primary'}`}
                >
                  Sign up
                </button>
              </div>

              <h2 className="text-2xl font-bold mb-1 text-theme-primary">
                {mode === 'login' ? 'Welcome back!' : 'Create your account'}
              </h2>
              <p className="text-sm text-theme-secondary mb-6">
                {mode === 'login'
                  ? 'Sign in to access your trading platform.'
                  : 'Fill in your details to create a trading account.'}
              </p>

              <form onSubmit={onSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-theme-secondary">First name *</label>
                      <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="First Name"
                        className="mt-2 w-full bg-theme-tertiary rounded-xl px-3 py-2 border border-theme-secondary outline-none placeholder:text-slate-400 text-theme-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-theme-secondary">Last name *</label>
                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Last Name"
                        className="mt-2 w-full bg-theme-tertiary rounded-xl px-3 py-2 border border-theme-secondary outline-none placeholder:text-slate-400 text-theme-primary"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs text-theme-secondary">Email *</label>
                  <div className="mt-2 flex items-center gap-3 bg-theme-tertiary rounded-xl px-3 py-2 border border-theme-secondary">
                    <MdMailOutline className="w-5 h-5 text-theme-secondary" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@bullwaves.com"
                      className="bg-transparent outline-none w-full placeholder:text-slate-400 text-theme-primary"
                      required
                    />
                  </div>
                </div>

                <div className={mode === 'signup' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : ''}>
                  <div className={mode === 'signup' ? '' : ''}>
                    <label className="text-xs text-theme-secondary">Password *</label>
                    <div className="mt-2 flex items-center gap-3 bg-theme-tertiary rounded-xl px-3 py-2 border border-theme-secondary">
                      <MdLock className="w-5 h-5 text-theme-secondary" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-transparent outline-none w-full placeholder:text-slate-400 text-theme-primary"
                        required
                      />
                      {mode === 'login' && (
                        <button type="button" className="text-theme-secondary hover:text-theme-primary text-xs">Forgot?</button>
                      )}
                    </div>
                  </div>

                  {mode === 'signup' && (
                    <div>
                      <label className="text-xs text-theme-secondary">Password confirmation *</label>
                      <div className="mt-2 flex items-center gap-3 bg-theme-tertiary rounded-xl px-3 py-2 border border-theme-secondary">
                        <MdLock className="w-5 h-5 text-theme-secondary" />
                        <input
                          type="password"
                          value={password2}
                          onChange={(e) => setPassword2(e.target.value)}
                          placeholder="••••••••"
                          className="bg-transparent outline-none w-full placeholder:text-slate-400 text-theme-primary"
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>

                {mode === 'signup' && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-theme-secondary">Platform</label>
                        <input
                          value={platform}
                          onChange={(e) => setPlatform(e.target.value)}
                          className="mt-2 w-full bg-theme-tertiary rounded-xl px-3 py-2 border border-theme-secondary outline-none placeholder:text-slate-400 text-theme-primary"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-theme-secondary">Currency</label>
                        <input
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="mt-2 w-full bg-theme-tertiary rounded-xl px-3 py-2 border border-theme-secondary outline-none placeholder:text-slate-400 text-theme-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-theme-secondary">Date of birth *</label>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        <input
                          value={dobYear}
                          onChange={(e) => setDobYear(e.target.value)}
                          placeholder="Year"
                          className="w-full bg-theme-tertiary rounded-xl px-3 py-2 border border-theme-secondary outline-none placeholder:text-slate-400 text-theme-primary"
                        />
                        <input
                          value={dobMonth}
                          onChange={(e) => setDobMonth(e.target.value)}
                          placeholder="Month"
                          className="w-full bg-theme-tertiary rounded-xl px-3 py-2 border border-theme-secondary outline-none placeholder:text-slate-400 text-theme-primary"
                        />
                        <input
                          value={dobDay}
                          onChange={(e) => setDobDay(e.target.value)}
                          placeholder="Day"
                          className="w-full bg-theme-tertiary rounded-xl px-3 py-2 border border-theme-secondary outline-none placeholder:text-slate-400 text-theme-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-theme-secondary">Promocode</label>
                      <input
                        value={promo}
                        onChange={(e) => setPromo(e.target.value)}
                        placeholder="Promocode"
                        className="mt-2 w-full bg-theme-tertiary rounded-xl px-3 py-2 border border-theme-secondary outline-none placeholder:text-slate-400 text-theme-primary"
                      />
                    </div>
                  </>
                )}

                {error && (
                  <div className="text-sm text-red-200 bg-red-500/10 border border-red-500/20 rounded-md px-3 py-2">{error}</div>
                )}

                <button
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  {mode === 'login' ? 'Sign In' : 'Next'}
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-theme-secondary">Connect</div>
              <div className="flex items-center justify-center gap-3 mt-3">
                <button className="p-2 bg-theme-tertiary text-theme-secondary hover:text-theme-primary rounded-full border border-theme-secondary" aria-label="Facebook"><FaFacebookF /></button>
                <button className="p-2 bg-theme-tertiary text-theme-secondary hover:text-theme-primary rounded-full border border-theme-secondary" aria-label="Twitter"><FaTwitter /></button>
                <button className="p-2 bg-theme-tertiary text-theme-secondary hover:text-theme-primary rounded-full border border-theme-secondary" aria-label="LinkedIn"><FaLinkedinIn /></button>
              </div>

              <div className="mt-6 text-center text-xs text-theme-secondary">
                {mode === 'login' ? (
                  <>Don't have an account? <button type="button" onClick={() => setMode('signup')} className="text-blue-400 hover:text-blue-300">Create account</button></>
                ) : (
                  <>Already have an account? <button type="button" onClick={() => setMode('login')} className="text-blue-400 hover:text-blue-300">Log in</button></>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Dynamic trading content */}
        <div className="bg-theme-secondary border-t border-theme-primary lg:border-t-0 lg:border-l px-6 sm:px-10 py-10">
          <div className="w-full max-w-xl">
            <div className="mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center font-bold text-white">BW</div>
                <div>
                  <div className="text-sm font-semibold text-theme-primary">Bullwaves</div>
                  <div className="text-xs text-theme-secondary">Live trading demo</div>
                </div>
              </div>

              <h1 className="text-3xl font-semibold mb-3 text-theme-primary">Trade with clarity</h1>
              <p className="text-theme-secondary leading-relaxed mb-8">
                A realistic execution simulation: price updates, entries, exits and live P/L — no backend required.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-theme-primary border border-theme-secondary rounded-2xl p-4 shadow-sm">
                  <div className="text-xs text-theme-secondary">Daily P/L</div>
                  <div className="mt-2 text-xl font-bold text-theme-primary">+2.14%</div>
                  <div className="mt-1 text-xs text-green-400">Low volatility</div>
                </div>
                <div className="bg-theme-primary border border-theme-secondary rounded-2xl p-4 shadow-sm">
                  <div className="text-xs text-theme-secondary">Win rate</div>
                  <div className="mt-2 text-xl font-bold text-theme-primary">58%</div>
                  <div className="mt-1 text-xs text-theme-secondary">Last 30 days</div>
                </div>
                <div className="bg-theme-primary border border-theme-secondary rounded-2xl p-4 shadow-sm">
                  <div className="text-xs text-theme-secondary">Risk</div>
                  <div className="mt-2 text-xl font-bold text-theme-primary">1.2x</div>
                  <div className="mt-1 text-xs text-theme-secondary">Balanced</div>
                </div>
              </div>

              <div className="bg-theme-primary border border-theme-secondary rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold text-theme-primary">Analytics</div>
                    <div className="text-xs text-theme-secondary">Live execution simulation</div>
                  </div>
                  <div className="text-xs text-theme-secondary">{demoTrade.statusText}</div>
                </div>

                <div className="rounded-xl bg-theme-tertiary border border-theme-secondary p-3 relative">
                  <div ref={demoWrapRef} className="relative w-full h-[150px]">
                    <canvas ref={demoCanvasRef} className="absolute inset-0 w-full h-full" />
                  </div>

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <div className="px-2 py-1 rounded-lg bg-theme-primary border border-theme-secondary text-xs font-semibold text-theme-primary">
                      {demoTrade.symbol}
                    </div>
                    <div className={`px-2 py-1 rounded-lg bg-theme-primary border border-theme-secondary text-xs font-semibold ${demoTrade.dir === 1 ? 'text-green-600' : 'text-blue-600'}`}>
                      {demoTrade.dir === 1 ? 'BUY' : 'SELL'}
                    </div>
                    <div className="px-2 py-1 rounded-lg bg-theme-primary border border-theme-secondary text-xs font-semibold text-theme-secondary">
                      {demoTrade.size.toFixed(1)} lot
                    </div>
                  </div>

                  <div className="absolute top-3 right-3 text-right">
                    <div className="text-[11px] text-theme-secondary">P/L</div>
                    <div className={`text-sm font-bold ${demoTrade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {(demoTrade.pnl >= 0 ? '+' : '') + demoTrade.pnl.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-theme-tertiary border border-theme-secondary p-3">
                    <div className="text-xs text-theme-secondary">Equity</div>
                    <div className="mt-1 text-sm font-semibold text-theme-primary">$12,480</div>
                  </div>
                  <div className="rounded-xl bg-theme-tertiary border border-theme-secondary p-3">
                    <div className="text-xs text-theme-secondary">Exposure</div>
                    <div className="mt-1 text-sm font-semibold text-theme-primary">$3,210</div>
                  </div>
                  <div className="rounded-xl bg-theme-tertiary border border-theme-secondary p-3">
                    <div className="text-xs text-theme-secondary">Drawdown</div>
                    <div className="mt-1 text-sm font-semibold text-theme-primary">-0.8%</div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {demoEvents.map((ev) => (
                    <div key={ev.id} className="rounded-xl bg-theme-tertiary border border-theme-secondary px-3 py-2 text-xs text-theme-secondary flex items-center justify-between">
                      <span className="truncate">{ev.text}</span>
                      <span className="ml-3 text-[11px] text-theme-muted">live</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
