import React from "react";
import AuthTabs from "./AuthTabs";

export default function AuthFormCard({
  title,
  subtitle,
  headerAction,
  children,
}: {
  title: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <AuthTabs />

      <div className="mt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="tp-login-title" style={{ fontSize: 18, margin: 0 }}>{title}</div>
          {headerAction ? <div className="pt-0.5">{headerAction}</div> : null}
        </div>
        {subtitle ? <div className="tp-login-subtitle" style={{ marginTop: 6 }}>{subtitle}</div> : null}
      </div>

      <div className="mt-3">{children}</div>
    </div>
  );
}
