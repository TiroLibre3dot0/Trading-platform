import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function AuthShell() {
  const location = useLocation();
  const path = location.pathname;
  const panelPosition = "left";
  const panelSize = path.startsWith("/signup") ? "wide" : "normal";

  return (
    <AuthLayout backgroundImageUrl="/auth-trader-bg.jpg" panelPosition={panelPosition} panelSize={panelSize}>
      <Outlet />
    </AuthLayout>
  );
}
