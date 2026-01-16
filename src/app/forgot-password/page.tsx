"use client";
import Navbar from "../_components/NavBar";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement password reset logic
  };

  return (
    <div>
      <Navbar />
      <section className="relative flex min-w-[280px] flex-col items-center justify-center px-4 py-[2rem] pb-[6rem]">
        <form
          onSubmit={handleSubmit}
          className="item-center relative z-10 w-full max-w-md rounded-lg bg-white p-6 text-[var(--shpe-navy-blue)] shadow"
        >
          <h2 className="mb-2 text-center text-2xl font-bold">
            Forgot Password
          </h2>
          <p className="mb-4 text-center text-sm">
            Please enter your email address, and we’ll send you instructions to
            reset your password.
          </p>

          <input
            type="email"
            required
            value={email}
            placeholder="example@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded border px-3 py-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-[var(--shpe-light-blue)] py-2 text-xl text-white hover:bg-[var(--shpe-blue)] disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>

          <div className="mt-4 flex justify-center">
            <a
              href="/login"
              className="text-sm text-[var(--shpe-navy-blue)] hover:underline"
            >
              Back to Log In
            </a>
          </div>
        </form>
      </section>
    </div>
  );
}
