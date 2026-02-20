"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBarLogin from "../../_components/NavBarLogin";
import { api } from "~/trpc/react";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const roles = [
    { value: "President", label: "President" },
    { value: "Internal Vice President", label: "Internal Vice President" },
    { value: "Corporate Vice President", label: "Corporate Vice President" },
    { value: "Secretary", label: "Secretary" },
    { value: "Marketing Vice President", label: "Marketing Vice President" },
    { value: "Treasurer", label: "Treasurer" },
    { value: "Technology Chair", label: "Technology Chair" },
    { value: "Professional Development Chair", label: "Professional Development Chair" },
    { value: "Projects Chair", label: "Projects Chair" },
    { value: "Mentorship Chair", label: "Mentorship Chair" },
    { value: "Outreach Chair", label: "Outreach Chair" },
    { value: "Shpetinas Chair", label: "Shpetinas Chair" },
    { value: "Social Chair", label: "Social Chair" },
    { value: "Director", label: "Director" },
    { value: "DevTeam", label: "DevTeam" },
    { value: "Committee", label: "Committee" },
    { value: "Member", label: "Member" },
];

export default function AddPage() {
    const [role, setRole] = useState("");
    const [ucf_id, setUcfId] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [roleSearch, setRoleSearch] = useState("");
    const router = useRouter();

    const updateUserRole = api.user.updateUserRole.useMutation();

    const filteredRoles = roles.filter(r =>
        r.label.toLowerCase().includes(roleSearch.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);
        try {
            await updateUserRole.mutateAsync({
                ucf_id: ucf_id.trim(),
                new_role: role as any,
            });
            setSuccess("Role updated successfully!");
            setUcfId("");
            setRole("");
        } catch (err: any) {
            setError(err?.message || "Failed to update role");
        } finally {
            setIsLoading(false);
        }
    };

    

    return (
        <main className="flex flex-col w-full min-h-screen items-center bg-gradient-to-br from-[#e3e9f7] to-[#f8fafc]">
            <NavBarLogin />
            <motion.div
                className="flex flex-col w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 mt-12 items-center relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
            >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-tr from-[#002147] to-[#3b82f6] rounded-full p-3 shadow-lg">
                    <svg width={48} height={48} fill="none" viewBox="0 0 24 24">
                        <motion.circle
                            cx="12"
                            cy="12"
                            r="8"
                            stroke="#fff"
                            strokeWidth="2"
                            initial={{ strokeDasharray: 0, strokeDashoffset: 60 }}
                            animate={{ strokeDasharray: 60, strokeDashoffset: 0 }}
                            transition={{ duration: 1 }}
                        />
                        <motion.path
                            d = "M9 12l2 2 4-4"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.5, duration: 0.7 }}
                        />
                    </svg>
                </div>
                <h1 className="text-3xl text-[#002147] font-extrabold mb-2 mt-4 text-center">Change Member Role</h1>
                <p className="text-gray-500 mb-8 text-center">Assign a new role to a member by UCF ID. Use the search to quickly find a role.</p>
                <motion.button
                    className="text-[#002147] font-bold mb-4 border border-[#002147] rounded-lg px-4 py-2 hover:bg-[#002147] hover:text-white transition"
                    onClick={() => router.push('/admin')}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                >
                    ← Back to Admin Dashboard
                </motion.button>
                <form className="w-full space-y-6" onSubmit={handleSubmit}>
                    {/* UCF ID Input with floating label */}
                    <div className="relative">
                        <input
                            id="ucf_id"
                            type="text"
                            value={ucf_id}
                            onChange={(e) => setUcfId(e.target.value)}
                            className="peer shadow border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-800 focus:border-[#3b82f6] focus:outline-none transition"
                            required
                            autoComplete="off"
                        />
                        <label
                            htmlFor="ucf_id"
                            className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-[#3b82f6] peer-valid:-top-5 peer-valid:text-xs bg-white px-1"
                        >
                            UCF ID
                        </label>
                    </div>
                    {/* Role Search and Select */}
                    <div>
                        <div className="relative">
                            <select
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="shadow border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-800 focus:border-[#3b82f6] focus:outline-none transition"
                                required
                            >
                                <option value="">Select Role</option>
                                {filteredRoles.map((role) => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        className="w-full py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-[#002147] to-[#3b82f6] text-white shadow-lg hover:from-[#3b82f6] hover:to-[#002147] transition"
                        whileTap={{ scale: 0.97 }}
                        disabled={isLoading}
                    >
                        {isLoading ? "Updating..." : "Update Role"}
                    </motion.button>
                    {/* Feedback */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg px-4 py-2 mt-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                            >
                                <ExclamationCircleIcon className="h-5 w-5" />
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                className="flex items-center gap-2 text-green-600 bg-green-50 rounded-lg px-4 py-2 mt-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                            >
                                <CheckCircleIcon className="h-5 w-5" />
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </motion.div>
        </main>
    );
}