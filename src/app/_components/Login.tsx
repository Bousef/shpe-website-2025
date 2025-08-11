"use client";

import { useActionState, useState } from 'react';
import { login } from '../login/actions';
import Link from 'next/link';
import InputBox, { InputField, PasswordInputField } from './InputBox';
import { supabase } from '~/supabase-client';
import { useRouter } from 'next/navigation';

export default function Login(){
	// const [loginState, loginAction] = useActionState(login, { error: "" });
	// const currentError = loginState.error;
	// const formData = loginState.formData;

	const router = useRouter();
	const [error, setError] = useState<string | null>(null);

	async function handleSubmit(formData: FormData) {
		setError(null);
		const result = await login(null, formData);

		if (result?.error) {
			setError(result.error);
		return;
		}

		if (result?.session) {
		await supabase.auth.setSession({
			access_token: result.session.access_token,
			refresh_token: result.session.refresh_token,
		});

		router.push('/?refetchUser=1');
		}
	}

	return (
		<section className="flex flex-col items-center pb-[6rem] py-[2rem] px-4 min-w-[280px]">

			{/* header */}
			<div className="container px-4 text-center mb-10.5">
				<h2 className="text-5xl text-[var(--shpe-orange)]">LOG IN</h2>
			</div>

			<form className="w-full max-w-md space-y-1" action={handleSubmit}>
				<InputBox>
				<InputField 
					id="email"
					type="email"
					name="email"
					required
					placeholder="UCF Email"
					// defaultValue={formData?.email ?? ""}
				 />
				 <PasswordInputField
				 	id='password'
					name="password"
					required
					placeholder='Password'
				 />
				</InputBox>

				{/* {currentError && (
					<div className="text-red-600 text-sm mb-1">{currentError}</div>
				)} */}
				{error && <p className="text-red-500">{error}</p>}

				{/* REMEMBER ME + FORGET PASSWORD */}
				<div className="flex justify-between items-center mb-2">
					<label className="flex items-center">	
						<input
							id="remember"
							type="checkbox"
							className="h-4 w-4 text-yellow-500 focus:ring-yellow-400 border-gray-300 rounded"
						/>
						<span className="ml-2 text-sm text-[var(--shpe-navy-blue)] select-none">
							Remember Me
						</span>
					</label>

					<a 
						href="/forgot-password"
						className="text-sm text-[var(--shpe-navy-blue)] hover:underline">
						Forgot Password
					</a>
				</div>

				{/* LOGIN / SIGNUP BUTTONS */}
				<div className="mt-15 space-y-2 text-[var(--shpe-navy-blue)] font-bold">
					<button type='submit' className="w-full p-2 bg-[var(--shpe-light-blue)] text-white hover:bg-[var(--shpe-blue)] cursor-pointer">
						LOG IN
					</button>
					<p className="text-center text-sm">
					  New to SHPE UCF?{' '}
					  <Link href="/signUp" className="text-[var(--shpe-light-blue)] hover:underline">
					    Sign Up
					  </Link>
					</p>
				</div>
			</form>
		</section>
	)
}