"use client";

import { api } from "~/trpc/react";
import { motion } from "motion/react";
import { FaSadTear } from "react-icons/fa";

// Define the type for a member
interface Member {
    uuid: string;
    ucf_id: number;
    first_name: string | null;
    last_name: string | null;
    email: string;
    image: string | null;
    resume: string | null;
    is_member: boolean | null;
    position: string | null;
    points: number;
    event_counter: number;
}

export default function MemberTable () {
    const { data: members, isLoading } = api.member.getAllMembers.useQuery();
    const memberList = Array.isArray(members) ? members as Member[] : [];
    const hasAttendance = memberList.some(m => m.event_counter > 0);
    const sorted = [...memberList].sort((a, b) => (b.event_counter ?? 0) - (a.event_counter ?? 0));

    if (isLoading) {
        return (
            <motion.div 
                className="flex items-center justify-center h-full w-full text-[#001F5B]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}>
                Loading members...
            </motion.div>
        );
    }

    // If there are no members or nobody has attended, show friendly fallback
    if (memberList.length === 0 || !hasAttendance) {
        return (
            <motion.div 
                className="flex flex-col items-center justify-center h-full w-full text-center text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}>
                <FaSadTear className="text-6xl mb-4 text-[#001F5B]/50" />
                <p className="text-lg font-medium">No member has attended an event this academic year</p>
                <p className="mt-2 text-sm text-slate-400">Once members attend events their names will appear here.</p>
            </motion.div>
        );
    }

    return (
        <motion.div 
            className="overflow-hidden p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <h2 className="text-xl font-semibold text-[#001F5B] mb-4">Leaderboard</h2>
            <ul className="divide-y divide-slate-200">
                {sorted.map((member, index) => (
                    <motion.li 
                        key={member.uuid} 
                        className="flex justify-between items-center py-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.06 }}>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-[#001F5B]/10 flex items-center justify-center text-sm font-semibold text-[#001F5B]">
                                {member.first_name ? (member.first_name[0] ?? "") : "?"}
                            </div>
                            <div>
                                <div className="text-[#001F5B] font-medium">{member.first_name ?? member.email}</div>
                                <div className="text-xs text-slate-400">{member.position ?? "Member"}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-slate-500">{member.event_counter ?? 0} events</div>
                        </div>
                    </motion.li>
                ))}
            </ul>
        </motion.div>
    );
}