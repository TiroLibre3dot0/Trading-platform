import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaApple, FaFacebookF, FaGoogle } from "react-icons/fa";
import { FiGift } from "react-icons/fi";
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

  const inputInvalid = "tp-login-input-wrap--invalid";

  const fieldError = (key: string) => (touched[key] ? errors[key] : "");

  const socialSignIn = (provider: "google" | "apple" | "facebook") => {
    // Placeholder (UI only): keep current auth contract
    setSubmitError(`Social login (${provider}) isn't wired yet.`);
  };

  return (
    <AuthFormCard
      title="Welcome back"
      subtitle="Pick up where you left off."
      headerAction={
        <button
          type="button"
          onClick={() => navigate("/bonus")}
          aria-label="Welcome bonus"
          className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-lg border border-rose-200 bg-rose-50/80 text-rose-600 transition hover:bg-rose-100/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
        >
          <span className="promo-attention-shine opacity-80" aria-hidden="true" />
          <FiGift className="relative h-4 w-4 animate-pulse" />
        </button>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {/* Social login (collapsed to save vertical space) */}
        <div>
          <button
            type="button"
            onClick={() => setShowSocial((s) => !s)}
            className="tp-login-btn"
            style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.10)' }}
          >
            Social login
          </button>
          {showSocial ? (
            <div className="mt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => socialSignIn("google")}
                className="h-10 w-10 rounded-full"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
                aria-label="Continue with Google"
                title="Google"
              >
                <FaGoogle className="h-5 w-5" style={{ color: '#e8f1fb' }} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => socialSignIn("apple")}
                className="h-10 w-10 rounded-full"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
                aria-label="Continue with Apple"
                title="Apple"
              >
                <FaApple className="h-5 w-5" style={{ color: '#e8f1fb' }} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => socialSignIn("facebook")}
                className="h-10 w-10 rounded-full"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)' }}
                aria-label="Continue with Facebook"
                title="Facebook"
              >
                <FaFacebookF className="h-5 w-5" style={{ color: '#e8f1fb' }} aria-hidden="true" />
              </button>
            </div>
          ) : null}
        </div>

            <div>
              <label htmlFor="email" className="tp-login-label">
                Email
              </label>
              <div className={cx("tp-login-input-wrap", fieldError("email") && inputInvalid)}>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                  className="tp-login-input"
                  autoComplete="email"
                  aria-invalid={!!fieldError("email")}
                  aria-describedby={fieldError("email") ? "email-error" : undefined}
                />
              </div>
              {fieldError("email") ? (
                <div id="email-error" className="tp-login-hint" style={{ color: '#fca5a5' }}>
                  {fieldError("email")}
                </div>
              ) : null}
            </div>

            <div>
              <label htmlFor="password" className="tp-login-label">
                Password
              </label>
              <div className={cx("tp-login-input-wrap", fieldError("password") && inputInvalid)}>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                  className="tp-login-input"
                  autoComplete="current-password"
                  aria-invalid={!!fieldError("password")}
                  aria-describedby={fieldError("password") ? "password-error" : undefined}
                />
              </div>
              {fieldError("password") ? (
                <div id="password-error" className="tp-login-hint" style={{ color: '#fca5a5' }}>
                  {fieldError("password")}
                </div>
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-3">
              <label className="inline-flex items-center gap-2 select-none" style={{ color: 'rgba(159,179,200,0.95)', fontWeight: 700, fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-navy-300 text-brand-600 focus:ring-brand-600"
                />
                Keep me signed in
              </label>

              <a href="#" className="tp-login-link" style={{ fontSize: 13 }}>
                Forgot it?
              </a>
            </div>

            {submitError ? (
              <div className="tp-login-error" role="alert">
                {submitError}
              </div>
            ) : null}

            <button type="submit" className="tp-login-btn">
              Continue
            </button>

            <div className="text-center" style={{ color: 'rgba(159,179,200,0.95)', fontSize: 13 }}>
              No account?{" "}
              <Link to="/signup" className="tp-login-link">
                Sign up
              </Link>
            </div>
        </form>
    </AuthFormCard>
  );
}
