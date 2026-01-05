import React from "react";
import { Link } from "react-router-dom";
import AuthFormCard from "../components/AuthFormCard";

export default function BonusPage() {
  return (
    <AuthFormCard title="Welcome bonus" subtitle="Enable a 100% deposit bonus on your account.">
      <div className="space-y-4">
        <div className="pt-1">
          <img src="/Logo.png" alt="Bullwaves" className="mx-auto h-10 w-auto opacity-90" />
        </div>

        <div
          className="rounded-2xl p-[1px]"
          style={{
            background: "linear-gradient(135deg, rgba(27,77,184,0.38) 0%, rgba(37,208,242,0.22) 55%, rgba(37,208,242,0.12) 100%)",
          }}
        >
          <div
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
            style={{
              boxShadow:
                "0 26px 70px rgba(0,0,0,0.42), 0 0 0 1px rgba(255,255,255,0.04) inset, 0 0 44px rgba(37,208,242,0.10)",
            }}
          >
            <div className="text-center">
              <div className="text-[11px] font-extrabold uppercase tracking-wide text-navy-600">Account feature</div>

              <div className="mt-1 text-[32px] font-extrabold leading-[1.05] text-white">100% Deposit Bonus</div>

              <div className="mt-3 space-y-1 text-[13px] text-navy-600">
                <div>Applies to your first deposit only.</div>
                <div>Optional — you can continue without it.</div>
                <div>Included with your Bullwaves account.</div>
              </div>
            </div>
          </div>
        </div>

        <Link
          to="/signup"
          className="tp-login-btn block text-center"
          style={{ boxShadow: "0 18px 48px rgba(37,208,242,0.14)" }}
        >
          Activate bonus & create account
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
