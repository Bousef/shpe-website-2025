"use client";

import { useState } from "react";

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
    picture: "/images/LuchoSuarez.svg",
  },
];

export default function TeamSection() {
  const [selected, setSelected] = useState<Member | null>(null);

  return (
    <main className="p-6 flex items-center">
      <div className="text-[ffc201]">
      <h1>
        Title
      </h1>
      <div>
        <div>

        </div>
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
        <div className="fixed inset-0 bg-blue-300/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-2">{selected.name}</h2>
            <p><strong>Role:</strong> {selected.role}</p>
            <p><strong>Major:</strong> {selected.major}</p>
            <p><strong>Hobbies:</strong> {selected.hobbies}</p>
            <a
              href={selected.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline mt-2 block"
            >
              View LinkedIn
            </a>
          </div>
        </div>
      )}
    </main>
  );
}
