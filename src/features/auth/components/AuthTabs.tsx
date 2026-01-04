import React from "react";
import { Link, useLocation } from "react-router-dom";

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

type Tab = { label: string; to: string; key: "login" | "signup" };

const tabs: Tab[] = [
  { key: "login", label: "Login", to: "/login" },
  { key: "signup", label: "Sign up", to: "/signup" },
];

export default function AuthTabs() {
  const location = useLocation();
  const activeKey: "login" | "signup" = location.pathname.startsWith("/signup") ? "signup" : "login";

  return (
    <div className="relative rounded-full bg-white/60 p-1 ring-1 ring-black/5">
      <div
        className={cx(
          "pointer-events-none absolute inset-y-1 w-1/2 rounded-full bg-white ring-1 ring-black/5 transition-transform duration-300",
          activeKey === "signup" && "translate-x-full"
        )}
        aria-hidden="true"
      />
      <div className="relative grid grid-cols-2">
        {tabs.map((t) => {
          const active = t.key === activeKey;
          return (
            <Link
              key={t.key}
              to={t.to}
              className={cx(
                "rounded-full px-4 py-2 text-center text-[13px] font-semibold transition-colors",
                active ? "text-navy-900" : "text-navy-600 hover:text-navy-900"
              )}
              aria-current={active ? "page" : undefined}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
