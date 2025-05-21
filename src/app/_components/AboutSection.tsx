const aboutCards = [
  {
    img: "dark-orange.6038308d.svg",
    title: "Mission",
    text:
      "SHPE empowers the Hispanic community to unlock their full potential " +
      "and create a global impact through heightened awareness, support, " +
      "and comprehensive development in STEM disciplines.",
  },
  {
    img: "orange.92d909cd.svg",
    title: "Vision",
    text:
      "SHPE envisions a world where Hispanics are esteemed and hold influence " +
      "as premier innovators, scientists, mathematicians, and engineers, " +
      "driving progress and diversity.",
  },
  {
    img: "yellow.66a58898.svg",
    title: "Familia",
    text:
      "We take responsibility for our collective strength and passion by developing " +
      "communities, building a diverse and inclusive membership, and challenging " +
      "each other to be our best.",
  },
  {
    img: "light-blue.95cb17dc.svg",
    title: "Service",
    text:
      "We act on a foundation of service, committing to deliver the highest levels " +
      "of quality, integrity, and ethical behavior.",
  },
  {
    img: "blue.71fc51e4.svg",
    title: "Education",
    text:
      "We value formal education and professional development. We learn from " +
      "successes, setbacks, and each other.",
  },
  {
    img: "dark-blue.86dfb3e6.svg",
    title: "Resilience",
    text:
      "Embracing diverse cultures and communities, we thrive in unity and persist " +
      "with unwavering optimism.",
  },
];

export default function AboutSection() {
  return (
    <main
      id="about"
      className="relative bg-white 2xl:h-[110rem] xl:h-[70rem] lg:h-[60rem] h-[128rem]"
    >
      <img
        src="/_next/static/media/pattern.204798be.svg"
        alt=""
        className="absolute z-10 w-screen"
      />

      <article className="absolute z-20 flex flex-col items-center w-screen h-full my-[5rem] pb-[5rem]">
        <h4 className="font-bold text-slate-800 text-3xl lg:text-4xl 2xl:text-7xl text-center pb-[2rem]">
          Learn more about SHPE
        </h4>
        <p className="font-medium text-slate-500 text-baseline lg:text-xl 2xl:text-3xl text-center pb-[6rem] w-[90%]">
          We bring you the best professional development, engineering, and
          social experiences with a Hispanic twist.
        </p>

        <section className="flex flex-wrap justify-between items-center w-[80%] h-full m-auto">
          {aboutCards.map(({ img, title, text }) => (
            <section
              key={title}
              className="flex flex-col items-center mb-[4rem] w-80 h-60 2xl:w-[35rem] 2xl:h-96"
            >
              <img src={`/_next/static/media/${img}`} alt={title} />
              <h5 className="font-bold text-slate-800 text-2xl 2xl:text-5xl text-center py-4 2xl:py-8">
                {title}
              </h5>
              <p className="font-medium text-slate-500 text-base 2xl:text-3xl text-center">
                {text}
              </p>
            </section>
          ))}
        </section>
      </article>
    </main>
  );
}
