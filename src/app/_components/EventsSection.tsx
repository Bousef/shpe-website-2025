const events = [
  {
    title: "Industry BBQ",
    text:
      "A dynamic networking event that unites our talented students with prominent " +
      "professionals and recruiters from various industries.",
    url: "https://shpeucfbbq.webflow.io/",
  },
  {
    title: "SHPE Conference",
    text:
      "Join SHPE in our signature event and the largest gathering of Hispanics in STEM " +
      "in the country in Anaheim, California.",
    url: "https://shpe.org/engage/events/national-convention/",
  },
  {
    title: "SHPExchange",
    text:
      "Online series giving companies and attendees an opportunity to connect in an " +
      "industry‑focused setting.",
    url: "https://shpe.org/shpexchange/",
  },
];

export default function EventsSection() {
  return (
    <main
      id="events"
      className="relative flex justify-around items-center w-screen bg-[#F7F8F9] h-[80rem] lg:h-[70rem] 2xl:h-[105rem]"
    >
      <img
        src="/_next/static/media/events.ca1aa0aa.svg"
        alt=""
        className="absolute z-10 w-screen"
      />

      <section className="absolute z-20 flex flex-col items-center w-screen max-w-[100%] 2xl:pt-[9rem] lg:mt-[9rem] h-[80rem] lg:h-[70rem] 2xl:h-[105rem]">
        <header className="w-[80%] h-[10%]">
          <h2 className="font-bold text-slate-800 text-3xl lg:text-4xl 2xl:text-7xl pb-6">
            Our Main Events
          </h2>
          <p className="font-medium text-slate-500 text-xl 2xl:text-3xl lg:w-[75%]">
            Learn, interview, network, celebrate, and socialize. There really is
            something for everyone!
          </p>
        </header>

        <section className="flex justify-around w-[90%] h-[80%]">
          <article>
            {events.map(({ title, text, url }) => (
              <a
                key={title}
                href={url}
                target="_blank"
                className="flex justify-between w-[20rem] lg:w-[28rem] 2xl:w-[38rem] mb-6"
              >
                <img
                  src="/_next/static/media/yellow-plain.a8d64088.svg"
                  alt=""
                />
                <article className="w-[14rem] lg:w-[22rem] 2xl:w-[32rem] mt-[4rem] 2xl:mt-[8rem]">
                  <h3 className="font-bold text-slate-800 text-2xl 2xl:text-5xl mb-2 2xl:mb-4">
                    {title}
                  </h3>
                  <p className="font-medium text-slate-500 text-base 2xl:text-2xl">
                    {text}
                  </p>
                </article>
              </a>
            ))}
          </article>

          <img
            src="/_next/static/media/event.342e739c.svg"
            alt="events illustration"
            className="self-start lg:w-1/2 hidden lg:block"
          />
        </section>
      </section>
    </main>
  );
}
