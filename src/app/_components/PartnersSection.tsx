"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const logos = ["bloomberg", "blueorigin"];

export default function PartnersSection() {
    const router = useRouter();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <main className="bg-white py-12 px-4">
            <section className="max-w-6xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl font-semi-bold font-helvetica text-[var(--shpe-yellow)] tracking-wider uppercase mb-20">
                    THANK YOU TO OUR SPONSORS!
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 place-items-center mt-8">
                    {logos.map((l) => (
                        <div key={l} className="flex items-center justify-center">
                            <img
                                src={`/assets/${l}.svg`}
                                alt={l}
                                className="h-28 w-auto"
                            />
                        </div>
                    ))}
                </div>

                <div className="mt-60 text-center">
                    <div className="w-full max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-center">
                        {/* Sponsor Button */}
                        <button
                            onClick={() => router.push("../sponsors/sponsor")}
                            className="inline-flex items-center justify-center
                                bg-[#f2ac02] hover:bg-[#e0a200]
                                text-black font-helvetica
                                text-base sm:text-lg font-bold
                                tracking-[0.3em]
                                px-20 py-5
                                rounded-full
                                transition-all duration-200
                                shadow-md hover:scale-105"
                        >
                            SPONSOR
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
                                    px-20 py-5
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
                                            router.push("../sponsors/chapter");
                                            setShowDropdown(false);
                                        }}
                                        className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                                    >
                                        Chapter Contribution
                                    </button>
                                    <button
                                        onClick={() => {
                                            router.push("../sponsors/outreach");
                                            setShowDropdown(false);
                                        }}
                                        className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                                    >
                                        SHPE Jr. Outreach Program
                                    </button>
                                      <button
                                        onClick={() => {
                                            router.push("../sponsors/shpe_jr");
                                            setShowDropdown(false);
                                        }}
                                        className="block w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100"
                                    >
                                        SHPE Jr. Donation
                                      </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
