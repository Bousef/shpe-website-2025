"use client";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function InputBox({children, ...props}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className="border-4 border-solid border-[#82a8bc] px-2 py-4 w-full max-w-md mx-auto mt-10" {...props}>
            {children}
        </div>
    );
}

export function InputField(inputProps: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div>
            <input
                {...inputProps}
                className="placeholder-[#0b1e57] w-full mb-4 border-b border-blue-300 focus:outline-none py-1"
            />
        </div>
    );
}

export function PasswordInputField(inputProps: React.InputHTMLAttributes<HTMLInputElement>) {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
        <div>
            <div className="relative mb-4">
                <input
                    {...inputProps}
                    type={showPassword ? "text" : "password"}
                    className="placeholder-[#0b1e57] w-full border-b border-blue-300 focus:outline-none py-1 pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 mt-1 mr-1"
                >
                    {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-blue-700" />
                    ) : (
                        <EyeIcon className="h-5 w-5 text-blue-700" />
                    )}
                </button>
            </div>
        </div>
    );
}
