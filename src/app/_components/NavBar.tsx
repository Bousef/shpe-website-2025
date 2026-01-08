'use client';

import { motion } from "motion/react"
import { useState } from "react";
import Link from "next/link";
import { VscAccount } from "react-icons/vsc";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { api } from "~/trpc/react";
import router from "next/router";

const navItems = [
  { href: "/board", label: "Board" },
  { href: "/dev-team", label: "Dev team" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/calendar", label: "Calendar" },
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fetch current member; null if not signed in
  const { data: member, isLoading } = api.user.getCurrentMember.useQuery();
  const isLoggedIn = Boolean(member);
  
  // sign out and reload
  const logout = api.user.logout.useMutation({
    onSuccess: () => {
      // after logging out, send them back to home or login
      router.push("/");
    },
  });

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
      {navItems.map(({ href, label }) =>
        external ? (
          <motion.a
            initial={{ opacity: 0 }}
      {navItems.map(({ href, label, external }) =>
            transition={{ duration: 1 }}
            whileHover="hover"
            key={href}
            href={href}
            className="px-3 py-1 text-[#001f5b] hover:text-[#001133] rounded-3xl relative inline-block"
          >
            {label.toUpperCase()}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#001f5b]" 
              initial={{ scaleX: 0 }}
              variants={{
                hover: { scaleX: 0.8 }
              }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>
        ) : (
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
 {/* account / login / logout */}
          {( isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" title="Your Profile">
                  <VscAccount className="text-3xl text-[#001f5b] cursor-pointer" />
                </Link>
                <button
                   onClick={() => logout.mutate()}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Log out
                </button>
              </div>
            ) : (
              <motion.a
                href="/login"
                className="px-3 py-1 text-[#001f5b] hover:text-[#001133] font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                Log in
              </motion.a>
            )
          )}
    </div>
  </div>

  {/* Mobile Nav */}
  {mobileOpen && (
    <div className="md:hidden mt-4 space-y-3 flex flex-col items-start text-lg sm:text-xl">
      {navItems.map(({ href, label }) =>
        external ? (
          <a
            key={href}
      {navItems.map(({ href, label, external }) =>
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
           {( isLoggedIn ? (
              <div className="px-4 py-2 flex items-center space-x-4 bg-white/90 rounded-xl">
                <Link href="/profile">
                  <VscAccount className="text-2xl text-[#001f5b]" />
                </Link>
                <button
                   onClick={() => logout.mutate()}
                  className="text-red-600 font-medium"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2 bg-white/90 rounded-xl"
              >
                Log in
              </Link>
            )
          )}
    </div>
  )}
</nav>

  );
}
