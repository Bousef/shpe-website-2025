"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import NavBarLogin from "../../_components/NavBarLogin";
import { MapPin, CheckCircle, XCircle, Loader2, ChevronDown, Zap } from "lucide-react";

type CheckinStatus = "idle" | "locating" | "checking" | "success" | "error" | "out_of_range";

export default function AttendanceUI() {
  const { data: allEvents, isLoading } = api.events.getEvents.useQuery();
  const { data: currentMember } = api.user.getCurrentMember.useQuery();

  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  const [status, setStatus] = useState<CheckinStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [pointsEarned, setPointsEarned] = useState<number | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const watchRef = useRef<number | null>(null);

  const checkinMutation = api.checkin.checkin.useMutation({
    onSuccess: (data) => {
      setPointsEarned(data.pointsEarned);
      setStatus("success");
      stopWatching();
    },
    onError: (err) => {
      if (err.message.includes("not within range")) {
        setStatus("out_of_range");
      } else if (err.message.includes("already checked in")) {
        setStatus("success"); // treat as success so box turns green
      } else {
        setErrorMsg(err.message);
        setStatus("error");
      }
    },
  });

  const stopWatching = () => {
    if (watchRef.current !== null) {
      navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
    }
  };

  // Start watching location once an event is selected
  useEffect(() => {
    if (!selectedEventId || !currentMember) return;

    stopWatching();
    setStatus("locating");

    watchRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });

        if (status !== "success") {
          setStatus("checking");
          checkinMutation.mutate({
            ucf_id:     currentMember.ucf_id,
            title:      selectedTitle,
            latitude,
            longtitude: longitude,
          });
        }
      },
      (err) => {
        setErrorMsg("Location access denied. Please enable location permissions.");
        setStatus("error");
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
    );

    return () => stopWatching();
  }, [selectedEventId]);

  const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    const title = e.target.options[e.target.selectedIndex]?.text ?? "";
    setSelectedEventId(id || null);
    setSelectedTitle(title);
    setStatus("idle");
    setErrorMsg("");
    setPointsEarned(null);
  };

  const statusConfig = {
    idle: {
      bg: "bg-[#001F5B]/80 backdrop-blur-xl",
      border: "border-zinc-700",
      glow: "",
      icon: <MapPin className="w-10 h-10 text-zinc-300" />,
      label: "Select an event to begin",
      sub: "Your location will be checked automatically",
      pulse: false,
    },
    locating: {
      bg: "bg-[#001F5B]/80 backdrop-blur-xl",
      border: "border-yellow-500/50",
      glow: "shadow-[0_0_40px_rgba(234,179,8,0.15)]",
      icon: <Loader2 className="w-10 h-10 text-yellow-400 animate-spin" />,
      label: "Acquiring location...",
      sub: "Please allow location access when prompted",
      pulse: false,
    },
    checking: {
      bg: "bg-[#001F5B]/80 backdrop-blur-xl",
      border: "border-blue-500/50",
      glow: "shadow-[0_0_40px_rgba(59,130,246,0.15)]",
      icon: <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />,
      label: "Verifying your position...",
      sub: "Checking if you're within range",
      pulse: false,
    },
    out_of_range: {
      bg: "bg-red-950/60",
      border: "border-red-500/60",
      glow: "shadow-[0_0_50px_rgba(239,68,68,0.2)]",
      icon: <XCircle className="w-10 h-10 text-red-400" />,
      label: "Not in range",
      sub: "Move closer to the event location",
      pulse: true,
    },
    error: {
      bg: "bg-red-950/60",
      border: "border-red-500/60",
      glow: "shadow-[0_0_50px_rgba(239,68,68,0.2)]",
      icon: <XCircle className="w-10 h-10 text-red-400" />,
      label: "Check-in failed",
      sub: errorMsg,
      pulse: false,
    },
    success: {
      bg: "bg-emerald-950/60",
      border: "border-emerald-400/60",
      glow: "shadow-[0_0_60px_rgba(52,211,153,0.25)]",
      icon: <CheckCircle className="w-10 h-10 text-emerald-400" />,
      label: "Attendance confirmed!",
      sub: pointsEarned ? `+${pointsEarned} points earned` : "You're checked in",
      pulse: false,
    },
  };

  const current = statusConfig[status];

  return (
    <main className="min-h-screen bg-white text-white flex flex-col">
      <NavBarLogin />

      <div className="flex flex-col items-center flex-1 px-4 pt-12 pb-16">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-zinc-500 mb-2 font-mono">
            SHPEUCF Attendance System
          </p>
          <h1
            className="text-4xl font-black tracking-tight text-[#001F5B]"
          >
            Check In
          </h1>
        </motion.div>

        {/* Event Selector */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md mb-8 relative"
        >
          <label className="block text-xs tracking-widest uppercase text-zinc-500 font-mono mb-2">
            Event
          </label>
          <div className="relative">
            <select
              onChange={handleEventChange}
              className="w-full appearance-none bg-[#001F5B]/80 backdrop-blur-xl border border-zinc-700 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-zinc-500 transition-colors cursor-pointer pr-10"
            >
              <option value="" className="bg-[#fafafa] text-[#001F5B] font-bold">Select an event...</option>
              {isLoading ? (
                <option disabled>Loading events...</option>
              ) : (
                allEvents?.map((event) => (
                  <option key={event.id} value={event.id} className="bg-[#fafafa] text-[#001F5B] font-bold">
                    {event.title}
                  </option>
                ))
              )}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300 pointer-events-none" />
          </div>
        </motion.div>

        {/* Status Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className={`
                relative overflow-hidden rounded-2xl border-2 h-64
                flex flex-col items-center justify-center gap-4
                transition-all duration-500
                ${current.bg} ${current.border} ${current.glow}
              `}
            >
              {/* Pulse ring for out_of_range */}
              {current.pulse && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border border-red-500/20 animate-ping" />
                </div>
              )}

              {/* Success particle burst */}
              {status === "success" && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 1, scale: 0, x: "50%", y: "50%" }}
                      animate={{
                        opacity: 0,
                        scale: 1,
                        x: `${50 + (Math.cos((i * Math.PI * 2) / 8) * 40)}%`,
                        y: `${50 + (Math.sin((i * Math.PI * 2) / 8) * 40)}%`,
                      }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                      className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400"
                    />
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center gap-3 px-8 text-center">
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {current.icon}
                </motion.div>

                <div>
                  <p className="font-bold text-lg tracking-tight">{current.label}</p>
                  <p className="text-sm text-zinc-300 mt-1">{current.sub}</p>
                </div>

                {/* Points badge */}
                {status === "success" && pointsEarned && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-4 py-1.5 mt-1"
                  >
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300 text-sm font-bold font-mono">
                      +{pointsEarned} pts
                    </span>
                  </motion.div>
                )}

                {/* Coords debug (optional, remove in prod) */}
                {coords && status !== "success" && (
                  <p className="text-[10px] text-zinc-300 font-mono mt-1">
                    {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Member info strip */}
          {currentMember && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between mt-4 px-4 py-3 bg-[#001F5B]/80 backdrop-blur-xl rounded-xl border border-zinc-100"
            >
              <div>
                <p className="text-xs text-zinc-100 font-mono tracking-widest uppercase">Signed in as</p>
                <p className="text-sm font-semibold text-white mt-0.5">
                  {currentMember.first_name} {currentMember.last_name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-100 font-mono tracking-widest uppercase">Points</p>
                <p className="text-sm font-bold text-white font-mono mt-0.5">
                  {currentMember.points ?? 0}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Syne font import */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&display=swap');
      `}</style>
    </main>
  );
}