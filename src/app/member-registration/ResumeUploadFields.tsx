import { useFormContext } from "react-hook-form";
import FieldError from "./FieldError";
import type { ResumeUploadSchema } from "./page";

export default function ResumeUploadFields() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<ResumeUploadSchema>();
  const resume = watch("resume");

  return (
    <>
      <div className="mb-8 h-px bg-gray-300" />
      <div className="space-y-4">
        <p>
          Please upload your resume, this is optional but beneficial as
          employers and sponsors will have access to them.
        </p>
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
                <p className="text-2xl">
                  {resume && resume.name ? resume.name : "Upload your resume"}
                </p>
                <p className="text-lg">
                  Must be a .pdf, .doc, or .docx and follow the template:
                  LastName_FirstName_Resume
                </p>
              </div>
            </label>
            <FieldError error={errors.resume} />
          </div>
        </div>
      </div>
    </>
  );
}
