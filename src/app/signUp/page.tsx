"use client";
import { useActionState, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import Navbar from "../_components/NavBar";
import { api } from "~/trpc/react";
import { signup } from "./actions";


export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ucfId, setUcfId] = useState("");
  const [status, setStatus] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [signupState, signupAction] = useActionState(signup, { error: ""});

   const createMember = api.member.createMember.useMutation({
        onSuccess: (data) => {if (data) {console.log("Member created successfully:", data);}},
        onError: (error) => {setErrors([error.message])},
        });

return(
    <div>
      <Navbar />

      <h1 className="h2 text-center text-5xl text-[var(--shpe-orange)] font-medium py-3">
        SIGN UP
      </h1>
<form >
      <div className="border-4 border-solid border-[#82a8bc] px-2 py-4 w-full max-w-md mx-auto mt-10">
        {/* First name */}
        <div>
          <input
            id="firstname"
            type="First Name"
            required
            placeholder="First Name"
            className="placeholder-[#0b1e57] w-full mb-4 border-b border-[#82a8bc] focus:outline-none py-1"
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        {/* Last name */}
        <div>
          <input
            id="lastname"
            type="Last Name"
            required
            placeholder="Last Name"
            className="placeholder-[#0b1e57] w-full mb-4 border-b border-blue-300 focus:outline-none py-1"
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        {/* UCF Email */}
        <div>
          <input
            name="email"
            id="email"
            type="text"
            required
            placeholder="UCF Email"
            className="peer placeholder-[#0b1e57] w-full mb-4 border-b border-blue-300 focus:outline-none py-1"
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.includes("Email must be a valid @ucf.edu address.") && (
            <div className="text-red-600 text-sm mb-1">Email must be a valid @ucf.edu address.</div>
          )}
        </div>

        {/* UCF ID */}
        <div>
          <input
            id="ucfID"
            type="UCF ID"
            required
            placeholder="UCF ID"
            className="placeholder-[#0b1e57] w-full mb-4 border-b border-blue-300 focus:outline-none py-1"
            onChange={(e) => setUcfId(e.target.value)}
          />
          {errors.includes("UCF ID must be exactly 7 digits.") && (
            <div className="text-red-600 text-sm mb-1">UCF ID must be exactly 7 digits.</div>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="relative mb-1">
            <input
              name="password"
              id="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Password"
              className="placeholder-[#0b1e57] w-full border-b border-blue-300 focus:outline-none py-1 pr-10"
              onChange={(e) => setPassword(e.target.value)}
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
          {errors.includes("Password must be 8+ characters, 1 capital letter, 1 number.") && (
            <div className="text-red-600 text-sm mb-1">Password must be 8+ characters, 1 capital letter, 1 number.</div>
          )}
        </div>

        <div />
      </div>

             
      {errors.map((err, i) => {
          if (
                err.includes("ucf.edu") ||
                err.includes("UCF ID") ||
                err.includes("Password")
              ) {
                return null;
              }
              return (
                <p key={i} className="text-red-600 text-sm mb-2 text-center">
                  {err}
                </p>
              );
      })}
     
      <div className="flex justify-center"> 
        
        <button
          type="submit"
          className="py-4 bg-[#82a8bc] hover:bg-[#6c92a8] text-[#0b1e57] w-md mt-10 mx-auto font-medium"
          formAction={signupAction}
          
          onClick={async(e) => {
            e.preventDefault();

            const newErrors = [];
            if (!/^[\w.-]+@ucf\.edu$/.test(email)) {
              newErrors.push("Email must be a valid @ucf.edu address.");
            }
            if (!/^\d{7}$/.test(ucfId)) {
              newErrors.push("UCF ID must be exactly 7 digits.");
            }
            if (!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)) {
              newErrors.push("Password must be 8+ characters, 1 capital letter, 1 number.");
            }

            if (newErrors.length > 0) {
              setErrors(newErrors);
              setStatus("");
            } else {
              setErrors([]);
              setStatus("Signing up...");

              const { error } = await signup(undefined, new FormData(document.querySelector("form")!));
    
              if (error) {
                setErrors([error]);
                setStatus("");
              }
              
                createMember.mutate({
                ucf_id: +ucfId,
                first_name: first_name,
                last_name: last_name,
                email,
              });
       
               }

          }}
        >
          SIGN UP
        </button>
      </div>

      <div className="text-center mt-4 text-red-600 font-medium">{status}</div>

      <div>
        <p className="text-md font-medium text-gray-600 text-center mt-3">
          ALREADY HAVE AN ACCOUNT?{" "}
          <a href="/login" className="hover:underline font-medium text-[#0b1e57]">
            LOG IN HERE!
          </a>
        </p>
      </div>
      </form>
    </div>
  );
}