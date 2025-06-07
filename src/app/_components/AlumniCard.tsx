"use client";

import { BsLinkedin } from "react-icons/bs";
import { type Member } from "./MemberCard";


type AlumniCardProps = {
    member: Member;
};

export default function AlumniCard({ member }: AlumniCardProps) {
    return (
        <div className="w-full max-w-[220px] bg-white shadow-xl rounded-xl overflow-hidden flex flex-col group">
            {/* Image section with LinkedIn button */}
            <div className="relative w-full aspect-[2/1]">
                {member.linkedin ? (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                        <img
                            src={member.picture}
                            alt={member.name}
                            className="w-full h-full object-cover"
                        />
                    </a>

                ) : (
                    <img
                        src={member.picture}
                        alt={member.name}
                        className="w-full h-full object-cover"
                    />
                )}


                {member.linkedin && (
                    <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center 
 bg-white bg-opacity-70 group-hover:bg-blue-700 transition"
                    >
                        <BsLinkedin className="w-4 h-4 text-blue-800 group-hover:text-white" />
                    </a>
                )}
            </div>

            {/* Name + Role */}
            <div className="p-2 text-center">
                <p className="text-[19px] font-semibold text-[#001f5b]">{member.name}</p>
                <p className="text-base font-bold text-[#001f5b] uppercase tracking-wide">
                    {member.role}
                </p>
            </div>
        </div>
    );
}