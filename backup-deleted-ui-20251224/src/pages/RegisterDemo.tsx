import { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../context/I18nContext";

const countries = ["Italia", "Spagna", "Regno Unito", "Germania", "Francia"];
const balances = ["10,000", "50,000", "100,000"];

type DemoForm = {
  name: string;
  email: string;
  country: string;
  balance: string;
  leverage: number;
};

const RegisterDemo = () => {
  const { t } = useI18n();
  const [form, setForm] = useState<DemoForm>({
    name: "",
    email: "",
    country: countries[0],
    balance: balances[1],
    leverage: 200,
  });

  const update = (key: keyof DemoForm, value: string | number) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`${t.register.ctaDemo}: ${form.name || form.email}\n${form.balance} USD | 1:${form.leverage}`);
  };

  return (
    <section className="section-shell grid lg:grid-cols-2 gap-8 items-start">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-100 text-xs font-semibold">
          {t.register.titleDemo}
        </div>
        <h1 className="text-4xl font-bold text-slate-900">{t.register.subtitleDemo}</h1>
        <p className="text-lg text-slate-600">{t.demo.desc}</p>
        <div className="grid sm:grid-cols-3 gap-3 text-sm text-brand-700">
          <span className="px-3 py-2 rounded-xl bg-white border border-brand-100">{t.register.highlightFast}</span>
          <span className="px-3 py-2 rounded-xl bg-white border border-brand-100">{t.register.highlightProtected}</span>
          <span className="px-3 py-2 rounded-xl bg-white border border-brand-100">{t.register.highlightSupport}</span>
        </div>
      </div>

      <div className="card p-8 space-y-5">
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="space-y-1 text-sm text-slate-700">
              {t.register.name}
              <input
                className="w-full rounded-xl border border-brand-200 bg-white px-3 py-2 text-base"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
            </label>
            <label className="space-y-1 text-sm text-slate-700">
              {t.register.email}
              <input
                type="email"
                className="w-full rounded-xl border border-brand-200 bg-white px-3 py-2 text-base"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </label>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="space-y-1 text-sm text-slate-700">
              {t.register.country}
              <select
                className="w-full rounded-xl border border-brand-200 bg-white px-3 py-2 text-base"
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
              >
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm text-slate-700">
              {t.register.balance}
              <select
                className="w-full rounded-xl border border-brand-200 bg-white px-3 py-2 text-base"
                value={form.balance}
                onChange={(e) => update("balance", e.target.value)}
              >
                {balances.map((b) => (
                  <option key={b} value={b}>{`$${b}`}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="space-y-2 text-sm text-slate-700">
            {t.register.leverage} 1:{form.leverage}
            <input
              type="range"
              min={50}
              max={500}
              step={50}
              value={form.leverage}
              onChange={(e) => update("leverage", Number(e.target.value))}
              className="w-full accent-brand-600"
            />
            <div className="text-xs text-slate-500">{t.register.leverageHint}</div>
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-brand-600 text-white font-semibold py-3 hover:bg-brand-500 transition shadow-md shadow-brand-200/60"
          >
            {t.register.ctaDemo}
          </button>
        </form>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>{t.register.altLive}</span>
          <Link to="/register" className="text-brand-700 font-semibold">
            {t.register.titleLive}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RegisterDemo;
