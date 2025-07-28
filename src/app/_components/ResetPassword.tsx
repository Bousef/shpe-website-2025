"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "~/supabase-client";


export default function ResetPassword() {
	const router = useRouter()
	const searchParams = useSearchParams();

	const email = searchParams.get("email");
	const access_token = searchParams.get("access_token");
	const refresh_token = searchParams.get("refresh_token");
	const verified = searchParams.get("verified") === "true";

	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState('');

	if (!email || !verified) {
		return (
			<p className="text-center mt-10 text-red-600">
				Invalid access. Please verify your code before resetting your password.
			</p>
		);
	}

	useEffect(() => {
		const trySession = async () => {
			if (access_token && refresh_token) {
				const { error } = await supabase.auth.setSession({
					access_token,
					refresh_token,
				});

				if (error) {
					setError("Session could not be established. Please retry.");
					return;
				}
			}

			const {
				data: { session },
			} = await supabase.auth.getSession();

			if (!session || !verified) {
				// // wait a little if token is present but session isnt ready yet
				// if (access_token) {
				// 	// wait for supabase to pick up token from url and set session
				// 	setTimeout(trySession, 500) // retry after 500 ms
				// 	return
				// }
				router.replace('/forgot-password') // if no token, kick them back
			}
		};

		trySession()
	}, [access_token, refresh_token, verified, router])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setSuccess('');

		if (password !== confirm) {
			setError("Passwords do not match.");
			return;
		}
		setLoading(true);

		const { error: updateError } = await supabase.auth.updateUser({
			password,
		}, {
			// pass the access token so supabase knows which user
			// in supabase v2, the client auto-reads the token from url by default
		});

		setLoading(false);
		if (updateError) 
			setError(updateError.message);
		else {
			setSuccess("Your password has been reset successfully!");
			router.push("/login?reset=success")
		}
	}

	return (
		<section className="flex flex-col items-center justify-center pb-[6rem] py-[2rem] px-4 min-w-[280px]">
			{/* header */}
			<div className="container px-4 text-center mb-5">
				<h2 className="text-4xl text-[var(--shpe-orange)] font-bold">Set a New Password</h2>
			</div>
			
			<form onSubmit={handleSubmit} className="w-full max-w-md bg-white item-center p-6 rounded-lg shadow text-[var(--shpe-navy-blue)]">
				{/* ENTER NEW PASSWORD */}

				<h2 className="text-lg font-semibold">Enter New Password</h2>
				<input 
					type="password"
					minLength={8}
					required
					value={password}
					onChange={e => setPassword(e.target.value)}
					placeholder="At least 8 characters"

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
				{error && <p className="text-red-600 text-sm mb-2">{error}</p>}
				{success && <p className="text-green-600 mb-2 text-center">{success}</p>}

			</form>
		</section>
	)
}