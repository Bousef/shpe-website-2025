"use client";
import { useActionState, useState, useEffect, useRef } from "react";
import { signup } from "./actions";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

type Step = "name" | "loading-1" | "identity" | "loading-2" | "password";

export default function SignUp() {
  const [signupState, signupAction] = useActionState(signup, { errors: [] });

  const errors = signupState.errors;

  const [step, setStep] = useState<Step>("name");
  const [firstName, setFirstName] = useState(signupState.formData?.first_name ?? "");
  const [lastName, setLastName] = useState(signupState.formData?.last_name ?? "");
  const [email, setEmail] = useState(signupState.formData?.email ?? "");
  const [ucfId, setUcfId] = useState(signupState.formData?.ucf_id ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localErrors, setLocalErrors] = useState<string[]>([]);

  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const ucfIdRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // If the server action returns errors, jump back to the relevant step
  useEffect(() => {
    if (errors.length > 0) {
      const hasPasswordError = errors.some((e) => e.toLowerCase().includes("password"));
      const hasEmailOrIdError = errors.some(
        (e) => e.toLowerCase().includes("email") || e.toLowerCase().includes("ucf id") || e.toLowerCase().includes("already")
      );
      if (hasPasswordError) setStep("password");
      else if (hasEmailOrIdError) setStep("identity");
      else setStep("name");
    }
  }, [errors]);

  // Loading transitions
  useEffect(() => {
    if (step === "loading-1") {
      const t = setTimeout(() => setStep("identity"), 1000);
      return () => clearTimeout(t);
    }
    if (step === "loading-2") {
      const t = setTimeout(() => setStep("password"), 1000);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Auto-focus on step change
  useEffect(() => {
    if (step === "identity") emailRef.current?.focus();
    if (step === "password") passwordRef.current?.focus();
  }, [step]);

  const goToIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalErrors([]);
    if (!firstName.trim() || !lastName.trim()) {
      setLocalErrors(["Please fill in both fields."]);
      return;
    }
    setStep("loading-1");
  };

  const goToPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalErrors([]);
    const errs: string[] = [];
    if (!/^[\w.-]+@(ucf\.edu|shpeucf\.com)$/.test(email)) {
      errs.push("Email must be a valid @ucf.edu address.");
    }
    if (!/^\d{7}$/.test(ucfId)) {
      errs.push("UCF ID must be exactly 7 digits.");
    }
    if (errs.length > 0) {
      setLocalErrors(errs);
      return;
    }
    setStep("loading-2");
  };

  const goBack = (target: Step) => {
    setLocalErrors([]);
    setStep(target);
  };

  // Progress indicator
  const stepIndex = step === "name" ? 0 : step === "loading-1" ? 0.5 : step === "identity" ? 1 : step === "loading-2" ? 1.5 : 2;

  const StepDots = () => (
    <div className="mb-8 flex items-center justify-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 rounded-full"
          animate={{
            width: Math.floor(stepIndex) === i ? 24 : 8,
            backgroundColor: stepIndex >= i ? "#001F5B" : "#cbd5e1",
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );

  const LoadingDots = () => (
    <motion.div
      key="loading-step"
      className="flex flex-col items-center justify-center py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-2 w-2 rounded-full bg-[var(--shpe-navy-blue)]"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  );

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-[#001F5B] focus:ring-2 focus:ring-[#001F5B]/20";

  const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

  const primaryBtnClass =
    "mt-5 w-full rounded-lg bg-[var(--shpe-navy-blue)] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#001040] cursor-pointer";

  const backBtnClass =
    "group mb-5 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 cursor-pointer";

  const BackChevron = () => (
    <svg
      className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );

  const displayErrors = localErrors.length > 0 ? localErrors : errors;

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        {/* Header */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-semibold tracking-tight text-[#001f5b]">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Join the SHPE UCF community
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          <StepDots />

          <AnimatePresence mode="wait">
            {/* ── Step 1: Name ── */}
            {step === "name" && (
              <motion.form
                key="name-step"
                onSubmit={goToIdentity}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <label htmlFor="first-name-input" className={labelClass}>
                  First name
                </label>
                <input
                  id="first-name-input"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Go"
                  required
                  autoFocus
                  className={inputClass}
                />

                <label htmlFor="last-name-input" className={`mt-4 ${labelClass}`}>
                  Last name
                </label>
                <input
                  ref={lastNameRef}
                  id="last-name-input"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Knights"
                  required
                  className={inputClass}
                />

                {displayErrors.length > 0 && step === "name" && (
                  <div className="mt-3 space-y-1">
                    {displayErrors.map((err, i) => (
                      <p key={i} className="text-sm text-red-500">{err}</p>
                    ))}
                  </div>
                )}

                <button type="submit" className={primaryBtnClass}>
                  Continue
                </button>
              </motion.form>
            )}

            {/* ── Loading 1 ── */}
            {step === "loading-1" && <LoadingDots />}

            {/* ── Step 2: Identity (email + UCF ID) ── */}
            {step === "identity" && (
              <motion.div
                key="identity-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <button type="button" onClick={() => goBack("name")} className={backBtnClass}>
                  <BackChevron />
                  {firstName} {lastName}
                </button>

                <form onSubmit={goToPassword}>
                  <label htmlFor="email-input" className={labelClass}>
                    UCF Email
                  </label>
                  <input
                    ref={emailRef}
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@ucf.edu"
                    required
                    className={inputClass}
                  />

                  <label htmlFor="ucfid-input" className={`mt-4 ${labelClass}`}>
                    UCF ID
                  </label>
                  <input
                    ref={ucfIdRef}
                    id="ucfid-input"
                    type="text"
                    value={ucfId}
                    onChange={(e) => setUcfId(e.target.value)}
                    placeholder="1234567"
                    required
                    className={inputClass}
                  />

                  {displayErrors.length > 0 && step === "identity" && (
                    <div className="mt-3 space-y-1">
                      {displayErrors.map((err, i) => (
                        <p key={i} className="text-sm text-red-500">{err}</p>
                      ))}
                    </div>
                  )}

                  <button type="submit" className={primaryBtnClass}>
                    Continue
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── Loading 2 ── */}
            {step === "loading-2" && <LoadingDots />}

            {/* ── Step 3: Password ── */}
            {step === "password" && (
              <motion.div
                key="password-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <button type="button" onClick={() => goBack("identity")} className={backBtnClass}>
                  <BackChevron />
                  {email}
                </button>

                <form>
                  {/* Hidden fields so the server action receives everything */}
                  <input type="hidden" name="first_name" value={firstName} />
                  <input type="hidden" name="last_name" value={lastName} />
                  <input type="hidden" name="email" value={email} />
                  <input type="hidden" name="ucf_id" value={ucfId} />

                  <label htmlFor="password-input" className={labelClass}>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      ref={passwordRef}
                      id="password-input"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 chars, 1 uppercase, 1 number"
                      required
                      className={inputClass + " pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-4.5 w-4.5" />
                      ) : (
                        <EyeIcon className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>

                  {/* Password requirements hint */}
                  <p className="mt-2 text-xs text-slate-400">
                    8+ characters, 1 capital letter, 1 number
                  </p>

                  {displayErrors.length > 0 && step === "password" && (
                    <div className="mt-3 space-y-1">
                      {displayErrors.map((err, i) => (
                        <p key={i} className="text-sm text-red-500">{err}</p>
                      ))}
                    </div>
                  )}

                  <button formAction={signupAction} className={primaryBtnClass}>
                    Create account
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="mt-6 text-center text-sm text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[var(--shpe-navy-blue)] hover:underline">
            Log in
          </Link>
        </motion.p>
      </div>
    </section>
  );
}

