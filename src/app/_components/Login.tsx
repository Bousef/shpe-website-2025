"use client";

import { useActionState } from 'react';
import { login, signup } from '../login/actions';

export default function Login(){
	const [loginState, loginAction] = useActionState(login, { error: "" });
	const [signupState, signupAction] = useActionState(signup, { error: "" });

	const currentError = loginState.error || signupState.error;

	return (
		<section className="flex flex-col items-center pb-[6rem] py-[2rem]">

			{/* header */}
			<div className="container mx-auto px-4 text-center mb-10 text-black">
				<h2 className="text-5xl text-[var(--shpe-orange)]">LOG IN</h2>
			</div>

			<form className="w-full max-w-md space-y-1">
				{/* border for the form container */}
				<div className="border-5 border-[var(--shpe-light-blue)] p-4 divide-y-4">
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
								className="w-full text-[var(--shpe-navy-blue)] text-xl"
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
							className="w-full text-[var(--shpe-navy-blue)] text-xl"
						/>
					</div>
				</div>

				{/* FORGET PASSWORD */}
				<div className="flex justify-end mb-2">
					<a
						href="#"
						className="text-sm text-[var(--shpe-navy-blue)] hover:underline"
					>
						Forgot Password
					</a>
				</div>

				{/* REMEMBER ME */}
				<div className="flex items-center">
					<input
						id="remember"
						type="checkbox"
						className="h-4 w-4 text-yellow-500 focus:ring-yellow-400 border-gray-300 rounded"
					/>
					<label
						htmlFor="remember"
						className="ml-2 text-sm text-[var(--shpe-navy-blue)] select-none"
					>
						Remember Me
					</label>
				</div>

				{/* LOGIN / SIGNUP BUTTONS */}
				<div className="mt-15 space-y-2 text-[var(--shpe-navy-blue)] font-bold">
					<button formAction={loginAction} className="w-full p-2 bg-[var(--shpe-light-blue)] text-white hover:bg-[var(--shpe-blue)] cursor-pointer">
						LOG IN
					</button>
					<button formAction={signupAction} className="w-full p-2 border hover:bg-gray-300 cursor-pointer">
						NEW TO SHPEUCF? SIGN UP
					</button>
				</div>
			</form>
		</section>
	)
}