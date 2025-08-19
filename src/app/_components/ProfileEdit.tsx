"use client";

import { supabase } from "~/supabase-client";
import { api } from "~/trpc/react";
import { useState } from "react";

type ProfileEditProps = {
    profile: {
        ucf_id: number;
        first_name?: string;
        last_name?: string;
        email?: string;
        phone_number?: string;
        major?: string;
    } | null | undefined;
    onClose: () => void;
};

async function uploadResume(oldResume: string | null | undefined, uuid: string, resumeFile: File) {
    // if member has an existing resume, extract filename and delete
    if (oldResume) {
        let prevFilename = null;
        try {
            const url = new URL(oldResume);
            const parts = url.pathname.split('/');
            prevFilename = parts[parts.length - 1]; // last segment is the filename
        } catch (err: any) {
            console.log("Error extracting filename:", err?.message || err);
        }
        if (prevFilename) {
            const { error } = await supabase.storage
                .from('resumes')
                .remove([prevFilename]);
        
            if (error) console.log("Error deleting old resume: ", error);
        }
    }

    // generate unique filename to prevent browser caching if filename stays same
    // format: userId + timestamp + original extension
    const timestamp = Date.now();
    const ext = resumeFile.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ["pdf", "doc", "docx"];
    if (!ext || !allowedExtensions.includes(ext)) {
        throw new Error("Only PDF, DOC, or DOCX files are allowed.");
    }
    const fileName = `${uuid}-${timestamp}.${ext}`;

    // upload to supabase storage
    const { data: upload, error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(fileName, resumeFile, { 
            cacheControl: "0",  // avoid CDN caching issues
            upsert: true,       // don't overwrite automatically
            metadata: { owner: uuid },
        });

    if (uploadError) {
        throw new Error(`Failed to upload resume: ${uploadError.message}`);
    }

    // get public url
    const { data: publicUrlData } = supabase.storage
        .from("resumes")
        .getPublicUrl(fileName);

    if (!publicUrlData?.publicUrl) throw new Error("Failed to retrieve resume URL.");

    return{
        publicUrl: publicUrlData.publicUrl,
        filename: fileName,
    };
}

export default function ProfileEdit({ profile, onClose }: ProfileEditProps) {
    const [firstName, setFirstName] = useState(profile?.first_name || "");
    const [lastName, setLastName] = useState(profile?.last_name || "");
    const [email, setEmail] = useState(profile?.email || "");
    const [phone, setPhone] = useState(profile?.phone_number || "");
    const [major, setMajor] = useState(profile?.major || "");
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [phoneError, setPhoneError] = useState("");
    const [resumeError, setResumeError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { mutateAsync: updateProfile } = api.member.updateMember.useMutation();
    const member = api.member.getMember.useQuery({ ucf_id: profile!.ucf_id });
    if (!member) throw new Error("Member not found");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) {
            setResumeFile(null);
            setResumeError("");
            return;
        }
        const file = files[0]!;

        // validate file type
        const allowedTypes = [
            "application/pdf",
            "application/msword", 
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ];
        if (!allowedTypes.includes(file.type)) {
            setResumeError("Only PDF or Word documents are allowed.");
            setResumeFile(null);
            return;
        }

        // validate file size (limit to 1 MB)
        const maxSize = 1 * 1024 * 1024; // 1MB
        if (file.size > maxSize) {
            setResumeError("File size must be under 1 MB.");
            setResumeFile(null);
            return;
        }

        setResumeError("");
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
            let resumeUrl = null;
            let resumeFilename = null;

            // only upload if file is selected
            if (resumeFile) {
                // get current user session
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) throw new Error("User session not found");

                const userSub = session.user.id;
                const result = await uploadResume(member.data?.resume, userSub, resumeFile);
                resumeUrl = result.publicUrl;
                resumeFilename = result.filename;
            }

            // call updateMember
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
                            <p className="mt-3 mx-2 text-md text-gray-700">{resumeFile.name} ({(resumeFile.size / 1024).toFixed(1)} KB)</p>
                        )}
                    </div>
                    {resumeError && (
                        <p className="text-red-500 text-sm mt-1">{resumeError}</p>
                    )}
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
