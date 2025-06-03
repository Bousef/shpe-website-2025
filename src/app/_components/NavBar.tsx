// components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { VscAccount, VscMenu, VscChromeClose } from "react-icons/vsc";

const navItems = [
  { href: "/board",    label: "Board" },
  { href: "/dev-team", label: "Dev Team" },
  { href: "/alumni",   label: "Alumni" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/calendar", label: "Calendar" },
  { href: "/gallery",  label: "Gallery" },
  { href: "/shop",     label: "Shop", external: true },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Fixed Navbar */}
      <nav
        className="
          fixed top-0 left-0 right-0 z-50
          bg-gradient-to-t from-white to-[#819fd3]
          p-10 
        "
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" aria-label="SHPE UCF – Home" className="flex-shrink-0">
            <img
              src="/assets/NavLogo.png"
              alt="SHPE UCF logo"
              className="h-full w-80 ml-10"
            />
          </Link>

          {/* Desktop Nav (hidden on small screens) */}
          <div className="hidden md:flex items-center space-x-10">
            {navItems.map(({ href, label, external }) =>
              external ? (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    px-4 py-2
                    text-[#001f5b] text-2xl uppercase
                    hover:bg-white hover:bg-opacity-70
                    rounded-3xl
                    transition-colors duration-150
                  "
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className="
                    px-4 py-2
                    text-[#001f5b] text-2xl uppercase
                    hover:bg-white hover:bg-opacity-70
                    rounded-3xl
                    transition-colors duration-150
                  "
                >
                  {label}
                </Link>
              )
            )}

            {/* Profile Icon */}
            <img
              src="/assets/NavProfile.svg"
              alt="Profile"
              className="ml-5 w-10 h-10 mr-15"
            />
          </div>

          {/* Mobile Hamburger Button (visible on small screens) */}
          <button
            className="md:hidden text-[#001f5b] text-3xl focus:outline-none"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <VscChromeClose /> : <VscMenu />}
          </button>
        </div>

        {/* Mobile Menu (slides down) */}
        <div
          className={`
            md:hidden
            fixed inset-x-0 top-0 z-40
            bg-white bg-opacity-90 backdrop-blur-sm
            transform transition-transform duration-200 ease-in-out
            ${menuOpen ? "translate-y-0" : "-translate-y-full"}
          `}
        >
          <div className="px-6 pt-24 pb-6 space-y-6">
            {navItems.map(({ href, label, external }) =>
              external ? (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    block w-full
                    px-4 py-2
                    text-[#001f5b] text-xl uppercase
                    hover:bg-[#f2ac02] hover:text-white
                    rounded-lg
                    transition-colors duration-150
                  "
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={href}
                  href={href}
                  className="
                    block w-full
                    px-4 py-2
                    text-[#001f5b] text-xl uppercase
                    hover:bg-[#f2ac02] hover:text-white
                    rounded-lg
                    transition-colors duration-150
                  "
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </Link>
              )
            )}

            <div className="pt-4 border-t border-gray-300">
              <img
                src="/assets/NavProfile.svg"
                alt="Profile"
                className="mx-auto w-10 h-10 transition-colors duration-150 hover:text-black"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Add top padding so page content starts below the fixed navbar */}
      <div className="pt-[5rem]">{/* Your remaining page content goes here */}</div>
    </>
  );
}
