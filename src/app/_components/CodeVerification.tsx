"use client";

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { api } from "~/trpc/react";
import { supabase } from "~/supabase-client";

export default function CodeVerification() {
	const router = useRouter();
	const searchParams = useSearchParams();

	// supabase do not include the below tokens if u custom redirect path here
	// const accessToken = searchParams.get("access_token") || '';
  	// const refreshToken = searchParams.get("refresh_token");

	// get email from url query param
	const email = searchParams.get("email") || '';

	const [loading, setLoading] = useState(true);
  	const [error, setError] = useState('');
  	const [code, setCode] = useState('');
	const [codeSent, setCodeSent] = useState(false);
  	const [verifying, setVerifying] = useState(false);

	const generateCode = api.resetCode.generateCode.useMutation();
	const verifyCode = api.resetCode.verifyCode.useMutation();

	useEffect(() => {
		if (!email || codeSent) {
			setLoading(false);
			return;
		}

		// generate 6-digit code and send to email
		generateCode.mutate(
			{ email },
			{
				onSuccess: () => {
					setCodeSent(true); // prevent re-calling
					setLoading(false);
				},
				onError: (err) => {
					console.error("Failed to send reset code", err);
					setError("Could not send code to email.");
					setLoading(false);
				},
			}
		);    	
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
			console.log("Calling verifyCode with", email, code);
			const isValid = await verifyCode.mutateAsync({ email, code });
			console.log("Result of verifyCode:", isValid);
			if (isValid) {
				// redirect to reset-password page only after successful code verification
			router.push(`/forgot-password/reset?email=${email}&verified=true`);
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
			<form onSubmit={handleSubmit} className="w-full max-w-md bg-white item-center p-6 rounded-lg shadow text-[var(--shpe-navy-blue)]">
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
				{error && <p className="text-red-600 text-sm mb-2">{error}</p>}
				<button
					type="submit"
					onClick={handleSubmit}
					disabled={verifying}
					className="w-full py-2 mt-5 bg-[var(--shpe-light-blue)] text-white text-xl hover:bg-[var(--shpe-blue)] disabled:opacity-50 cursor-pointer"
				>
					{verifying ? 'Verifying...' : 'Verify Code'}
				</button>

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