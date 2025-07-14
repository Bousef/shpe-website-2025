"use client";

import { useFormContext } from "react-hook-form";
import Input from "../_components/Input";
import { type ExperienceSchema } from "./page";
import FieldError from "./FieldError";
import ToggleButton from "./ToggleButton";
import { useState } from "react";

export default function ExperienceFields() {
  const {
    watch,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<ExperienceSchema>();
  const [showInternship, setShowInternship] = useState<boolean>();
  const internships = watch("internships") || [];
  console.log("Internships:", internships);

  return (
    <>
      <p className="text-lg font-semibold text-[#001f5b]">
        Do you have any internship experience?
      </p>
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowInternship(true)}
          className={`cursor-pointer rounded-md border-2 border-yellow-500 px-3 py-2 text-[#001f5b] transition-colors hover:bg-yellow-500 focus:ring-2 focus:outline-none ${
            showInternship ? "bg-yellow-500" : ""
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => setShowInternship(false)}
          className={`cursor-pointer rounded-md border-2 border-yellow-500 px-3 py-2 text-[#001f5b] transition-colors hover:bg-yellow-500 focus:ring-2 focus:outline-none ${
            showInternship === false ? "bg-yellow-500" : ""
          }`}
        >
          No
        </button>
      </div>
      {showInternship && (
        <div className="mt-4 space-y-4">
          {internships.map((internship, index) => (
            <div key={index} className="rounded-md border border-gray-300 p-4">
              <p className="text-lg font-semibold text-[#001f5b]">
                {internship.companyName}
              </p>
              <p className="mb-4 text-sm text-[#001f5b]/60">
                {internship.location}
              </p>
              <div className="space-y-2">
                <p className="text-[#001f5b]">
                  Position: {internship.position}
                </p>
                <p className="text-[#001f5b]">Type: {internship.type}</p>
                <p className="text-[#001f5b]">
                  Mode of Work: {internship.modeOfWork}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-end">
                <button
                  type="button"
                  className="cursor-pointer rounded-md bg-red-500 px-3 py-2 text-white transition-colors hover:bg-red-600"
                  onClick={() => {
                    const newInternships = [...internships];
                    newInternships.splice(index, 1);
                    setValue("internships", newInternships);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="space-y-2 rounded-md border border-gray-300 p-4">
            <div>
              <p className="text-[#001f5b]">Company name</p>
              <Input
                {...register(
                  `internships.${internships.length - 1}.companyName`,
                )}
                placeholder="Enter company name"
              />
              <FieldError
                error={
                  errors.internships?.[internships.length - 1]?.companyName
                }
              />
            </div>
            <div>
              <p className="text-[#001f5b]">Location</p>
              <Input
                {...register(`internships.${internships.length - 1}.location`)}
                placeholder="Enter location"
              />
              <FieldError
                error={errors.internships?.[internships.length - 1]?.location}
              />
            </div>
            <div>
              <p className="text-[#001f5b]">Position</p>
              <Input
                {...register(`internships.${internships.length - 1}.position`)}
                placeholder="Enter position"
              />
              <FieldError
                error={errors.internships?.[internships.length - 1]?.position}
              />
            </div>
            <div>
              <p className="text-[#001f5b]">Type</p>
              <div className="flex items-center gap-2">
                <ToggleButton
                  {...register(`internships.${internships.length - 1}.type`)}
                  fieldName={`internships.${internships.length - 1}.type`}
                  id={`internship-type-${internships.length - 1}-full-time`}
                  value="full-time"
                >
                  Full-time
                </ToggleButton>
                <ToggleButton
                  {...register(`internships.${internships.length - 1}.type`)}
                  fieldName={`internships.${internships.length - 1}.type`}
                  id={`internship-type-${internships.length - 1}-part-time`}
                  value="part-time"
                >
                  Part-time
                </ToggleButton>
                <ToggleButton
                  {...register(`internships.${internships.length - 1}.type`)}
                  fieldName={`internships.${internships.length - 1}.type`}
                  id={`internship-type-${internships.length - 1}-other`}
                  value="other"
                >
                  Other
                </ToggleButton>
              </div>
              <FieldError
                error={errors.internships?.[internships.length - 1]?.type}
              />
            </div>
            <div>
              <p className="text-[#001f5b]">Type</p>
              <div className="flex items-center gap-2">
                <ToggleButton
                  {...register(
                    `internships.${internships.length - 1}.modeOfWork`,
                  )}
                  fieldName={`internships.${internships.length - 1}.modeOfWork`}
                  id={`internship-type-${internships.length - 1}-in-person`}
                  value="in-person"
                >
                  In-person
                </ToggleButton>
                <ToggleButton
                  {...register(
                    `internships.${internships.length - 1}.modeOfWork`,
                  )}
                  fieldName={`internships.${internships.length - 1}.modeOfWork`}
                  id={`internship-type-${internships.length - 1}-remote`}
                  value="remote"
                >
                  Remote
                </ToggleButton>
                <ToggleButton
                  {...register(
                    `internships.${internships.length - 1}.modeOfWork`,
                  )}
                  fieldName={`internships.${internships.length - 1}.modeOfWork`}
                  id={`internship-type-${internships.length - 1}-hybrid`}
                  value="hybrid"
                >
                  Hybrid
                </ToggleButton>
                <ToggleButton
                  {...register(
                    `internships.${internships.length - 1}.modeOfWork`,
                  )}
                  fieldName={`internships.${internships.length - 1}.modeOfWork`}
                  id={`internship-type-${internships.length - 1}-other`}
                  value="other"
                >
                  Other
                </ToggleButton>
              </div>
              <FieldError
                error={errors.internships?.[internships.length - 1]?.type}
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  const newInternships = [...internships];
                  newInternships.push({
                    companyName: "",
                    location: "",
                    position: "",
                    type: "",
                    modeOfWork: "",
                  });
                  setValue("internships", newInternships);
                }}
                className="cursor-pointer rounded-md bg-yellow-500 px-3 py-2 text-[#001f5b] transition-colors hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              >
                Add Internship
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
