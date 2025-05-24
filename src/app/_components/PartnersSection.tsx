const logos = [
  "disney",
  "bny_mellon",
  "nvidia",
  "adobe",
  "boa",
  "verizon",
  "northrop",
];

export default function PartnersSection() {
  return (
    <main className="relative bg-white h-[45rem] lg:h-[27rem] 2xl:h-[35rem]">
      <section className="absolute z-20 flex flex-col items-center w-screen 2xl:pt-[6rem] lg:pt-[3.5rem]">
        <p className="pb-4 font-medium text-center text-slate-300 text-xl 2xl:text-3xl">
          Know some of our partners
        </p>
        <figure className="flex items-center justify-around w-screen">
          {logos.map((l) => (
            <img
              key={l}
              src={`assets/${l}.svg`}
              alt={l}
              className="2xl:w-[6%]"
            />
          ))}
        </figure>
      </section>
    </main>
  );
}
