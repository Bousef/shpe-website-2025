"use client";

import { useState } from "react";
import ContactCard from "./ContactCard"; 
import {members} from "../../../public/members/data/members";
import type { Member, } from "./MemberCard";
import MemberCard from "./MemberCard";


export default function TeamSection() {
  const [selected, setSelected] = useState<Member | null>(null);

  return (
    <main>
      <div className="flex items-center">
        <div className="text-yellow-500 mx-auto">
          <h1 className="font-helvetica text-[50px] m-10 pb-5">
            GET TO KNOW OUR TEAM
          </h1>
        </div>
      </div>

      {/* Photo, Name and Role Grid */}
      <div className="container mx-auto max-w-full px-25">
        <div className="grid grid-cols-4 gap-x-5">
          {members.map((member) => (
            <MemberCard
              key={member.name}
              member={member}
              onSelect={setSelected}
            />
          ))}
        </div>
      </div>

      {/* Contact Card Pop-up (now in its own component) */}
      {selected && (
        <ContactCard member={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}
