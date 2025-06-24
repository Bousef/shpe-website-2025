"use client";

import { useActionState } from 'react';
import { login, signup } from '../login/actions';
import Link from 'next/link';

export default function Login(){
	const [loginState, loginAction] = useActionState(login, { error: "" });
	const [signupState, signupAction] = useActionState(signup, { error: "" });

	const currentError = loginState.error || signupState.error;

	return (
		<section className="flex flex-col items-center pb-[6rem] py-[2rem] px-4 min-w-[280px]">

			{/* header */}
			<div className="container px-4 text-center mb-10.5">
				<h2 className="text-5xl text-[var(--shpe-orange)]">LOG IN</h2>
			</div>

			<form className="w-full max-w-md space-y-1">
				{/* border for the form container */}
				<div className="border-4 border-[var(--shpe-light-blue)] p-4 divide-y-2">
					{/* EMAIL */}
					<div className="pb-3">
							<div className="h-6 text-red-500 text-sm hidden">
								{currentError && <p>{currentError}</p>}
							</div>
							{/* <label htmlFor="email" className="block text-[var(--shpe-blue)] mb-1">Email</label> */}
							<input 
								id="email" 
								name="email" 
								type="email" 
								placeholder="Email"
								required 
								className="w-full text-[var(--shpe-navy-blue)] text-xl focus:outline-none  "
							/>
					</div>
					{/* PASSWORD */}
					<div className="pt-3">
						<input 
							id="password" 
							name="password" 
							type="password" 
							placeholder="Password"
							required 
							className="w-full text-[var(--shpe-navy-blue)] text-xl focus:outline-none"
						/>
					</div>
				</div>

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
					<button formAction={loginAction} className="w-full p-2 bg-[var(--shpe-light-blue)] text-white hover:bg-[var(--shpe-blue)] cursor-pointer">
						LOG IN
					</button>
					<p className="text-center text-sm">
					  New to SHPE UCF?{' '}
					  <Link href="/signup" className="text-[var(--shpe-light-blue)] hover:underline">
					    Sign Up
					  </Link>
					</p>
				</div>
			</form>
		</section>
	)
}