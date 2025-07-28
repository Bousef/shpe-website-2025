import Navbar          from "./_components/NavBar";
import WeeklyEvents    from "./_components/WeeklyEvents";
import Slideshow    from "./_components/MeetFam";
import AboutSection    from "./_components/AboutSection";
import HeroSection    from "./_components/HeroSection";
import SquareConnectionTest from "./_components/SquareConnectionTester";
import JotformTester from "./_components/JotformTester";

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
        <HeroSection />   
        <AboutSection />
        <WeeklyEvents />

        <Slideshow />
        
        {/*<SquareConnectionTest />*/}
        
        <JotformTester />
        
      </div>
    </>
  );
}
