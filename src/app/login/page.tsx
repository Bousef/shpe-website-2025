"use client";

import { useActionState } from 'react';
import { login, signup } from './actions'

export default function LoginPage() {
  const [loginState, loginAction] = useActionState(login, { error: "" });
  const [signupState, signupAction] = useActionState(signup, { error: "" });

  const currentError = loginState.error || signupState.error;

  return (
    <div className="max-w-sm mx-auto mt-20 p-6">
      <form className="space-y-4">
        <div>
            <div className="h-6 text-red-500 text-sm">
                {currentError && <p>{currentError}</p>}
            </div>
          <p>Email:</p>
          <input 
            id="email" 
            name="email" 
            type="email" 
            required 
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <p>Password:</p>
          <input 
            id="password" 
            name="password" 
            type="password" 
            required 
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="space-y-2">
          <button formAction={loginAction} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer">
            Log in
          </button>
          <button formAction={signupAction} className="w-full p-2 border rounded hover:bg-gray-300 cursor-pointer">
            Sign up
          </button>
        </div>
      </form>
    </div>
  )
}