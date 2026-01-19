"use client";

import Navbar from "../_components/NavBar";
import { useState } from "react";
import ContactCard from "./_components/ContactCard";
import { eBoardMembers } from "../../../public/members/data/eboard";
import { remainingMembers } from "../../../public/members/data/members";
import type { Member } from "../_components/MemberCard";
import MemberCard from "../_components/MemberCard";
import { motion } from "framer-motion";

export default function Board() {
  const [selected, setSelected] = useState<Member | null>(null);

  return (
    <main>
      <Navbar />
      {/* Main Title */}
      <div className="flex items-center">
        <div className="mx-auto text-yellow-500">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="font-helvetica m-6 pb-4 text-center text-[28px] text-blue-800 sm:m-10 sm:text-[36px] md:text-[50px]"
          >KNOW THE FACES OF SHPE UCF
          </motion.h1>
        </div>
      </div>

      {/* E-Board Section */}
      <div className="font-helvetica mb-6 text-center text-4xl text-yellow-500"></div>
      <div className="container mx-auto mb-12 max-w-full px-25">
        <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-4 gap-4 *:px-2">
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
