"use client";

import React from "react";
import { DevBioPopup, type Member } from "./DevBioPopup";

type ProfileCardProps = {
  member: Member;
};

export function DevProfileCard({ member }: ProfileCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    // wrap everything in a div with a fixed max-width (and mx-auto to center)
    <div className="w-full max-w-sm mx-auto">
      <div className="group bg-white overflow-hidden shadow-lg flex flex-col">
        {/* image + hover overlay + arrow */}
        <div className="relative w-full h-96">
          <img
            src={member.pfp}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        
          {/* subtle dark overlay on hover */}
          {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition" /> */}

          {/* arrow icon */}
          <button
            onClick={() => setIsOpen(true)} 
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center
              bg-white bg-opacity-70 group-hover:bg-yellow-400 group-hover:bg-opacity-100 transition cursor-pointer"
          >
            <img
              src={"/assets/arrow.png"}
              alt={member.name + "'s Biography"}
              className="w-6 h-6"
            />
          </button>
        </div>

        {/* name + role */}
        <div className="p-1 text-center flex-grow">
          <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
          <p className="text-sm uppercase font-bold text-blue-900">{member.role}</p>
        </div>

        {/* conditionally render bio popup */}
        {isOpen && <DevBioPopup member={member} onClose={() => setIsOpen(false)} />}
      </div>
    </div>
  )
} 
