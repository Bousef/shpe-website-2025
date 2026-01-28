"use client";

import { motion } from "motion/react";

// Alternative: Word-by-word reveal component
function WordReveal({ text }: { text: string }) {
    const words = text.split(" ");
    
    return (
        <p className="mt-8 text-base sm:text-lg lg:text-xl text-[#001f5b]/70 mx-auto font-helvetica max-w-4xl text-center px-4 sm:px-0">
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    className="inline-block mr-[0.25em]"
                    initial={{ opacity: 0.15 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.01 }}
                    viewport={{ once: true, amount: 1, margin: "-10% 0px -10% 0px" }}
                >
                    {word}
                </motion.span>
            ))}
        </p>
    );
}

export default function HistorySection() {

    const textContent = `The Society of Hispanic Professional Engineers chapter at the University of Central Florida was founded in 1988. Our chapter started to provide support for minorities within the UCF College of Engineering and Computer Science, offering a safe space for social, professional, and academic growth within the university. Over the years, we have evolved into one of the largest STEM student-run organizations at UCF, continuously expanding since our inception. Our journey has been marked by significant milestones including, SHPE National Blue Chip Award in 2018, 2021-2022 Best Academic Organization of UCF, Best Attendance 2021 for RLDC 5 & 7, and Regional Outstanding Chapter Region 7 in 2017. SHPE UCF pioneered the first SHPE Chapter app and was the first SHPE chapter to hold an Industry BBQ. SHPE UCF has always held high standards for our Professional Development and Service, and begun to help members with Technical Development as well. `;

    return (
    <section className="w-full bg-white mt-12 flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-helvetica text-[#001F5B] font-bold">OUR HISTORY</h1>
        
        {/* Word-by-word reveal - each word fades in as it enters viewport */}
        <WordReveal text={textContent} />
    </section>
    );
}