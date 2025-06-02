// components/HeroSection.tsx
export default function HeroSection() {
  return (
    <main className="        
        flex items-center justify-start 
        bg-[url('/assets/homebg.png')] bg-cover bg-center 
        min-h-screen
      ">

      <div className="ml-20 mt-10 w-2/3 h-[50rem] text-white font-helvetica">

        <p className="text-[50px] ml-4 tracking-tighter">Society of Hispanic Professional Engineers at UCF </p>
        <p className="hero-title tracking-tighter">Become a Member</p>
        <p className="text-[50px] ml-4">Empowering students to realize their fullest potential </p>

<a
  href="https://form.jotform.com/70387424224151"
  target="_blank"
  rel="noopener noreferrer"
  className="
    mt-8                                /* small gap above */
    inline-flex items-center justify-center
    bg-[#f2ac02] hover:bg-[#e0a200]     /* yellow bg, slightly darker on hover */
    text-black font-helvetica /* black, uppercase Helvetica */
    text-xl font-bold
    tracking-[0.3em]                    /* letter-spacing: 0.3em */
    px-10 py-5                           /* horizontal/vertical padding */
    rounded-full                        /* pill shape */
    transition-colors duration-200      /* smooth hover */
  "
>
  JOIN SHPEUCF
  <img
    src="/assets/arrow.png"
    alt="→"
    className="ml-2 w-5 h-5"
  />
</a>

      </div>
    </main>
  );
}
