"use client";

import { useState } from "react";
import MemberCard, { type Member } from "./MemberCard";
import ContactCard from "./ContactCard"; // ← import contact card
// Note: You no longer need to import Flag, iso, or BsLinkedin here.

const members: Member[] = [
  {
    name: "Luis Suarez",
    role: "Director",
    major: "Art",
    future_ind: "Samsung",
    bio: "Aguante la falopa",
    hobbies: "Fulbo",
    country: "Uruguay",
    linkedin: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    email: "",
    picture: "/members/855_suarez_luis.jpg",
  },
  {
    name: "Leyjay",
    role: "Tech Stool",
    major: "Computer Information",
    future_ind: "Samsung",
    bio: "Este, este o este?",
    hobbies: "AI for ChatGPT",
    country: "Puerto Rico",
    linkedin: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    email: "",
    picture: "/members/contact_placeholder.jpg",
  },
  {
    name: "Reyjay",
    role: "Tech Stool",
    major: "Computer Information",
    future_ind: "Samsung",
    bio: "Este, este o este?",
    hobbies: "AI for ChatGPT",
    country: "Puerto Rico",
    linkedin: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    email: "",
    picture: "/members/contact_placeholder.jpg",
  },
  {
    name: "Teyjay",
    role: "Tech Stool",
    major: "Computer Information",
    future_ind: "Samsung",
    bio: "Este, este o este?",
    hobbies: "AI for ChatGPT",
    country: "Puerto Rico",
    linkedin: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    email: "",
    picture: "/members/contact_placeholder.jpg",
  },
  {
    name: "Meyjay",
    role: "Tech Stool",
    major: "Computer Information",
    future_ind: "Samsung",
    bio: "Este, este o este?",
    hobbies: "AI for ChatGPT",
    country: "Puerto Rico",
    linkedin: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    email: "",
    picture: "/members/contact_placeholder.jpg",
  },
  {
    name: "Oeyjay",
    role: "Tech Stool",
    major: "Computer Information",
    future_ind: "Samsung",
    bio: "Este, este o este?",
    hobbies: "AI for ChatGPT",
    country: "Puerto Rico",
    linkedin: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    email: "",
    picture: "/members/contact_placeholder.jpg",
  },
  {
    name: "Peyjay",
    role: "Tech Stool",
    major: "Computer Information",
    future_ind: "Samsung",
    bio: "Este, este o este?",
    hobbies: "AI for ChatGPT",
    country: "Puerto Rico",
    linkedin: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    email: "",
    picture: "/members/contact_placeholder.jpg",
  },
];

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

      {selected && (
        <ContactCard member={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}
