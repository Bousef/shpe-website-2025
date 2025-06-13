import Navbar from "../_components/NavBar";

export default function SignUp(){
  return (
    <div>
      <Navbar/>
      <h1 className="h2 text-center text-3xl text-[#e3af3e] font-medium py-3"> SIGN UP</h1>
      <div className=" border-4 border-solid border-[#82a8bc] px-2 py-4 w-full max-w-md mx-auto mt-10">
        {/* First name */}
          <div>
          <input type="First Name" placeholder="First Name" className="w-full mb-4 border-b border-[#82a8bc] focus:outline-none py-1">
          </input>
          </div>

        {/*Last name  */}

          <div>
            <input type = "Last Name" placeholder="Last Name" className="w-full mb-4 border-b border-blue-300 focus:outline-none py-1"></input>
          </div>

        {/* UCF Email */}

          <div>
            <input type="UCF Email" placeholder="UCF Email" className="w-full mb-4 border-b border-blue-300 focus:outline-none py-1"></input>
          </div>

        {/*UCF ID */}

          <div>
            <input type="UCF ID" placeholder="UCF ID" className="w-full mb-4 border-b border-blue-300 focus:outline-none py-1"></input>
          </div>
        
        {/* Password */}

          <div>
            <input type="Password" placeholder="Password" className="w-full mb-4 border-b border-blue-300 focus:outline-none py-1"></input>
          </div>

        <div/>

      </div>

      <div className="flex justify-center">
        <button className="py-4 bg-[#82a8bc] hover:bg-[#6c92a8] text-[#0b1e57] w-md mt-10 mx-auto font-medium">SIGN UP</button>
      </div>

      <div >
        <p className=" text-sm text-gray-600 text-center">
          ALREADY HAVE AN ACCOUNT?{" "}
          <a href="#" className="text-black hover:underline font-medium">
            Log In Here!
          </a>
        </p>
        {/* <button className="py-4 border-4 border-[#82a8bc] bg-transparent hover:bg-[#6c92a8] hover:text-white text-[#0b1e57] w-md mt-3 mb-4 mx-auto font-medium"> ALREADY HAVE AN ACCOUNT? LOG IN</button> */}
      </div>
      

    </div>
  )
}