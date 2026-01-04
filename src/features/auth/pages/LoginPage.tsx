import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaApple, FaFacebookF, FaGoogle } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import AuthFormCard from "../components/AuthFormCard";

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

const isValidEmail = (value: string) => {
  const v = value.trim();
  return v.includes("@") && v.includes(".");
};

export default function LoginPage() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = (location.state as any)?.from?.pathname as string | undefined;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState<string>("");
  const [showSocial, setShowSocial] = useState(false);

  useEffect(() => {
    if (user) navigate(fromPath || "/trade", { replace: true });
  }, [user, navigate, fromPath]);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = "Email is required.";
    else if (!isValidEmail(email)) e.email = "Enter a valid email.";

    if (!password) e.password = "Password is required.";
    else if (password.length < 4) e.password = "Password is too short.";

    return e;
  }, [email, password]);

  const canSubmit = Object.keys(errors).length === 0;

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setTouched({ email: true, password: true });

    if (!canSubmit) {
      setSubmitError("Oops — check the highlighted fields.");
      return;
    }

    setSubmitError("");
    // Keep existing auth contract
    signIn(email.trim());
    navigate(fromPath || "/trade");
  };

  const inputBase =
    "h-10 w-full rounded-xl bg-white px-3 text-[15px] text-navy-900 ring-1 ring-navy-300 placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-600";
  const inputInvalid = "ring-rose-200 focus:ring-rose-400";

  const fieldError = (key: string) => (touched[key] ? errors[key] : "");

  const socialSignIn = (provider: "google" | "apple" | "facebook") => {
    // Placeholder (UI only): keep current auth contract
    setSubmitError(`Social login (${provider}) isn't wired yet.`);
  };

  return (
    <AuthFormCard title="Welcome back" subtitle="Pick up where you left off.">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {/* Social login (collapsed to save vertical space) */}
        <div>
          <button
            type="button"
            onClick={() => setShowSocial((s) => !s)}
            className="h-10 w-full rounded-xl bg-white/70 px-3 text-sm font-semibold text-navy-800 ring-1 ring-black/10 transition-colors hover:bg-white"
          >
            Social login
          </button>
          {showSocial ? (
            <div className="mt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => socialSignIn("google")}
                className="h-10 w-10 rounded-full bg-white ring-1 ring-navy-200 hover:bg-navy-50 transition-colors flex items-center justify-center"
                aria-label="Continue with Google"
                title="Google"
              >
                <FaGoogle className="h-5 w-5 text-navy-900" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => socialSignIn("apple")}
                className="h-10 w-10 rounded-full bg-white ring-1 ring-navy-200 hover:bg-navy-50 transition-colors flex items-center justify-center"
                aria-label="Continue with Apple"
                title="Apple"
              >
                <FaApple className="h-5 w-5 text-navy-900" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => socialSignIn("facebook")}
                className="h-10 w-10 rounded-full bg-white ring-1 ring-navy-200 hover:bg-navy-50 transition-colors flex items-center justify-center"
                aria-label="Continue with Facebook"
                title="Facebook"
              >
                <FaFacebookF className="h-5 w-5 text-navy-900" aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>

            <div>
              <label htmlFor="email" className="text-sm font-semibold text-navy-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                className={cx(inputBase, fieldError("email") && inputInvalid)}
                autoComplete="email"
                aria-invalid={!!fieldError("email")}
                aria-describedby={fieldError("email") ? "email-error" : undefined}
              />
              {fieldError("email") ? (
                <div id="email-error" className="mt-1 text-xs font-medium text-rose-600">
                  {fieldError("email")}
                </div>
              ) : null}
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-semibold text-navy-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                className={cx(inputBase, fieldError("password") && inputInvalid)}
                autoComplete="current-password"
                aria-invalid={!!fieldError("password")}
                aria-describedby={fieldError("password") ? "password-error" : undefined}
              />
              {fieldError("password") ? (
                <div id="password-error" className="mt-1 text-xs font-medium text-rose-600">
                  {fieldError("password")}
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-navy-700 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-navy-300 text-brand-600 focus:ring-brand-600"
                />
                Keep me signed in
              </label>

              <a href="#" className="text-sm font-semibold text-brand-600 hover:underline">
                Forgot it?
              </a>
            </div>

            {submitError ? (
              <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 ring-1 ring-rose-100" role="alert">
                {submitError}
              </div>
            ) : null}

            <button
              type="submit"
              className={cx(
                "h-11 w-full rounded-xl bg-brand-600 text-[15px] font-semibold text-white ring-1 ring-brand-700/40 transition-colors",
                "hover:bg-brand-700 active:bg-brand-800"
              )}
            >
              Continue
            </button>

            <div className="text-center text-sm text-navy-600">
              No account?{" "}
              <Link to="/signup" className="font-semibold text-brand-600 hover:underline">
                Sign up
              </Link>
            </div>
        </form>
    </AuthFormCard>
  );
}
