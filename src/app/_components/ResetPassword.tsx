"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "~/supabase-client";

export default function ResetPassword() {
	const router = useRouter()
	const searchParams = useSearchParams();

	// supabase includes 'access_token' in the URL when redirecting here
	const accessToken = searchParams.get("access_token") || ""
	const [password, setPassword] = useState('')
	const [confirm, setConfirm] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const checkSession = async () => {
			const {
				data: { session },
			} = await supabase.auth.getSession()

			if (!session) {
				// wait a little if token is present but session isnt ready yet
				if (accessToken) {
					// wait for supabase to pick up token from url and set session
					setTimeout(checkSession, 500) // retry after 500 ms
					return
				}
				// if no token, kick them back
				router.replace('/forgot-password')
			}
		}
		checkSession()
	}, [accessToken, router])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (password !== confirm) {
			setError("Passwords must match.")
			return
		}
		setLoading(true)

		const { error: updateError } = await supabase.auth.updateUser({
			password,
		}, {
			// pass the access token so supabase knows which user
			// in supabase v2, the client auto-reads the token from url by default
		})

		setLoading(false)
		if (updateError) 
			setError(updateError.message)
		else
			router.push("/login?reset=success")
	}

	return (
		<section className="flex flex-col items-center justify-center pb-[6rem] py-[2rem] px-4 min-w-[280px]">
			{/* header */}
			<div className="container px-4 text-center mb-5">
				<h2 className="text-4xl text-[var(--shpe-orange)] font-bold">Set a New Password</h2>
			</div>
			
			{/* ENTER NEW PASSWORD */}
			<form onSubmit={handleSubmit} className="w-full max-w-md bg-white item-center p-6 rounded-lg shadow text-[var(--shpe-navy-blue)]">
				<h2 className="text-lg font-semibold">Enter New Password</h2>
				<input 
					type="password"
					minLength={8}
					required
					value={password}
					onChange={e => setPassword(e.target.value)}
					placeholder="At least 8 digits"
					className="w-full px-3 py-2 mb-1 border rounded"
				/>

				{/* CONFIRM NEW PASSWORD */}
				<h2 className="mt-5 text-lg font-semibold">Confirm Password</h2>
				<input 
					type="password"
					minLength={8}
					required
					value={confirm}
					onChange={e => setConfirm(e.target.value)}
					placeholder="At least 8 digits"
					className="w-full px-3 py-2 mb-1 border rounded"
				/>

				{error && <p className="text-red-600 text-sm mb-2">{error}</p>}
				<button
					type="submit"
					disabled={loading}
					className="w-full py-2 mt-8 bg-[var(--shpe-light-blue)] text-white text-xl hover:bg-[var(--shpe-blue)] disabled:opacity-50 cursor-pointer"
				>
					{loading ? 'Resetting...' : 'Reset Password'}
				</button>
			</form>
		</section>
	)
}