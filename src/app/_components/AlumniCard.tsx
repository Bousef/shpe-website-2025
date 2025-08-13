/* eslint-disable @next/next/no-img-element */
"use client";

import { BsLinkedin } from "react-icons/bs";
import type { Alumni } from "~/server/db/schema";

export default function AlumniCard({ alumni }: { alumni: Alumni }) {
    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        alumni.first_name + " " + alumni.last_name
    )}&background=001f5b&color=ffffff&size=220`;

    return (
        <div className="w-[220px] mx-auto flex flex-col items-center">
            {/* Image Section */}
            <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden shadow-md">
                <img
                    src={alumni.image ?? fallbackUrl}
                    alt={`${alumni.first_name} ${alumni.last_name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackUrl;
                    }}
                />
                {alumni.linkedIn && (
                    <a
                        href={alumni.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-white bg-opacity-80 shadow-md hover:bg-opacity-100 transition"
                    >
                        <BsLinkedin className="text-blue-600 w-5 h-5" />
                    </a>
                )}
            </div>

            {/* Name & Position directly on page background */}
            <p className="mt-3 text-base font-semi-bold text-[#001f5b] font-helvetica uppercase text-center">
                {alumni.first_name} {alumni.last_name}
            </p>
            <p className="text-sm font-bold text-[#001f5b] font-helvetica uppercase tracking-tight text-center">
                {alumni.position}
            </p>
        </div>
    );
}
