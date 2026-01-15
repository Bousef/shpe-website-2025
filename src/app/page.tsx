import Navbar          from "./_components/NavBar";
import WeeklyEvents    from "./_components/WeeklyEvents";
import AboutSection    from "./_components/AboutSection";
import HeroSection    from "./_components/HeroSection";
import HeroMask       from "./_components/HeroMask";
import HeroMask2      from "./_components/HeroMask2";
export const metadata = {
  title: "SHPE UCF",
  description: "Society of Hispanic Professional Engineers - UCF Chapter",
  icons: { icon: "/favicon.ico" },
};

export default function HomePage() {
  return (
    <>
      {/* full page */}
      <div className="bg-[#F7F8F9] text-black overflow-x-hidden flex flex-col">
        <Navbar />
        {/*<HeroMask />*/}
        {/*<HeroMask2 />*/}
        <HeroSection />   

        <AboutSection />

        {/* <WeeklyEvents /> */}
  
      </div>
    </>
  );
}
