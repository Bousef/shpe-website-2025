export default function FooterSection() {
  return (
    <footer className="bg-[#2A3342] text-white flex flex-col items-center justify-around pt-3 h-[30rem] 2xl:h-[35rem]">
      <img
        src="assets/logo-footer.svg"
        alt="SHPE logo"
        className="2xl:w-[6%]"
      />

      <ul className="flex justify-around w-full lg:w-[50%] text-center text-slate-400 2xl:text-2xl">
        {[
          { href: "#about", label: "About" },
          {
            href:
              "https://docs.google.com/forms/d/e/1FAIpQLSd-afMh4hdQtk6HfmeaEOxptbqrMK4Nei9ukQXQBaFB0rwKOQ/viewform",
            label: "News",
            target: "_blank",
          },
          { href: "#team", label: "Our Team" },
          { href: "#calendar", label: "Calendar" },
          { href: "#contact", label: "Contact Us" },
        ].map(({ href, label, target }) => (
          <li key={label}>
            <a href={href} target={target}>
              {label}
            </a>
          </li>
        ))}
      </ul>

      <p className="text-slate-400 2xl:text-xl">
        © 2023 SHPE UCF. All rights reserved.
      </p>
    </footer>
  );
}

