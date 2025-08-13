"use client";

import { BsLinkedin } from "react-icons/bs";
import type { Alumni } from "~/server/db/schema";

export default function AlumniCard({ alumni }: { alumni: Alumni }) {
    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        alumni.first_name + " " + alumni.last_name
    )}&background=001f5b&color=ffffff&size=500`;

    return (
        <div className="flex flex-col items-center gap-4 mx-auto w-[280px]">
            {/* Centered Portrait Rectangle */}
            <div className="w-full aspect-[3/4] max-h-[373px] relative shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                <img
                    src={alumni.image ?? fallbackUrl}
                    alt={`${alumni.first_name} ${alumni.last_name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = fallbackUrl;
                    }}
                />
                
                {/* LinkedIn Icon */}
                {alumni.linkedIn && (
                    <div className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform">
                        <a 
                            href={alumni.linkedIn} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 block"
                        >
                            <BsLinkedin size={24} />
                        </a>
                    </div>
                )}
            </div>

            {/* Centered Text */}
            <div className="text-center w-full px-2">
                <p className="text-xl font-semi-bold font-helvetica text-[#001f5b] tracking-tight">
                    {alumni.first_name} {alumni.last_name}
                </p>
                <p className="text-base font-bold font-helvetica text-[#001f5b] uppercase tracking-wider mt-1">
                    {alumni.position}
                </p>
            </div>
        </div>
    );
}