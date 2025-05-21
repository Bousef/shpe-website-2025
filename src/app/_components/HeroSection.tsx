export default function HeroSection() {
  return (
    <main className="relative flex items-center justify-center w-screen bg-[#F7F8F9] h-[30rem] lg:h-[35rem] 2xl:h-[48rem]">
      <img
        src="assets/background.svg"
        alt="hero pattern"
        className="absolute z-10 lg:w-2/3 w-[90%] bg-gray-50"
      />

      <section className="absolute z-20 flex flex-col items-center text-center p-8 lg:p-4 h-[35%] lg:h-[35%] 2xl:h-[45%]">
        <h1 className="font-bold text-white text-[1.7rem] lg:text-5xl 2xl:text-7xl">
          Society of Hispanic
          <br />
          Professional Engineers
        </h1>
        <h2 className="mt-4 font-medium text-slate-400 text-sm lg:text-xl 2xl:text-xl">
          Empowering UCF students to realize their fullest potential
        </h2>
        <a
          href="https://form.jotform.com/70387424224151"
          target="_blank"
          className="inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 rounded-md shadow text-black font-medium
                     w-44 h-10 text-xs lg:w-52 lg:h-12 lg:text-base 2xl:w-80 2xl:h-16 2xl:text-xl mt-6"
        >
          Become a Member
        </a>
        <p className="mt-4 font-medium text-slate-400 text-sm 2xl:text-2xl">
          We are familia!
        </p>
      </section>
    </main>
  );
}
