import Link from "next/link";
import { VscAccount } from "react-icons/vsc";

const navItems = [
  { href: "/board",    label: "Board" },
  { href: "/dev-team", label: "Dev team" },
  { href: "/alumni",   label: "Alumni" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/calendar", label: "Calendar" },
  { href: "/gallery", label: "Calendar" },
  { href: "/shop",     label: "Shop", external: true },
];

export default function Navbar() {
  return (
    <nav className="relative flex items-center justify-between bg-linear-to-t from-white to-[#afc1e3] p-10">
      {/* Logo */}
      <Link href="/" aria-label="SHPE UCF – Home" className="flex-shrink-50">
        <img src="/assets/NavLogo.png" alt="SHPE UCF logo" className="mt-2 pl-15 h-max w-sm object-cover" />
      </Link>

      {/* Desktop navigation */}
      <div className="hidden md:flex space-x-14 text-3x1 pr-30">
        {navItems.map(({ href, label, external }) =>
          external ? (
            <a
              key={href}
              href={href}
              className="px-4 py-2 text-[#001f5b] text-xl hover:bg-linear-to-t from-white-70% to-[#a4bade] rounded-3xl"
            >
              {label.toUpperCase()}
            </a>
          ) : (
            <Link
              key={href}
              href={href}
              className="px-4 py-2 text-[#001f5b] text-xl hover:bg-linear-to-t from-white-70% to-[#a4bade] rounded-3xl"
            >
              {label.toUpperCase()}
            </Link>
          )
        )}
        <VscAccount className="text-4xl text-[#001f5b]" />
      </div>

    </nav>
  );
}
