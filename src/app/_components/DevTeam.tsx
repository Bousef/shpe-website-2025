import { DevProfileCard } from "./DevProfileCard";
import type { Member } from "./DevBioPopup";

const members: Member[] = [
  {
    name: "Yousef Osman",
    role: "Tech Chair",
    pfp: "/board/yousef.png",
    bio: {
      major: "Computer Engineering",
      industryFocus: "Project Management, Technical Design, Drafting",
      biotext: `Hey! My name is Yousef, I was born in Maracay, Venezuela, my grandparents were Colombian (Medellín) and Lebanese (Zgharta) immigrants in Venezuela. I'm majoring in Industrial Engineering and minoring in Business Administration. Fun fact about me: I do rapel since I was 2 years old. I also want to be an architect and a fashion designer living in Italy, so I’m learning Italian.`,
      hobbies: "Sports, Modeling, F1, Sewing, Amusement parks, Music, Traveling, Concerts, trying new things, etc.",
      linkedin: "",
    },
  },
  {
    name: "Cata",
    role: "Tech Chair",
    pfp: "/board/cata.png",
    bio: {
      major: "Computer Science",
      industryFocus: "Full‐stack Development, UI/UX Design",
      biotext: `Hi, I'm Cata. I love building elegant UIs, prototyping in Figma, and learning new JS frameworks. Fun fact: I also paint in watercolor on the weekends.`,
      hobbies: "Painting, Photography, Board games, Hiking.",
      linkedin: "",
    },
  },
  {
    name: "Gabriela Cardenas",
    role: "UI/UX Designer",
    pfp: "/board/gabriela.jpeg",
    bio: {
      major: "Computer Science",
      industryFocus: "Full‐stack Development, UI/UX Design",
      biotext: `Hi, I'm Cata. I love building elegant UIs, prototyping in Figma, and learning new JS frameworks. Fun fact: I also paint in watercolor on the weekends.`,
      hobbies: "Painting, Photography, Board games, Hiking.",
      linkedin: "",
    },
  },
  {
    name: "Nicole Baez Espinosa",
    role: "Mobile",
    pfp: "/dev-team/nicole_baez.jpeg",
    bio: {
      major: "Computer Science",
      industryFocus: "Full‐stack Development, UI/UX Design",
      biotext: `Hi, I'm Cata. I love building elegant UIs, prototyping in Figma, and learning new JS frameworks. Fun fact: I also paint in watercolor on the weekends.`,
      hobbies: "Reading, junk journaling, watching movies",
      linkedin: "https://www.linkedin.com/in/nicole-esp",
    },
  },
  {
    name: "Denice Garcia",
    role: "Mobile",
    pfp: "/dev-team/denice.jpg",
    bio: {
      major: "Computer Science",
      industryFocus: "Full‐stack Development, UI/UX Design",
      biotext: `Hi, I'm Cata. I love building elegant UIs, prototyping in Figma, and learning new JS frameworks. Fun fact: I also paint in watercolor on the weekends.`,
      hobbies: "Visiting museums, ballet, watching video essays, pilates",
      linkedin: "http://linkedin.com/in/denice-garcia",
    },
  },
  {
    name: "Santiago Aguilar",
    role: "Mobile",
    pfp: "/dev-team/santiago.jpg",
    bio: {
      major: "Computer Science",
      industryFocus: "Full‐stack Development, UI/UX Design",
      biotext: `Hi, I'm Cata. I love building elegant UIs, prototyping in Figma, and learning new JS frameworks. Fun fact: I also paint in watercolor on the weekends.`,
      hobbies: "Video games, gym, Vollyball, Tennis",
      linkedin: "http://www.linkedin.com/in/santiago-aguilar-b2a99b169",
    },
  },
  {
    name: "Cami Alarcon-Fernandez",
    role: "Mobile",
    pfp: "/dev-team/cami.jpg",
    bio: {
      major: "Digital Media",
      industryFocus: "Full‐stack Development, UI/UX Design",
      biotext: `Hi, I'm Cata. I love building elegant UIs, prototyping in Figma, and learning new JS frameworks. Fun fact: I also paint in watercolor on the weekends.`,
      hobbies: "Drawing, reading, playing open-world video games",
      linkedin: "https://www.linkedin.com/in/camille-alarcon-fernandez",
    },
  },
  {
    name: "Sebastian Chacon",
    role: "Web",
    pfp: "/dev-team/sebastian.jpg",
    bio: {
      major: "Computer Science",
      industryFocus: "Full‐stack Development, UI/UX Design",
      biotext: `Hi, I'm Cata. I love building elegant UIs, prototyping in Figma, and learning new JS frameworks. Fun fact: I also paint in watercolor on the weekends.`,
      hobbies: "playing Soccer and learning about Cyber Security",
      linkedin: "https://www.linkedin.com/in/sebastianchacon1/",
    },
  },
  {
    name: "Luciano Paredes",
    role: "Web",
    pfp: "/dev-team/luciano.jpg",
    bio: {
      major: "Computer Science",
      industryFocus: "Full‐stack Development, UI/UX Design",
      biotext: `Hi, I'm Cata. I love building elegant UIs, prototyping in Figma, and learning new JS frameworks. Fun fact: I also paint in watercolor on the weekends.`,
      hobbies: "Programming Language Design, Systems Programming",
      linkedin: "https://www.linkedin.com/in/luciano-paredes-701300191/",
    },
  },
  {
    name: "Fernando Ailon",
    role: "Web",
    pfp: "/dev-team/fernando.jpg",
    bio: {
      major: "Computer Science",
      industryFocus: "Full‐stack Development, UI/UX Design",
      biotext: `Hi, I'm Cata. I love building elegant UIs, prototyping in Figma, and learning new JS frameworks. Fun fact: I also paint in watercolor on the weekends.`,
      hobbies: "I like playing video games and playing video games",
      linkedin: "https://www.linkedin.com/in/fernando-ailon/",
    },
  },
  /*{
    name: "Isaiah Stockton",
    role: "Web",
    pfp: "/dev-team/isaiah.jpg",
    bio: {
      major: "Computer Science",
      industryFocus: "Full‐stack Development, UI/UX Design",
      biotext: `Hi, I'm Cata. I love building elegant UIs, prototyping in Figma, and learning new JS frameworks. Fun fact: I also paint in watercolor on the weekends.`,
      hobbies: "Coding, gaming, listening to music, hanging with friends",
      linkedin: "https://www.linkedin.com/in/isaiahstockton/",
    },
  },*/
  {
    name: "Mary Bauta",
    role: "Web",
    pfp: "/dev-team/mary.jpeg",
    bio: {
      major: "Computer Science",
      industryFocus: "Full‐stack Development, UI/UX Design",
      biotext: `Hi, I'm Cata. I love building elegant UIs, prototyping in Figma, and learning new JS frameworks. Fun fact: I also paint in watercolor on the weekends.`,
      hobbies: "Painting, Photography, Board games, Hiking.",
      linkedin: "https://www.linkedin.com/in/mary-bauta-a76753292/",
    },
  },
  {
    name: "Anna Zheng",
    role: "Web",
    pfp: "/dev-team/anna.jpeg",
    bio: {
      major: "Computer Science",
      industryFocus: "Full‐stack Development, UI/UX Design",
      biotext: `Hi, I'm Cata. I love building elegant UIs, prototyping in Figma, and learning new JS frameworks. Fun fact: I also paint in watercolor on the weekends.`,
      hobbies: "You can catch me doodling/drawing, watching cdramas, kdramas, horror movies, etc., but at the moment trying to learn crochet :)",
      linkedin: "https://linkedin.com/in/anna-zheng000",
    },
  },
  // …other members (with `bio` fields)…
];

export default function DevSection() {
  const techChairs = members.filter((m) => m.role === "Tech Chair");
  const uiDesigner = members.filter((m) => m.role === "UI/UX Designer");
  const mobileTeam = members.filter((m) => m.role === "Mobile");
  const webTeam    = members.filter((m) => m.role === "Web");

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

        {/* two columns of grid: one for mobile and one for dev profile cards */}
        <section className="container mx-auto mb-16 px-8">
          <div className="flex flex-col md:flex-row gap-12">
            {/* MOBILE TEAM */}
            <div className="flex-1">
              <h4 className="text-4xl font-semibold text-center text-[var(--shpe-blue)] mb-4">MOBILE TEAM</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-items-center">
                {mobileTeam.map((member) => (
                  <div key={member.name} className="w-full max-w-xs">
                    <DevProfileCard member={member} />
                  </div>
                ))}
              </div>
            </div>

            {/* WEB TEAM */}
            <div className="flex-1">
              <h4 className="text-4xl font-semibold text-center text-[var(--shpe-blue)] mb-4">WEB TEAM</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-items-center">
                {webTeam.map((member) => (
                  <div key={member.name} className="w-full max-w-xs">
                    <DevProfileCard member={member} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}