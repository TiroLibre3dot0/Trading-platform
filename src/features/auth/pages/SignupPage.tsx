import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import AuthFormCard from "../components/AuthFormCard";

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

const isValidEmail = (value: string) => {
  const v = value.trim();
  return v.includes("@") && v.includes(".");
};

export default function SignupPage() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = (location.state as any)?.from?.pathname as string | undefined;

  const [step, setStep] = useState<1 | 2>(1);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [promocode, setPromocode] = useState("");
  const [email, setEmail] = useState("");

  // Step 2 (Contact + Legal)
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Italy");
  const [postalCode, setPostalCode] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+39");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [agreeTos, setAgreeTos] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState<string>("");

  useEffect(() => {
    if (user) navigate(fromPath || "/trade", { replace: true });
  }, [user, navigate, fromPath]);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};

    if (!firstName.trim()) e.firstName = "First name is required.";
    if (!lastName.trim()) e.lastName = "Last name is required.";

    if (!email.trim()) e.email = "Email is required.";
    else if (!isValidEmail(email)) e.email = "Enter a valid email.";

    if (!password) e.password = "Password is required.";
    else if (password.length < 4) e.password = "Password is too short.";

    if (!password2) e.password2 = "Please confirm your password.";
    else if (password2 !== password) e.password2 = "Passwords do not match.";

    if (!year.trim()) e.year = "Year is required.";
    if (!month.trim()) e.month = "Month is required.";
    if (!day.trim()) e.day = "Day is required.";

    if (!address.trim()) e.address = "Address is required.";
    if (!city.trim()) e.city = "City is required.";
    if (!country.trim()) e.country = "Country is required.";
    if (!postalCode.trim()) e.postalCode = "Postal Code is required.";
    if (!phoneCountryCode.trim()) e.phoneCountryCode = "Country code is required.";
    if (!phoneNumber.trim()) e.phoneNumber = "Phone Number is required.";
    if (!agreeTos) e.agreeTos = "You must agree to the Terms and Conditions.";
    if (!agreePrivacy) e.agreePrivacy = "You must agree to the Privacy Policy.";

    return e;
  }, [
    email,
    password,
    password2,
    firstName,
    lastName,
    year,
    month,
    day,
    address,
    city,
    country,
    postalCode,
    phoneCountryCode,
    phoneNumber,
    agreeTos,
    agreePrivacy,
  ]);

  const step1Keys = ["firstName", "lastName", "password", "password2", "year", "month", "day", "email"];
  const step2Keys = ["address", "city", "country", "postalCode", "phoneCountryCode", "phoneNumber", "agreeTos", "agreePrivacy"];

  const canSubmitAll = [...step1Keys, ...step2Keys].every((k) => !errors[k]);

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();

    // Submit happens only on step 2 (Create account). Validate everything here.
    setTouched((prev) => ({
      ...prev,
      firstName: true,
      lastName: true,
      password: true,
      password2: true,
      year: true,
      month: true,
      day: true,
      email: true,
      address: true,
      city: true,
      country: true,
      postalCode: true,
      phoneCountryCode: true,
      phoneNumber: true,
      agreeTos: true,
      agreePrivacy: true,
    }));

    if (!canSubmitAll) {
      setSubmitError("Almost there — check the highlighted fields.");
      return;
    }

    setSubmitError("");
    // Keep existing auth contract (UI validation only)
    signIn(email.trim());
    navigate(fromPath || "/trade");
  };

  const inputBase =
    "h-9 w-full rounded-lg bg-white px-2.5 text-[14px] text-navy-900 ring-1 ring-navy-300 placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-brand-600";
  const inputInvalid = "ring-rose-200 focus:ring-rose-400";

  const fieldError = (key: string) => (touched[key] ? errors[key] : "");

  const Stepper = () => (
    <div className="mb-2 flex items-center justify-center gap-2" aria-label="Signup steps">
      <div className={cx("h-2.5 w-2.5 rounded-full", step === 1 ? "bg-brand-600" : "bg-black/20")} aria-hidden="true" />
      <div className={cx("h-2.5 w-2.5 rounded-full", step === 2 ? "bg-brand-600" : "bg-black/20")} aria-hidden="true" />
    </div>
  );

  return (
    <AuthFormCard title="Let’s get you set up" subtitle="A couple quick details and you’re in.">
      <form onSubmit={onSubmit} className="space-y-2" noValidate>
        <Stepper />

        {step === 1 ? (
          <>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="text-xs font-semibold text-navy-700">
              First Name <span className="text-rose-600">*</span>
            </label>
            <input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, firstName: true }))}
              className={cx(inputBase, fieldError("firstName") && inputInvalid)}
              autoComplete="given-name"
              aria-invalid={!!fieldError("firstName")}
              aria-describedby={fieldError("firstName") ? "firstName-error" : undefined}
            />
              {fieldError("firstName") ? (
                <div id="firstName-error" className="mt-0.5 text-[11px] font-medium text-rose-600">
                  {fieldError("firstName")}
                </div>
              ) : null}
          </div>

          <div>
            <label htmlFor="lastName" className="text-xs font-semibold text-navy-700">
              Last Name <span className="text-rose-600">*</span>
            </label>
            <input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, lastName: true }))}
              className={cx(inputBase, fieldError("lastName") && inputInvalid)}
              autoComplete="family-name"
              aria-invalid={!!fieldError("lastName")}
              aria-describedby={fieldError("lastName") ? "lastName-error" : undefined}
            />
              {fieldError("lastName") ? (
                <div id="lastName-error" className="mt-0.5 text-[11px] font-medium text-rose-600">
                  {fieldError("lastName")}
                </div>
              ) : null}
          </div>
        </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
              <label htmlFor="password" className="text-xs font-semibold text-navy-700">
              Password <span className="text-rose-600">*</span>
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, password: true }))}
              className={cx(inputBase, fieldError("password") && inputInvalid)}
              autoComplete="new-password"
              aria-invalid={!!fieldError("password")}
              aria-describedby={fieldError("password") ? "password-error" : undefined}
            />
              {fieldError("password") ? (
                <div id="password-error" className="mt-0.5 text-[11px] font-medium text-rose-600">
                  {fieldError("password")}
                </div>
              ) : null}
          </div>

          <div>
            <label htmlFor="password2" className="text-xs font-semibold text-navy-700">
              Password Confirmation <span className="text-rose-600">*</span>
            </label>
            <input
              id="password2"
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, password2: true }))}
              className={cx(inputBase, fieldError("password2") && inputInvalid)}
              autoComplete="new-password"
              aria-invalid={!!fieldError("password2")}
              aria-describedby={fieldError("password2") ? "password2-error" : undefined}
            />
              {fieldError("password2") ? (
                <div id="password2-error" className="mt-0.5 text-[11px] font-medium text-rose-600">
                  {fieldError("password2")}
                </div>
              ) : null}
          </div>
        </div>

        {/* MetaTrader 5 */}
        <div className="pt-0 text-[10px] font-extrabold uppercase tracking-wide text-navy-500">MetaTrader 5</div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-navy-700">Currency</label>
            <select
              className="h-9 w-full rounded-lg bg-white px-2.5 text-[14px] text-navy-900 ring-1 ring-navy-300 focus:outline-none focus:ring-2 focus:ring-brand-600"
              value="USD"
              disabled
            >
              <option value="USD">USD</option>
            </select>
          </div>

          <div>
            <label htmlFor="promocode" className="text-xs font-semibold text-navy-700">
              Promocode
            </label>
            <input
              id="promocode"
              value={promocode}
              onChange={(e) => setPromocode(e.target.value)}
              className={inputBase}
              placeholder="Optional"
            />
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-navy-700">
            Date Of Birth <span className="text-rose-600">*</span>
          </div>
          <div className="mt-1 grid grid-cols-3 gap-2">
            <div>
              <label htmlFor="dob-year" className="text-xs font-semibold text-navy-600">
                Year
              </label>
              <input
                id="dob-year"
                inputMode="numeric"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, year: true }))}
                className={cx(inputBase, fieldError("year") && inputInvalid)}
                placeholder="YYYY"
                aria-invalid={!!fieldError("year")}
              />
            </div>

            <div>
              <label htmlFor="dob-month" className="text-xs font-semibold text-navy-600">
                Month
              </label>
              <select
                id="dob-month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, month: true }))}
                className={cx(
                  "h-9 w-full rounded-lg bg-white px-2.5 text-[14px] text-navy-900 ring-1 ring-navy-300 focus:outline-none focus:ring-2 focus:ring-brand-600",
                  fieldError("month") && inputInvalid
                )}
                aria-invalid={!!fieldError("month")}
              >
                <option value="">Month</option>
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i + 1} value={String(i + 1)}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="dob-day" className="text-xs font-semibold text-navy-600">
                Day
              </label>
              <select
                id="dob-day"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, day: true }))}
                className={cx(
                  "h-9 w-full rounded-lg bg-white px-2.5 text-[14px] text-navy-900 ring-1 ring-navy-300 focus:outline-none focus:ring-2 focus:ring-brand-600",
                  fieldError("day") && inputInvalid
                )}
                aria-invalid={!!fieldError("day")}
              >
                <option value="">Day</option>
                {Array.from({ length: 31 }).map((_, i) => (
                  <option key={i + 1} value={String(i + 1)}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {fieldError("year") || fieldError("month") || fieldError("day") ? (
            <div className="mt-0.5 text-[11px] font-medium text-rose-600">
              {fieldError("year") || fieldError("month") || fieldError("day")}
            </div>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className="text-xs font-semibold text-navy-700">
            Email <span className="text-rose-600">*</span>
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
            <div id="email-error" className="mt-0.5 text-[11px] font-medium text-rose-600">
              {fieldError("email")}
            </div>
          ) : null}
        </div>

        {submitError ? (
          <div className="rounded-xl bg-rose-50 px-3 py-2 text-[13px] font-semibold text-rose-700 ring-1 ring-rose-100" role="alert">
            {submitError}
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => {
            setSubmitError("");
            setStep(2);
          }}
          className={cx(
            "h-10 w-full rounded-xl bg-brand-600 text-[14px] font-semibold text-white ring-1 ring-brand-700/40 transition-colors",
            "hover:bg-brand-700 active:bg-brand-800"
          )}
        >
          Continue
        </button>

        <div className="text-center text-[13px] text-navy-600">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-brand-600 hover:underline">
            Sign in
          </Link>
        </div>
          </>
        ) : (
          <>
            <div className="text-[10px] font-extrabold uppercase tracking-wide text-navy-500">Contact Information</div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="address" className="text-xs font-semibold text-navy-700">
                  Address <span className="text-rose-600">*</span>
                </label>
                <input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, address: true }))}
                  className={cx(inputBase, fieldError("address") && inputInvalid)}
                  aria-invalid={!!fieldError("address")}
                />
                {fieldError("address") ? <div className="mt-0.5 text-[11px] font-medium text-rose-600">{fieldError("address")}</div> : null}
              </div>

              <div>
                <label htmlFor="city" className="text-xs font-semibold text-navy-700">
                  City <span className="text-rose-600">*</span>
                </label>
                <input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, city: true }))}
                  className={cx(inputBase, fieldError("city") && inputInvalid)}
                  aria-invalid={!!fieldError("city")}
                />
                {fieldError("city") ? <div className="mt-0.5 text-[11px] font-medium text-rose-600">{fieldError("city")}</div> : null}
              </div>

              <div>
                <label htmlFor="country" className="text-xs font-semibold text-navy-700">
                  Country <span className="text-rose-600">*</span>
                </label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, country: true }))}
                  className={cx(
                    "h-9 w-full rounded-lg bg-white px-2.5 text-[14px] text-navy-900 ring-1 ring-navy-300 focus:outline-none focus:ring-2 focus:ring-brand-600",
                    fieldError("country") && inputInvalid
                  )}
                  aria-invalid={!!fieldError("country")}
                >
                  <option value="Italy">Italy</option>
                </select>
                {fieldError("country") ? <div className="mt-0.5 text-[11px] font-medium text-rose-600">{fieldError("country")}</div> : null}
              </div>

              <div>
                <label htmlFor="postalCode" className="text-xs font-semibold text-navy-700">
                  Postal Code <span className="text-rose-600">*</span>
                </label>
                <input
                  id="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, postalCode: true }))}
                  className={cx(inputBase, fieldError("postalCode") && inputInvalid)}
                  aria-invalid={!!fieldError("postalCode")}
                />
                {fieldError("postalCode") ? (
                  <div className="mt-0.5 text-[11px] font-medium text-rose-600">{fieldError("postalCode")}</div>
                ) : null}
              </div>

              <div>
                <label htmlFor="phoneCountryCode" className="text-xs font-semibold text-navy-700">
                  Country Code <span className="text-rose-600">*</span>
                </label>
                <input
                  id="phoneCountryCode"
                  value={phoneCountryCode}
                  onChange={(e) => setPhoneCountryCode(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, phoneCountryCode: true }))}
                  className={cx(inputBase, fieldError("phoneCountryCode") && inputInvalid)}
                  aria-invalid={!!fieldError("phoneCountryCode")}
                />
                {fieldError("phoneCountryCode") ? (
                  <div className="mt-0.5 text-[11px] font-medium text-rose-600">{fieldError("phoneCountryCode")}</div>
                ) : null}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="text-xs font-semibold text-navy-700">
                  Phone Number <span className="text-rose-600">*</span>
                </label>
                <input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onBlur={() => setTouched((p) => ({ ...p, phoneNumber: true }))}
                  className={cx(inputBase, fieldError("phoneNumber") && inputInvalid)}
                  aria-invalid={!!fieldError("phoneNumber")}
                />
                {fieldError("phoneNumber") ? (
                  <div className="mt-0.5 text-[11px] font-medium text-rose-600">{fieldError("phoneNumber")}</div>
                ) : null}
              </div>
            </div>

            <div className="pt-0 text-[10px] font-extrabold uppercase tracking-wide text-navy-500">Legal Information</div>

            <div className="space-y-1.5">
              <label className="flex items-start gap-2 text-xs font-semibold text-navy-700 select-none">
                <input
                  type="checkbox"
                  checked={agreeTos}
                  onChange={(e) => setAgreeTos(e.target.checked)}
                  onBlur={() => setTouched((p) => ({ ...p, agreeTos: true }))}
                  className={cx(
                    "mt-0.5 h-4 w-4 rounded border-navy-300 text-brand-600 focus:ring-brand-600",
                    fieldError("agreeTos") && "ring-2 ring-rose-300"
                  )}
                />
                <span>
                  I agree to the Terms and Conditions <span className="text-rose-600">*</span>
                </span>
              </label>
              {fieldError("agreeTos") ? <div className="text-[11px] font-medium text-rose-600">{fieldError("agreeTos")}</div> : null}

              <label className="flex items-start gap-2 text-xs font-semibold text-navy-700 select-none">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={(e) => setAgreePrivacy(e.target.checked)}
                  onBlur={() => setTouched((p) => ({ ...p, agreePrivacy: true }))}
                  className={cx(
                    "mt-0.5 h-4 w-4 rounded border-navy-300 text-brand-600 focus:ring-brand-600",
                    fieldError("agreePrivacy") && "ring-2 ring-rose-300"
                  )}
                />
                <span>
                  I agree to the Privacy Policy <span className="text-rose-600">*</span>
                </span>
              </label>
              {fieldError("agreePrivacy") ? (
                <div className="text-[11px] font-medium text-rose-600">{fieldError("agreePrivacy")}</div>
              ) : null}
            </div>

            {submitError ? (
              <div className="rounded-xl bg-rose-50 px-3 py-2 text-[13px] font-semibold text-rose-700 ring-1 ring-rose-100" role="alert">
                {submitError}
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSubmitError("");
                  setStep(1);
                }}
                className="h-10 w-full rounded-xl bg-white text-[14px] font-semibold text-navy-900 ring-1 ring-black/10 transition-colors hover:bg-navy-50"
              >
                Back
              </button>
              <button
                type="submit"
                className={cx(
                  "h-10 w-full rounded-xl bg-brand-600 text-[14px] font-semibold text-white ring-1 ring-brand-700/40 transition-colors",
                  "hover:bg-brand-700 active:bg-brand-800"
                )}
              >
                Create account
              </button>
            </div>

            <div className="text-center text-[13px] text-navy-600">
              Already registered?{" "}
              <Link to="/login" className="font-semibold text-brand-600 hover:underline">
                Sign in
              </Link>
            </div>
          </>
        )}
      </form>
    </AuthFormCard>
  );
}
