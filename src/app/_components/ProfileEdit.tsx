"use client";

import { supabase } from "~/supabase-client";
import { api } from "~/trpc/react";
import { useState, useEffect } from "react";

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

    const { mutateAsync: updateProfile } = api.member.updateMember.useMutation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // useEffect(() => {
    //     const getToken = async () => {
    //         const {
    //             data: { session },
    //         } = await supabase.auth.getSession();
    //         console.log("JWT Access Token:", session?.access_token);
    //     };
    //     getToken();
    // }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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

            // alert("Profile updated!");
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
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block font-semibold">Phone Number</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
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
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                    />
                </div>
                <div className="text-right">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center
                            bg-[#f2ac02] hover:bg-[#e0a200]
                            text-black font-helvetica
                            text-base sm:text-md font-bold
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
