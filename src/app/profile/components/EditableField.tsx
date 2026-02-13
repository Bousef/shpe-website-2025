"use client";

import { useState, useRef, useEffect } from "react";

// These must match the z.enum in your backend mutation
type EditableFieldKey = "first_name" | "last_name" | "position" | "email" | "ucf_id";

interface EditableFieldProps {
  label: string;
  fieldKey: EditableFieldKey;
  value: string | null | undefined;
  icon: React.ReactNode;
  onSave: (field: EditableFieldKey, value: string) => Promise<void>;
  isSaving: boolean;
}

export default function EditableField({
  label,
  fieldKey,
  value,
  icon,
  onSave,
  isSaving,
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input when entering edit mode
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  // Keep draft in sync when the server value changes (e.g. after save)
  useEffect(() => {
    if (!isEditing) {
      setDraft(value ?? "");
    }
  }, [value, isEditing]);

  const handleSave = async () => {
    if (draft.trim() === "") return;
    await onSave(fieldKey, draft.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(value ?? "");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") void handleSave();
    else if (e.key === "Escape") handleCancel();
  };

  return (
    <div className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50/70">
      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#001f5b]/5 text-[#001f5b]">
        {icon}
      </div>

      {/* Label + value / input */}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </p>

        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSaving}
            className="mt-0.5 w-full rounded-lg border border-slate-300 px-2 py-1 text-base font-medium text-slate-800 outline-none focus:border-[#001f5b] focus:ring-1 focus:ring-[#001f5b]"
          />
        ) : (
          <p className="mt-0.5 truncate text-base font-medium text-slate-800">
            {value ?? "—"}
          </p>
        )}
      </div>

      {/* Buttons */}
      {isEditing ? (
        <div className="flex gap-2">
          <button
            onClick={() => void handleSave()}
            disabled={isSaving || draft.trim() === ""}
            className="h-[30px] rounded-xl bg-green-600 px-3 text-center text-sm leading-[30px] text-white disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? "Saving…" : "Save"}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="h-[30px] rounded-xl bg-slate-300 px-3 text-center text-sm leading-[30px] text-slate-700 disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="h-[30px] w-auto rounded-xl bg-[#001f5b] px-3 text-center text-sm leading-[30px] text-white cursor-pointer"
        >
          Modify
        </button>
      )}
    </div>
  );
}
