'use client';

import { useState } from "react";
import Link from "next/link";
import { VscAccount } from "react-icons/vsc";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/board", label: "Board" },
  { href: "/dev-team", label: "Dev team" },
  { href: "/alumni", label: "Alumni" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/calendar", label: "Calendar" },
  { href: "/shop", label: "Shop", external: true },
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

    <div className="hidden md:flex justify-between items-center w-full text-sm lg:text-xl mt-4 md:mt-0 px-6">
      {navItems.map(({ href, label, external }) =>
        external ? (
          <a
            key={href}
            href={href}

            className="px-3 py-1 text-[#001f5b] hover:text-[#001133] hover:scale-105 transition-transform duration-150 rounded-3xl"
          >
            {label.toUpperCase()}

          </a>
        ) : (
          <Link
            key={href}
            href={href}

            className="px-3 py-1 text-[#001f5b] hover:text-[#001133] hover:scale-105 transition-transform duration-150 rounded-3xl"
          >
            {label.toUpperCase()}
          </Link>
        )
      )}
      <Link href="/login">
        <VscAccount className="text-3xl sm:text-4xl text-[#001f5b] cursor-pointer" />
      </Link>
    </div>
  </div>

  {/* Mobile Nav */}
  {mobileOpen && (
    <div className="md:hidden mt-4 space-y-3 flex flex-col items-start text-lg sm:text-xl">
      {navItems.map(({ href, label, external }) =>
        external ? (
          <a
            key={href}
            href={href}
            className="block w-full px-4 py-2 text-[#001f5b] hover:text-[#001133] hover:scale-105 transition-transform duration-150 bg-white/90 rounded-xl"
          >
            {label}
          </a>
        ) : (
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
      <Link href="/login">
        <VscAccount className="text-3xl text-[#001f5b] mt-2 cursor-pointer" />
      </Link>
    </div>
  )}
</nav>

  );
}
