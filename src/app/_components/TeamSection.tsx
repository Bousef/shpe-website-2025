"use client";

import Flag from 'react-world-flags';
import { useState } from "react";
import iso from 'iso-3166-1';
import { BsLinkedin } from "react-icons/bs";

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
    name: "Luis Suarez",
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
    country: "puerto rico",
    linkedin: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
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
    picture: "/members/contact_placeholder.jpg",
  },
];

export default function TeamSection() {
  const [selected, setSelected] = useState<Member | null>(null);

  return (
    <main >
      <div className="flex items-center">
        <div className="text-yellow-500 mx-auto">
          <h1 className="font-helvetica text-[50px] m-10 pb-5">
            GET TO KNOW OR TEAM
          </h1>
        </div>
      </div>
      {/* Photo, name and role */}
      <div className="container mx-auto max-w-full px-25">
        <div className="grid grid-cols-4 gap-x-5">
          {members.map((member) => (
            <div key={member.name} className="flex flex-col items-center">
              <button onClick={() => setSelected(member)} className="block w-full">
                <div className="w-full aspect-[3/4]">
                  <img
                    src={member.picture}
                    alt={member.name}
                    className="w-full h-full object-cover cursor-pointer"
                  />
                </div>
                <div className="mt-2 text-center">
                  <p className="text-2xl tracking-wide text-[#001f5b]">{member.name}</p>
                  <p className="font-bold text-2xl tracking-wider text-[#001f5b] mb-10">{member.role.toUpperCase()}</p>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* Contact card pop-up */}
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
                <Flag className="h-10" code={iso.whereCountry(selected.country)?.alpha3} />
                <a
                  href={selected.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-600 underline"
                >
                  <BsLinkedin className='w-10 h-10' />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}


    </main>
  );
}
