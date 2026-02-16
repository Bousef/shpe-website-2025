"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { login, signup } from "../login/actions";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

type Step = "email" | "loading" | "password";

export default function Login() {
    const [loginState, loginAction] = useActionState(login, { error: "" });
    const [signupState, signupAction] = useActionState(signup, { error: "" });

    const currentError = loginState.error || signupState.error;

    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const passwordRef = useRef<HTMLInputElement>(null);

    // When the loading step starts, advance to password after 1s
    useEffect(() => {
        if (step === "loading") {
            const timer = setTimeout(() => setStep("password"), 1000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    // Auto-focus password input when it appears
    useEffect(() => {
        if (step === "password") {
            passwordRef.current?.focus();
        }
    }, [step]);

    const handleEmailContinue = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setStep("loading");
    };

    const handleBack = () => {
        setStep("email");
        setPassword("");
    };

    return (
        <section className="flex min-h-[80vh] items-center justify-center px-4">
            <div className="w-full max-w-[400px]">
                {/* Header */}
                <motion.div
                    className="mb-10 text-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-3xl font-semibold tracking-tight text-[var(--shpe-navy-blue)]">
                        Welcome back
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Sign in to your SHPE UCF account
                    </p>
                </motion.div>

                {/* Card */}
                <motion.div
                    className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                >
                    <AnimatePresence mode="wait">
                        {/* ── Step 1: Email ── */}
                        {step === "email" && (
                            <motion.form
                                key="email-step"
                                onSubmit={handleEmailContinue}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.25 }}
                            >
                                <label
                                    htmlFor="email-input"
                                    className="mb-1.5 block text-sm font-medium text-slate-700"
                                >
                                    Email address
                                </label>
                                <input
                                    id="email-input"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@ucf.edu"
                                    required
                                    autoFocus
                                    className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-[#0066cc] focus:ring-2 focus:ring-[#0066cc]/20"
                                />

                                {currentError && step === "email" && (
                                    <p className="mt-2 text-sm text-red-500">{currentError}</p>
                                )}

                                <button
                                    type="submit"
                                    className="mt-5 w-full rounded-lg bg-[var(--shpe-navy-blue)] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#162033] cursor-pointer"
                                >
                                    Continue
                                </button>
                            </motion.form>
                        )}

                        {/* ── Step 2: Loading ── */}
                        {step === "loading" && (
                            <motion.div
                                key="loading-step"
                                className="flex flex-col items-center justify-center py-8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-center gap-1.5">
                                    {[0, 1, 2].map((i) => (
                                        <motion.span
                                            key={i}
                                            className="block h-2 w-2 rounded-full bg-[#0a1628]"
                                            animate={{ opacity: [0.2, 1, 0.2] }}
                                            transition={{
                                                duration: 1,
                                                repeat: Infinity,
                                                delay: i * 0.15,
                                            }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* ── Step 3: Password ── */}
                        {step === "password" && (
                            <motion.div
                                key="password-step"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.25 }}
                            >
                                {/* Email display with back button */}
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="group mb-5 flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900 cursor-pointer"
                                >
                                    <svg
                                        className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                    {email}
                                </button>

                                {/* Actual form submitted to the server action */}
                                <form>
                                    {/* Hidden email so the server action receives it */}
                                    <input type="hidden" name="email" value={email} />

                                    <label
                                        htmlFor="password-input"
                                        className="mb-1.5 block text-sm font-medium text-slate-700"
                                    >
                                        Password
                                    </label>
                                    <input
                                        ref={passwordRef}
                                        id="password-input"
                                        name="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-[#0066cc] focus:ring-2 focus:ring-[#0066cc]/20"
                                    />

                                    {currentError && (
                                        <p className="mt-2 text-sm text-red-500">{currentError}</p>
                                    )}

                                    <div className="mt-3 flex justify-end">
                                        <Link
                                            href="/forgot-password"
                                            className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <button
                                        formAction={loginAction}
                                        className="mt-4 w-full rounded-lg bg-[var(--shpe-navy-blue)] py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#162033] cursor-pointer"
                                    >
                                        Log in
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Footer link */}
                <motion.p
                    className="mt-6 text-center text-sm text-slate-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.15 }}
                >
                    New to SHPE UCF?{" "}
                    <Link
                        href="/signUp"
                        className="font-medium text-[#0a1628] hover:underline"
                    >
                        Create an account
                    </Link>
                </motion.p>
            </div>
        </section>
    );
}