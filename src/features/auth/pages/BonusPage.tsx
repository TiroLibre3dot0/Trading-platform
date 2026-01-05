import React from "react";
import { Link } from "react-router-dom";
import AuthFormCard from "../components/AuthFormCard";

export default function BonusPage() {
  return (
    <AuthFormCard title="Welcome bonus" subtitle="Enable a 100% deposit bonus on your account.">
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-[11px] font-extrabold uppercase tracking-wide text-navy-600">Account feature</div>
          <div className="mt-1 text-2xl font-extrabold leading-tight text-white">100% deposit bonus</div>
          <div className="mt-2 text-[13px] text-navy-600">Available after signup. Applies to your first deposit.</div>
        </div>

        <div className="pt-1">
          <img src="/Logo.png" alt="Bullwaves" className="mx-auto h-10 w-auto opacity-95" />
          <div className="mt-2 text-center text-[13px] font-semibold text-navy-600">Included with your Bullwaves account.</div>
        </div>

        <Link to="/signup" className="tp-login-btn block text-center">
          Create account
        </Link>

        <div className="text-center" style={{ color: "rgba(159,179,200,0.95)", fontSize: 13 }}>
          Already registered?{" "}
          <Link to="/login" className="tp-login-link">
            Sign in
          </Link>
        </div>

        <div className="text-center text-[11px] text-navy-600">Terms apply.</div>
      </div>
    </AuthFormCard>
  );
}
