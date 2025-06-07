'use client';

import { useState } from "react";
import Link from "next/link";
import { VscAccount } from "react-icons/vsc";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const navItems = [
  { href: "/board", label: "Board" },
  { href: "/dev-team", label: "Dev team" },
  { href: "/alumni", label: "Alumni" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/calendar", label: "Calendar" },
  { href: "/gallery", label: "Gallery" }, // fixed duplicate "Calendar"
  { href: "/shop", label: "Shop", external: true },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="relative flex flex-col bg-gradient-to-t from-white to-[#afc1e3] p-4 sm:p-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" aria-label="SHPE UCF – Home" className="flex-shrink-0">
          <img
            src="/assets/logo.svg"
            alt="SHPE UCF logo"
            className="h-16 sm:h-20 w-44 sm:w-60 object-contain"
          />
        </Link>

        {/* Mobile toggle button */}
        <button
          className="md:absolute md:hiddens text-3xl text-[#001f5b]"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex space-x-10 lg:space-x-14 text-xl sm:text-2xl items-center pr-6">
          {navItems.map(({ href, label, external }) =>
            external ? (
              <a
                key={href}
                href={href}
                className="px-4 py-2 text-[#001f5b] hover:bg-gradient-to-t from-white/70 to-[#a4bade] rounded-3xl"
              >
                {label.toUpperCase()}
              </a>
            ) : (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 text-[#001f5b] hover:bg-gradient-to-t from-white/70 to-[#a4bade] rounded-3xl"
              >
                {label.toUpperCase()}
              </Link>
            )
          )}
          <VscAccount className="text-3xl sm:text-4xl text-[#001f5b]" />
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden mt-4 space-y-3 flex flex-col items-start text-lg sm:text-xl">
          {navItems.map(({ href, label, external }) =>
            external ? (
              <a
                key={href}
                href={href}
                className="block w-full px-4 py-2 text-[#001f5b] bg-white/90 rounded-xl"
              >
                {label}
              </a>
            ) : (
              <Link
                key={href}
                href={href}
                className="block w-full px-4 py-2 text-[#001f5b] bg-white/90 rounded-xl"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            )
          )}
          <VscAccount className="text-3xl text-[#001f5b] mt-2" />
        </div>
      )}
    </nav>
  );
}
