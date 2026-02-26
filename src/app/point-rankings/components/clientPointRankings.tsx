"use client";

import NavBarLogin  from "~/app/_components/NavBarLogin";
import CustomAreaChart from "~/app/_components/AreaChart";
import MemberTable from "~/app/_components/MemberTable";
import { motion } from "motion/react";

export default function ClientPointRankings() {
    return (
        <main className="bg-white py-12 px-4">
            <NavBarLogin />
            <motion.h1 
                className="text-center text-5xl font-bold m-4 text-[#001F5B]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1}}
                >
                    {"Point Rankings"}
            </motion.h1>
            <motion.p 
                className="text-center text-md font-thin m-4 text-slate-400"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                >
                    {"Check who has the most points accumulated, and compete with your peers"}
            </motion.p>
            <motion.div 
                className="grid grid-col-1 md:grid-cols-2 gap-4 h-full w-full bg-white rounded-lg p-4 shadow-md hover:bg-[#001F5B]/5 trasition-all duration-800"
                initial={{opacity: 0, y: 30}}
                animate={{opacity: 1, y: 0}}
                >
                    <CustomAreaChart />
                    <MemberTable />
            </motion.div>

        </main>
    )
}