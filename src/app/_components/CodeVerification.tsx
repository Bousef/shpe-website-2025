"use client";

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { api } from "~/trpc/react";
import { supabase } from "~/supabase-client";

export default function CodeVerification() {
	const router = useRouter();

	const [email, setEmail] = useState('');
	const [accessToken, setAccessToken] = useState('');
	const [refreshToken, setRefreshToken] = useState('');
	const [code, setCode] = useState('');
	const [codeSent, setCodeSent] = useState(false);
	const [loading, setLoading] = useState(true);
  	const [verifying, setVerifying] = useState(false);
  	const [error, setError] = useState('');
  	
	const generateCode = api.resetCode.generateCode.useMutation();
	const verifyCode = api.resetCode.verifyCode.useMutation();

	useEffect(() => {
		// extract token from url hash
		const hash = window.location.hash;
		const params = new URLSearchParams(hash.substring(1)); // remove the leading #
		const access_token = params.get("access_token");
		const refresh_token = params.get("refresh_token");

		if (access_token && refresh_token) {
			sessionStorage.setItem("access_token", access_token);
			sessionStorage.setItem("refresh_token", refresh_token);
		}

		// store in sessionStorage to persist across reloads
		const token = access_token || sessionStorage.getItem("access_token");
		const refresh = refresh_token || sessionStorage.getItem("refresh_token");

		if (!token || !refresh) {
			setError("Missing token from URL");
			setLoading(false);
			return;
		}
		setAccessToken(token);
		setRefreshToken(refresh);

		// get user info using token
		supabase.auth.getUser(token).then(({ data, error }) => {
			if (error || !data?.user?.email) {
				setError("Failed to fetch user info");
				setLoading(false);
				return;
			}

			const email = data.user.email;
			setEmail(email);

			if (!codeSent) {
				// generate 6-digit code and send to email
				generateCode.mutate(
					{ email },
					{
						onSuccess: () => {
							setCodeSent(true); // prevent re-calling
							setLoading(false);
						},
						onError: () => {
							setError("Could not send code to email.");
							setLoading(false);
						},
					}
				);
			} else {
				setLoading(false);
			}			
		});	
  	}, [email, codeSent]);

	// handle form submission for code verification
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (!email) {
			setError("Email not loaded yet.");
			return;
		}

		if (code.length !== 6) {
			setError("Please enter a valid 6-digit code.");
			return;
		}

		setVerifying(true);

		try {
			const isValid = await verifyCode.mutateAsync({ email, code });
			if (isValid) {
				// redirect to reset-password page only after successful code verification
				router.push(`/forgot-password/reset?email=${email}&verified=true&access_token=${accessToken}&refresh_token=${refreshToken}`);
			} else {
				setError("Invalid code. Try again.");
			}
    	} catch (err: any) {
      		setError(err.message || "Invalid or expired verification code.");
    	} finally {
      		setVerifying(false);
    	}
	};

	if (loading) return <p className="text-center mt-8">Loading...</p>;

	return (
		<section className="flex flex-col items-center justify-center pb-[6rem] py-[2rem] px-4 min-w-[280px]">
			{/* header */}
			<div className="container px-4 text-center mb-5">
				<h2 className="text-4xl text-[var(--shpe-orange)] font-bold">Verification</h2>
			</div>
			
			{/* ENTER CODE */}
			<form onSubmit={handleSubmit} className="w-full max-w-md bg-white items-center p-6 rounded-lg shadow text-[var(--shpe-navy-blue)]">
				<h2 className="text-xl font-bold mb-4">Enter Verification Code</h2>
				<p className="text-center mb-4">A 6-digit code is sent to <strong>{email}</strong>. Please enter it below.</p>
				<input 
					type="text"
					maxLength={6}
					inputMode="numeric"
					required
					value={code}
					onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
					placeholder="Enter 6-digit code"
					className="w-full px-3 py-2 mb-1 border rounded tracking-widest text-center text-lg"
				/>
				<button
					type="submit"
					disabled={verifying}
					className="w-full py-2 mt-5 bg-[var(--shpe-light-blue)] text-white text-xl hover:bg-[var(--shpe-blue)] disabled:opacity-50 cursor-pointer"
				>
					{verifying ? 'Verifying...' : 'Verify Code'}
				</button>
				{error && <p className="text-red-600 text-sm mb-2">{error}</p>}

				{/* RETURN BACK TO FORGET PASSWORD */}
				<div className="flex justify-center mt-4">
					<a
						className="text-sm text-[var(--shpe-navy-blue)] hover:underline"
						onClick={() => router.push("/forgot-password")}
					>
						Back
					</a>
				</div>
			</form>
		</section>
	)
}