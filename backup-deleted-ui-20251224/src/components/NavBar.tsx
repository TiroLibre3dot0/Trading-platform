import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";

const languages: { code: "it" | "en" | "es" | "fr" | "de"; label: string }[] = [
  { code: "it", label: "IT" },
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "fr", label: "FR" },
  { code: "de", label: "DE" },
];

const NavBar = () => {
  const { user } = useAuth();
  const { t, lang, setLang } = useI18n();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { label: t.nav.markets, href: "#markets" },
    { label: t.nav.why, href: "#why-us" },
    { label: t.nav.accounts, href: "#accounts" },
    { label: t.nav.support, href: "#support" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050b18]/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      <div className="section-shell py-3 flex items-center gap-3 text-white">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-lg overflow-hidden bg-white/5 border border-white/10 shadow-sm flex items-center justify-center">
            <img src="/Logo.png" alt="Bullwaves" className="h-7 w-7 object-contain" />
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-base text-white">Bullwaves</div>
            <div className="text-[11px] text-white/60">Ride the waves</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 ml-8 text-[13px] font-semibold text-white/70">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="group relative pb-1 transition text-white/70 hover:text-white"
            >
              {item.label}
              <span className="absolute left-0 -bottom-0.5 h-[2px] w-0 bg-brand-300 transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `relative pb-1 transition ${isActive ? "text-brand-200" : "text-white/70 hover:text-white"}`
            }
          >
            {t.nav.profile}
            <span className={`absolute left-0 -bottom-0.5 h-[2px] w-full bg-brand-300 transition-all duration-200 origin-left ${pathname === "/profile" ? "scale-x-100" : "scale-x-0"}`} />
          </NavLink>
          <NavLink
            to="/qlik-lab"
            className={({ isActive }) =>
              `relative pb-1 transition ${isActive ? "text-brand-200" : "text-white/70 hover:text-white"}`
            }
          >
            Qlik lab
            <span className={`absolute left-0 -bottom-0.5 h-[2px] w-full bg-brand-300 transition-all duration-200 origin-left ${pathname === "/qlik-lab" ? "scale-x-100" : "scale-x-0"}`} />
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <button
            className="lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 hover:text-white hover:border-white/20 transition"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className="w-5 h-[1.5px] bg-white block mb-1.5 transition" style={{ transform: open ? "translateY(5px) rotate(45deg)" : "none" }} />
            <span className="w-5 h-[1.5px] bg-white block transition" style={{ opacity: open ? 0 : 1 }} />
            <span className="w-5 h-[1.5px] bg-white block mt-1.5 transition" style={{ transform: open ? "translateY(-5px) rotate(-45deg)" : "none" }} />
          </button>

          <div className="hidden sm:flex items-center gap-1 text-[12px] font-semibold text-white/60">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-1.5 py-0.5 rounded transition ${
                  lang === l.code ? "text-brand-200 bg-white/10" : "hover:text-brand-200"
                }`}
                aria-label={`Switch to ${l.label}`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              `hidden md:inline-flex px-3.5 py-2 rounded-lg text-[13px] font-semibold border border-white/10 bg-white/5 text-white/80 hover:text-white hover:border-white/25 transition ${
                isActive ? "border-brand-300 text-white" : ""
              }`
            }
          >
            {t.nav.login}
          </NavLink>
          <NavLink
            to="/register-demo"
            className={({ isActive }) =>
              `hidden md:inline-flex px-3.5 py-2 rounded-lg text-[13px] font-semibold border border-white/10 bg-white/5 text-white/80 hover:text-white hover:border-white/25 transition ${
                isActive ? "border-brand-300 text-white" : ""
              }`
            }
          >
            {t.nav.demo}
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              `inline-flex px-4 py-2 rounded-lg text-[13px] font-semibold bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 text-white ring-1 ring-brand-400/40 shadow-[0_10px_30px_rgba(0,102,255,0.25)] hover:translate-y-[-1px] hover:shadow-[0_14px_40px_rgba(0,102,255,0.35)] transition ${
                isActive ? "ring-brand-300" : ""
              }`
            }
          >
            {t.nav.open}
          </NavLink>
        </div>
      </div>

      <div
        className={`lg:hidden border-t border-white/10 bg-[#050b18]/95 backdrop-blur-xl transition-all duration-200 origin-top ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="section-shell py-4 flex flex-col gap-3 text-sm text-white/80">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-2 py-2 rounded-lg hover:bg-white/5 hover:text-white transition"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <NavLink
            to="/profile"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `px-2 py-2 rounded-lg hover:bg-white/5 transition ${isActive ? "text-brand-200" : "text-white/80"}`
            }
          >
            {t.nav.profile}
          </NavLink>
          <NavLink
            to="/qlik-lab"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `px-2 py-2 rounded-lg hover:bg-white/5 transition ${isActive ? "text-brand-200" : "text-white/80"}`
            }
          >
            Qlik lab
          </NavLink>
          <div className="border-t border-white/10 pt-3 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[12px] font-semibold">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    setOpen(false);
                  }}
                  className={`px-2 py-1 rounded-lg border border-white/10 bg-white/5 transition ${
                    lang === l.code ? "text-brand-200 border-brand-300/60" : "text-white/70 hover:text-white"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <NavLink
              to="/login"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white/80 hover:text-white hover:border-white/25 transition ${
                  isActive ? "border-brand-300 text-white" : ""
                }`
              }
            >
              {t.nav.login}
            </NavLink>
            <NavLink
              to="/register-demo"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-white/80 hover:text-white hover:border-white/25 transition ${
                  isActive ? "border-brand-300 text-white" : ""
                }`
              }
            >
              {t.nav.demo}
            </NavLink>
            <NavLink
              to="/register"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-[13px] font-semibold bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 text-white ring-1 ring-brand-400/40 shadow-[0_10px_30px_rgba(0,102,255,0.25)] hover:translate-y-[-1px] hover:shadow-[0_14px_40px_rgba(0,102,255,0.35)] transition ${
                  isActive ? "ring-brand-300" : ""
                }`
              }
            >
              {t.nav.open}
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
