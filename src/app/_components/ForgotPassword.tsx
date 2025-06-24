"use client";

import { useRouter } from "next/navigation"
import React, { useState } from "react"

export default function ForgotPassword() {
	const router = useRouter()
	const [email, setEmail] = useState('')
	const [loading, setLoading] = useState(false)
	
	const handleSubmit = async (e: React.FormEvent) => {

	}

	return (
		<section className="flex flex-col items-center justify-center pb-[6rem] py-[2rem] px-4 min-w-[280px]">
			{/* header */}
			<div className="container px-4 text-center mb-8">
				<h2 className="text-4xl text-[var(--shpe-orange)] font-bold">Forgot Password</h2>
			</div>
			
			{/* ENTER EMAIL */}
			<form onSubmit={handleSubmit} className="w-full max-w-md bg-white item-center p-6 rounded-lg shadow text-[var(--shpe-navy-blue)]">
				<h2 className="text-xl font-bold mb-4">Enter Email Address</h2>
				<input 
					type="email"
					required
					value={email}
					placeholder="example@gmail.com"
					onChange={e => setEmail(e.target.value)}
					className="w-full px-3 py-2 mb-1 border rounded"
				/>

				{/* BACK TO LOG IN */}
				<div className="flex justify-center">
					<a
						href="/login"
						className="text-sm text-[var(--shpe-navy-blue)] hover:underline"
					>
						Back to Log In
					</a>
				</div>

				{/* SEND BUTTON */}
				<button
					type="submit"
					disabled={loading}
					className="w-full py-2 mt-5 bg-[var(--shpe-light-blue)] text-white text-xl hover:bg-[var(--shpe-blue)] disabled:opacity-50 cursor-pointer"
				>
					{loading ? 'Sending...' : 'Send'}
				</button>
			</form>
		</section>
	)
}