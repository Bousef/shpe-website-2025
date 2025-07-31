"use client";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "~/trpc/react"; // our tRPC hook
import { supabase } from "~/supabase-client"

export default function ForgotPassword() {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState('')

	const generateCode = api.resetCode.generateCode.useMutation();
	
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)

		const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
			// send user to verify page after they click on link in email, supabase will pick up access_token in url
			redirectTo: `${window.location.origin}/forgot-password/verify?email=${encodeURIComponent(email)}`	
		})

		if (supabaseError) {
			setError(supabaseError.message)
			setLoading(false)
			return
		}

    	setSuccess("Check your email for a password reset link.");
    	setLoading(false);
	}

	return (
		<section className="relative flex flex-col items-center justify-center pb-[6rem] py-[2rem] px-4 min-w-[280px]">

			<form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md bg-white item-center p-6 rounded-lg shadow text-[var(--shpe-navy-blue)]">
				<h2 className="text-2xl font-bold mb-2 text-center">Forgot Password</h2>
				<p className="text-center mb-4 text-sm">Please enter your email address, and we’ll send you instructions to reset your password.</p>
				{/* ENTER EMAIL */}
				<input 
					type="email"
					required
					value={email}
					placeholder="example@ucf.edu"
					onChange={e => setEmail(e.target.value)}
					className="w-full px-3 py-2 mb-4 border rounded"
				/>
				<button
					type="submit"
					disabled={loading}
					className="w-full py-2 bg-[var(--shpe-light-blue)] text-white text-xl hover:bg-[var(--shpe-blue)] disabled:opacity-50 cursor-pointer"
				>
					{loading ? 'Sending...' : 'Send'}
				</button>
				{error && <p className="text-red-600 text-sm mb-2">{error}</p>}
				{success && <p className="text-green-600 mt-2 text-center">{success}</p>}

				{/* BACK TO LOGIN */}
				<div className="flex justify-center mt-4">
					<a
						href="/login"
						className="text-sm text-[var(--shpe-navy-blue)] hover:underline"
					>
						Back to Log In
					</a>
				</div>
			</form>
		</section>
	)
}
