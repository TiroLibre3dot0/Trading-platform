import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function AuthShell() {
  const location = useLocation();
  const panelSide = location.pathname.startsWith("/signup") ? "right" : "left";
  const panelSize = location.pathname.startsWith("/signup") ? "wide" : "normal";

  return (
    <AuthLayout backgroundImageUrl="/auth-trader-bg.jpg" panelSide={panelSide} panelSize={panelSize}>
      <Outlet />
    </AuthLayout>
  );
}
