import { ChevronRightIcon } from '@heroicons/react/24/solid'

const members = [
  {
    name: "Yousef Osman",
    role: "Tech Chair",
    img: "../favicon.ico",
  },
  {
    name: "Cata",
    role: "Tech Chair",
    img: "/board/hernan.jpg",
  },
  {
    name: "Name1",
    role: "Mobile",
    img: "/board/hernan.jpg",
  },
  {
    name: "Name2",
    role: "Mobile",
    img: "/board/hernan.jpg",
  },
  {
    name: "Name3",
    role: "Mobile",
    img: "/board/hernan.jpg",
  },
  {
    name: "Name4",
    role: "Web",
    img: "/board/hernan.jpg",
  },
  {
    name: "Name5",
    role: "Web",
    img: "/board/hernan.jpg",
  },
  {
    name: "Name6",
    role: "Web",
    img: "/board/hernan.jpg",
  },
  {
    name: "Name7",
    role: "Web",
    img: "/board/hernan.jpg",
  },
  {
    name: "Name8",
    role: "Web",
    img: "/board/hernan.jpg",
  },
  // …add the remaining remaining team members here …
];

function Card({ member }: { member: { name: string; role: string; img: string } }) {
  return (
    <div className="group bg-white overflow-hidden shadow-lg flex flex-col">
      {/* image + hover overlay + arrow */}
      <div className="relative w-full h-96">
        <img
          src={member.img}
          alt={member.name}
          className="w-full h-full object-cover"
        />
      
        {/* subtle dark overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition" />
        {/* arrow icon */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition">
        {/* <ChevronRightIcon className="w-6 h-6" /> */}
        </div>
      </div>

      {/* name + role */}
      <div className="p-1 text-center flex-grow">
        <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
        <p className="text-sm uppercase font-bold text-blue-900">{member.role}</p>
      </div>
    </div>
  )
} 

export default function DevSection() {
  const techChairs = members.filter((m) => m.role === "Tech Chair")
  const devTeam    = members.filter((m) => m.role !== "Tech Chair")

  return (
    <main id="team" className="relative">
      <section className="bg-white text-white flex flex-col items-center pb-[6rem] py-[2rem]">

        {/* header */}
        <div className="container mx-auto px-4 text-center mb-12 text-black">
          <h2 className="text-5xl text-[var(--shpe-orange)]">GET TO KNOW OUR TEAM</h2>
          <p className="mt-2 text-xl text-slate-400">Know the faces of SHPE UCF</p>
        </div>

        {/* grid for the tech chairs profile cards */}
        <section className="container mx-auto mb-16 px-4">
          <h3 className="text-4xl text-[var(--shpe-blue)] font-semibold text-center mb-4">TECH CHAIRS</h3>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {techChairs.map((m) => (
                <Card key={m.name} member={m} />
              ))}
            </div>
          </div>
        </section>

        {/* grid for rest of dev team profile cards */}
        <section className="container mx-auto mb-16 px-4">
          <h3 className="text-4xl text-[var(--shpe-blue)] font-semibold text-center mb-4">REST OF DEV TEAM</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {devTeam.map((m) => (
              <Card key={m.name} member={m} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}