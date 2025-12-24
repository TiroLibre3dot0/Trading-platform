import { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../context/I18nContext";

const countries = ["Italia", "Spagna", "Regno Unito", "Germania", "Francia"];

type LiveForm = {
  name: string;
  email: string;
  phone: string;
  country: string;
  password: string;
};

const Register = () => {
  const { t } = useI18n();
  const [agree, setAgree] = useState(true);
  const [form, setForm] = useState<LiveForm>({
    name: "",
    email: "",
    phone: "",
    country: countries[0],
    password: "",
  });

  const update = (key: keyof LiveForm, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return alert(t.register.agree);
    alert(`${t.register.ctaLive}: ${form.name || form.email}\n${form.country}`);
  };

  return (
    <section className="section-shell grid lg:grid-cols-2 gap-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-100 text-xs font-semibold">
          {t.register.highlightFast}
        </div>
        <h1 className="text-4xl font-bold text-slate-900">{t.register.titleLive}</h1>
        <p className="text-lg text-slate-600">{t.register.subtitleLive}</p>
        <div className="flex gap-3 text-sm text-brand-700">
          <span className="px-3 py-1 rounded-full bg-brand-50 border border-brand-100">{t.register.highlightProtected}</span>
          <span className="px-3 py-1 rounded-full bg-brand-50 border border-brand-100">{t.register.highlightSupport}</span>
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
              {t.register.phone}
              <input
                className="w-full rounded-xl border border-brand-200 bg-white px-3 py-2 text-base"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+39 ..."
              />
            </label>
          </div>

          <label className="space-y-1 text-sm text-slate-700">
            {t.register.password}
            <input
              type="password"
              className="w-full rounded-xl border border-brand-200 bg-white px-3 py-2 text-base"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              minLength={6}
              required
            />
          </label>

          <label className="flex items-start gap-3 text-sm text-slate-700">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-brand-300 text-brand-600 focus:ring-brand-300"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <span>{t.register.agree}</span>
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-brand-600 text-white font-semibold py-3 hover:bg-brand-500 transition shadow-md shadow-brand-200/60"
          >
            {t.register.ctaLive}
          </button>
        </form>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>{t.register.altDemo}</span>
          <Link to="/register-demo" className="text-brand-700 font-semibold">
            {t.nav.demo}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Register;
