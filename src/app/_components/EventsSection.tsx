// components/EventsSection.tsx
import Image from "next/image";

const events = [
  {
    title: "Industry BBQ",
    text:
      "A dynamic networking event that unites our talented students with prominent " +
      "professionals and recruiters from various industries.",
    url: "https://shpeucfbbq.webflow.io/",
    imgSrc: "/assets/yousefxd.jpeg",       // <-- replace with your actual image path
  },
  {
    title: "SHPE Conference",
    text:
      "Join SHPE in our signature event and the largest gathering of Hispanics in STEM " +
      "in the country in Anaheim, California.",
    url: "https://shpe.org/engage/events/national-convention/",
    imgSrc: "/assets/yousefxd.jpeg",    // <-- replace with your actual image path
  },
  {
    title: "SHPExchange",
    text:
      "Online series giving companies and attendees an opportunity to connect in an " +
      "industry-focused setting.",
    url: "https://shpe.org/shpexchange/",
    imgSrc: "/assets/yousefxd.jpeg",        // <-- replace with your actual image path
  },
  {
    title: "Hackathon",
    text:
      "36-hour event focusing on completing a prompt a company gives you ",
    url: "https://shpe.org/shpexchange/",
    imgSrc: "/assets/yousefxd.jpeg",        // <-- replace with your actual image path
  },
];

export default function EventsSection() {
  return (
    <section
      id="events"
      className="relative w-full bg-white py-16 px-4 lg:px-8"
    >
      {/* Header */}
      <div className=" mx-auto text-center mb-12">
        <h2 className="text-3xl lg:text-4xl 2xl:text-5xl font-semibold font-helvetica text-blue-800">
          OUR MAIN EVENTS
        </h2>
        <p className="mt-4 text-base lg:text-lg 2xl:text-xl text-[#001f5b] mx-auto font-helvetica">
          LEARN, INTERVIEW, NETWORK, CELEBRATE, AND SOCIALIZE. THERE REALLY IS SOMETHING FOR EVERYONE!
        </p>
      </div>

      {/* Cards Container */}
      <div className="flex flex-wrap justify-center gap-8">
        {events.map(({ title, text, url, imgSrc }) => (
          <a
            key={title}
            href={url}
            className="
              block
              w-full sm:w-72 lg:w-80 2xl:w-96
              bg-[#EFB70E]
            "
          >
            <div className="aspect-square flex items-center justify-center ">
              <Image
                src={imgSrc}
                alt={title}
                width={400}
                height={400}
                className="w-10/11 h-10/11 object-cover object-center  "
              />
            </div>

            <div className="px-4 py-3">
              <h3 className="text-center text-slate-800 font-bold text-xl 2xl:text-2xl">
                {title.toUpperCase()}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
