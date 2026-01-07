"use client";

import Navbar from "../_components/NavBar";
import MemberCard from "../_components/MemberCard";
import type { Member } from "../_components/MemberCard";
import { useState } from "react";
import ContactCard from "../board/_components/ContactCard";
import { DevBioPopup } from "./_components/DevBioPopup";

const members: Member[] = [
  {
    name: "Yousef Osman",
    role: "Tech Chair",
    picture: "yousef.png",
    hobbies:
      "Sports, Modeling, F1, Sewing, Amusement parks, Music, Traveling, Concerts, trying new things, etc.",
    linkedin: "",
  },
  {
    name: "Catalina Ocampo",
    role: "Tech Chair",
    picture: "cata.png",
    hobbies: "Painting, Photography, Board games, Hiking.",
    linkedin: "",
  },
  {
    name: "Gabriela Cardenas",
    role: "UI/UX Designer",
    picture: "gaby.jpeg",
    hobbies: "Design, Photography, Art, Music.",
    linkedin: "",
  },
  {
    name: "Nicole Baez Espinosa",
    role: "Mobile Developer",
    picture: "nicole_baez.jpeg",
    hobbies: "Reading, junk journaling, watching movies",
    linkedin: "https://www.linkedin.com/in/nicole-esp",
  },
  {
    name: "Denice Garcia",
    role: "Mobile Developer",
    picture: "denice.jpg",
    hobbies: "Visiting museums, ballet, watching video essays, pilates",
    linkedin: "http://linkedin.com/in/denice-garcia",
  },
  {
    name: "Santiago Aguilar",
    role: "Mobile Developer",
    picture: "santiago.jpg",
    hobbies: "Video games, gym, Volleyball, Tennis",
    linkedin: "http://www.linkedin.com/in/santiago-aguilar-b2a99b169",
  },
  {
    name: "Cami Alarcon-Fernandez",
    role: "Mobile Developer",
    picture: "cami.jpg",
    hobbies: "Drawing, reading, playing open-world video games",
    linkedin: "https://www.linkedin.com/in/camille-alarcon-fernandez",
  },
  {
    name: "Sebastian Chacon",
    role: "Web Developer",
    picture: "sebastian.jpg",
    hobbies: "Playing Soccer and learning about Cyber Security",
    linkedin: "https://www.linkedin.com/in/sebastianchacon1/",
  },
  {
    name: "Luciano Paredes",
    role: "Web Developer",
    picture: "luciano.jpg",
    hobbies: "Programming Language Design, Systems Programming",
    linkedin: "https://www.linkedin.com/in/luciano-paredes-701300191/",
  },
  {
    name: "Fernando Ailon",
    role: "Web Developer",
    picture: "fernando.jpg",
    hobbies: "I like playing video games and playing video games",
    linkedin: "https://www.linkedin.com/in/fernando-ailon/",
  },
  {
    name: "Adan Rojas",
    role: "Web Developer",
    picture: "adan.jpeg",
    hobbies: "I like tickling my dog",
    linkedin: "https://www.linkedin.com/in/adan-rojas/",
  },
  /*{
    name: "Isaiah Stockton",
    role: "Web Developer",
    pfp: "/dev-team/isaiah.jpg",
    bio: {
      major: "Computer Science",
      year: "Sophomore",
      hometown: "",
      industryFocus: "Web Development",
      biotext: `Hi, I'm Isaiah. I enjoy coding and building web applications. Music and friends keep me balanced when I'm not behind the keyboard.`,
      hobbies: "Coding, gaming, listening to music, hanging with friends",
      linkedin: "https://www.linkedin.com/in/isaiahstockton/",
      instagram: "",
    },
  },*/
  {
    name: "Mary Bauta",
    role: "Web Developer",
    picture: "mary.jpeg",
    hobbies: "Painting, Photography, Board games, Hiking.",
    linkedin: "https://www.linkedin.com/in/mary-bauta-a76753292/",
  },
  {
    name: "Anna Zheng",
    role: "Web Developer",
    picture: "anna.jpeg",
    hobbies:
      "Doodling/drawing, games, watching cdramas, kdramas, horror movies, etc. Trying to learn how to crochet right now :)",
    linkedin: "https://linkedin.com/in/anna-zheng000",
  },
];

export default function DevSection() {
  const [selected, setSelected] = useState<Member | null>(null);

  return (
    <main>
      <Navbar />
      {/* Main Title */}
      <div className="flex items-center">
        <div className="mx-auto text-yellow-500">
          <h1 className="font-helvetica m-6 pb-4 text-center text-[28px] text-blue-800 sm:m-10 sm:text-[36px] md:text-[50px]">
            GET TO KNOW OUR TEAM
          </h1>
        </div>
      </div>

      {/* Team Section */}
      <div className="container mx-auto mb-12 max-w-full px-25">
        <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member) => (
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
        <DevBioPopup member={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}
