"use client";

import Flag from 'react-world-flags';
import { useState } from "react";
import iso from 'iso-3166-1';

type Member = {
  name: string;
  role: string;
  major: string;
  future_ind: string;
  bio: string;
  hobbies: string;
  country: string;
  linkedin: string;
  picture: string;
};

const members: Member[] = [
  {
    name: "Santiago",
    role: "Director",
    major: "Art",
    future_ind: "Samsung",
    bio: "Aguante la falopa",
    hobbies: "Fulbo",
    country: "Uruguay",
    linkedin: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    picture: "/members/855_suarez_luis.jpg",
  },
  {
    name: "Leyjay",
    role: "Tech Stool",
    major: "Computer Information",
    future_ind: "Samsung",
    bio: "Este, este o este?",
    hobbies: "AI for ChatGPT",
    country: "Puelto Lico",
    linkedin: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    picture: "/members/contact_placeholder.jpg",
  },

];

export default function TeamSection() {
  const [selected, setSelected] = useState<Member | null>(null);

  return (
    <main className="p-6">
      <div className="flex items-center">
        <div className="text-yellow-500 mx-auto">
          <h1>
            Title
          </h1>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6">
        {members.map((member) => (
          <div
            key={member.name}
            className="flex flex-col items-center"
          >
            <img
              src={member.picture}
              alt={member.name}
              className="w-24 h-24 rounded-full object-cover cursor-pointer"
              onClick={() => setSelected(member)}
            />
            <button
              onClick={() => setSelected(member)}
              className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Contact
            </button>
          </div>
        ))}
      </div>

{selected && (
  <div className="fixed inset-0 bg-blue-300/50 flex justify-center items-center z-50">
    <div className="bg-white p-6 h-[40rem] w-[60rem] relative overflow-y-auto flex flex-col items-center">
      <button
        onClick={() => setSelected(null)}
        className="absolute top-2 right-2 text-gray-500 hover:text-black"
      >
        ✕
      </button>

      <img src={selected.picture} className="h-[35rem] w-[30rem] object-contain mb-4" />

      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">{selected.name}</h2>
        <p><strong>Role:</strong> {selected.role}</p>
        <p><strong>Major:</strong> {selected.major}</p>
        <p><strong>Hobbies:</strong> {selected.hobbies}</p>
        <a
          href={selected.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View LinkedIn
        </a>
      </div>
    </div>
  </div>
)}

    </main>
  );
}
