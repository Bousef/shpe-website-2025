import Navbar from "../_components/NavBar";

export default function SignUp(){
  return (
    <div>
      <Navbar/>
      <div className=" border-4 border-solid border-blue-300 px-2 py-4">
        {/* First name */}
          <div>
          <input type="First Name" placeholder="First Name" className="w-full mb-4 border-b border-blue-300 focus:outline-none py-1">
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
      

    </div>
  )
}