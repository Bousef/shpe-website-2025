import { useFormContext } from "react-hook-form";
import FieldError from "./FieldError";
import type { ResumeUploadSchema } from "./page";
import { api } from "~/trpc/react";
import { useEffect } from "react";
import { LuReplace } from "react-icons/lu";
import { FaTrash } from "react-icons/fa";

export default function ResumeUploadFields() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<ResumeUploadSchema>();
  const resume = watch("resume");
  const {
    data: member,
    isLoading,
    error,
  } = api.user.getCurrentMember.useQuery(undefined);

  return (
    <>
      <div className="mb-8 h-px bg-gray-300" />
      <div className="space-y-4">
        <p>
          Please upload your resume, this is optional but beneficial as
          employers and sponsors will have access to them.
        </p>
        {resume && !(resume instanceof FileList) && (
          <div className="relative h-[40rem] w-full">
            <iframe
              src={URL.createObjectURL(resume)}
              className="h-full w-full"
              title="Resume PDF"
            />
            <button
              className="absolute bottom-4 left-4 cursor-pointer rounded-full bg-red-500 p-3 shadow-lg transition-colors hover:bg-red-600"
              onClick={() => setValue("resume", undefined)}
            >
              <FaTrash size={24} />
            </button>
          </div>
        )}
        {member?.resume && (!resume || resume instanceof FileList) && (
          <div className="relative h-[40rem] w-full">
            <iframe
              src={member.resume}
              className="h-full w-full"
              title="Resume PDF"
            />
            <input
              {...register("resume")}
              id="resume"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setValue("resume", file);
              }}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            <label
              htmlFor="resume"
              className="absolute bottom-4 left-4 cursor-pointer rounded-full bg-yellow-500 p-3 transition-colors hover:bg-yellow-600"
            >
              <LuReplace size={24} />
            </label>
          </div>
        )}
        {(!resume || resume instanceof FileList) && !member?.resume && (
          <div>
            <p className="text-lg font-semibold text-[#001f5b]">
              What is your resume file?
            </p>
            <div className="mt-2">
              <input
                {...register("resume")}
                id="resume"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setValue("resume", file);
                }}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              <label
                htmlFor="resume"
                className="flex aspect-video cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-yellow-500 text-center font-semibold text-balance text-[#001f5b] invalid:border-red-500 hover:bg-yellow-100"
              >
                <div className="max-w-lg">
                  <p className="text-2xl">Upload your resume</p>
                  <p className="text-lg">
                    Must be a .pdf, .doc, or .docx and follow the template:
                    LastName_FirstName_Resume
                  </p>
                </div>
              </label>
              <FieldError error={errors.resume} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
