"use client";

import { motion } from "motion/react";
import { supabase } from "../../supabase-client";
import { useEffect, useState } from "react";
import { FaGear } from "react-icons/fa6";


export default function WeeklyEvents() {

  const [events, setEvents] = useState<{ name: string; description: string; imgSrc: string; }[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");

  
useEffect(() => {
  async function loadEvents() {
    const { data, error } = await supabase
      .from("events")
      .select("title, description, image");

    console.log("DATA:", data);
    console.log("ERROR:", error);

    const events = (data ?? []).map((event: { title: string; description: string; image: string | null }) => ({
      name: event.title,
      description: event.description,
      imgSrc: event.image?.split(";")[0] ?? "/placeholder.jpg",
    }));

    setEvents(events);
  }

  void loadEvents();
}, []);

  return (
    <section
      id="events"
      className="relative w-full bg-white py-16 px-4 lg:px-8"
    >
      {/* Header */}
      {/* Section Header */}
      <div className="text-center mb-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-6xl font-helvetica text-[#001F5B] font-bold">
          CATCH OUR WEEKLY EVENTS
        </h2>
        <p className="mt-8 text-base sm:text-lg lg:text-xl text-[#001f5b]/70 mx-auto font-helvetica ">
          Every activity we have going on this week, all in one place.
        </p>

      </div>

      {/* No events message */}
      {events.length === 0 ? (
        <div className="flex flex-col text-center text-red-600 font-helvetica mb-8">
          {"No events available at the moment "}
          <div className="flex flex-row justify-center">
            <motion.span className="inline-block ml-2"
              initial={{ y: 20 }}
              animate={{ y:  0 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2, ease: "easeInOut" }}>
              <FaGear className="inline-block animate-spin" />
            </motion.span>
            <motion.span className="inline-block ml-2"
              initial={{ y: 7.5 }}
              animate={{ y: 12.5 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2, ease: "easeInOut" }}>
              <FaGear className="inline-block animate-spin" />
            </motion.span>
            <motion.span className="inline-block ml-2"
              initial={{ y: 0 }}
              animate={{ y: 20 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2, ease: "easeInOut" }}>
              <FaGear className="inline-block animate-spin" />
            </motion.span>
          </div>
        </div>
      ) : null}

      {/* Horizontal Scrollable Slider */}
      <div className="flex overflow-x-auto overflow-y-hidden space-x-6 px-4 lg:px-8 py-6 scrollbar-thin scrollbar-thumb-[#001F5B] scrollbar-track-blue-100 snap-x snap-mandatory"> 
        {events.map(({ name, description, imgSrc }) => (
          <motion.div
            key={name}
            className="flex-none w-72 lg:w-80 2xl:w-96 h-[420px] lg:h-[460px] 2xl:h-[500px] snap-center"
            style={{ perspective: "1200px" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.div 
              className="relative w-full h-full preserve-3d cursor-pointer"
              whileHover={{ rotateY: 180 }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Front of card */}
              <div className="absolute w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,31,91,0.12)] hover:shadow-[0_12px_40px_rgba(0,31,91,0.2)] transition-shadow duration-300">
                {/* Image Container */}
                <div className="relative h-[70%] w-full overflow-hidden bg-gradient-to-br from-[#001F5B] to-[#0070C0]">
                  <img
                    src={imgSrc}
                    alt={name}
                    className="w-full h-full object-cover object-center transition-transform duration-500"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>
                
                {/* Content */}
                <div className="absolute bottom-0 w-full bg-white px-5 py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-[#F7A800] to-[#FD652F] rounded-full" />
                    <h3 className="text-[#001F5B] font-bold text-lg lg:text-xl font-helvetica tracking-tight line-clamp-2">
                      {name.toUpperCase()}
                    </h3>
                  </div>
                  <p className="text-[#626366] text-sm font-helvetica">
                    Hover to learn more →
                  </p>
                </div>
              </div>

              {/* Back of card */}
              <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,31,91,0.2)]">
                {/* Background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#001F5B] via-[#0070C0] to-[#001F5B]" />
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F7A800]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#FD652F]/10 rounded-full translate-y-1/2 -translate-x-1/2" />
                
                {/* Content */}
                <div className="relative h-full flex flex-col justify-center p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-1.5 h-10 bg-gradient-to-b from-[#F7A800] to-[#FD652F] rounded-full" />
                    <h3 className="text-white font-bold text-xl lg:text-2xl font-helvetica tracking-tight">
                      {name.toUpperCase()}
                    </h3>
                  </div>
                  
                  <div className="w-12 h-0.5 bg-gradient-to-r from-[#F7A800] to-[#FD652F] mb-4 rounded-full" />
                  
                  <p className="text-white/90 text-sm lg:text-base font-helvetica leading-relaxed line-clamp-6">
                    {description}
                  </p>
                  
                  {/* Bottom accent */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-center gap-2">
                    <div className="flex-1 h-px bg-gradient-to-r from-[#F7A800]/50 to-transparent" />
                    <span className="text-[#F7A800] text-xs font-helvetica uppercase tracking-widest">SHPE</span>
                    <div className="flex-1 h-px bg-gradient-to-l from-[#FD652F]/50 to-transparent" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
