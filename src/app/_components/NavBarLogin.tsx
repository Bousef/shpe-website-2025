'use client';

import { motion } from "motion/react"
import { useState } from "react";
import Link from "next/link";
import { VscAccount } from "react-icons/vsc";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/board", label: "Board" },
  { href: "/dev-team", label: "Dev team" },
  { href: "/sponsors", label: "Partners" },
  { href: "/calendar", label: "Calendar" },
  { href: "/history", label: "History" },
  { href: "/point-rankings", label: "Point Rankings" },
];
const adminNavItems = [
  { href: "/admin", label: "Admin" },
  { href: "/board", label: "Board" },
  { href: "/dev-team", label: "Dev team" },
  { href: "/sponsors", label: "Partners" },
  { href: "/calendar", label: "Calendar" },
  { href: "/history", label: "History" },
  { href: "/point-rankings", label: "Point Rankings" },
]

function NavLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={href}
      className="relative rounded-full px-4 py-2 text-sm font-semibold text-[#001F5B] transition-colors hover:text-[#FD652F]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.span
        className="absolute inset-0 z-0 rounded-full bg-[#FD652F]/20"
        initial={false}
        animate={{ scaleX: hovered ? 1 : 0 }}
        style={{ originX: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <span className="relative z-10">{label}</span>
    </Link>
  );
}

export default function NavbarLogin() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  // Fetch current member (includes isAdmin flag); null if not signed in
  const { data: member, isLoading } = api.user.getCurrentMember.useQuery();
  const isLoggedIn = Boolean(member);
  const isAdmin = member?.isAdmin ?? false;
  
  // sign out and reload
  const logout = api.user.logout.useMutation({
    onSuccess: () => {
      // after logging out, send them back to home or login
      router.push("/");
    },
  });

  return (
    <div className="sticky top-4 z-50 px-2 sm:px-6 lg:px-8 pb-4">
      <motion.nav
        className="mx-auto max-w-7xl rounded-2xl bg-white/50 backdrop-blur-xl hover:bg-gradient-to-b hover:from-[#FD652F]/10 hover:to-transparent"
        initial={{ y: 0 }}
        whileHover={{ 
          y: -2,
          scale: 1.02,
          boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" 
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="relative flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              src="/assets/NavLogo.png"
              alt="SHPE UCF logo"
              className="h-9 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {(isAdmin ? adminNavItems : navItems).map(({ href, label }) => (
              <NavLink key={href} href={href} label={label} />
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link
                  href="/profile"
                  title="Your Profile"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#001F5B] transition-colors hover:bg-slate-100 hover:text-[#FD652F]"
                >
                  <VscAccount className="text-xl" />
                </Link>
                <button
                  onClick={() => logout.mutate()}
                  className="text-sm font-semibold text-[#001F5B] transition-colors hover:text-[#FD652F]"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-gradient-to-r from-[#72A9BE] to-[#FD652F] px-5 py-2 text-sm font-bold text-white shadow-md transition-transform hover:scale-105"
              >
                Log in
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-[#001F5B] transition-colors hover:bg-slate-100"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiX className="text-xl" /> : <HiMenuAlt3 className="text-xl" />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileOpen && (
          <motion.div
            className="md:hidden border-t border-slate-200 px-4 pb-4 pt-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-1">
              {(isAdmin ? adminNavItems : navItems).map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-[#001F5B] transition-colors hover:bg-slate-100 hover:text-[#FD652F]"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="mt-3 border-t border-slate-200 pt-3">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[#001F5B] hover:bg-slate-100"
                  >
                    <VscAccount className="text-lg" />
                    Profile
                  </Link>
                  <button
                    onClick={() => logout.mutate()}
                    className="ml-auto rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-slate-50"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full rounded-full bg-gradient-to-r from-[#72A9BE] to-[#FD652F] px-4 py-2.5 text-center text-sm font-bold text-white shadow-sm"
                >
                  Log in
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </motion.nav>
    </div>
  );
}
