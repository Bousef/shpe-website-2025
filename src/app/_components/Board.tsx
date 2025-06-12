"use client";

import { useState } from "react";
import ContactCard from "./ContactCard";
import { eBoardMembers } from "../../../public/members/data/eboard";
import { remainingMembers } from "../../../public/members/data/members";
import type { Member } from "./MemberCard";
import MemberCard from "./MemberCard";

export default function Board() {
  const [selected, setSelected] = useState<Member | null>(null);

  return (
    <main>
      {/* Main Title */}
      <div className="flex items-center">
        <div className="text-yellow-500 mx-auto">
<h1 className="font-helvetica text-[28px] sm:text-[36px] md:text-[50px] m-6 sm:m-10 pb-4 text-center">
  KNOW THE FACES OF SHPE UCF
</h1>

        </div>
      </div>

      {/* E-Board Section */}
      <div className="text-yellow-500 text-4xl font-helvetica text-center mb-6">
      </div>
      <div className="container mx-auto max-w-full px-25 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8">
          {eBoardMembers.map((member) => (
            <MemberCard
              key={member.name}
              member={member}
              onSelect={setSelected}
            />
            
          ))}
          {remainingMembers.map((member) => (
            <MemberCard
              key={member.name}
              member={member}
              onSelect={setSelected}
            />
          ))}
        </div>
      </div>

      {/* Contact Card Pop-up */}
      {selected && (
        <ContactCard member={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}
