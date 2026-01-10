"use client";

import { motion } from "framer-motion";

interface HeroMaskProps {
    text?: string;
    tagline?: string;
    subtitle?: string;
}

export default function HeroMask({
    text = "SHPEUCF",
    tagline = "Society of Hispanic Professional Engineers at UCF",
    subtitle = "Empowering students to realize their fullest potential",
}: HeroMaskProps) {
    return (
        <motion.div
            className="relative w-full overflow-hidden bg-white"
            initial={{ opacity: 0, }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
        >
            {/* SVG with mask, it is basically the base for the hero*/}
            <svg
                className="w-full h-auto"
                viewBox="0 0 1200 600"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    {/* Gradient overlay that fades from transparent to white at the bottom of the component*/}
                    <linearGradient id="white-fade-overlay" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="white" stopOpacity="0" />
                        <stop offset="70%" stopColor="white" stopOpacity="0" />
                        <stop offset="100%" stopColor="white" stopOpacity="1" />
                    </linearGradient>
                    
                    <mask id="hero-mask">
                        {/* White text (visible in mask), else not visible */}
                        <text
                            x="600"
                            y="220"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="white"
                            fontFamily="Impact, Helvetica, Arial, sans-serif"
                            fontSize="258"
                            letterSpacing="-0.02em"
                            transform="translate(600, 220) scale(1.29, 1.78) translate(-603, -210)"
                        >
                            {text}
                        </text>
                        {/* Solid white rectangle banner (visible in mask) */}
                        <rect
                            x="0"
                            y="340"
                            width="1200"
                            height="400"
                            fill="white"
                        />
                    </mask>
                </defs>

                {/* Background video with mask applied */}
                <foreignObject x="0" y="0" width="1200" height="600" mask="url(#hero-mask)">
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        >   
                            <source src="/assets/shpevideo.mp4" type="video/mp4" />
                        </video>
                        <img
                            src="/assets/homebg.png"
                            alt=""
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                opacity: 0.8,
                                pointerEvents: 'none',
                            }}
                        />
                    </div>
                </foreignObject>
                

                {/* White gradient overlay on top - fades the bottom to white */}
                <rect
                    x="0"
                    y="0"
                    width="1200"
                    height="601"
                    fill="url(#white-fade-overlay)"
                />

                {/* Text inside the banner */}
                <text
                    x="600"
                    y="420"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontFamily="Helvetica, Arial, sans-serif"
                    fontWeight="300"
                    fontSize="28"
                    letterSpacing="0.05em"
                >
                    {tagline}
                </text>
                <text
                    x="600"
                    y="465"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontFamily="Helvetica, Arial, sans-serif"
                    fontWeight="600"
                    fontSize="36"
                    letterSpacing="0.02em"
                >
                    {subtitle}
                </text>
            </svg>
        </motion.div>
    );
}