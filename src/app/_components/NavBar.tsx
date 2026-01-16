'use client';

import { motion } from "motion/react"
import { useState } from "react";
import Link from "next/link";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const navItems = [
  { href: "/board", label: "Board" },
  { href: "/dev-team", label: "Dev team" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/calendar", label: "Calendar" },
  { href: "/history", label: "History" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
  <nav className="w-full bg-gradient-to-t from-white to-[#afc1e3] p-4 sm:p-5 max-w-screen overlay-x-hidden">
  <div className="flex items-center ">
    {/* Logo */}
    <Link href="/" className="flex-shrink-0.5">
      <img
        src="/assets/NavLogo.png"
        alt="SHPE UCF logo"
        className="w-80 object-contain"
      />
    </Link>

    {/* Toggle Button — FIXED CLASS */}
    <button
      className="md:hidden text-3xl text-[#001f5b]"
      onClick={() => setMobileOpen((prev) => !prev)}
      aria-label="Toggle menu"
    >
      {mobileOpen ? <HiX /> : <HiMenuAlt3 />}
    </button>

    {/* Desktop Nav */}

    <div className="hidden md:flex justify-between items-center w-full text-sm lg:text-xl mt-4 md:mt-0 px-6 font-extralight">
      {navItems.map(({ href, label }) => (
          <motion.div
            key={href}
            className="px-3 py-1 relative inline-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            whileHover="hover"
          >
            <Link
              href={href}
              className="text-[#001f5b] hover:text-[#001133]"
            >
              {label.toUpperCase()}
            </Link>
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#001f5b]" 
              initial={{ scaleX: 0 }}
              variants={{
                hover: { scaleX: 1 }
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )
      )}
      <motion.a
        href="https://form.jotform.com/70387424224151"
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-[#FD652F] text-white rounded-lg hover:bg-[#E55829] transition-colors duration-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Members
      </motion.a>
    </div>
  </div>

  {/* Mobile Nav */}
  {mobileOpen && (
    <div className="md:hidden mt-4 space-y-3 flex flex-col items-start text-lg sm:text-xl">
      {navItems.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="block w-full px-4 py-2 text-[#001f5b] hover:text-[#001133] hover:scale-105 transition-transform duration-150 bg-white/90 rounded-xl"
            onClick={() => setMobileOpen(false)}
          >
            {label}
          </Link>
        )
      )}
      <a
        href="https://form.jotform.com/70387424224151"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setMobileOpen(false)}
        className="block w-full px-4 py-2 bg-[#FD652F] text-white text-center rounded-xl hover:bg-[#E55829] transition-colors duration-200"
      >
        Members
      </a>
    </div>
  )}
</nav>

  );
}
