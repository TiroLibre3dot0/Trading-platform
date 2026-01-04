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
    <div className="px-4 py-4 sm:px-5 h-full">
      <AuthTabs />

      <div className="mt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="text-base font-semibold text-navy-900">{title}</div>
          {headerAction ? <div className="pt-0.5">{headerAction}</div> : null}
        </div>
        {subtitle ? <div className="mt-0.5 text-[11px] text-navy-600">{subtitle}</div> : null}
      </div>

      <div className="mt-3">{children}</div>
    </div>
  );
}
