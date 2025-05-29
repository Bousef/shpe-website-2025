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
          <div className="bg-white p-6 w-[65rem] h-[40rem] relative flex gap-6">
            {/* Close Button */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            <div className="w-3/5 flex items-start justify-center">
              <img
                src={selected.picture}
                alt={selected.name}
                className="h-full object-cover rounded-md"
              />
            </div>

            <div className="w-2/3 flex flex-col justify-start space-y-3 ">
              <div>
                <p className="font-bold text-lg  text-blue-950">MAJOR:</p>
                <p>{selected.major}</p>
              </div>

              <div>
                <p className="font-bold text-lg text-blue-950">FUTURE INDUSTRY FOCUS:</p>
                <p>{selected.future_ind}</p>
              </div>

              <div>
                <p className="font-bold text-lg text-blue-950">BIO:</p>
                <p className="text-justify whitespace-pre-wrap">{selected.bio}</p>
              </div>

              <div>
                <p className="font-bold text-sm text-blue-950">HOBBIES:</p>
                <p>{selected.hobbies}</p>
              </div>

              <div className="flex flex-row gap-3 mt-2">
              <Flag className="w-10" code={ iso.whereCountry(selected.country)?.alpha3 } />
                <a
                  href={selected.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-600 underline"
                >
                  View LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      )}


    </main>
  );
}
