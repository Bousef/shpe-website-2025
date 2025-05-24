import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

const navItems = [
  { href: "/board",    label: "Board" },
  { href: "/dev-team", label: "Dev team" },
  { href: "/alumni",   label: "Alumni" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/calendar", label: "Calendar" },
  { href: "/shop",     label: "Shop", external: true },
];

export default function Navbar() {
  return (
    <nav className="relative flex items-center justify-between bg-[#F7F8F9] p-5 text-black">
      {/* Logo */}
      <Link href="/" aria-label="SHPE UCF – Home" className="flex-shrink-0">
        <img src="/assets/logo.svg" alt="SHPE UCF logo" className="md:2x1:w-[12%]" />
      </Link>

      {/* Desktop navigation */}
      <div className="hidden md:flex space-x-14 text-3x1">
        {navItems.map(({ href, label, external }) =>
          external ? (
            <a
              key={href}
              href={href}
              className="px-4 py-2 text-[#6B7280] text-2xl hover:bg-gray-100 rounded"
            >
              {label}
            </a>
          ) : (
            <Link
              key={href}
              href={href}
              className="px-4 py-2 text-[#6B7280] text-2xl hover:bg-gray-100 rounded"
            >
              {label}
            </Link>
          )
        )}
      </div>

      {/* Login button on desktop */}
      <Link
        href="/login"
        className="hidden md:inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white text-sm md:text-lg px-4 py-2 rounded shadow"
      >
        Login
      </Link>

      {/* Mobile menu (pure CSS) */}
      <div className="md:hidden relative">
        <input type="checkbox" id="menu-toggle" className="peer hidden" aria-hidden="true" />
        <label htmlFor="menu-toggle" className="block p-2 cursor-pointer">
          <FaBars className="peer-checked:hidden" size={24} />
          <FaTimes className="hidden peer-checked:block" size={24} />
        </label>
        <div className="hidden peer-checked:flex flex-col absolute left-0 top-full w-full bg-white shadow-md p-4 space-y-2">
          {navItems.map(({ href, label, external }) =>
            external ? (
              <a
                key={href}
                href={href}
                className="px-4 py-2 text-[#6B7280] hover:bg-gray-100 rounded"
              >
                {label}
              </a>
            ) : (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 text-[#6B7280] hover:bg-gray-100 rounded"
              >
                {label}
              </Link>
            )
          )}
          <Link
            href="/login"
            className="mt-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded text-center"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
