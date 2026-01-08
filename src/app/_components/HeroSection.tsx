"use client";
import { motion } from "motion/react";

export default function HeroSection({
  radius = 14,            // Corner radius in px
  stroke = 3,             // Border thickness in px
  color = "#3b82f6",      // Tailwind blue-500
  dash = 80,              // Length of glowing segment
  gap = 140,              // Gap length between segments
  speedSeconds = 4,       // How fast the snake circles
}: {
  radius?: number;
  stroke?: number;
  color?: string;
  dash?: number;
  gap?: number;
  speedSeconds?: number;
}) {
  
  return (
    
    <main className="w-full flex flex-col items-center justify-items-center py-16 sm:py-20 px-6 bg-white">
      <h2 className="text-3xl sm:text-4xl lg:text-6xl font-helvetica text-blue-800 font-bold">
        {"WANT TO JOIN SHPE UCF?"}
      </h2>
    <div className="mt-16 relative w-full max-w-4xl">
      <div
        className="
          bg-[url('/assets/homebg.png')] bg-cover bg-center rounded-4xl
          text-white font-helvetica
          py-16 px-8 sm:px-16
          space-y-6 sm:space-y-8
          shadow-2xl
        "
      >
        {/* Headline */}
        <p className="text-xl sm:text-2xl md:text-3xl tracking-tight text-center">
          {"Society of Hispanic Professional Engineers at UCF"}
        </p>

        {/* Become a Member - Emphasized */}
        <p className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-center">
          {"Become a Member"}
        </p>

        {/* Subheadline */}
        <p className="text-xl sm:text-2xl md:text-3xl text-center">
          {"Empowering students to realize their fullest potential"}
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <a
            href="/signUp"
            target="_blank"
            rel="noopener noreferrer"
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
            {"JOIN SHPEUCF"}
            <img src="/assets/arrow.png" alt="→" className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>

      {/* SVG overlay (no pointer events so clicks pass through) */}
      <motion.svg
        className="pointer-events-none absolute inset-0 w-full h-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="glow-hero" x="-50%" y="-50%" width="200%" height="200%">
            {/* Outer glow only */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Glow layer (thicker + blur) */}
        <motion.rect
          x={0.1}
          y={0.1}
          width={100}
          height={100}
          rx={4}
          ry={8}
          fill="none"
          stroke="#0070C0"
          strokeWidth={0.75}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${gap}`}
          filter="url(#glow-hero)"
          style={{ paintOrder: "stroke" }}
          animate={{ strokeDashoffset: [0, -(dash + gap)] }}
          transition={{ duration: speedSeconds, repeat: Infinity, ease: "linear" }}
        />
      </motion.svg>
    </div>
      
    </main>
    
  );
}
