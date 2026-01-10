"use client";

import { motion } from "motion/react"
import Link from "next/link";
import Image from "next/image";

type HistoryCard = {
    year: string;
    event: string;
    description: string;
    imgSrc?: string;
};

export default function HistorySection() {
    return (
    <section className="w-full bg-white mt-12 flex flex-col items-center">
        <div className="text-3xl sm:text-4xl lg:text-6xl font-helvetica text-blue-800 font-bold">OUR HISTORY</div>
        
    </section>
    );
}