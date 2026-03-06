"use client";

import Navbar          from "./_components/NavBar";
import WeeklyEvents    from "./_components/WeeklyEvents";
import AboutSection    from "./_components/AboutSection";
import HeroSection    from "./_components/HeroSection";
import HeroMask       from "./_components/HeroMask";
import HeroMask2      from "./_components/HeroMask2";
import HistorySection from "./_components/HistorySection";
import { useEffect, useState } from "react";
import NavbarLogin from "./_components/NavBarLogin";
import ElectionComponents from "./_components/ElectionComponents";
{/*export const metadata = {
  title: "SHPE UCF",
  description: "Society of Hispanic Professional Engineers - UCF Chapter",
  icons: { icon: "/favicon.ico" },
};*/}

export default function HomePage() {

      const [isMobile, setIsMobile] = useState(false);

      useEffect(() => {
          const checkScreenSize = () => {
              setIsMobile(window.innerWidth <= 768);
              
          };
          // Check on mount
          checkScreenSize();          
          // Listen for resize
          window.addEventListener('resize', checkScreenSize);
          return () => window.removeEventListener('resize', checkScreenSize);
      }, []);

  if(isMobile){
    return (
      <>
        {/* full page */}
        <div className="bg-white text-black overflow-x-hidden flex flex-col">
          <NavbarLogin />
          <HeroMask2 />
          <HeroSection />
          <WeeklyEvents />
          <AboutSection />
        </div>
      </>
    );
  }

  return (
    <>
      {/* full page */}
      <div className="bg-white text-black overflow-x-hidden flex flex-col">
        <NavbarLogin />
        <HeroMask />
        <HeroSection /> 
        <WeeklyEvents /> 
        <AboutSection />
      </div>
    </>
  );
}
