/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { BsLinkedin } from "react-icons/bs";
import type { Alumni } from "~/server/db/schema";

async function fetchAvatarAsBase64(url: string): Promise<string> {
    const key = url;
    const cached = localStorage.getItem(key);
    if (cached) return cached;

    const res = await fetch(url);

    const blob = await res.blob();

    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onloadend = () => {
        const base64data = reader.result as string;
        localStorage.setItem(key, base64data);
        resolve(base64data);
        };

        // start reading the blob as a data URL
        reader.readAsDataURL(blob);
    });
}

async function getCachedOrFallbackImage(alumni: Alumni): Promise<string> {
    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(alumni.first_name + " " + alumni.last_name)}&background=001f5b&color=ffffff&size=220`;

    // Helper to check if url is valid
    async function urlExists(url: string) {
        try {
            const response = await fetch(url, { method: 'HEAD' }); // HEAD is lighter than GET
        return response.ok;
        } catch {
            return false;
        }
    }

    // Check alumni image URL first
    if (alumni.image && (await urlExists(alumni.image))) {
        return fetchAvatarAsBase64(alumni.image);
    }

    // fallback to default avatar
    return fetchAvatarAsBase64(fallbackUrl);
}


export default function AlumniCard({ alumni }: { alumni: Alumni }) {
    const [imageSrc, setImageSrc] = useState<string>("");

    useEffect(() => {
        void getCachedOrFallbackImage(alumni).then(setImageSrc);
    }, [alumni]);


    return (
        <div className="w-full max-w-[220px] bg-white shadow-xl rounded-xl overflow-hidden flex flex-col group">
            {/* Image section with LinkedIn button */}
            <div className="relative w-full aspect-[2/1]">
                <a
                    href={alumni.linkedIn ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                    onClick={!alumni.linkedIn ? (e) => e.preventDefault() : undefined}
                >
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt={alumni.first_name + " " + alumni.last_name}
                            className="w-full h-full object-cover"
                        />) : null
                    }
                </a>

                {alumni.linkedIn && (
                    <a
                        href={alumni.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center 
 bg-white bg-opacity-70 group-hover:bg-blue-700 transition"
                    >
                        <BsLinkedin className="w-4 h-4 text-blue-800 group-hover:text-white" />
                    </a>
                )}
            </div>

            {/* Name + Role */}
            <div className="p-2 text-center">
                <p className="text-[19px] font-semibold text-[#001f5b]">{alumni.first_name + " " + alumni.last_name}</p>
                <p className="text-base font-bold text-[#001f5b] uppercase tracking-wide">
                    {alumni.position}
                </p>
            </div>
        </div>
    );
}