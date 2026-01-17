import "tailwindcss";

const logos = [
  { name: "bloomberg", file: "bloomberg.svg" },
  { name: "blueorigin", file: "blueorigin.svg" },
  { name: "boa", file: "boa.svg" },
  { name: "boeing", file: "boeing.svg" },
  { name: "burns-and-mcdonnell", file: "burns-and-mcdonnell.svg" },
  { name: "CDM-Smith", file: "CDM-Smith.png" },
  { name: "disney", file: "disney.svg" },
  { name: "honeywell", file: "honeywell.svg" },
  { name: "jnj", file: "jnj.svg" },
  { name: "lockheed", file: "lockheed.svg" },
  { name: "microsoft", file: "microsoft.svg" },
   { name: "wells", file: "wells.svg" },
  { name: "sg-logo", file: "sg-logo.png" },
  { name: "career", file: "career.png" },
  
];

export default function PartnersSection() {
  return (
    <main className="bg-white py-12 px-4">
      <section className="max-w-6xl mx-auto text-center">
        <h2 className="text-5xl text-blue-800">
          THANK YOU TO OUR PARTNERS!
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 place-items-center mt-8">
          {logos.map((l) => (
            <div
              key={l.name}
              className="flex items-center justify-center w-80 h-80 p-4">
              <img
                src={`assets/sponsors/${l.file}`}
                alt={l.name}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>

      <div className="mt-20 text-center">
         <p className="text-2xl sm:text-3xl font-light text-gray-700 mb-10">
          Want to support our mission?
          <br className="hidden sm:block" />
          <span className="font-medium text-[var(--shpe-blue)]">Sponsor</span> or
          <span className="font-medium text-[var(--shpe-orange)]"> donate</span> today.
          </p>

        {/* donation buttons */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
          <a
            href="mailto:corporateaffairs@shpeucf.com"
            className="bg-[var(--shpe-blue)] text-white font-semibold py-3 px-6 rounded-lg hover:brightness-110 transition"
          >
            Become a Partner
          </a>
          <a
            href="https://shpe.org/donor-info/" // replace with actual donation link
            className="bg-[var(--shpe-orange)] text-white font-semibold py-3 px-6 rounded-lg hover:brightness-110 transition"
          >
            Donate
          </a>
        </div>
        </div>

      </section>
    </main>
  );
}
