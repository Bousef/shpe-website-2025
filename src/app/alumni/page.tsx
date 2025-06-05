"use client";

import { useState } from "react";
import Navbar from "../_components/NavBar";
import MemberCard, { type Member } from "../_components/MemberCard";
import { BsLinkedin } from "react-icons/bs";

export default function Alumni() {


    const alumniList: Member[] = [
        {
            name: "Hernan Hernandez-Garcia",
            role: "EX-PRESIDENT",
            picture: "",
            linkedin: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        },
        {
            name: "Vimalys Rivera Caceres",
            role: "EXTERNAL VICE PRESIDENT",
            picture: "",
            linkedin: "",
        },
        {
            name: "Ariana Rodriguez Velez",
            role: "EX-INTERNAL VICE PRESIDENT",
            picture: "",
            linkedin: "",
        },
        //to add more alumni later

    ];


    const [selected, setSelected] = useState<Member | null>(null);






    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-blue-100">
            <Navbar />

            <div className="text-center py-10">
                <h1 className="text-4xl font-bold text-yellow-500">

                    2024 - 2025

                </h1>
            </div>

            {/* Alumni Cards Grid */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-20 pb-10 justify-items-center">


                {alumniList.map((member) => (

                    <div
                        key={member.name}
                        className="bg-white shadow-xl rounded-xl p-4 w-full max-w-xs hover:scale-101 transition-transform">


                        <MemberCard member={member} onSelect={setSelected} />


                        {member.linkedin && (
                            <a
                                href={member.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex justify-center mt-2"
                            >
                                <BsLinkedin className="w-6 h-6 text-blue-600 hover:text-blue-800" />
                            </a>
                        )}

                    </div>


                ))}





            </div>
        </div>
    );
}