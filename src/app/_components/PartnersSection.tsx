<<<<<<< HEAD
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const logos = ["bloomberg", "blueorigin"];
=======
import "tailwindcss";

const logos = [
  "bloomberg",
  "blueorigin",
];
>>>>>>> dev

export default function PartnersSection() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFetchItem = async (itemId: string) => {
    try {
      const res = await fetch("/api/square/get-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });

      if (!res.ok) throw new Error("Failed to fetch item");
      const item = await res.json();

      console.log("Square Item Info:", item);
      alert(`Item: ${item.name}\nPrice: ${item.price}`);
    } catch (err) {
      console.error("Error fetching item:", err);
      alert("Failed to load item info.");
    }
  };

  return (
    <main className="bg-white py-12 px-4">
      <section className="max-w-6xl mx-auto text-center">
<<<<<<< HEAD
     <h2
  className="text-3xl sm:text-4xl font-semi-bold font-helvetica text-[var(--shpe-yellow)]
             tracking-wider uppercase mb-10"
             >THANK YOU TO OUR SPONSORS!
             </h2>



        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 place-items-center mt-8">
          {logos.map((l) => (
            <div key={l} className="w-48 h-48 flex items-center justify-center">
              <img
                src={`/assets/${l}.svg`}
=======
        <h2 className="text-5xl text-blue-800">
          THANK YOU TO OUR SPONSORS!
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 place-items-center mt-8">
          {logos.map((l) => (
            <div
              key={l}
              className="w-200 h-96 flex items-center justify-center">
              <img
                src={`assets/${l}.svg`}
>>>>>>> dev
                alt={l}
                className="max-h-32 w-auto"
              />
            </div>
          ))}
        </div>

<<<<<<< HEAD
        <div className="mt-20 text-center">
          <p className="text-2xl sm:text-3xl font-light text-gray-700 mb-10">
       </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6 items-center relative">
            {/* Sponsor Button */}
            <button
              onClick={() => router.push("/sponsor")}
              className="inline-flex items-center justify-center
                bg-[#f2ac02] hover:bg-[#e0a200]
                text-black font-helvetica
                text-base sm:text-lg font-bold
                tracking-[0.3em]
                px-10 py-5
                rounded-full
                transition-all duration-200
                shadow-md hover:scale-105"
            >
              SPONSOR A GBM
              <img
                src="/assets/arrow.png"
                alt="→"
                className="ml-2 w-5 h-5"
              />
            </button>

            {/* Donate Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="inline-flex items-center justify-center
                  bg-[#f2ac02] hover:bg-[#e0a200]
                  text-black font-helvetica
                  text-base sm:text-lg font-bold
                  tracking-[0.3em]
                  px-10 py-5
                  rounded-full
                  transition-all duration-200
                  shadow-md hover:scale-105"
              >
                DONATE
                <img
                  src="/assets/arrow.png"
                  alt="→"
                  className="ml-2 w-5 h-5"
                />
              </button>

              {showDropdown && (
                <div className="absolute z-10 mt-2 w-56 right-0 bg-white border border-gray-200 rounded-md shadow-lg text-left">
                  <button
                    onClick={() => {
                      router.push("/chapter");
                      setShowDropdown(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                  >
                    Chapter Contribution
                  </button>
                  <button
                    onClick={() => {
                      router.push("/outreach");
                      setShowDropdown(false);
                    }}
                    className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                  >
                    SHPE Jr. Outreach Program
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
=======
      <div className="mt-20 text-center">
         <p className="text-2xl sm:text-3xl font-light text-gray-700 mb-10">
          Want to support our mission?
          <br className="hidden sm:block" />
          <span className="font-medium text-[var(--shpe-blue)]">Sponsor</span> or
          <span className="font-medium text-[var(--shpe-orange)]"> donate</span> today.
          </p>

        {/* donation buttons */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
          <a
            href="/become-a-sponsor" // replace with actual URL
            className="bg-[var(--shpe-blue)] text-white font-semibold py-3 px-6 rounded-lg hover:brightness-110 transition"
          >
            Become a Sponsor
          </a>
          <a
            href="/donate" // replace with actual donation link
            className="bg-[var(--shpe-orange)] text-white font-semibold py-3 px-6 rounded-lg hover:brightness-110 transition"
          >
            Donate
          </a>
        </div>
        </div>

>>>>>>> dev
      </section>
    </main>
  );
}
