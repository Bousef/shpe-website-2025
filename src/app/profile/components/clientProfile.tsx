"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import NavbarLogin from "~/app/_components/NavBarLogin";
import { api } from "~/trpc/react";

export default function ClientProfile() {
    const { data: member, isLoading } = api.user.getCurrentMember.useQuery();
    const [minloading, setMinLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMinLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const showLoading = isLoading || minloading;

    if (showLoading) {
        return (
            <main className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100">
                <NavbarLogin />
                <motion.div 
                    className="flex flex-col items-center justify-center gap-2 py-32 text-[#001f5b] text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}>
                    {"Loading profile"}
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

    const initials = `${member?.first_name?.[0] ?? ""}${member?.last_name?.[0] ?? ""}`.toUpperCase();

    const infoFields = [
        {
            label: "Email",
            value: member?.email,
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
            ),
        },
        {
            label: "Position",
            value: member?.position,
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
            ),
        },
        {
            label: "UCF ID",
            value: member?.ucf_id,
            icon: (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                </svg>
            ),

        },
    ];

    return (
        <main className="min-h-screen w-full bg-white">
            <NavbarLogin />

            {/* Hero header with gradient */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white via-[#001845]/20 to-white" />
                

                <div className="relative mx-auto max-w-3xl px-6 pb-24 pt-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        {/* Avatar circle */}
                        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm ring-2 ring-white/20">
                            <span className="text-3xl font-bold tracking-tight text-[#001f5b]/60">
                                {initials}
                            </span>
                        </div>
                    </motion.div>

                    <motion.h1
                        className="text-3xl font-bold tracking-tight text-[#001f5b]/60 sm:text-4xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {member?.first_name} {member?.last_name}
                    </motion.h1>

                    <motion.div
                        className="mt-3 flex flex-wrap items-center justify-center gap-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-[#001f5b]/60 backdrop-blur-sm ring-1 ring-white/20">
                            {member?.position ?? "Member"}
                        </span>
                        {member?.isAdmin && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#f47b20]/20 px-3 py-1 text-sm font-medium text-[#f47b20] backdrop-blur-sm ring-1 ring-[#f47b20]/30">
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 1l2.928 6.856L20 8.588l-5.072 4.569L16.18 20 10 16.26 3.82 20l1.252-6.843L0 8.588l7.072-.732L10 1z" clipRule="evenodd" />
                                </svg>
                                Admin
                            </span>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Info cards — pulled up over the hero */}
            <div className="relative z-10 mx-auto -mt-12 max-w-2xl px-6 pb-20">
                <motion.div
                    className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-xl shadow-slate-200/40"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    {/* Section header */}
                    <div className="border-b border-slate-100 px-6 py-4">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                            Personal Information
                        </h2>
                    </div>

                    {/* Fields */}
                    <div className="divide-y divide-slate-100">
                        {infoFields.map((field, i) => (
                            <motion.div
                                key={field.label}
                                className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50/70"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#001f5b]/5 text-[#001f5b]">
                                    {field.icon}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                        {field.label}
                                    </p>
                                    <p className="mt-0.5 truncate text-base font-medium text-slate-800">
                                        {field.value ?? "—"}
                                    </p>
                                </div>
                                <button className="h-[30px] w-auto rounded-xl bg-[#001f5b] text-white cursor-pointer text-center leading-[30px] px-3">Modify</button>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </main>
    );
}