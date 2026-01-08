import { SlSocialLinkedin } from "react-icons/sl";
import { RxDiscordLogo } from "react-icons/rx";
import { PiYoutubeLogoLight, PiInstagramLogoLight, PiTiktokLogoThin } from "react-icons/pi";

export default function FooterSection() {
  return (
    <footer className="relative flex flex-col items-center justify-center  h-[15rem] w-full mt-6">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/40 to-transparent backdrop-blur-[5px] pointer-events-none"></div>

      {/* Hollow social icons */}
      <div className="flex space-x-8 z-10 mb-4">
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
      </div>

      <p className="z-10 text-[#001f5b] text-sm font-medium opacity-80">
        &copy; {new Date().getFullYear()} SHPE UCF. All Rights Reserved.
      </p>
    </footer>
  );
}
