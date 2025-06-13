import "tailwindcss";

const logos = [
  "bloomberg",
  "blueorigin",
];

export default function PartnersSection() {
  return (
    <main className="bg-white py-12 px-4">
      <section className="max-w-6xl mx-auto text-center">
        <h2 className="text-5xl text-blue-800">
          THANK YOU TO OUR SPONSORS!
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 place-items-center mt-8">
          {logos.map((l) => (
            <div
              key={l}
              className="w-200 h-96 flex items-center justify-center">
              <img
                src={`assets/${l}.svg`}
                alt={l}
                className="max-h-32 w-auto"
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
            href="/become-a-sponsor" // replace with actual URL
            className="bg-[var(--shpe-blue)] text-white font-semibold py-3 px-6 rounded-lg hover:brightness-110 transition"
          >
            Become a Sponsor
          </a>
          <a
            href="/donate" // replace with actual donation link
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
