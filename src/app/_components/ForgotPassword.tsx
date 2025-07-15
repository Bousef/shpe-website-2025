"use client";

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "~/supabase-client";

export default function ForgotPassword() {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [loading, setLoading] = useState(false)
	
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)

		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			// send user to reset password page after they click on link in email
			redirectTo: `${window.location.origin}/forgot-password/reset`
		})

		setLoading(false)
		if (error)
			alert(error.message)
		else
			// redirect to the verify code page tho supabase's email link skips it
			// router.push("/forgot-password/verify?email=" + encodeURIComponent(email))
			router.push("/forgot-password/reset?email=" + encodeURIComponent(email))
	}

	return (
		<section className="relative flex flex-col items-center justify-center pb-[6rem] py-[2rem] px-4 min-w-[280px]">

			<form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md bg-white item-center p-6 rounded-lg shadow text-[var(--shpe-navy-blue)]">
				<h2 className="text-2xl font-bold mb-2 text-center">Forgot Password</h2>
				<p className="text-center mb-4 text-sm">Please enter your email address, and we’ll send you instructions to reset your password.</p>

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