"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NavbarLogin from "~/app/_components/NavBarLogin";
import { api } from "~/trpc/react";
import CreateAnEvent from "~/app/_components/CreateAnEvent";
import ManageUsers from "~/app/_components/ManageUsers";
import PushAttendance from "~/app/_components/PushAttendance";

export default function AdminUI() {
    const router = useRouter();
    const { data: member, isLoading } = api.user.getCurrentMember.useQuery();
    const [minLoading, setMinLoading] = useState(true);
    const [activeComponent, setActiveComponent] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMinLoading(false);
        }, 2000); // 2 seconds minimum loading time, for animation to show
        return () => clearTimeout(timer);
    }, []);

    const showLoading = isLoading || minLoading;

    // Redirect non-admin users
    useEffect(() => {
        if (!isLoading && (!member || !member.isAdmin)) {
            router.replace("/login?error=Unauthorized");
        }
    }, [member, isLoading, router]);

    // Show nothing while checking auth
    if (showLoading || !member?.isAdmin) {
            return (
                <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100">
                    <NavbarLogin />
                    <motion.div 
                        className="flex flex-col items-center justify-center gap-2 py-32 text-[#001f5b] text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}>
                        {"Loading Admin Panel"}
                        <div className="flex flex-row gap-2">
                        <motion.p 
                            className="bg-[#001f5b] h-[10px] w-[10px]"
                            initial={{ opacity: 0 , rotate: 0 }}
                            animate={{ opacity: 1, rotate: 360, transition: { repeat: Infinity, duration: 2 } }}></motion.p>
                        <motion.p 
                            className="bg-[#001f5b] h-[10px] w-[10px]"
                            initial={{ opacity: 0 , rotate: 0 }}
                            animate={{ opacity: 1, rotate: 360, transition: { repeat: Infinity, duration: 2 } }}></motion.p>
                        <motion.p 
                            className="bg-[#001f5b] h-[10px] w-[10px]"
                            initial={{ opacity: 0 , rotate: 0 }}
                            animate={{ opacity: 1, rotate: 360, transition: { repeat: Infinity, duration: 2 } }}></motion.p>
                        </div>
                        
                    </motion.div>
                </main>
            );
        }

    const AdminCapabilities = [
        { 
            name: "Manage Users", 
            description: "Add, edit, or remove user accounts and permissions",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            component: "ManageUsers" // Placeholder for component later
        },
        { 
            name: "Create Event", 
            description: "Schedule and manage upcoming events",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            component: "CreateAnEvent"
        },
        {
            name: "Push Attendance",
            description: "Grant attendance to members who were within event range",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            component: "PushAttendance"
        },
    ];

    // If a component is active, render it instead of the admin panel
    if (activeComponent === "CreateAnEvent") {
        return (
            <main className="min-h-screen w-full">
                <NavbarLogin />
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <button
                        onClick={() => setActiveComponent(null)}
                        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#001f5b] transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Admin Panel
                    </button>
                    <CreateAnEvent />
                </div>
            </main>
        );
    }
    else if (activeComponent === "PushAttendance") {
        return (
            <main className="min-h-screen w-full">
                <NavbarLogin />
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <button
                        onClick={() => setActiveComponent(null)}
                        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#001f5b] transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Admin Panel
                    </button>
                    <PushAttendance />
                </div>
            </main>
        );
    }
    else if (activeComponent === "ManageUsers") {
        return (
            <main className="min-h-screen w-full">
                <NavbarLogin />
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <button
                        onClick={() => setActiveComponent(null)}
                        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-[#001f5b] transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Admin Panel
                    </button>
                    <ManageUsers />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen w-full">
            <NavbarLogin />
            
            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* Header Section */}
                <motion.div 
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-semibold text-[#001f5b] tracking-tight">
                        {`Welcome back ${member?.first_name}!`}
                    </h1>
                    <p className="mt-3 text-slate-500 text-lg max-w-md mx-auto">
                        {`Manage your organization settings and content`}
                    </p>
                </motion.div>

                {/* Cards Grid */}
                <motion.div 
                    className="grid gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    {AdminCapabilities.map((item, index) => (
                        <motion.div
                            key={index}
                            className="group relative bg-white border border-slate-200/80 rounded-2xl p-6 cursor-pointer overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index + 0.4, duration: 0.4 }}
                            whileHover={{ y: -2 }}
                            onClick={() => {
                                if (item.component) {
                                    setActiveComponent(item.component);
                                }
                            }}
                        >
                            {/* Hover gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#001f5b]/5 to-[#ff4d00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            <div className="relative flex items-center gap-5">
                                {/* Icon container */}
                                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#001f5b] to-[#001f5b]/80 rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#001f5b]/20 group-hover:shadow-[#001f5b]/30 transition-shadow">
                                    {item.icon}
                                </div>
                                
                                {/* Text content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-medium text-slate-900 group-hover:text-[#001f5b] transition-colors">
                                        {item.name}
                                    </h3>
                                    <p className="text-slate-500 text-sm mt-0.5">
                                        {item.description}
                                    </p>
                                </div>
                                
                                {/* Arrow indicator */}
                                <div className="flex-shrink-0 text-slate-300 group-hover:text-[#ff4d00] group-hover:translate-x-1 transition-all duration-200">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Footer hint */}
                <motion.p 
                    className="text-center text-slate-400 text-sm mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    Select an option to get started
                </motion.p>
            </div>
        </main>
    );
}