import Navbar from "../_components/NavBar";

export default function SignUp() {
  return (
    <div>
      <Navbar />

      <h1 className="h2 text-center text-3xl text-[#e3af3e] font-medium py-3">
        SIGN UP
      </h1>

      <div className="border-4 border-solid border-[#82a8bc] px-2 py-4 w-full max-w-md mx-auto mt-10">
        {/* First name */}
        <div>
          <input
            id="firstname"
            type="First Name"
            required
            placeholder="First Name"
            className="placeholder-[#0b1e57] w-full mb-4 border-b border-[#82a8bc] focus:outline-none py-1"
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
          />
        </div>

        {/* UCF Email */}
        <div>
          <input
            id="email"
            type="email"
            required
            placeholder="UCF Email"
            className="peer placeholder-[#0b1e57] w-full mb-4 border-b border-blue-300 focus:outline-none py-1"
          />
        </div>

        {/* UCF ID */}
        <div>
          <input
            id="ucfID"
            type="UCF ID"
            required
            placeholder="UCF ID"
            className="placeholder-[#0b1e57] w-full mb-4 border-b border-blue-300 focus:outline-none py-1"
          />
        </div>

        {/* Password */}
        <div>
          <input
            id="password"
            type="Password"
            required
            placeholder="Password"
            className="placeholder-[#0b1e57] w-full mb-4 border-b border-blue-300 focus:outline-none py-1"
          />
        </div>

        <div />
      </div>

      <div className="flex justify-center">
        <button className="py-4 bg-[#82a8bc] hover:bg-[#6c92a8] text-[#0b1e57] w-md mt-10 mx-auto font-medium">
          SIGN UP
        </button>
      </div>

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
