"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

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

    const [isMedium, setIsMedium] = useState(false);
    const [isSmall, setIsSmall] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMedium(window.innerWidth < 1024);
            setIsSmall(window.innerWidth < 768);
        };
        
        // Check on mount
        checkScreenSize();
        setIsLoaded(true);
        
        // Listen for resize
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Don't render until we know the screen size to prevent flash
    if (!isLoaded) {
        return <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-white" />;
    }

    // Small/Mobile version (< 768px) - check first since it's more specific
    if (isSmall) {
        return (
            <motion.div
                className="relative w-full overflow-hidden bg-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
            >
                <div className="relative w-full">
                    {/* Video and text mask section */}
                    <div className="relative w-full h-[280px] overflow-hidden">
                        {/* Video layer - bottom */}
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                        >
                            <source src="/assets/shpevideo.mp4" type="video/mp4" />
                        </video>
                        
                        {/* Gradient overlay on video */}
                        <img
                            src="/assets/homebg.png"
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover opacity-80 pointer-events-none"
                        />
                        
                        {/* SVG white overlay with text and banner cutout mask - wider viewBox for mobile */}
                        <svg
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 600 400"
                            preserveAspectRatio="xMidYMid slice"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient id="small-white-fade-overlay" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="white" stopOpacity="0" />
                                    <stop offset="70%" stopColor="white" stopOpacity="0" />
                                    <stop offset="100%" stopColor="white" stopOpacity="1" />
                                </linearGradient>
                                
                                <mask id="small-text-mask">
                                    {/* White = visible, Black = transparent cutout */}
                                    <rect width="100%" height="100%" fill="white" />
                                    <text
                                        x="300"
                                        y="120"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill="black"
                                        fontFamily="Impact, Helvetica, Arial, sans-serif"
                                        fontSize="100"
                                        letterSpacing="-0.02em"
                                        transform="translate(300, 120) scale(1.67, 2.50) translate(-300, -105)"
                                    >
                                        {text}          
                                    </text>
                                    {/* Banner rectangle cutout */}
                                    <rect
                                        x="0"
                                        y="220"
                                        width="600"
                                        height="200"
                                        fill="black"
                                    />
                                </mask>
                            </defs>
                            
                            {/* White overlay with text and banner cutout */}
                            <rect 
                                width="100%" 
                                height="100%" 
                                fill="white" 
                                mask="url(#small-text-mask)" 
                            />
                            
                            {/* White gradient overlay - fades to white at bottom */}
                            <rect
                                x="0"
                                y="0"
                                width="600"
                                height="401"
                                fill="url(#small-white-fade-overlay)"
                            />
                            
                            {/* Tagline text inside banner */}
                            <text
                                x="300"
                                y="280"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="white"
                                fontFamily="Helvetica, Arial, sans-serif"
                                fontWeight="300"
                                fontSize="14"
                                letterSpacing="0.03em"
                            >
                                {tagline}
                            </text>
                            {/* Subtitle text inside banner */}
                            <text
                                x="300"
                                y="300"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="white"
                                fontFamily="Helvetica, Arial, sans-serif"
                                fontWeight="600"
                                fontSize="18"
                                letterSpacing="0.02em"
                            >
                                {subtitle}
                            </text>
                        </svg>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Medium/Tablet version (768px - 1024px)
    if (isMedium) {
        return (
            <motion.div
                className="relative w-full overflow-hidden bg-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
            >
                <div className="relative w-full">
                    {/* Video and text mask section */}
                    <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] overflow-hidden">
                        {/* Video layer - bottom */}
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                        >
                            <source src="/assets/shpevideo.mp4" type="video/mp4" />
                        </video>
                        
                        {/* Gradient overlay on video */}
                        <img
                            src="/assets/homebg.png"
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover opacity-80 pointer-events-none"
                        />
                        
                        {/* SVG white overlay with text and banner cutout mask */}
                        <svg
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 1200 600"
                            preserveAspectRatio="xMidYMid slice"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient id="medium-white-fade-overlay" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="white" stopOpacity="0" />
                                    <stop offset="70%" stopColor="white" stopOpacity="0" />
                                    <stop offset="100%" stopColor="white" stopOpacity="1" />
                                </linearGradient>
                                
                                <mask id="medium-text-mask">
                                    {/* White = visible, Black = transparent cutout */}
                                    <rect width="100%" height="100%" fill="white" />
                                    <text
                                        x="600"
                                        y="220"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill="black"
                                        fontFamily="Impact, Helvetica, Arial, sans-serif"
                                        fontSize="258"
                                        letterSpacing="-0.02em"
                                        transform="translate(600, 220) scale(1.29, 1.78) translate(-603, -210)"
                                    >
                                        {text}          
                                    </text>
                                    {/* Banner rectangle cutout */}
                                    <rect
                                        x="0"
                                        y="340"
                                        width="1200"
                                        height="300"
                                        fill="black"
                                    />
                                </mask>
                            </defs>
                            
                            {/* White overlay with text and banner cutout */}
                            <rect 
                                width="100%" 
                                height="100%" 
                                fill="white" 
                                mask="url(#medium-text-mask)" 
                            />
                            
                            {/* White gradient overlay - fades to white at bottom */}
                            <rect
                                x="0"
                                y="0"
                                width="1200"
                                height="601"
                                fill="url(#medium-white-fade-overlay)"
                            />
                            
                            {/* Tagline text inside banner */}
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
                            {/* Subtitle text inside banner */}
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
                    </div>
                </div>
            </motion.div>
        );
    }

    // Desktop version - Original SVG mask approach
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