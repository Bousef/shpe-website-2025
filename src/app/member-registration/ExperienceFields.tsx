"use client";

import { FormProvider, useForm, useFormContext } from "react-hook-form";
import Input from "../_components/Input";
import { internshipSchema, type ExperienceSchema } from "./page";
import FieldError from "./FieldError";
import ToggleButton from "./ToggleButton";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

function removeFromEnd<T>(array: T[], index: number): T[] {
  const newArray = [...array];
  newArray.splice(index, 1);
  return newArray;
}

export default function ExperienceFields() {
  const { watch, setValue } = useFormContext<ExperienceSchema>();
  const form = useForm({ resolver: zodResolver(internshipSchema) });
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = form;
  const [showInternship, setShowInternship] = useState<boolean>();
  const internships = watch("internships") || [];

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
      <FormProvider {...form}>
        {showInternship && (
          <div className="mt-4 space-y-4">
            {internships.map((internship, index) => (
              <div
                key={index}
                className="rounded-md border border-gray-300 p-4"
              >
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
                      const newInternships = removeFromEnd(internships, index);
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
                  {...register("companyName")}
                  placeholder="Enter company name"
                />
                <FieldError error={errors.companyName} />
              </div>
              <div>
                <p className="text-[#001f5b]">Location</p>
                <Input {...register("location")} placeholder="Enter location" />
                <FieldError error={errors.location} />
              </div>
              <div>
                <p className="text-[#001f5b]">Position</p>
                <Input {...register("position")} placeholder="Enter position" />
                <FieldError error={errors.position} />
              </div>
              <div>
                <p className="text-[#001f5b]">Type</p>
                <div className="flex items-center gap-2">
                  <ToggleButton
                    {...register("type")}
                    fieldName="type"
                    id={`internship-type-full-time`}
                    value="full-time"
                  >
                    Full-time
                  </ToggleButton>
                  <ToggleButton
                    {...register("type")}
                    fieldName="type"
                    id={`internship-type-part-time`}
                    value="part-time"
                  >
                    Part-time
                  </ToggleButton>
                  <ToggleButton
                    {...register("type")}
                    fieldName="type"
                    id={`internship-type-other`}
                    value="other"
                  >
                    Other
                  </ToggleButton>
                </div>
                <FieldError error={errors.type} />
              </div>
              <div>
                <p className="text-[#001f5b]">Type</p>
                <div className="flex items-center gap-2">
                  <ToggleButton
                    {...register("modeOfWork")}
                    fieldName="modeOfWork"
                    id={`internship-type-in-person`}
                    value="in-person"
                  >
                    In-person
                  </ToggleButton>
                  <ToggleButton
                    {...register("modeOfWork")}
                    fieldName="modeOfWork"
                    id={`internship-type-remote`}
                    value="remote"
                  >
                    Remote
                  </ToggleButton>
                  <ToggleButton
                    {...register("modeOfWork")}
                    fieldName="modeOfWork"
                    id={`internship-type-hybrid`}
                    value="hybrid"
                  >
                    Hybrid
                  </ToggleButton>
                  <ToggleButton
                    {...register("modeOfWork")}
                    fieldName="modeOfWork"
                    id={`internship-type-other`}
                    value="other"
                  >
                    Other
                  </ToggleButton>
                </div>
                <FieldError error={errors.modeOfWork} />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleSubmit((data) => {
                    const newInternships = [...internships];
                    newInternships.push(data);
                    setValue("internships", newInternships);
                  })}
                  className="cursor-pointer rounded-md bg-yellow-500 px-3 py-2 text-[#001f5b] transition-colors hover:bg-yellow-600 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                >
                  Add Internship
                </button>
              </div>
            </div>
          </div>
        )}
      </FormProvider>
    </>
  );
}
