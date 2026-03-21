"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import NavbarLogin from "~/app/_components/NavBarLogin";
import { api } from "~/trpc/react";
import EditableField from "./EditableField";
import { useRouter } from "next/navigation";

export default function ClientProfile() {
    const utils = api.useUtils();
    const { data: member, isLoading } = api.user.getCurrentMember.useQuery();
    const [minLoading, setMinLoading] = useState(true);
    const router = useRouter();
    const [hovered, setHovered] = useState(false);

    // Connect to the backend mutation you already created
    const updateMember = api.user.updateCurrentMember.useMutation({
        onSuccess: () => {
            // Refetch the profile so the UI shows the updated data
            void utils.user.getCurrentMember.invalidate();
        },
    });

    useEffect(() => {
            if (!isLoading && (!member)) {
                router.replace("/login?error=Unauthorized");
            }
        }, [member, isLoading, router]);

    const handleSave = async (
        field: "first_name" | "last_name" | "position" | "email" | "ucf_id",
        value: string,
    ) => {
        await updateMember.mutateAsync({ field, value });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setMinLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const showLoading = isLoading || minLoading;

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

    const isMember = !member?.position;

    // Base fields every user can edit
    const emailField = {
        label: "Email",
        fieldKey: "email" as const,
        value: member?.email,
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
        ),
    };

    const ucfIdField = {
        label: "UCF ID",
        fieldKey: "ucf_id" as const,
        value: member?.ucf_id != null ? String(member.ucf_id) : null,
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
            </svg>
        ),
    };

    // Extra fields only non-Member roles can see/edit
    const nameField = (label: string, fieldKey: "first_name" | "last_name", value: string | null | undefined) => ({
        label,
        fieldKey,
        value,
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
        ),
    });

    const positionField = {
        label: "Position",
        fieldKey: "position" as const,
        value: member?.position,
        icon: (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
        ),
    };


    // Members: email + UCF ID only. Everyone else: all fields.
    const infoFields = isMember
        ? [emailField, ucfIdField]
        : [emailField, nameField("First Name", "first_name", member?.first_name), nameField("Last Name", "last_name", member?.last_name), positionField, ucfIdField];

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
                        className="text-3xl font-bold tracking-tight text-[#001f5b] sm:text-4xl"
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
                        <motion.a
                            href="/attendance"
                            className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-[#001f5b]/60 backdrop-blur-sm ring-1 ring-white/20 hover:bg-white/40 hover:shadow-lg cursor-pointer"
                            onHoverStart={() => setHovered(true)}
                            onHoverEnd={() => setHovered(false)}
                            onTouchStart={() => setHovered(true)}
                            onTouchEnd={() => setHovered(false)}
                            onPointerDown={() => setHovered(true)}
                            onPointerUp={() => setHovered(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ width: { duration: 0.3, ease: "easeInOut" } }}>
                        attendance</motion.a>
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
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-[#001f5b]">
                            Personal Information
                        </h2>
                    </div>

                    {/* Fields */}
                    <div className="divide-y divide-slate-100">
                        {infoFields.map((field, i) => (
                            <motion.div
                                key={field.label}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                            >
                                <EditableField
                                    label={field.label}
                                    fieldKey={field.fieldKey}
                                    value={field.value}
                                    icon={field.icon}
                                    onSave={handleSave}
                                    isSaving={updateMember.isPending}
                                    isMember={member?.position === "Member"}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Error feedback */}
                    {updateMember.isError && (
                        <div className="border-t border-red-100 bg-red-50 px-6 py-3 text-sm text-red-600">
                            Failed to save: {updateMember.error.message}
                        </div>
                    )}
                </motion.div>
            </div>
        </main>
    );
}