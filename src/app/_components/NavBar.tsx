'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { VscAccount } from "react-icons/vsc";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { api } from "~/trpc/react";
import { useRouter, useSearchParams } from "next/navigation";

const navItems = [
  { href: "/about", label: "About" },
  { href: "/board", label: "Board" },
  { href: "/dev-team", label: "Dev team" },
  { href: "/alumni", label: "Alumni" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/calendar", label: "Calendar" },
  { href: "/shop", label: "Shop", external: true },
];

// shared links renderer
function NavLinks({ onClick }: { onClick?: () => void }) {
  return (
    <>
      {navItems.map(({ href, label, external }) =>
        external ? (
          <a
            key={href}
            href={href}
            onClick={onClick}
            className="px-3 py-1 text-[#001f5b] hover:text-[#001133] hover:scale-105 transition-transform duration-150 rounded-3xl"
          >
            {label.toUpperCase()}
          </a>
        ) : (
          <Link
            key={href}
            href={href}
            onClick={onClick}
            className="px-3 py-1 text-[#001f5b] hover:text-[#001133] hover:scale-105 transition-transform duration-150 rounded-3xl"
          >
            {label.toUpperCase()}
          </Link>
        )
      )}
    </>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const utils = api.useUtils();
  const searchParams = useSearchParams();
  const shouldRefetch = searchParams.get("refetchUser") === "1";

  const { data: member, isLoading } = api.user.getCurrentMember.useQuery(
    undefined,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
  const isLoggedIn = Boolean(member);

  useEffect(() => {
    if (!shouldRefetch) return;
    utils.user.getCurrentMember.invalidate();

    const params = new URLSearchParams(window.location.search);
    params.delete("refetchUser");
    const newUrl = `${window.location.pathname}${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    window.history.replaceState({}, "", newUrl);
  }, [shouldRefetch, utils]);

  const logout = api.user.logout.useMutation({
    onSuccess: async () => {
      await utils.user.getCurrentMember.invalidate();
      router.push("/");
    },
  });

  return (
    <nav className="w-full bg-gradient-to-t from-white to-[#afc1e3] p-4 sm:p-5 max-w-screen overlay-x-hidden">
      <div className="flex items-center">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0.5">
          <img
            src="/assets/NavLogo.png"
            alt="SHPE UCF logo"
            className="w-80 object-contain"
          />
        </Link>

        {/* Toggle Button */}
        <button
          className="md:hidden text-3xl text-[#001f5b] ml-auto"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex justify-between items-center w-full text-sm lg:text-xl mt-4 md:mt-0 px-6">
          <NavLinks />
          {!isLoading &&
            (isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" title="Your Profile">
                  <VscAccount className="text-3xl text-[#001f5b] cursor-pointer" />
                </Link>
                <button
                  onClick={() => logout.mutate()}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link href="/login" className="flex items-center">
                <img
                  src="/assets/NavProfile.png"
                  alt="Log in"
                  className="w-10 h-10 object-contain cursor-pointer"
                />
              </Link>
            ))}
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden mt-4 space-y-3 flex flex-col items-start text-lg sm:text-xl">
          <NavLinks onClick={() => setMobileOpen(false)} />
          {!isLoading &&
            (isLoggedIn ? (
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
                className="px-4 py-2 flex items-center"
              >
                <img
                  src="/assets/NavProfile.png"
                  alt="Log in"
                  className="w-10 h-10 object-contain cursor-pointer"
                />
              </Link>
            ))}
        </div>
      )}
    </nav>
  );
}