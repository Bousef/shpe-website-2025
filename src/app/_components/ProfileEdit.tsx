"use client";

import { supabase } from "~/supabase-client";
import { api } from "~/trpc/react";
import { useState, useEffect } from "react";
import type { Session } from "@supabase/supabase-js";

type ProfileEditProps = {
    profile: {
        ucf_id: number;
        first_name?: string;
        last_name?: string;
        email?: string;
        phone_number?: string;
        major?: string;
        resume_url?: string;
    } | null | undefined;
    onClose: () => void;
};

export default function ProfileEdit({ profile, onClose }: ProfileEditProps) {
    const [firstName, setFirstName] = useState(profile?.first_name || "");
    const [lastName, setLastName] = useState(profile?.last_name || "");
    const [email, setEmail] = useState(profile?.email || "");
    const [phone, setPhone] = useState(profile?.phone_number || "");
    const [major, setMajor] = useState(profile?.major || "");
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [phoneError, setPhoneError] = useState("");

    const { mutateAsync: updateProfile } = api.member.updateMember.useMutation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) {
            setResumeFile(null);
            return;
        }

        const file = files[0]!;

        // validate file type
        const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        if (!allowedTypes.includes(file.type)) {
            alert("Only PDF or Word documents are allowed.");
            e.target.value = ""; // reset input
            return;
        }

        // validate file size (limit to 1 MB)
        const maxSize = 1 * 1024 * 1024; // 1MB
        if (file.size > maxSize) {
            alert("File size must be under 1 MB.");
            e.target.value = "";
            return;
        }

        setResumeFile(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (phone.length !== 10) {
            setPhoneError("Phone number must be exactly 10 digits.");
            return;
        }

        setIsSubmitting(true);
        try {
            let resumeUrl: string | null = profile?.resume_url ?? null;

            if (resumeFile) {
                const { error } = await supabase.storage
                    .from("resumes")
                    .upload(`resumes/${profile?.ucf_id}.pdf`, resumeFile, { upsert: true });

                if (error) throw error;

                const { data: publicUrlData } = supabase.storage
                    .from("resumes")
                    .getPublicUrl(`resumes/${profile?.ucf_id}.pdf`);

                resumeUrl = publicUrlData.publicUrl;
            }

            await updateProfile({
                ucf_id: profile!.ucf_id,
                first_name: firstName,
                last_name: lastName,
                email,
                phone_number: phone,
                major: major,
                resume: resumeUrl ?? undefined,
            });

            onClose();
        } catch (err: any) {
            console.error("Error updating profile:", err?.message || err);
            alert("Update failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                    <label className="block font-semibold">First Name</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Last Name</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Email</label>
                    <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full p-2 border rounded cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Phone Number</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "");   // remove non-digits
                            if (digits.length <= 10) {
                                setPhone(digits);
                                if (digits.length === 10) 
                                    setPhoneError("");
                            }
                        }}
                        maxLength={10}
                        // pattern="\d{10}"
                        className="w-full p-2 border rounded"
                    />
                    {phoneError && (
                        <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                    )}
                </div>
                <div>
                    <label className="block font-semibold">Major</label>
                    <input
                        type="text"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Resume (PDF)</label>
                    <div className="flex">
                        <label className="bg-[var(--shpe-light-blue)] hover:bg-[var(--shpe-blue)] text-white mt-2 px-4 py-1 rounded cursor-pointer inline-block">
                            Choose File
                            <input
                                type="file"
                                name="resume"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                        {resumeFile && (
                            <p className="mt-3 mx-2 text-md text-gray-700">{resumeFile.name}</p>
                        )}
                    </div>
                </div>
                <div className="text-right">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center
                            bg-[#f2ac02] hover:bg-[#e0a200]
                            text-black font-helvetica
                            text-base sm:text-lg font-bold
                            tracking-[0.1em]
                            px-7 py-3
                            rounded-full
                            transition-all duration-200
                            shadow-md hover:scale-105
                            cursor-pointer"
                    >
                        {isSubmitting ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </div>
    );
}
