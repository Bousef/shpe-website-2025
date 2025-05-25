// components/HeroSection.tsx
export default function HeroSection() {
  return (
    <main className="relative w-screen min-h-screen flex justify-center bg-[#F7F8F9]">
      <img
        src="/assets/background.svg"
        alt="SHPE hero banner"
        className="absolute top-10 z-10 w-[90%] lg:w-2/3 bg-gray-50"
      />
      <img
        src="/assets/wavepattern.svg"
        alt="decorative wave"
        className="absolute bottom-0 left-0 w-full z-0 bg-white"
      />
      <section className="absolute z-20 top-45 flex flex-col items-center text-center h-[35%] 2xl:h-[45%] lg:h-[35%] p-8 lg:p-4">
        <h1 className="text-white font-bold text-[1.7rem] lg:text-5xl 2xl:text-7xl">
          Society of Hispanic
          <br />
          Professional Engineers
        </h1>
        <h2 className="mt-4 text-slate-400 font-medium text-sm lg:text-xl 2xl:text-xl">
          Empowering UCF students to realize their fullest potential
        </h2>
        <a
          href="https://form.jotform.com/70387424224151"
          target="_blank"
          className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-md shadow inline-flex items-center justify-center w-44 h-10 lg:w-52 lg:h-12 2xl:w-80 2xl:h-16 text-xs lg:text-base 2xl:text-xl"
        >
          Become a Member
        </a>
        <p className="mt-4 text-slate-400 font-medium text-sm 2xl:text-2xl">
          We are familia!
        </p>
      </section>
    </main>
  );
}
