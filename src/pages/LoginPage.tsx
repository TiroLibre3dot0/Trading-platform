import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Mode = "login" | "signup";

const isValidEmail = (value: string) => {
  const v = value.trim();
  return v.includes("@") && v.includes(".");
};

const classNames = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

const Segmented = ({
  value,
  onChange,
}: {
  value: Mode;
  onChange: (next: Mode) => void;
}) => {
  return (
    <div className="relative rounded-full bg-navy-100 p-1 ring-1 ring-navy-200">
      <div
        className={classNames(
          "pointer-events-none absolute inset-y-1 w-1/2 rounded-full bg-navy-900 shadow-card transition-transform duration-300",
          value === "signup" && "translate-x-full"
        )}
        aria-hidden="true"
      />
      <div className="relative grid grid-cols-2">
        <button
          type="button"
          className={classNames(
            "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
            value === "login" ? "text-white" : "text-navy-700 hover:text-navy-900"
          )}
          onClick={() => onChange("login")}
          aria-pressed={value === "login"}
        >
          Login
        </button>
        <button
          type="button"
          className={classNames(
            "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
            value === "signup" ? "text-white" : "text-navy-700 hover:text-navy-900"
          )}
          onClick={() => onChange("signup")}
          aria-pressed={value === "signup"}
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = (location.state as any)?.from?.pathname as string | undefined;

  const [mode, setMode] = useState<Mode>("login");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState<string>("");

  useEffect(() => {
    if (user) navigate(fromPath || "/trade", { replace: true });
  }, [user, navigate, fromPath]);

  useEffect(() => {
    setSubmitError("");
  }, [mode]);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};

    if (!email.trim()) e.email = "Email is required.";
    else if (!isValidEmail(email)) e.email = "Enter a valid email.";

    if (!password) e.password = "Password is required.";
    else if (password.length < 4) e.password = "Password is too short.";

    if (mode === "signup") {
      if (!firstName.trim()) e.firstName = "First name is required.";
      if (!lastName.trim()) e.lastName = "Last name is required.";
      if (!password2) e.password2 = "Please confirm your password.";
      else if (password2 !== password) e.password2 = "Passwords do not match.";
    }

    return e;
  }, [email, password, password2, firstName, lastName, mode]);

  const canSubmit = Object.keys(errors).length === 0;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      password2: true,
    });

    if (!canSubmit) {
      setSubmitError("Please fix the highlighted fields.");
      return;
    }

    setSubmitError("");
    // Current auth is intentionally lightweight: keep the existing contract.
    signIn(email.trim());
    navigate(fromPath || "/trade");
  };

  const inputBase =
    "h-11 w-full rounded-xl bg-white px-3 text-[15px] text-navy-900 ring-1 ring-navy-300 placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-600";

  const inputInvalid = "ring-rose-200 focus:ring-rose-400";

  const fieldError = (key: string) => (touched[key] ? errors[key] : "");

  return (
    <div className="relative min-h-screen bg-navy-900">
      {/* Layer 1: animated trading environment */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-slate-925" />
        <div className="auth-vignette absolute inset-0 opacity-[0.10]" />
        <div className="auth-noise absolute inset-0 opacity-[0.06]" />
      </div>

      {/* Layout */}
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-10">
        <div className="w-full max-w-[440px]">
          <div className="relative rounded-3xl bg-white p-5 shadow-card ring-1 ring-navy-200">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-navy-200/40 to-transparent" aria-hidden="true" />

              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-2">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-navy-900 text-white">
                      <span className="text-sm font-black tracking-wide">BW</span>
                    </div>
                    <div>
                      <div className="text-base font-semibold text-navy-900">Bullwaves</div>
                      <div className="text-sm text-navy-500">Secure access to your trading workspace</div>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block">
                  <div className="rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-600 ring-1 ring-navy-100">
                    {mode === "login" ? "Welcome back" : "Create account"}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Segmented value={mode} onChange={setMode} />
              </div>

              <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
                {mode === "signup" && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className="text-sm font-semibold text-navy-700">
                        First name
                      </label>
                      <input
                        id="firstName"
                        value={firstName}
                        onChange={(ev) => setFirstName(ev.target.value)}
                        onBlur={() => setTouched((p) => ({ ...p, firstName: true }))}
                        className={classNames(inputBase, fieldError("firstName") && inputInvalid)}
                        autoComplete="given-name"
                        aria-invalid={!!fieldError("firstName")}
                        aria-describedby={fieldError("firstName") ? "firstName-error" : undefined}
                      />
                      <div id="firstName-error" className="mt-1 min-h-4 text-xs font-medium text-rose-600">
                        {fieldError("firstName")}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="lastName" className="text-sm font-semibold text-navy-700">
                        Last name
                      </label>
                      <input
                        id="lastName"
                        value={lastName}
                        onChange={(ev) => setLastName(ev.target.value)}
                        onBlur={() => setTouched((p) => ({ ...p, lastName: true }))}
                        className={classNames(inputBase, fieldError("lastName") && inputInvalid)}
                        autoComplete="family-name"
                        aria-invalid={!!fieldError("lastName")}
                        aria-describedby={fieldError("lastName") ? "lastName-error" : undefined}
                      />
                      <div id="lastName-error" className="mt-1 min-h-4 text-xs font-medium text-rose-600">
                        {fieldError("lastName")}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="text-sm font-semibold text-navy-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    inputMode="email"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                    className={classNames(inputBase, fieldError("email") && inputInvalid)}
                    autoComplete="email"
                    aria-invalid={!!fieldError("email")}
                    aria-describedby={fieldError("email") ? "email-error" : undefined}
                  />
                  <div id="email-error" className="mt-1 min-h-4 text-xs font-medium text-rose-600">
                    {fieldError("email")}
                  </div>
                </div>

                <div className={classNames("grid gap-4", mode === "signup" ? "sm:grid-cols-2" : "grid-cols-1")}>
                  <div>
                    <label htmlFor="password" className="text-sm font-semibold text-navy-700">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(ev) => setPassword(ev.target.value)}
                      onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                      className={classNames(inputBase, fieldError("password") && inputInvalid)}
                      autoComplete={mode === "login" ? "current-password" : "new-password"}
                      aria-invalid={!!fieldError("password")}
                      aria-describedby={fieldError("password") ? "password-error" : undefined}
                    />
                    <div id="password-error" className="mt-1 min-h-4 text-xs font-medium text-rose-600">
                      {fieldError("password")}
                    </div>
                  </div>

                  {mode === "signup" && (
                    <div>
                      <label htmlFor="password2" className="text-sm font-semibold text-navy-700">
                        Confirm
                      </label>
                      <input
                        id="password2"
                        type="password"
                        value={password2}
                        onChange={(ev) => setPassword2(ev.target.value)}
                        onBlur={() => setTouched((p) => ({ ...p, password2: true }))}
                        className={classNames(inputBase, fieldError("password2") && inputInvalid)}
                        autoComplete="new-password"
                        aria-invalid={!!fieldError("password2")}
                        aria-describedby={fieldError("password2") ? "password2-error" : undefined}
                      />
                      <div id="password2-error" className="mt-1 min-h-4 text-xs font-medium text-rose-600">
                        {fieldError("password2")}
                      </div>
                    </div>
                  )}
                </div>

                <div className="min-h-[52px]">
                  {submitError ? (
                    <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 ring-1 ring-rose-100" role="alert">
                      {submitError}
                    </div>
                  ) : null}
                </div>

                <button
                  type="submit"
                  className={classNames(
                    "h-11 w-full rounded-xl bg-brand-600 text-sm font-semibold text-white ring-1 ring-brand-700/40 transition-colors",
                    "hover:bg-brand-700 active:bg-brand-800"
                  )}
                >
                  {mode === "login" ? "Continue" : "Create account"}
                </button>

                <div className="text-center text-sm text-navy-500">
                  {mode === "login" ? (
                    <>
                      No account?{" "}
                      <button type="button" onClick={() => setMode("signup")} className="font-semibold text-brand-600 hover:underline">
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already registered?{" "}
                      <button type="button" onClick={() => setMode("login")} className="font-semibold text-brand-600 hover:underline">
                        Sign in
                      </button>
                    </>
                  )}
                </div>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;