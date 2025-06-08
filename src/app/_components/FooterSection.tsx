"use client";

import {
  RiInstagramLine,
  RiDiscordLine,
  RiTiktokLine,
  RiYoutubeLine,
} from "react-icons/ri";
import { SlSocialLinkedin } from "react-icons/sl";
import { RxDiscordLogo } from "react-icons/rx";
import { PiYoutubeLogoLight, PiInstagramLogoLight, PiTiktokLogoThin } from "react-icons/pi";
import {  } from "react-icons/pi";

export default function FooterSection() {
  return (
    <footer className="relative flex flex-col items-center bg-[url(/assets/homebg.png)] h-[15rem] w-full bg-cover mt-6">
      {/* White horizontal line */}
      <hr className="w-11/12 border-t-2 border-white mt-8" />

      {/* Hollow social icons */}
      <div className="flex space-x-8 mt-4">
        <a
          href="https://www.instagram.com/shpeucf/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PiInstagramLogoLight className="text-white text-4xl sm:text-5xl hover:text-gray-300" />
        </a>
        <a
          href="https://www.linkedin.com/company/society-of-hispanic-professional-engineers/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SlSocialLinkedin className="text-white text-4xl sm:text-5xl hover:text-gray-300" />
        </a>
        <a
          href="https://discord.com/invite/gRamS65mqT"
          target="_blank"
          rel="noopener noreferrer"
        >
          <RxDiscordLogo className="text-white text-4xl sm:text-5xl hover:text-gray-300" />
        </a>
        <a
          href="https://www.tiktok.com/@shpe_ucf?_t=ZP-8x1AoD0oTDr&_r=1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PiTiktokLogoThin className="text-white text-4xl sm:text-5xl hover:text-gray-300" />
        </a>
        <a
          href="https://www.youtube.com/@SHPEUCF"
          target="_blank"
          rel="noopener noreferrer"
        >
          <PiYoutubeLogoLight className="text-white text-4xl sm:text-5xl hover:text-gray-300" />
        </a>
      </div>
    </footer>
  );
}
