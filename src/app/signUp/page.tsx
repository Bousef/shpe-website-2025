"use client";
import { useActionState } from "react";
import Navbar from "../_components/NavBar";
import { signup } from "./actions";
import InputBox, { InputField, PasswordInputField } from "../_components/InputBox";

export default function SignUp() {
  const [signupState, signupAction] = useActionState(signup, { errors: [] });

  const errors = signupState.errors;

  return(
    <div>
      <Navbar />

      <h1 className="h2 text-center text-5xl text-[var(--shpe-orange)] font-medium py-3">
        SIGN UP
      </h1>
      <form>
        <InputBox>
          <InputField
            id="firstname"
            type="text"
            name="first_name"
            required
            placeholder="First Name"
          />
          <InputField
            id="lastname"
            type="text"
            name="last_name"
            required
            placeholder="Last Name"
          />
          <InputField
            id="email"
            type="email"
            name="email"
            required
            placeholder="UCF Email"
          />
          {errors.includes("Email must be a valid @ucf.edu address.") && (
            <div className="text-red-600 text-sm mb-1">Email must be a valid @ucf.edu address.</div>
          )}
          <InputField
            id="ucfID"
            type="text"
            name="ucf_id"
            required
            placeholder="UCF ID"
          />
          {errors.includes("UCF ID must be exactly 7 digits.") && (
            <div className="text-red-600 text-sm mb-1">UCF ID must be exactly 7 digits.</div>
          )}
          <PasswordInputField
            id="password"
            name="password"
            required
            placeholder="Password"
          />
          {errors.includes("Password must be 8+ characters, 1 capital letter, 1 number.") && (
            <div className="text-red-600 text-sm mb-1">Password must be 8+ characters, 1 capital letter, 1 number.</div>
          )}
        </InputBox>

        {/* // skip email ucf id and password validation errors */}
        {errors.length > 0 && (
          <div className="text-red-600 text-sm mt-4 text-center">
            {errors.map((error, index) => {
              if (error === "Email must be a valid @ucf.edu address." ||
                  error === "UCF ID must be exactly 7 digits." ||
                  error === "Password must be 8+ characters, 1 capital letter, 1 number.") return null;

              return <div key={index}>{error}</div>;
            })}
          </div>
        )}
     
      <div className="flex justify-center"> 
          <button
            type="submit"
            className="py-4 bg-[#82a8bc] hover:bg-[#6c92a8] text-[#0b1e57] w-md mt-10 mx-auto font-medium"
            formAction={signupAction}
          >
            SIGN UP
          </button>
        </div>
      </form>

      <div>
        <p className="text-md font-medium text-gray-600 text-center mt-3">
          ALREADY HAVE AN ACCOUNT?{" "}
          <a href="/login" className="hover:underline font-medium text-[#0b1e57]">
            LOG IN HERE!
          </a>
        </p>
      </div>
    </div>
  );
}