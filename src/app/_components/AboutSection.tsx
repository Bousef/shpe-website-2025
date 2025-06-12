// components/AboutSection.tsx
const aboutCards = [
  {
    img: "mission.png",
    title: "MISSION",
    text: "SHPE empowers the Hispanic community to unlock their full potential and create a global impact through heightened awareness, support, and comprehensive development in STEM disciplines.",
    bgColor: "bg-[#DC3912]",
  },
  {
    img: "vision.png",
    title: "VISION",
    text: "SHPE envisions a world where Hispanics are esteemed and hold influence as premier innovators, scientists, mathematicians, and engineers, driving progress and diversity.",
    bgColor: "bg-[#FF6F2D]",
  },
  {
    img: "familia.png",
    title: "FAMILIA",
    text: "We take responsibility for our collective strength and passion by developing communities, building a diverse and inclusive membership, and challenging each other to be our best.",
    bgColor: "bg-[#EFB70E]",
  },
  {
    img: "service.png",
    title: "SERVICE",
    text: "We act on a foundation of service, committing to deliver the highest levels of quality, integrity, and ethical behavior. We act with empathy, patience, and understanding.",
    bgColor: "bg-[#80AFC6]",
  },
  {
    img: "education.png",
    title: "EDUCATION",
    text: "We value formal education and professional development. We are dedicated to continuous improvement and renewal. We learn from successes, setbacks, and each other.",
    bgColor: "bg-[#0078D7]",
  },
  {
    img: "resilence.png",
    title: "RESILIENCE",
    text: "Embracing diverse cultures and communities, we find strength in adaptation, thrive in unity, and persist with unwavering optimism, fostering growth and interconnectedness.",
    bgColor: "bg-[#001F5B]",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="w-full bg-white py-12">
      {/* Section Header */}
      <div className="text-center mb-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold font-helvetica text-yellow-500">
          LEARN MORE ABOUT SHPEUCF
        </h2>
        <p className="mt-4 text-base sm:text-lg lg:text-xl text-[#001f5b] mx-auto font-helvetica ">
          WE BRING YOU THE BEST PROFESSIONAL DEVELOPMENT, ENGINEERING, AND SOCIAL EXPERIENCES WITH A HISPANIC TWIST.
        </p>
      </div>

      {/* Responsive Grid of Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 gap-10 px-8 sm:px-10 lg:px-30">
        {aboutCards.map(({ img, title, text, bgColor }) => (
          <div
            key={title}
            className={`
              ${bgColor}
              flex flex-col items-center
              p-6 sm:p-8 lg:p-10
              text-white
              min-h-[30rem] sm:min-h-[35rem] lg:min-h-[40rem]
              shadow-lg
              transition-transform hover:scale-105
            `}
          >
            {/* Icon */}
<div className="mb-6">
  <img
    src={`/assets/${img}`}
    alt={title}
    className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 object-contain"
  />
</div>

<h3 className="font-bold text-2xl sm:text-2xl md:text-3xl lg:text-4xl mb-6 px-2 text-center">
  {title}
</h3>

<p className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-snug text-center">
  {text}
</p>

          </div>
        ))}
      </div>
    </section>
  );
}
