import { FaEnvelope, FaDiscord, FaInstagram, FaWhatsapp } from "react-icons/fa";

const channels = [
  { name: "Email", icon: FaEnvelope, url: "mailto:contact@shpeucf.com" },
  { name: "Discord", icon: FaDiscord, url: "https://discord.com/invite/gRamS65mqT" },
  { name: "Instagram", icon: FaInstagram, url: "https://www.instagram.com/shpeucf/" },
  { name: "Whatsapp", icon: FaWhatsapp, url: "https://chat.whatsapp.com/LotVd4J7FNzJQzAX2rxDjc" },
];


export default function ContactSection() {
  return (
    <main id="contact" className="relative">
      <img
        src="/_next/static/media/contact.69691e85.svg"
        alt=""
        className="w-screen "
      />

      <section className="flex flex-col items-center w-screen ">
        <header className="h-[5%]">
          <h2 className="font-bold text-slate-800 text-4xl 2xl:text-7xl text-center mb-6 2xl:mb-10">
            Let&rsquo;s stay connected
          </h2>
          <p className="font-medium text-slate-500 text-xl 2xl:text-4xl text-center">
            Please reach out to us with any questions, suggestions or issues
          </p>
        </header>

        <section className="flex flex-wrap items-center justify-center w-screen lg:h-[10%] h-[30%]">
{channels.map(({ name, icon: Icon, url }) => (
  <a
    key={name}
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center justify-between w-44 lg:w-64 2xl:w-80 h-9 lg:h-12 2xl:h-auto"
  >
    <div className="mb-6 lg:mb-10 flex items-center justify-center w-16 h-16 2xl:w-24 2xl:h-24 rounded-full bg-orange-500">
      <Icon className="text-white text-3xl 2xl:text-5xl" />
    </div>
    <h3 className="font-bold text-slate-800 text-2xl 2xl:text-4xl">{name}</h3>
  </a>
))}


        </section>
      </section>
    </main>
  );
}

