import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

export default function AuthLayout({
  children,
  backgroundImageUrl,
  panelPosition = "left",
  panelSize = "normal",
}: {
  children: React.ReactNode;
  backgroundImageUrl?: string;
  panelPosition?: "left" | "mid" | "right";
  panelSize?: "normal" | "wide";
}) {
  useEffect(() => {
    if (!backgroundImageUrl) return;
    try {
      const img = new Image();
      img.decoding = 'async';
      img.src = backgroundImageUrl;
    } catch (_err) {
      // ignore
    }
  }, [backgroundImageUrl]);

  return (
    <div className="relative min-h-screen bg-navy-900">
      {/* Top-left brand (outside modal) */}
      <div className="absolute left-5 top-5 z-20">
        <Link
          to="/"
          className="inline-flex items-center rounded-xl bg-white/10 p-2 backdrop-blur-sm ring-1 ring-white/15 transition-colors hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-brand-600/40"
          aria-label="Go to homepage"
        >
          <img src="/Logo.png" alt="Bullwaves" className="h-9 w-auto" />
        </Link>
      </div>

      {/* Full-page background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-925 via-navy-900 to-navy-900" />
        {backgroundImageUrl ? (
          <>
            <div
              className="absolute inset-0 bg-center bg-cover"
              style={{ backgroundImage: `url(${backgroundImageUrl})` }}
            />
            <div className="absolute inset-0 bg-black/45" />
          </>
        ) : null}
        <div className="auth-vignette absolute inset-0 opacity-[0.10]" />
        <div className="auth-noise absolute inset-0 opacity-[0.06]" />
      </div>

      {/* Embedded access panel (not a modal) */}
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="relative w-full min-h-[560px]">
          <div
            className={cx(
              "auth-panel",
              panelPosition === "mid" && "auth-panel--mid",
              panelPosition === "right" && "auth-panel--right",
              panelSize === "wide" && "auth-panel--wide"
            )}
          >
            <div className="auth-card bg-navy-50/80 backdrop-blur-sm border border-black/5 rounded-xl overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
