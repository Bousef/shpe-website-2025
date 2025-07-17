"use client";
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

    const events = (data ?? []).map((event) => ({
      name: event.name,
      description: event.description,
      imgSrc: event.image_url?.split(";")[0] || "/placeholder.jpg",
    }));

    setEvents(events);
  }

  loadEvents();
}, []);

  return (
    <section
      id="events"
      className="relative w-full bg-white py-16 px-4 lg:px-8"
    >
      {/* Header */}
      {/* Section Header */}
      <div className="text-center mb-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-helvetica text-blue-800">
          CATCH US THIS WEEK
        </h2>

      </div>


      {/* Horizontal Scrollable Slider */}
      <div className="flex justify-center overflow-x-auto space-x-6 px-2 scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-blue-100 snap-x snap-mandatory">
        {events.map(({ name, imgSrc }) => (
          <a
            key={name}
            href={imgSrc}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-none snap-start w-72 lg:w-80 2xl:w-96 bg-[#EFB70E] rounded-md shadow-lg transform transition-transform duration-300 hover:scale-105"
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
          </a>
        ))}
      </div>
    </section>
  );
}
