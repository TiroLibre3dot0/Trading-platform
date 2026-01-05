import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

export default function AuthLayout({
  children,
  backgroundImageUrl,
  panelPosition: _panelPosition = "left",
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
    <div
      className="tp-login-shell"
      style={backgroundImageUrl ? { backgroundImage: `radial-gradient(120% 120% at 10% 10%, rgba(12,27,50,0.92) 0%, rgba(5,13,29,0.92) 45%, rgba(4,9,21,0.96) 100%), url('${backgroundImageUrl}')` } : undefined}
    >
      <Link to="/" className="tp-login-brand" aria-label="Go to homepage">
        <img src="/Logo.png" alt="Bullwaves" className="tp-login-brand-img" />
      </Link>

      <div className={cx("tp-login-card", panelSize === "wide" && "tp-login-card--wide")}>
        {children}
      </div>
    </div>
  );
}
