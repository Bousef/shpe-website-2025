// components/WeeklyEvents.tsx
const events = [
  {
    title: "Industry BBQ",
    date: "June 26, 2025",
    text:
      "A dynamic networking event that unites our talented students with prominent " +
      "professionals and recruiters from various industries.",
    url: "https://shpeucfbbq.webflow.io/",
    imgSrc: "/assets/yousefxd.jpeg",       // <-- replace with your actual image path
  },
  {
    title: "SHPE Conference",
    date: "October 10, 2025",
    text:
      "Join SHPE in our signature event and the largest gathering of Hispanics in STEM " +
      "in the country in Anaheim, California.",
    url: "https://shpe.org/engage/events/national-convention/",
    imgSrc: "/assets/yousefxd.jpeg",    // <-- replace with your actual image path
  },
  {
    title: "SHPExchange",
    date: "August 15, 2025",
    text:
      "Online series giving companies and attendees an opportunity to connect in an " +
      "industry-focused setting.",
    url: "https://shpe.org/shpexchange/",
    imgSrc: "/assets/yousefxd.jpeg",        // <-- replace with your actual image path
  },
  {
    title: "Hackathon",
    date: "September 5, 2025",
    text:
      "36-hour event focusing on completing a prompt a company gives you ",
    url: "https://shpe.org/shpexchange/",
    imgSrc: "/assets/yousefxd.jpeg",        // <-- replace with your actual image path
  },
];

export default function WeeklyEvents() {
  return (
    <section
      id="events"
      className="relative w-full bg-white py-16 px-4 lg:px-8"
    >
      {/* Header */}
        {/* Section Header */}
        <div className="text-center mb-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-helvetica text-blue-800">
        CATCH US THIS WEEK
        </h2>
       
      </div>
       

      {/* Horizontal Scrollable Slider */}
      <div className="flex overflow-x-auto space-x-6 px-2 scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-100 snap-x snap-mandatory">
        {events.map(({ title, date, url, imgSrc }) => (
          <a
            key={title}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-none snap-start w-72 lg:w-80 2xl:w-96 bg-[#EFB70E] rounded-md shadow-lg transform transition-transform duration-300 hover:scale-105"
          >
            <div className="aspect-square flex items-center justify-center rounded-md overflow-hidden">
              <img
                src={imgSrc}
                alt={title}
                className="w-10/11 h-10/11 object-cover object-center"
              />
            </div>
            <div className="px-4 py-3">
              <h3 className="text-center text-slate-800 font-bold text-xl 2xl:text-2xl">
                {title.toUpperCase()}
              </h3>
              <p className="text-center text-sm text-slate-700 mt-1">{date}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
