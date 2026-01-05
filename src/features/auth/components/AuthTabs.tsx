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
    <div className="tp-auth-tabs">
      <div
        className={cx(
          "tp-auth-tabs-slider",
          activeKey === "signup" && "translate-x-full"
        )}
        aria-hidden="true"
      />
      <div className="tp-auth-tabs-grid">
        {tabs.map((t) => {
          const active = t.key === activeKey;
          return (
            <Link
              key={t.key}
              to={t.to}
              className={cx(
                "tp-auth-tab",
                active && "tp-auth-tab--active"
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
