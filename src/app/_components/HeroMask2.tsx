"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

export default function HeroMask2() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
    
    // Mouse position tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    // Smooth spring animations for mouse movement
    const springConfig = { damping: 25, stiffness: 150 };
    const smoothMouseX = useSpring(mouseX, springConfig);
    const smoothMouseY = useSpring(mouseY, springConfig);
    
    // Transform mouse position to rotation values
    const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [8, -8]);
    const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);
    
    // Parallax offsets for floating elements
    const floatX1 = useTransform(smoothMouseX, [-0.5, 0.5], [-30, 30]);
    const floatY1 = useTransform(smoothMouseY, [-0.5, 0.5], [-30, 30]);
    const floatX2 = useTransform(smoothMouseX, [-0.5, 0.5], [20, -20]);
    const floatY2 = useTransform(smoothMouseY, [-0.5, 0.5], [20, -20]);
    
    useEffect(() => {
        const updateSize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);
    
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    };
    
    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
        setIsHovered(false);
    };

    // Responsive font sizing
    const isMobile = windowSize.width < 768;
    const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
    
    return (
        
        <motion.div
            ref={containerRef}
            className="relative w-full min-h-[100vh] overflow-hidden bg-gradient-to-br from-blue-700 via-white to-orange-500 flex items-center justify-center"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <motion.div
                className="absolute top-0 left-0 w-full h-24 bg-gradient-to-t from-transparent z-10 to-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            />
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0 opacity-20"
            >
                <source src="/assets/shpevideo.mp4" type="video/mp4" />
            </video>
            {/* Animated gradient orbs */}
            <motion.div
                className="absolute w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full blur-[100px]"
                style={{ x: floatX1, y: floatY1 }}
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
            <motion.div
                className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-r from-blue-600/20 to-indigo-600/30 blur-[80px]"
                style={{ x: floatX2, y: floatY2 }}
                animate={{
                    scale: [1.2, 1, 1.2],
                    rotate: [360, 180, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                }}
            />
            
            {/* Grid pattern overlay */}
            <div 
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                }}
            />
            
            {/* Floating geometric shapes */}
            <motion.div
                className="absolute top-[15%] left-[10%] w-16 h-16 md:w-24 md:h-24 border border-orange-500/50 rounded-lg"
                style={{ x: floatX1, y: floatY1 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute bottom-[20%] right-[15%] w-20 h-20 md:w-32 md:h-32 border border-blue-500/50 rounded-full"
                style={{ x: floatX2, y: floatY2 }}
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute top-[60%] left-[5%] w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-500/30 to-transparent rounded-lg rotate-45"
                style={{ x: floatX2, y: floatY1 }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
                className="absolute top-[25%] right-[8%] w-8 h-8 md:w-12 md:h-12 bg-orange-500/30 rounded-full"
                style={{ x: floatX1, y: floatY2 }}
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
            />
            
            {/* Main content container with 3D effect */}
            <motion.div
                className="relative z-20 text-center px-4"
                style={{
                    rotateX: isMobile ? 0 : rotateX,
                    rotateY: isMobile ? 0 : rotateY,
                    transformPerspective: 1000,
                }}
            >
                {/* Tagline above */}
                <motion.p
                    className="text-orange-800 text-sm md:text-base lg:text-lg font-medium tracking-[0.3em] uppercase mb-4 md:mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    Society of Hispanic Professional Engineers
                </motion.p>
                
                {/* Main SHPEUCF text with gradient and glow */}
                <motion.div
                    className="relative z-20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                >
                    {/* Glow layer */}
                    <h1 
                        className="absolute inset-0 text-[7rem] sm:text-[9rem] md:text-[11rem] lg:text-[13rem] xl:text-[15rem] font-black tracking-tight bg-gradient-to-r from-orange-800 via-orange-700 to-yellow-600 bg-clip-text text-transparent blur-2xl opacity-50 select-none"
                        aria-hidden="true"
                    >
                        SHPEUCF
                    </h1>
                    
                    {/* Main text */}
                    <motion.h1 
                        className="relative text-[7rem] sm:text-[9rem] md:text-[11rem] lg:text-[13rem] xl:text-[15rem] tracking-tight bg-gradient-to-r from-orange-400 via-orange-700 to-blue-800 bg-clip-text text-transparent cursor-default"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        style={{
                            fontFamily: "'Impact', 'Helvetica', 'Arial', sans-serif",
                        }}
                    >
                        SHPEUCF
                    </motion.h1>
                    
                    {/* Animated underline */}
                    <motion.div
                        className="absolute -bottom-2 left-1/2 h-1 md:h-1.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent rounded-full z-10"
                        initial={{ width: 0, x: "-50%" }}
                        animate={{ width: isHovered ? "80%" : "40%", x: "-50%" }}
                        transition={{ duration: 0.5 }}
                    />
                </motion.div>
                
                {/* Subtitle */}
                <motion.p
                    className="mt-6 md:mt-8 text-black/50 text-base md:text-xl lg:text-2xl font-light max-w-2xl mx-auto z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                >
                    University of Central Florida Chapter
                </motion.p>
                
                {/* CTA Buttons */}
                {/*<motion.div
                    className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                >
                    <motion.button
                        className="group relative px-8 py-3 md:px-10 md:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full overflow-hidden shadow-lg shadow-orange-500/25"
                        whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(249, 115, 22, 0.3)" }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="relative z-10">Join SHPE</span>
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700"
                            initial={{ x: "100%" }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.button>
                    
                    <motion.button
                        className="group px-8 py-3 md:px-10 md:py-4 border border-slate-600 text-black/50 font-semibold rounded-full hover:border-orange-500/50 hover:text-orange-400 transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="flex items-center gap-2">
                            Learn More
                            <motion.span
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                →
                            </motion.span>
                        </span>
                    </motion.button>
                </motion.div>*/}
            </motion.div>
            
            {/* Scroll indicator */}
            {/*<motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col z-10 items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
            >
                <span className="text-black/50 text-xs tracking-widest uppercase">Scroll</span>
                <motion.div
                    className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center pt-2"
                    animate={{ borderColor: ["rgb(71 85 105)", "rgb(249 115 22)", "rgb(71 85 105)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <motion.div
                        className="w-1.5 h-3 bg-orange-500 rounded-full"
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                </motion.div>
            </motion.div>*/}
            {/* Gradient fade at bottom */}
            <motion.div
                className="absolute bottom-0 left-0 w-full h-36 z-10 bg-gradient-to-t from-white to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >

            </motion.div>
            
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 rounded-tl-3xl z-10" />
            <div className="absolute bottom-0 right-0 w-32 h-32 md:w-48 md:h-48 rounded-br-3xl z-10" />
        </motion.div>
    );
}