import { DevProfileCard } from "./DevProfileCard";
import type { Member } from "./DevBioPopup";

const members: Member[] = [
  {
    name: "Yousef Osman",
    role: "Tech Chair",
    pfp: "/path/to/yousef.jpg", 
    bio: {
      major: "Computer Engineering",
      industryFocus: "Project Management, Technical Design, Drafting",
      biotext: `Hey! My name is Yousef, I was born in Maracay, Venezuela, my grandparents were Colombian (Medellín) and Lebanese (Zgharta) immigrants in Venezuela. I'm majoring in Industrial Engineering and minoring in Business Administration. Fun fact about me: I do rapel since I was 2 years old. I also want to be an architect and a fashion designer living in Italy, so I’m learning Italian.`,
      hobbies: "Sports, Modeling, F1, Sewing, Amusement parks, Music, Traveling, Concerts, trying new things, etc.",
      flags: [""], 
      email: "",
      linkedin: "",
    },
  },
  {
    name: "Cata",
    role: "Tech Chair",
    pfp: "/path/to/cata.jpg",
    bio: {
      major: "Computer Science",
      industryFocus: "Full‐stack Development, UI/UX Design",
      biotext: `Hi, I'm Cata. I love building elegant UIs, prototyping in Figma, and learning new JS frameworks. Fun fact: I also paint in watercolor on the weekends.`,
      hobbies: "Painting, Photography, Board games, Hiking.",
      flags: [""], 
      email: "",
      linkedin: "",
    },
  },
  {
    name: "Gabriela Cardenas",
    role: "UI/UX Designer",
    pfp: "/path/to/cata.jpg",
    bio: {
      major: "Computer Science",
      industryFocus: "Full‐stack Development, UI/UX Design",
      biotext: `Hi, I'm Cata. I love building elegant UIs, prototyping in Figma, and learning new JS frameworks. Fun fact: I also paint in watercolor on the weekends.`,
      hobbies: "Painting, Photography, Board games, Hiking.",
      flags: [""], 
      email: "",
      linkedin: "",
    },
  },
  {
    name: "name2",
    role: "Mobile",
    pfp: "/path/to/cata.jpg",
    bio: {
      major: "Computer Science",
      industryFocus: "Full‐stack Development, UI/UX Design",
      biotext: `Hi, I'm Cata. I love building elegant UIs, prototyping in Figma, and learning new JS frameworks. Fun fact: I also paint in watercolor on the weekends.`,
      hobbies: "Painting, Photography, Board games, Hiking.",
      flags: [""], 
      email: "",
      linkedin: "",
    },
  },
  {
    name: "name3",
    role: "Mobile",
    pfp: "/path/to/cata.jpg",
    bio: {
      major: "Computer Science",
      industryFocus: "Full‐stack Development, UI/UX Design",
      biotext: `Hi, I'm Cata. I love building elegant UIs, prototyping in Figma, and learning new JS frameworks. Fun fact: I also paint in watercolor on the weekends.`,
      hobbies: "Painting, Photography, Board games, Hiking.",
      flags: [""], 
      email: "",
      linkedin: "",
    },
  },
  {
    name: "name4",
    role: "Mobile",
    pfp: "/path/to/cata.jpg",
    bio: {
      major: "Computer Science",
      industryFocus: "Full‐stack Development, UI/UX Design",
      biotext: `Hi, I'm Cata. I love building elegant UIs, prototyping in Figma, and learning new JS frameworks. Fun fact: I also paint in watercolor on the weekends.`,
      hobbies: "Painting, Photography, Board games, Hiking.",
      flags: [""], 
      email: "",
      linkedin: "",
    },
  },
  {
    name: "name5",
    role: "Web",
    pfp: "/path/to/cata.jpg",
    bio: {
      major: "Computer Science",
      industryFocus: "Full‐stack Development, UI/UX Design",
      biotext: `Hi, I'm Cata. I love building elegant UIs, prototyping in Figma, and learning new JS frameworks. Fun fact: I also paint in watercolor on the weekends.`,
      hobbies: "Painting, Photography, Board games, Hiking.",
      flags: [""], 
      email: "",
      linkedin: "",
    },
  },
  {
    name: "name6",
    role: "Web",
    pfp: "/path/to/cata.jpg",
    bio: {
      major: "Computer Science",
      industryFocus: "Full‐stack Development, UI/UX Design",
      biotext: `Hi, I'm Cata. I love building elegant UIs, prototyping in Figma, and learning new JS frameworks. Fun fact: I also paint in watercolor on the weekends.`,
      hobbies: "Painting, Photography, Board games, Hiking.",
      flags: [""], 
      email: "",
      linkedin: "",
    },
  },
  {
    name: "name7",
    role: "Web",
    pfp: "/path/to/cata.jpg",
    bio: {
      major: "Computer Science",
      industryFocus: "Full‐stack Development, UI/UX Design",
      biotext: `Hi, I'm Cata. I love building elegant UIs, prototyping in Figma, and learning new JS frameworks. Fun fact: I also paint in watercolor on the weekends.`,
      hobbies: "Painting, Photography, Board games, Hiking.",
      flags: [""], 
      email: "",
      linkedin: "",
    },
  },
  {
    name: "name8",
    role: "Web",
    pfp: "/path/to/cata.jpg",
    bio: {
      major: "Computer Science",
      industryFocus: "Full‐stack Development, UI/UX Design",
      biotext: `Hi, I'm Cata. I love building elegant UIs, prototyping in Figma, and learning new JS frameworks. Fun fact: I also paint in watercolor on the weekends.`,
      hobbies: "Painting, Photography, Board games, Hiking.",
      flags: [""], 
      email: "",
      linkedin: "",
    },
  },
  {
    name: "name9",
    role: "Mobile",
    pfp: "/path/to/cata.jpg",
    bio: {
      major: "Computer Science",
      industryFocus: "Full‐stack Development, UI/UX Design",
      biotext: `Hi, I'm Cata. I love building elegant UIs, prototyping in Figma, and learning new JS frameworks. Fun fact: I also paint in watercolor on the weekends.`,
      hobbies: "Painting, Photography, Board games, Hiking.",
      flags: [""], 
      email: "",
      linkedin: "",
    },
  },
  // …other members (with `bio` fields)…
];

