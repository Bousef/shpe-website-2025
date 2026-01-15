"use client";

import { SlSocialLinkedin } from "react-icons/sl";
import { RxDiscordLogo } from "react-icons/rx";
import { PiYoutubeLogoLight, PiInstagramLogoLight, PiTiktokLogoThin } from "react-icons/pi";
import { HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";


export default function FooterSection() {
  const [isSmall, setIsSmall] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const hnadleClick = () => {
    setIsVisible(!isVisible);
  }

  useEffect(() => {
    const handleResize = () => {
      setIsSmall(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mobile Footer
  if (isSmall) {
    return (
      <footer className="relative flex flex-col items-center justify-center bg-[url(/assets/homebg.png)] h-[10rem] w-full bg-cover mt-6">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/40 to-transparent backdrop-blur-[5px] pointer-events-none"/>
        
        {/* Toggle button - shows circle when closed, X when open */}
        <motion.button
          className="h-[30px] w-[30px] rounded-full border-blue-950 border-2 z-20 flex items-center justify-center mt-4 cursor-pointer bg-transparent"
          onClick={hnadleClick}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {isVisible ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <HiX className="text-blue-950 text-lg" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.2 }}
                className="w-2 h-2 bg-blue-950"
              />
            )}
          </AnimatePresence>
        </motion.button>

        {/* Animated menu */}
        <AnimatePresence>
          {isVisible && (
            <motion.div 
              className="flex flex-row w-full items-center justify-center space-x-4 px-4 py-2 z-10"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <motion.a
                href="https://www.instagram.com/shpeucf/"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <PiInstagramLogoLight className="text-[#001f5b] text-2xl hover:text-gray-500 transition-colors duration-300" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/company/shpe-ucf/"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <SlSocialLinkedin className="text-[#001f5b] text-2xl hover:text-gray-500 transition-colors duration-300" />
              </motion.a>
              <motion.a
                href="https://discord.com/invite/gRamS65mqT"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <RxDiscordLogo className="text-[#001f5b] text-2xl hover:text-gray-500 transition-colors duration-300" />
              </motion.a>
              <motion.a
                href="https://www.tiktok.com/@shpe_ucf?_t=ZP-8x1AoD0oTDr&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <PiTiktokLogoThin className="text-[#001f5b] text-2xl hover:text-gray-500 transition-colors duration-300" />
              </motion.a>
              <motion.a
                href="https://www.youtube.com/@SHPEUCF"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <PiYoutubeLogoLight className="text-[#001f5b] text-2xl hover:text-gray-500 transition-colors duration-300" />
              </motion.a>
              <motion.div
                initial={{ opacity: 0, y: 10, width: 70 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ width: 90 }}
                transition={{ delay: 0.3, ease: "easeOut", duration: 0.3 }}
                className="h-[28px] rounded-full cursor-pointer border-2 border-blue-950 origin-left flex items-center justify-center"
              >
                <a
                  href="https://shpe.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-950 font-bold text-[10px] flex items-center justify-center h-full px-2"
                >
                  shpe.org
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <p className="z-10 text-[#001f5b] text-xs font-medium opacity-80 mt-2">
          &copy; {new Date().getFullYear()} SHPE UCF. All Rights Reserved.
        </p>
      </footer>
    );
  }
  return (
    <footer className="relative flex flex-col items-center justify-center bg-[url(/assets/homebg.png)] h-[15rem] w-full bg-cover mt-6">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/40 to-transparent backdrop-blur-[5px] pointer-events-none"/>
  
      {/* Hollow social icons */}
      <div className="flex flex-row w-full items-center justify-center space-x-8 p-16 z-10">
        <a
          href="https://www.instagram.com/shpeucf/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PiInstagramLogoLight className="text-[#001f5b] text-4xl sm:text-5xl hover:text-gray-500 transition-colors duration-300" />
        </a>
        <a
          href="https://www.linkedin.com/company/shpe-ucf/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SlSocialLinkedin className="text-[#001f5b] text-4xl sm:text-5xl hover:text-gray-500 transition-colors duration-300" />
        </a>
        <a
          href="https://discord.com/invite/gRamS65mqT"
          target="_blank"
          rel="noopener noreferrer"
        >
          <RxDiscordLogo className="text-[#001f5b] text-4xl sm:text-5xl hover:text-gray-500 transition-colors duration-300" />
        </a>
        <a
          href="https://www.tiktok.com/@shpe_ucf?_t=ZP-8x1AoD0oTDr&_r=1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PiTiktokLogoThin className="text-[#001f5b] text-4xl sm:text-5xl hover:text-gray-500 transition-colors duration-300" />
        </a>
        <a
          href="https://www.youtube.com/@SHPEUCF"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PiYoutubeLogoLight className="text-[#001f5b] text-4xl sm:text-5xl hover:text-gray-500 transition-colors duration-300" />
        </a>
        <motion.div
          initial={{ width: 100 }}
          whileHover={{ width: 130 }}
          transition={{ ease: "easeOut", duration: 0.3 }}
          className="h-[45px] rounded-full p-2 cursor-pointer border-2 border-blue-950 origin-left"
        >
          <a
            href="https://shpe.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-950 font-bold text-sm sm:text-base flex items-center justify-center h-full"
          >
            shpe.org
          </a>
        </motion.div>
      </div>

      <p className="z-10 text-[#001f5b] text-sm font-medium opacity-80">
        &copy; {new Date().getFullYear()} SHPE UCF. All Rights Reserved.
      </p>
    </footer>
  );
}