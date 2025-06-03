import Navbar          from "./_components/NavBar";
import HeroSection     from "./_components/HeroSection";
import AboutSection    from "./_components/AboutSection";
import ContactSection from "./_components/ContactSection";
import EventsSection from "./_components/EventsSection";


export const metadata = {
  title: "SHPE UCF",
  description: "Society of Hispanic Professional Engineers – UCF Chapter",
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
        <EventsSection />
      </div>
    </>
  );
}
