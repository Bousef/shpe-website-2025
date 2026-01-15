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

    const [isXXL, setIsXXL] = useState(false);
    const [isXL, setIsXL] = useState(false);
    const [isMedium, setIsMedium] = useState(false);
    const [isSmall, setIsSmall] = useState(false);
    const [isXS, setIsXS] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [windowWidth, setWindowWidth] = useState(1200);
    const [windowHeight, setWindowHeight] = useState(800);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsXXL(window.innerWidth > 2560);
            setIsXL(window.innerWidth > 1600 && window.innerWidth <= 2560);
            setIsMedium(window.innerWidth <= 1024 && window.innerWidth > 768);
            setIsSmall(window.innerWidth <= 768 && window.innerWidth > 400);
            setIsXS(window.innerWidth <= 400);
            setWindowWidth(window.innerWidth);
            setWindowHeight(window.innerHeight);
        };
        
        // Check on mount
        checkScreenSize();
        setIsLoaded(true);
        
        // Listen for resize
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Responsive calculations
    const smallFontSize = Math.max(60, Math.min(100, windowWidth * 0.18));
    const smallTaglineSize = Math.max(10, Math.min(16, windowWidth * 0.025));
    const smallSubtitleSize = Math.max(12, Math.min(20, windowWidth * 0.035));
    
    const mediumFontSize = Math.max(150, Math.min(300, windowWidth * 0.22));
    const mediumTaglineSize = Math.max(18, Math.min(28, windowWidth * 0.025));
    const mediumSubtitleSize = Math.max(22, Math.min(36, windowWidth * 0.032));
    
    const desktopFontSize = Math.max(200, Math.min(350, windowWidth * 0.18));
    const desktopTaglineSize = Math.max(20, Math.min(32, windowWidth * 0.018));
    const desktopSubtitleSize = Math.max(24, Math.min(40, windowWidth * 0.022));
    
    // XL screens (> 1600px)
    const xlFontSize = Math.max(280, Math.min(450, windowWidth * 0.16));
    const xlTaglineSize = Math.max(26, Math.min(38, windowWidth * 0.016));
    const xlSubtitleSize = Math.max(32, Math.min(48, windowWidth * 0.02));
    
    // XXL screens (> 2560px) - 4K monitors and ultrawides
    const xxlFontSize = Math.max(380, Math.min(600, windowWidth * 0.15));
    const xxlTaglineSize = Math.max(32, Math.min(48, windowWidth * 0.014));
    const xxlSubtitleSize = Math.max(40, Math.min(60, windowWidth * 0.018));
    
    // XS screens (<= 400px) - Very small phones
    const xsFontSize = Math.max(45, Math.min(70, windowWidth * 0.16));
    const xsTaglineSize = Math.max(8, Math.min(12, windowWidth * 0.025));
    const xsSubtitleSize = Math.max(10, Math.min(14, windowWidth * 0.03));

    // Don't render until we know the screen size to prevent flash
    if (!isLoaded) {
        return <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-white" />;
    }

    // XS/Extra Small version (<= 400px) - Very small phones
    if (isXS) {
        return (
            <motion.div
                className="relative w-full overflow-hidden bg-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
            >
                <div className="relative w-full">
                    <div className="relative w-full h-[30vh] min-h-[180px] overflow-hidden">
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
                            viewBox="0 0 400 300"
                            preserveAspectRatio="xMidYMid slice"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient id="xs-white-fade-overlay" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="white" stopOpacity="0" />
                                    <stop offset="70%" stopColor="white" stopOpacity="0" />
                                    <stop offset="100%" stopColor="white" stopOpacity="1" />
                                </linearGradient>
                                
                                <mask id="xs-text-mask">
                                    {/* White = visible, Black = transparent cutout */}
                                    <rect width="100%" height="100%" fill="white" />
                                    <text
                                        x="200"
                                        y="90"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill="black"
                                        fontFamily="Impact, Helvetica, Arial, sans-serif"
                                        fontSize={xsFontSize}
                                        letterSpacing="-0.02em"
                                        transform="translate(200, 90) scale(1.8, 2.2) translate(-200, -75)"
                                    >
                                        {text}
                                    </text>
                                    {/* Banner rectangle cutout */}
                                    <rect
                                        x="0"
                                        y="160"
                                        width="400"
                                        height="150"
                                        fill="black"
                                    />
                                </mask>
                            </defs>
                            
                            {/* White overlay with text and banner cutout */}
                            <rect 
                                width="100%" 
                                height="100%" 
                                fill="white" 
                                mask="url(#xs-text-mask)" 
                            />
                            
                            {/* White gradient overlay - fades to white at bottom */}
                            <rect
                                x="0"
                                y="0"
                                width="400"
                                height="301"
                                fill="url(#xs-white-fade-overlay)"
                            />
                            
                            {/* Tagline text inside banner */}
                            <text
                                x="200"
                                y="210"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="white"
                                fontFamily="Helvetica, Arial, sans-serif"
                                fontWeight="300"
                                fontSize={xsTaglineSize}
                                letterSpacing="0.03em"
                            >
                                {tagline}
                            </text>
                            {/* Subtitle text inside banner */}
                            <text
                                x="200"
                                y="230"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="white"
                                fontFamily="Helvetica, Arial, sans-serif"
                                fontWeight="600"
                                fontSize={xsSubtitleSize}
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

    // Small/Mobile version (401px - 768px)
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
                    <div className="relative w-full h-[35vh] sm:h-[50vh] overflow-hidden">
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
                                        fontSize={smallFontSize}
                                        letterSpacing="-0.02em"
                                        transform="translate(300, 120) scale(1.68, 2.1) translate(-300, -98)"
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
                                fontSize={smallTaglineSize}
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
                                fontSize={smallSubtitleSize}
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
                    <div className="relative w-full h-[50vh] overflow-hidden">
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
                                        fontSize={mediumFontSize}
                                        letterSpacing="-0.02em"
                                        transform="translate(600, 220) scale(1.4, 1.6) translate(-603, -210)"
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
                                fontSize={mediumTaglineSize}
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
                                fontSize={mediumSubtitleSize}
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

    // XL version (> 1600px) - Large desktop/ultrawide monitors
    if (isXL) {
        return (
            <motion.div
                className="relative w-full overflow-hidden bg-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
            >
                <div className="relative w-full">
                    <div className="relative w-full h-[80vh] min-h-[500px] max-h-[1000px] overflow-hidden">
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
                            viewBox="0 0 1600 800"
                            preserveAspectRatio="xMidYMid slice"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient id="xl-white-fade-overlay" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="white" stopOpacity="0" />
                                    <stop offset="70%" stopColor="white" stopOpacity="0" />
                                    <stop offset="100%" stopColor="white" stopOpacity="1" />
                                </linearGradient>
                                
                                <mask id="xl-hero-mask">
                                    {/* White = visible, Black = transparent cutout */}
                                    <rect width="100%" height="100%" fill="white" />
                                    <text
                                        x="800"
                                        y="280"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill="black"
                                        fontFamily="Impact, Helvetica, Arial, sans-serif"
                                        fontSize={xlFontSize}
                                        letterSpacing="-0.02em"
                                        transform="translate(800, 280) scale(1.2, 1.3) translate(-800, -240)"
                                    >
                                        {text}
                                    </text>
                                    {/* Banner rectangle cutout */}
                                    <rect
                                        x="0"
                                        y="450"
                                        width="1600"
                                        height="400"
                                        fill="black"
                                    />
                                </mask>
                            </defs>
                            
                            {/* White overlay with text and banner cutout */}
                            <rect 
                                width="100%" 
                                height="100%" 
                                fill="white" 
                                mask="url(#xl-hero-mask)" 
                            />
                            
                            {/* White gradient overlay on top - fades the bottom to white */}
                            <rect
                                x="0"
                                y="0"
                                width="1600"
                                height="801"
                                fill="url(#xl-white-fade-overlay)"
                            />

                            {/* Text inside the banner */}
                            <text
                                x="800"
                                y="560"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="white"
                                fontFamily="Helvetica, Arial, sans-serif"
                                fontWeight="300"
                                fontSize={xlTaglineSize}
                                letterSpacing="0.05em"
                            >
                                {tagline}
                            </text>
                            <text
                                x="800"
                                y="620"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="white"
                                fontFamily="Helvetica, Arial, sans-serif"
                                fontWeight="600"
                                fontSize={xlSubtitleSize}
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

    // XXL version (> 2560px) - 4K monitors and ultrawides
    if (isXXL) {
        return (
            <motion.div
                className="relative w-full overflow-hidden bg-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
            >
                <div className="relative w-full">
                    <div className="relative w-full h-[80vh] min-h-[600px] max-h-[1800px] overflow-hidden">
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
                            viewBox="0 0 2000 1000"
                            preserveAspectRatio="xMidYMid slice"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient id="xxl-white-fade-overlay" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="white" stopOpacity="0" />
                                    <stop offset="70%" stopColor="white" stopOpacity="0" />
                                    <stop offset="100%" stopColor="white" stopOpacity="1" />
                                </linearGradient>
                                
                                <mask id="xxl-hero-mask">
                                    {/* White = visible, Black = transparent cutout */}
                                    <rect width="100%" height="100%" fill="white" />
                                    <text
                                        x="1000"
                                        y="350"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        fill="black"
                                        fontFamily="Impact, Helvetica, Arial, sans-serif"
                                        fontSize={xxlFontSize}
                                        letterSpacing="-0.02em"
                                        transform="translate(1000, 350) scale(1, 1.05) translate(-1000, -330)"
                                    >
                                        {text}
                                    </text>
                                    {/* Banner rectangle cutout */}
                                    <rect
                                        x="0"
                                        y="560"
                                        width="2000"
                                        height="500"
                                        fill="black"
                                    />
                                </mask>
                            </defs>
                            
                            {/* White overlay with text and banner cutout */}
                            <rect 
                                width="100%" 
                                height="100%" 
                                fill="white" 
                                mask="url(#xxl-hero-mask)" 
                            />
                            
                            {/* White gradient overlay on top - fades the bottom to white */}
                            <rect
                                x="0"
                                y="0"
                                width="2000"
                                height="1001"
                                fill="url(#xxl-white-fade-overlay)"
                            />

                            {/* Text inside the banner */}
                            <text
                                x="1000"
                                y="700"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="white"
                                fontFamily="Helvetica, Arial, sans-serif"
                                fontWeight="300"
                                fontSize={xxlTaglineSize}
                                letterSpacing="0.05em"
                            >
                                {tagline}
                            </text>
                            <text
                                x="1000"
                                y="780"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="white"
                                fontFamily="Helvetica, Arial, sans-serif"
                                fontWeight="600"
                                fontSize={xxlSubtitleSize}
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

    // Desktop version (1025px - 1600px) - Same architecture as medium
    return (
        <motion.div
            className="relative w-full overflow-hidden bg-white"
            initial={{ opacity: 0, }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring", stiffness: 50 }}
        >
            <div className="relative w-full">
                <div className="relative w-full h-[80vh] min-h-[400px] max-h-[1000px] overflow-hidden">
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
                            {/* Gradient overlay that fades from transparent to white at the bottom of the component*/}
                            <linearGradient id="white-fade-overlay" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="white" stopOpacity="0" />
                                <stop offset="70%" stopColor="white" stopOpacity="0" />
                                <stop offset="100%" stopColor="white" stopOpacity="1" />
                            </linearGradient>
                            
                            <mask id="hero-mask">
                                {/* White = visible, Black = transparent cutout */}
                                <rect width="100%" height="100%" fill="white" />
                                <text
                                    x="600"
                                    y="220"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill="black"
                                    fontFamily="Impact, Helvetica, Arial, sans-serif"
                                    fontSize={desktopFontSize}
                                    letterSpacing="-0.02em"
                                    transform="translate(600, 220) scale(1.1, 1.2) translate(-603, -200)"
                                >
                                    {text}
                                </text>
                                {/* Banner rectangle cutout */}
                                <rect
                                    x="0"
                                    y="340"
                                    width="1200"
                                    height="400"
                                    fill="black"
                                />
                            </mask>
                        </defs>
                        
                        {/* White overlay with text and banner cutout */}
                        <rect 
                            width="100%" 
                            height="100%" 
                            fill="white" 
                            mask="url(#hero-mask)" 
                        />
                        
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
                            fontSize={desktopTaglineSize}
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
                            fontSize={desktopSubtitleSize}
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