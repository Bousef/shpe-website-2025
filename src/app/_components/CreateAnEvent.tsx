"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "~/trpc/react";
import LocationAutocomplete from "./LocationAutocomplete";
import { LocationMapPicker } from './LocationMapPicker';

export default function CreateAnEvent() {
    const [eventName, setEventName] = useState("");
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [location, setLocation] = useState("");
    const [host, setHost] = useState("");
    const [isVirtual, setIsVirtual] = useState(false);
    const [description, setDescription] = useState("");
    const [flyerPreview, setFlyerPreview] = useState<string | null>(null);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [eventPoints, setEventPoints] = useState<number>(0);
    const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

    const createEvent = api.events.createEvent.useMutation({
        onSuccess: () => {
            setSubmitStatus("success");
            setEventName("");
            setStartTime("");
            setEndTime("");
            setLocation("");
            setHost("");
            setIsVirtual(false);
            setDescription("");
            setFlyerPreview(null);
        },
        onError: () => {
            setSubmitStatus("error");
        },
    });

    const allHost = api.member.getAllMembers.useQuery();
    const hostOptions = (allHost.data ?? []).filter((m) => m.position !== "Member");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setFlyerPreview(url);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitStatus("loading");

        createEvent.mutate({
            title: eventName,
            description,
            location,
            startTime: startTime ? new Date(startTime) : undefined,
            endTime: endTime ? new Date(endTime) : undefined,
            image: flyerPreview ?? undefined,
            points: eventPoints,
            hostName: host,
        });
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
                    Create an Event
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    Fill in the details below to publish a new event for SHPE members.
                </p>
            </div>

            {/* Form Card */}
            <motion.form
                onSubmit={handleSubmit}
                className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-xl shadow-slate-200/40"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
            >
                {/* Section: Event Details */}
                <div className="border-b border-slate-100 px-6 py-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-[#001f5b]">
                        Event Details
                    </h2>
                </div>

                <div className="divide-y divide-slate-100">
                    {/* Event Name */}
                    <motion.div
                        className="flex items-center gap-4 px-6 py-4"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#001f5b]/5 text-[#001f5b]">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                            </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                            <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                Event Name
                            </label>
                            <input
                                type="text"
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                placeholder="e.g. SHPE General Body Meeting"
                                className="mt-0.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-medium text-slate-800 outline-none transition-colors focus:border-[#001f5b] focus:ring-1 focus:ring-[#001f5b]"
                            />
                        </div>
                    </motion.div>

                    {/* Start Time & End Time */}
                    <motion.div
                        className="flex items-center gap-4 px-6 py-4"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.25 }}
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#001f5b]/5 text-[#001f5b]">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                            <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                Start Time & End Time
                            </label>
                            <div className="mt-0.5 flex gap-3">
                                <div className="flex-1">
                                    <label className="text-xs text-slate-400">Start</label>
                                    <input
                                        type="datetime-local"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-medium text-slate-800 outline-none transition-colors focus:border-[#001f5b] focus:ring-1 focus:ring-[#001f5b]"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-slate-400">End</label>
                                    <input
                                        type="datetime-local"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-medium text-slate-800 outline-none transition-colors focus:border-[#001f5b] focus:ring-1 focus:ring-[#001f5b]"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Location */}
                    <motion.div
                        className="flex items-center gap-4 px-6 py-4"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#001f5b]/5 text-[#001f5b]">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                            <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                Location
                            </label>
                            <LocationMapPicker onLocationSelect={(display, lat, lon) => { setLocation(display); setCoords({ lat, lon }); }} />
                            {/* Virtual toggle */}
                            <label className="mt-2 inline-flex cursor-pointer items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={isVirtual}
                                    onChange={(e) => setIsVirtual(e.target.checked)}
                                    className="h-4 w-4 rounded border-slate-300 text-[#001f5b] focus:ring-[#001f5b]"
                                />
                                <span className="text-sm text-slate-500">This is a virtual event</span>
                            </label>
                        </div>
                        
                    </motion.div>
                    <motion.div
                        className="flex items-center gap-4 px-6 py-4"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#001f5b]/5 text-[#001f5b]">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {/* Head */}
                                <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                                {/* Body/Shoulders */}
                                <path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2" />
                            </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                            <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                Host
                            </label>
                            <select
                            value={host}
                            onChange={(e) => setHost(e.target.value)}
                            className="mt-0.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-medium text-slate-800 outline-none transition-colors focus:border-[#001f5b] focus:ring-1 focus:ring-[#001f5b]"
                        >
                            <option value="" disabled>
                                {allHost.isLoading
                                    ? "Loading hosts..."
                                    : hostOptions.length === 0
                                        ? "No admin hosts available"
                                        : "Select a host..."}
                            </option>
                            {hostOptions.map((m) => (
                                <option key={m.uuid} value={m.first_name}>
                                    {m.first_name} {m.last_name} ({m.position})
                                </option>
                            ))}
                        </select>
                        </div>
                        
                    </motion.div>
                    {/* Points */}
                    <motion.div
                        className="flex items-center gap-4 px-6 py-4"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#001f5b]/5 text-[#001f5b]">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
                            </svg>
                        </div> 
                        <div className="min-w-0 flex-1">
                            <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                How many points is the event worth?
                            </label>
                            <input
                                type="number"
                                value={eventPoints}
                                onChange={(e) => setEventPoints(Number(e.target.value))}
                                placeholder="e.g. 1000"
                                className="mt-0.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-base font-medium text-slate-800 outline-none transition-colors focus:border-[#001f5b] focus:ring-1 focus:ring-[#001f5b]"
                            />
                        </div>
                    </motion.div>

                    {/* Description */}
                    <motion.div
                        className="flex items-start gap-4 px-6 py-4"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.35 }}
                    >
                        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#001f5b]/5 text-[#001f5b]">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                            <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe what this event is about..."
                                rows={4}
                                className="mt-0.5 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-base font-medium text-slate-800 outline-none transition-colors focus:border-[#001f5b] focus:ring-1 focus:ring-[#001f5b]"
                            />
                        </div>
                    </motion.div>

                    {/* Event Flyer (optional) */}
                    <motion.div
                        className="flex items-start gap-4 px-6 py-4"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                    >
                        <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#001f5b]/5 text-[#001f5b]">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 003.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                            </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                            <label className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                Event Flyer <span className="normal-case tracking-normal text-slate-300">(optional)</span>
                            </label>

                            {flyerPreview ? (
                                <div className="mt-2 relative">
                                    <img
                                        src={flyerPreview}
                                        alt="Flyer preview"
                                        className="max-h-48 rounded-lg border border-slate-200 object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFlyerPreview(null)}
                                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-md hover:bg-red-600"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ) : (
                                <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 px-6 py-8 transition-colors hover:border-[#001f5b]/40 hover:bg-[#001f5b]/[0.02]">
                                    <svg className="mb-2 h-8 w-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                    </svg>
                                    <span className="text-sm font-medium text-slate-500">Click to upload an image</span>
                                    <span className="mt-1 text-xs text-slate-400">PNG, JPG, or WEBP up to 5MB</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Submit */}
                <motion.div
                    className="border-t border-slate-100 bg-slate-50/50 px-6 py-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                >
                    <div className="flex items-center justify-end gap-3">
                        <button
                            type="button"
                            className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createEvent.isPending}
                            className="rounded-xl bg-[#001f5b] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#001f5b]/90 hover:shadow-md active:scale-[0.98] disabled:opacity-50"
                        >
                            {createEvent.isPending ? "Creating..." : "Create Event"}
                        </button>
                    </div>
                    {submitStatus === "success" && (
                        <p className="mt-2 text-sm text-green-600">Event created successfully!</p>
                    )}
                    {submitStatus === "error" && (
                        <p className="mt-2 text-sm text-red-600">Failed to create event. Please try again.</p>
                    )}
                </motion.div>
            </motion.form>
        </motion.div>
    );
}
