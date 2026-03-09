"use client";

import { useState, useRef } from "react";
import { api } from "~/trpc/react";
import NavBarLogin from "./NavBarLogin"

export default function MemoryBucketTest() {
  const [eventId, setEventId] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- tRPC ---
  const uploadPhoto = api.photos.uploadPhoto.useMutation({
    onSuccess: () => {
      setUploadStatus("✅ Upload successful!");
      refetchPhotos();
    },
    onError: (err) => setUploadStatus(`❌ ${err.message}`),
  });

  const {
    data: photos,
    refetch: refetchPhotos,
    isFetching,
  } = api.photos.getEventPhotos.useQuery(
    { eventId },
    { enabled: eventId > 0 }
  );

  // --- Handlers ---
  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file || !eventId) {
      setUploadStatus("❌ Select a file and enter an event ID first");
      return;
    }

    // 1. Upload to Supabase Storage directly from client
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const ext = file.name.split(".").pop();
    const storagePath = `${eventId}/${Date.now()}.${ext}`;

    setUploadStatus("⏳ Uploading to storage...");

    const { error: storageError } = await supabase.storage
      .from("events_images")
      .upload(storagePath, file);

    if (storageError) {
      setUploadStatus(`❌ Storage error: ${storageError.message}`);
      return;
    }

    // 2. Save metadata via tRPC
    setUploadStatus("⏳ Saving metadata...");
    uploadPhoto.mutate({ eventId, storagePath });
  };

  return (
    <main>
        <NavBarLogin />
        <div style={{ padding: "2rem", fontFamily: "monospace", maxWidth: "600px" }}>
            
        <h2>🧪 Memory Bucket Test</h2>

        {/* Event ID input */}
        <div style={{ marginBottom: "1rem" }}>
            <label>Event ID: </label>
            <input
            type="number"
            value={eventId || ""}
            onChange={(e) => setEventId(Number(e.target.value))}
            placeholder="Enter event ID"
            style={{ marginLeft: "0.5rem", padding: "4px" }}
            />
        </div>

        {/* File upload */}
        <div style={{ marginBottom: "1rem" }}>
            <input type="file" accept="image/*" ref={fileInputRef} />
            <button
            onClick={handleUpload}
            disabled={uploadPhoto.isPending}
            style={{ marginLeft: "0.5rem", padding: "4px 12px" }}
            >
            {uploadPhoto.isPending ? "Uploading..." : "Upload Photo"}
            </button>
        </div>

        {/* Upload status */}
        {uploadStatus && (
            <p style={{ marginBottom: "1rem" }}>{uploadStatus}</p>
        )}

        {/* Fetch photos */}
        <div style={{ marginBottom: "1rem" }}>
            <button
            onClick={() => refetchPhotos()}
            disabled={eventId === 0 || isFetching}
            style={{ padding: "4px 12px" }}
            >
            {isFetching ? "Loading..." : "Fetch Photos"}
            </button>
        </div>

        {/* Photo grid */}
        {photos && photos.length === 0 && (
            <p>No photos found for event {eventId}</p>
        )}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {photos?.map((photo) => (
            <div key={photo.id}>
                {photo.signedUrl ? (
                <img
                    src={photo.signedUrl}
                    alt={photo.storagePath}
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
                ) : (
                <p>⚠️ No signed URL for {photo.id}</p>
                )}
            </div>
            ))}
        </div>
        </div>
    </main>
  );
}