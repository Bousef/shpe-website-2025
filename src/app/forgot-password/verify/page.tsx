"use client";
import { useRouter, useSearchParams } from "next/navigation"
import React, { useState, useEffect } from "react"

export default function CodeVerification() {
    const router = useRouter()
    const searchParams = useSearchParams();

    // read the email
    const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // useEffect(() => {
    // 	if (!email) {
    // 		// if no email in query, redirect back
    // 		router.replace('/forgot-password')
    // 	}
    // }, [email, router])

    const handleSubmit = async (e: React.FormEvent) => {}

    return (
        <section className="flex flex-col items-center justify-center pb-[6rem] py-[2rem] px-4 min-w-[280px]">
            {/* header */}
            <div className="container px-4 text-center mb-5">
                <h2 className="text-4xl text-[var(--shpe-orange)] font-bold">Verification</h2>
            </div>
            
            {/* ENTER CODE */}
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white item-center p-6 rounded-lg shadow text-[var(--shpe-navy-blue)]">
                <h2 className="text-xl font-bold mb-4">Enter Verification Code</h2>
                <input 
                    type="text"
                    maxLength={6}
                    required
                    value={code}
                    onChange={e => setCode(e.target.value.replace(/\D/, ''))}
                    placeholder="••••••"
                    className="w-full px-3 py-2 mb-1 border rounded tracking-widest text-center text-lg"
                />
                {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 mt-5 bg-[var(--shpe-light-blue)] text-white text-xl hover:bg-[var(--shpe-blue)] disabled:opacity-50 cursor-pointer"
                >
                    {loading ? 'Verifying...' : 'Verify Code'}
                </button>

                {/* RETURN BACK TO FORGET PASSWORD */}
                <div className="flex justify-center mt-4">
          <a
            className="text-sm text-[var(--shpe-navy-blue) hover:underline"
            onClick={() => router.push("/forgot-password")}
          >
            Back
          </a>
        </div>
            </form>
        </section>
    )
}