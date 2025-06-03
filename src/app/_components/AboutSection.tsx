// components/AboutSection.tsx
const aboutCards = [
  {
    img: "mission.png",
    title: "MISSION",
    text: "SHPE empowers the Hispanic community to unlock their full potential and create a global impact through heightened awareness, support, and comprehensive development in STEM disciplines.",
    bgColor: "bg-[#DC3912]", // deep red
  },
  {
    img: "vision.png",
    title: "VISION",
    text: "SHPE envisions a world where Hispanics are esteemed and hold influence as premier innovators, scientists, mathematicians, and engineers, driving progress and diversity.",
    bgColor: "bg-[#FF6F2D]", // bright orange
  },
  {
    img: "familia.png",
    title: "FAMILIA",
    text: "We take responsibility for our collective strength and passion by developing communities, building a diverse and inclusive membership, and challenging each other to be our best.",
    bgColor: "bg-[#EFB70E]", // gold
  },
  {
    img: "service.png",
    title: "SERVICE",
    text: "We act on a foundation of service, committing to deliver the highest levels of quality, integrity, and ethical behavior. We act with empathy, patience, and understanding.",
    bgColor: "bg-[#80AFC6]", // muted teal
  },
  {
    img: "education.png",
    title: "EDUCATION",
    text: "We value formal education and professional development. We are dedicated to continuous improvement and renewal. We learn from successes, setbacks, and each other.",
    bgColor: "bg-[#0078D7]", // blue
  },
  {
    img: "resilence.png",
    title: "RESILIENCE",
    text: "Embracing diverse cultures and communities, we find strength in adaptation, thrive in unity, and persist with unwavering optimism, fostering growth and interconnectedness.",
    bgColor: "bg-[#001F5B]", // dark navy
  },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="w-full min-h-screen bg-white py-12"
    >
      {/* Section Header */}
      <div className="text-center mb-12 px-4">
        <h2 className="text-3xl lg:text-4xl 2xl:text-5xl font-semibold font-helvetica text-yellow-500">
          LEARN MORE ABOUT SHPEUCF
        </h2>
        <p className="mt-4 text-base lg:text-lg 2xl:text-xl text-[#001f5b] mx-auto font-helvetica">
          WE BRING YOU THE BEST PROFESSIONAL DEVELOPMENT, ENGINEERING, AND SOCIAL EXPERIENCES WITH A HISPANIC TWIST.
          
        </p>
      </div>

      {/* Banner of Cards */}
      <div className="grid grid-cols-6 mx-auto max-w-full gap-8 px-30">
        {aboutCards.map(({ img, title, text, bgColor }) => (
          <div
            key={title}
            className={`
              ${bgColor} 
              flex flex-col items-center 
              p-4 
              text-white 
              w-full
              h-[45rem]
            `}
          >
            {/* Icon */}
            <div className="mb-2">
              <img
                src={`/assets/${img}`}
                alt={title}
                className="w-12 h-12 2xl:w-40 2xl:h-40 object-contain"
              />
            </div>

            {/* Title */}
            <h3 className="font-bold text-4xl mb-4">
              {title}
            </h3>

            {/* Body Text */}
            <p className="text-2xl leading-tight text-center">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
