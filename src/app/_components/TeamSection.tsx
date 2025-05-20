const members = [
  {
    name: "Hernan Hernandez‑Garcia",
    role: "President",
    img: "/board/hernan.jpg",
  },
  // …add the remaining 21 here …
];

export default function TeamSection() {
  return (
    <main id="team" className="relative">
      <img
        src="/_next/static/media/wave2.6d75af1d.svg"
        alt=""
        className="w-full"
      />

      <section className="bg-[#2A3342] text-white flex flex-col items-center pb-[6rem] py-[2rem]">
        <article className="w-[80%] flex flex-col lg:h-[12rem] 2xl:h-[16rem] justify-around py-6 pb-10">
          <h2 className="font-bold text-[1.6rem] lg:text-4xl 2xl:text-7xl pb-4">
            Get to know our Team
          </h2>
          <p className="font-medium text-xl 2xl:text-3xl text-slate-400">
            Know the faces of SHPE UCF
          </p>
        </article>

        <section className="flex flex-wrap justify-around gap-[3rem] w-[90%]">
          {members.map(({ name, role, img }) => (
            <div
              key={name}
              className="inline-flex flex-col items-center gap-4 bg-white rounded-lg shadow border-stone-300
                         w-56 h-[22rem] 2xl:w-80 2xl:h-[27rem] p-4"
            >
              <div className="flex flex-col items-start w-full">
                <img
                  src={img}
                  alt={name}
                  className="rounded-md m-auto w-40 h-40 2xl:w-36 2xl:h-36"
                />
                <h3 className="font-bold text-black text-lg 2xl:text-[1.6rem] mt-4 ml-4">
                  {name}
                </h3>
                <p className="font-medium text-neutral-700 text-base 2xl:text-xl ml-4">
                  {role}
                </p>
              </div>
              <button className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 rounded-md shadow text-black font-medium
                                 w-40 h-9 2xl:w-60 2xl:h-12 2xl:text-xl mb-4">
                More
              </button>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