export default function DevSection() {
  const techChairs = members.filter((m) => m.role === "Tech Chair")
  const uiDesigner = members.filter((m) => m.role === "UI/UX Designer")
  const devTeam    = members.filter((m) => m.role !== "Tech Chair" && m.role !== "UI/UX Designer")

  return (
    <main id="team" className="relative bg-white">
      <section className="flex flex-col items-center pb-[6rem] py-[2rem]">

        {/* header */}
        <div className="container mx-auto px-4 text-center mb-12 text-black">
          <h2 className="text-5xl text-[var(--shpe-orange)]">GET TO KNOW OUR TEAM</h2>
          <p className="mt-2 text-xl text-slate-400">Know the faces of SHPE UCF</p>
        </div>

        {/* grid for the tech chairs profile cards */}
        <section className="container mx-auto mb-16 px-4">
          <h3 className="text-4xl text-[var(--shpe-blue)] font-semibold text-center mb-4">TECH CHAIRS</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {techChairs.map((m) => (
              <DevProfileCard key={m.name} member={m} />
            ))}
          </div>
        </section>

        {/* grid for the ui/ux designer profile cards */}
        <section className="container mx-auto mb-16 px-4">
          <h3 className="text-4xl text-[var(--shpe-blue)] font-semibold text-center mb-4">UI/UX DESIGNER</h3>
          <div className="grid grid-cols-1 gap-4">
            {uiDesigner.map((m) => (
              <DevProfileCard key={m.name} member={m} />
            ))}
          </div>
        </section>

        {/* grid for rest of dev team profile cards */}
        <section className="container mx-auto mb-16 px-4">
          <h3 className="text-4xl text-[var(--shpe-blue)] font-semibold text-center mb-4">REST OF DEV TEAM</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {devTeam.map((m) => (
              <DevProfileCard key={m.name} member={m} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}