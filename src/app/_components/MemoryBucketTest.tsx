"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "~/trpc/react";
import NavBarLogin from "./NavBarLogin";
import { FiUploadCloud, FiCamera, FiX, FiChevronDown } from "react-icons/fi";

// ─── Upload Panel ────────────────────────────────────────────────────────────

function UploadPanel({
  eventId,
  eventTitle,
  onSuccess,
}: {
  eventId: number;
  eventTitle: string;
  onSuccess: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadPhoto = api.photos.uploadPhoto.useMutation({
    onSuccess: () => {
      setStatus("done");
      setPreview(null);
      onSuccess();
      setTimeout(() => setStatus("idle"), 2000);
    },
    onError: (err) => {
      setStatus("error");
      setErrorMsg(err.message);
    },
  });

  const pickFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) pickFile(file);
  };

  const handleSubmit = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setStatus("uploading");
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const ext = file.name.split(".").pop();
    const storagePath = `${eventId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("events_images").upload(storagePath, file);

    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
      return;
    }

    uploadPhoto.mutate({ eventId, storagePath, eventTitle });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Drop zone */}
      <div
        className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden
          ${dragging ? "border-[#FD652F] bg-[#FD652F]/5" : "border-[#001F5B]/20 hover:border-[#FD652F]/50 bg-white/40"}
        `}
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) pickFile(f); }}
        />

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative"
            >
              <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
              <button
                onClick={(e) => { e.stopPropagation(); setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition"
              >
                <FiX size={16} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 gap-3"
            >
              <div className="p-4 rounded-full bg-[#001F5B]/5">
                <FiCamera size={32} className="text-[#001F5B]/40" />
              </div>
              <p className="text-sm font-medium text-[#001F5B]/60">
                Drop a photo or <span className="text-[#FD652F]">browse</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Upload button */}
      <AnimatePresence>
        {preview && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={handleSubmit}
            disabled={status === "uploading"}
            className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-white
              bg-gradient-to-r from-[#001F5B] to-[#003080] hover:from-[#FD652F] hover:to-[#e55a28]
              disabled:opacity-60 transition-all duration-300 shadow-lg"
          >
            <FiUploadCloud size={18} />
            {status === "uploading" ? "Uploading…" : "Share Photo"}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Status feedback */}
      <AnimatePresence>
        {status === "done" && (
          <motion.p
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-2 text-center text-sm text-emerald-600 font-medium"
          >
            ✓ Photo shared!
          </motion.p>
        )}
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="mt-2 text-center text-sm text-red-500 font-medium"
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Photo Card ───────────────────────────────────────────────────────────────

function PhotoCard({
  signedUrl,
  userName,
  index,
}: {
  signedUrl: string;
  userName: string | null;
  index: number;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.07, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-2xl bg-[#001F5B]/5 shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      {/* Skeleton shimmer */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#001F5B]/5 via-[#001F5B]/10 to-[#001F5B]/5 animate-pulse" />
      )}

      <img
        src={signedUrl}
        alt={userName ?? "Event photo"}
        className={`w-full aspect-square object-cover transition-all duration-500 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
      />

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#001F5B]/70 via-transparent to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
        {userName && (
          <span className="text-white text-sm font-semibold truncate">
            {userName}
          </span>
        )}
      </div>

      {/* Orange accent bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FD652F] to-[#f2ac02]
        scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </motion.div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function SkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl bg-gradient-to-br from-[#001F5B]/5 to-[#001F5B]/10 aspect-square animate-pulse"
    />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MemoryBucketTest() {
  const [eventId, setEventId] = useState<number>(0);
  const [showUpload, setShowUpload] = useState(false);
  const [eventTitle, setEventTitle] = useState<string>("");
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { data: eventsData } = api.events.getEvents.useQuery();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    refetch,
  } = api.photos.getEventPhotos.useInfiniteQuery(
    { eventId, limit: 4 },
    {
      enabled: eventId > 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: 0,
    }
  );

  const allPhotos = data?.pages.flatMap((p) => p.items) ?? [];

  // ── Infinite scroll via IntersectionObserver ─────────────────────────────
  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  return (
    <main className="min-h-screen bg-white text-[#001F5B]">
      <NavBarLogin />

      {/* ── Hero header ───────────────────────────────────────────────── */}
      <div className="relative overflow-hidden py-16 px-6 text-center">
        
        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl font-bold tracking-tight"
        >
          Memory{" "}
          <span className="bg-gradient-to-r from-[#FD652F] to-[#f2ac02] bg-clip-text text-transparent">
            Bucket
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-3 text-[#001F5B]/60 text-lg"
        >
          Relive the moments with your chapter
        </motion.p>
      </div>

      {/* ── Controls ──────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
          {/* Event selector */}
          <div className="relative flex-1 w-full">
            <select
              value={eventId || ""}
              onChange={(e) => {
                const selected = eventsData?.find((ev) => ev.id === Number(e.target.value));
                setEventId(Number(e.target.value));
                setEventTitle(selected?.title ?? "");
              }}
              className="w-full appearance-none pl-4 pr-10 py-3 rounded-2xl border border-[#001F5B]/15
                bg-white/70 backdrop-blur text-[#001F5B] font-medium cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-[#FD652F]/40 transition
                disabled:opacity-50"
            >
              <option value="" disabled>Select an event…</option>
              {eventsData?.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
            <FiChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#001F5B]/40"
            />
          </div>

          {/* Share button */}
          <button
            onClick={() => setShowUpload((v) => !v)}
            disabled={eventId === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white
              bg-gradient-to-r from-[#FD652F] to-[#e55a28] hover:from-[#001F5B] hover:to-[#003080]
              disabled:opacity-40 transition-all duration-300 shadow-md whitespace-nowrap"
          >
            <FiCamera size={18} />
            Share a Memory
          </button>
        </div>

        {/* ── Upload panel ──────────────────────────────────────────── */}
        <AnimatePresence>
          {showUpload && eventId > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="p-6 rounded-3xl bg-gradient-to-br from-white to-[#001F5B]/5 border border-[#001F5B]/10 shadow-sm">
                <UploadPanel eventId={eventId} eventTitle={eventTitle} onSuccess={() => { void refetch(); setShowUpload(false); }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Photo grid ────────────────────────────────────────────── */}
        {isFetching && allPhotos.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} index={i} />)}
          </div>
        ) : allPhotos.length === 0 && eventId > 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-4"
          >
            <div className="p-6 rounded-full bg-[#001F5B]/5">
              <FiCamera size={40} className="text-[#001F5B]/20" />
            </div>
            <p className="text-[#001F5B]/40 font-medium">No memories yet — be the first to share one!</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {allPhotos.map((photo, i) =>
              photo.signedUrl ? (
                <PhotoCard
                  key={photo.id}
                  signedUrl={photo.signedUrl}
                  userName={photo.user_name}
                  index={i}
                />
              ) : null
            )}

            {/* Loading skeletons for next page */}
            {isFetchingNextPage &&
              Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={`skel-${i}`} index={i} />
              ))}
          </div>
        )}

        {/* ── Infinite scroll sentinel ──────────────────────────────── */}
        <div ref={sentinelRef} className="h-16 flex items-center justify-center">
          {hasNextPage && !isFetchingNextPage && (
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="text-[#001F5B]/30"
            >
              <FiChevronDown size={24} />
            </motion.div>
          )}
          {!hasNextPage && allPhotos.length > 0 && (
            <p className="text-xs text-[#001F5B]/30 font-medium tracking-widest uppercase">
              You've seen all memories
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
