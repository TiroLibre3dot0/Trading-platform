import React from "react";
import { Link } from "react-router-dom";
import { FiGift } from "react-icons/fi";
import AuthFormCard from "../components/AuthFormCard";

export default function BonusPage() {
  return (
    <AuthFormCard title="Regalo di benvenuto" subtitle="Sblocca il bonus del 100% sul deposito.">
      <div className="space-y-4">
        {/* Gift hero */}
        <div className="relative overflow-hidden rounded-2xl bg-white/70 px-5 py-4 ring-1 ring-black/5">
          <div
            className="absolute inset-0 opacity-100"
            style={{
              background:
                "linear-gradient(135deg, rgba(0,54,255,0.18) 0%, rgba(255,255,255,0.55) 45%, rgba(0,54,255,0.12) 100%)",
            }}
            aria-hidden="true"
          />
          <div className="promo-attention-shine opacity-90" aria-hidden="true" />

          <div className="relative flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-600 text-white ring-1 ring-brand-700/40">
              <FiGift className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-extrabold uppercase tracking-wide text-navy-700">Bonus di benvenuto</div>
              <div className="text-lg font-extrabold text-navy-900 leading-tight">100% del deposito</div>
            </div>
          </div>

          <div className="relative mt-2 flex flex-wrap items-center gap-2">
            <div className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-semibold text-navy-700 ring-1 ring-black/5">
              Attivalo in 2 step
            </div>
            <div className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-semibold text-navy-700 ring-1 ring-black/5">
              Subito disponibile
            </div>
          </div>
        </div>

        {/* Brand highlight */}
        <div className="pt-1">
          <img src="/Logo.png" alt="Bullwaves" className="mx-auto h-10 w-auto" />
          <div className="mt-2 text-center text-[13px] font-semibold text-navy-800">
            Un regalo esclusivo Bullwaves — attivalo ora
          </div>
        </div>

        {/* CTAs */}
        <Link
          to="/signup"
          className="block h-11 w-full rounded-xl bg-brand-600 text-center text-[15px] font-semibold leading-[44px] text-white ring-1 ring-brand-700/40 transition-colors hover:bg-brand-700 active:bg-brand-800"
        >
          Sblocca il regalo (Registrati)
        </Link>

        <Link
          to="/login"
          className="block h-11 w-full rounded-xl bg-white/80 text-center text-[15px] font-semibold leading-[44px] text-navy-900 ring-1 ring-black/10 transition-colors hover:bg-white"
        >
          Ho già un account (Accedi)
        </Link>

        <div className="text-center text-[11px] text-navy-600">Termini e condizioni applicabili.</div>
      </div>
    </AuthFormCard>
  );
}
