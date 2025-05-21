/* src/components/Navbar.tsx */
import Link from "next/link";

const navItems = [
  { href: "/board",    label: "Board" },
  { href: "/dev-team", label: "Dev team" },
  { href: "/alumni",   label: "Alumni" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/calendar", label: "Calendar" },
  { href: "/shop",     label: "Shop", external: true },
  // login is rendered separately so we can position it absolutely
];

export default function Navbar() {
  return (
    <nav className="relative flex w-full items-center justify-center bg-[#F7F8F9] p-5 text-[30px] font-normal text-black">
      {/* logo (absolute left) */}
      <Link
        href="/"
        aria-label="SHPE UCF – Home"
        className="absolute left-5"
      >
        <img
          src="/assets/logo.svg"
          alt="SHPE UCF logo"
          className="h-55 w-55"
        />
      </Link>

      {/* centred nav links */}
      <div className="p-4 flex items-center text-[25px] gap-x-20">
        {navItems.map(({ href, label, external }) =>
          external ? (
            <a
              key={href}
              href={href}
              className="px-4 py-2 text-[#6B7280] hover:bg-gray-100"
            >
              {label}
            </a>
          ) : (
            <Link
              key={href}
              href={href}
              className="px-4 py-2 text-[#6B7280] hover:bg-gray-100"
            >
              {label}
            </Link>
          )
        )}
      </div>

      {/* login (absolute right) */}
      <Link
        href="/login"
        className="absolute right-5 text-white 2xl:text-2xl 2xl:h-14 2xl:w-[200px] text-sm w-[127px] h-9 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-md shadow justify-center items-center gap-1.5 inline-flex"
      >
        Login
      </Link>
    </nav>
  );
}
