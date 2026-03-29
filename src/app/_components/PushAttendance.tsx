"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "~/trpc/react";

export default function PushAttendance() {
    const { data: allEvents, isLoading: eventsLoading } = api.events.getEvents.useQuery();
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [result, setResult] = useState<{ attendedCount: number; message: string } | null>(null);

    const pushAttendance = api.events.pushAttendance.useMutation({
        onSuccess: (data) => {
            setResult({ attendedCount: data.attendedCount, message: data.message });
            setStatus("success");
        },
        onError: (err) => {
            setResult({ attendedCount: 0, message: err.message });
            setStatus("error");
        },
    });

    const handlePush = () => {
        if (!selectedEventId) return;
        setStatus("loading");
        setResult(null);
        pushAttendance.mutate({ eventId: selectedEventId });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-[#001f5b]">
                    Push Attendance
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    Grant attendance to all eligible members who were within range of the event.
                </p>
            </div>

            {/* Card */}
            <motion.div
                className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-xl shadow-slate-200/40"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
            >
                <div className="p-8 space-y-6">
                    {/* Event Selector */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Select Event
                        </label>
                        <select
                            value={selectedEventId ?? ""}
                            onChange={(e) => {
                                setSelectedEventId(e.target.value ? Number(e.target.value) : null);
                                setStatus("idle");
                                setResult(null);
                            }}
                            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 focus:border-[#001f5b] focus:outline-none focus:ring-1 focus:ring-[#001f5b] transition-colors"
                        >
                            <option value="">Select an event...</option>
                            {eventsLoading ? (
                                <option disabled>Loading events...</option>
                            ) : (
                                allEvents?.map((event) => (
                                    <option key={event.id} value={event.id}>
                                        {event.title}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    {/* Push Button */}
                    <button
                        onClick={handlePush}
                        disabled={!selectedEventId || status === "loading"}
                        className={`
                            w-full rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200
                            ${!selectedEventId || status === "loading"
                                ? "bg-slate-300 cursor-not-allowed"
                                : "bg-[#001f5b] hover:bg-[#001f5b]/90 shadow-lg shadow-[#001f5b]/20 hover:shadow-[#001f5b]/30 active:scale-[0.98]"
                            }
                        `}
                    >
                        {status === "loading" ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            "Push Attendance"
                        )}
                    </button>

                    {/* Result Message */}
                    <AnimatePresence>
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.3 }}
                                className={`rounded-xl px-5 py-4 text-sm font-medium ${
                                    status === "success"
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                        : "bg-red-50 text-red-700 border border-red-200"
                                }`}
                            >
                                <p>{result.message}</p>
                                {status === "success" && result.attendedCount > 0 && (
                                    <p className="mt-1 text-xs text-emerald-600">
                                        {result.attendedCount} member(s) received attendance and points.
                                    </p>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
}

