"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const mockPhotos = [
  "/assets/shpe_event1.jpg",
  "/assets/shpe_event2.jpg",
  "/assets/shpe_event3.jpg",
];


const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Slideshow() {
  return (
    <section className="w-full bg-white px-6 py-12 space-y-28">
      {/* Section Header */}
      <div className="text-center mb-12 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-helvetica text-blue-800">
            Meet Our Familia
            </h2>
          </div>



      {/* Moments from the Familia */}
      <motion.div variants={fadeIn} initial="hidden" whileInView="show" viewport={{ once: true }}>
        <div className="flex overflow-x-auto space-x-4 pb-4 snap-x">
          {mockPhotos.map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-80 h-60 bg-gray-100 rounded-lg overflow-hidden shadow snap-start"
            >
              <Image
                src={src}
                alt={`SHPE Event ${i + 1}`}
                width={320}
                height={240}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}