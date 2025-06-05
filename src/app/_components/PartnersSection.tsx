import "tailwindcss";

const logos = [
  "bloomberg",
  "blueorigin",
];

export default function PartnersSection() {
  return (
    <main className="bg-white py-12 px-4">
      <section className="max-w-6xl mx-auto text-center">
        <h2 className="text-5xl text-[var(--shpe-yellow)]">
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
      </section>
    </main>
  );
}
