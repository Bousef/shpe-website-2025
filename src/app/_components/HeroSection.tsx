"use client";

export default function HeroSection() {
  return (
    <main className="w-full flex justify-center py-16 sm:py-20 px-6 bg-white">
      <div
        className="
          w-full max-w-6xl
          bg-[url('/assets/homebg.png')] bg-cover bg-center rounded-2xl
          text-white font-helvetica
          py-16 px-8 sm:px-16
          space-y-6 sm:space-y-8
          shadow-2xl
        "
      >
        {/* Headline */}
        <p className="text-xl sm:text-2xl md:text-3xl tracking-tight text-center">
          Society of Hispanic Professional Engineers at UCF
        </p>

        {/* Become a Member - Emphasized */}
        <p className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-center">
          Become a Member
        </p>

        {/* Subheadline */}
        <p className="text-xl sm:text-2xl md:text-3xl text-center">
          Empowering students to realize their fullest potential
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <a
            href="/signUp"
            className="inline-flex items-center justify-center
              bg-[#f2ac02] hover:bg-[#e0a200]
              text-black font-helvetica
              text-base sm:text-lg font-bold
              tracking-[0.3em]
              px-10 py-5
              rounded-full
              transition-all duration-200
              shadow-md hover:scale-105"
          >
            JOIN SHPEUCF
            <img src="/assets/arrow.png" alt="→" className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </main>
  );
}
