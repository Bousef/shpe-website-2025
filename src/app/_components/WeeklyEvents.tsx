"use client";
import { motion } from "motion/react";
import { supabaseMobile } from "../../supabase-client";
import { useEffect, useState } from "react";


export default function WeeklyEvents() {

  const [events, setEvents] = useState<{ name: string; description: string; imgSrc: string; }[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");

  
useEffect(() => {
  async function loadEvents() {
    const { data, error } = await supabaseMobile
      .from("Events")
      .select("name, description, image_url");

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    const events = (data ?? []).map((event: { name: string; description: string; image_url: string | null }) => ({
      name: event.name,
      description: event.description,
      imgSrc: event.image_url?.split(";")[0] ?? "/placeholder.jpg",
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
        <h2 className="text-3xl sm:text-4xl lg:text-6xl font-helvetica text-blue-800 font-bold">
          CATCH OUR WEEKLY EVENTS
        </h2>
        <p className="mt-8 text-base sm:text-lg lg:text-xl text-[#001f5b]/70 mx-auto font-helvetica ">
          Every activity we have going on this week, all in one place.
        </p>

      </div>

      {/* Horizontal Scrollable Slider */}
      <div className="flex overflow-x-auto overflow-y-hidden space-x-6 px-4 lg:px-8 scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-100 snap-x snap-mandatory"> 
        {events.map(({ name, imgSrc }) => (
          <motion.a
            key={name}
            href={imgSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-none w-72 lg:w-80 2xl:w-96 bg-[#EFB70E] rounded-3xl shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 0.95 }}

          >
            <div className="aspect-square flex items-center justify-center rounded-md overflow-hidden">
              <img
                src={imgSrc}
                alt={name}
                className="w-10/11 h-10/11 object-cover object-center"
              />
            </div>
            <div className="px-4 py-3">
              <h3 className="text-center text-slate-800 font-bold text-xl 2xl:text-2xl">
                {name.toUpperCase()}
              </h3>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
