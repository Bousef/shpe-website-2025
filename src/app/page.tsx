import Navbar          from "./_components/NavBar";
import HeroSection     from "./_components/HeroSection";
import AboutSection    from "./_components/AboutSection";
import JoinBanner      from "./_components/JoinBanner";
import FooterSection   from "./_components/FooterSection";
import ContactSection from "./_components/ContactSection";


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
        <JoinBanner />
        <ContactSection/>
        <FooterSection />
      </div>
    </>
  );
}
