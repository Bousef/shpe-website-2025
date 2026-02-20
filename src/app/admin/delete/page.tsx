"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import NavBarLogin from "../../_components/NavBarLogin";
import { api } from "~/trpc/react";
import { ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function DeletePage() {

    const [role, setRole] = useState("");
    const [ucf_id, setUcfId] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const deleteUser = api.user.deleteUser.useMutation();
    const [confirmation, setConfirmation] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        const expectedPhrase = `I am deleting this user ${ucf_id.trim()}`;
        if (confirmation !== expectedPhrase) {
            setError(`Please type the exact confirmation phrase: "${expectedPhrase}"`);
            setIsLoading(false);
            return;
        }

        try {
            await deleteUser.mutateAsync({
                ucf_id: ucf_id.trim(),
            });
            setSuccess("Member deleted successfully!");
            setUcfId("");
            setRole("");
        } catch (err: any) {
            setError(err?.message || "Failed to delete member");
        } finally {
            setIsLoading(false);
        }
    };

    const router = useRouter();

        return (
            <main className="flex flex-col w-full min-h-screen items-center bg-gradient-to-br from-[#fbeee6] to-[#f8fafc]">
                <NavBarLogin />
                <motion.div
                    className="flex flex-col w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10 mt-12 items-center relative"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, type: "spring" }}
                >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-tr from-red-600 to-yellow-400 rounded-full p-3 shadow-lg">
                        <motion.div
                            initial={{ scale: 0.7, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        >
                            <ExclamationTriangleIcon className="h-10 w-10 text-white" />
                        </motion.div>
                    </div>
                    <h1 className="text-3xl text-[#b91c1c] font-extrabold mb-2 mt-4 text-center">Delete Member</h1>
                    <p className="text-gray-500 mb-8 text-center">This action is <span className="font-bold text-[#b91c1c]">irreversible</span>. Please confirm by typing the exact phrase below.</p>
                    <motion.button
                        className="text-[#b91c1c] font-bold mb-4 border border-[#b91c1c] rounded-lg px-4 py-2 hover:bg-[#fafafc] transition"
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
                                className="peer shadow border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-800 focus:border-red-600 focus:outline-none transition"
                                required
                                autoComplete="off"
                            />
                            <label
                                htmlFor="ucf_id"
                                className="absolute left-4 top-3 text-gray-500 text-sm transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-red-600 peer-valid:-top-5 peer-valid:text-xs bg-white px-1"
                            >
                                UCF ID
                            </label>
                        </div>
                        {/* Confirmation phrase input with highlight */}
                        <div className="relative">
                            <input
                                type="text"
                                value={confirmation}
                                onChange={(e) => setConfirmation(e.target.value)}
                                required
                                placeholder={`Type: I am deleting this user: ${ucf_id || "[UCF_ID]"}`}
                                className="peer shadow border border-gray-300 rounded-xl w-full py-3 px-4 text-gray-800 focus:border-red-600 focus:outline-none transition"
                            />
                        </div>
                        <motion.button
                            type="submit"
                            className="w-full py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-[#b91c1c] to-[#f59e42] text-white shadow-lg hover:from-[#f59e42] hover:to-[#b91c1c] transition"
                            whileTap={{ scale: 0.97 }}
                            disabled={isLoading}
                        >
                            {isLoading ? "Deleting..." : "Delete Member"}
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
                                    <ExclamationTriangleIcon className="h-5 w-5" />
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