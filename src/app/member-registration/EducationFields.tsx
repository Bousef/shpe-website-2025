"use client";

import { useFormContext } from "react-hook-form";
import Input from "../_components/Input";
import { type EducationSchema } from "./page";
import FieldError from "./FieldError";
import ToggleButton from "./ToggleButton";
import { useState } from "react";

export default function EducationFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<EducationSchema>();
  const [showSecondMajor, setShowSecondMajor] = useState<boolean>();
  const [showMinor, setShowMinor] = useState<boolean>();

  return (
    <>
      <div>
        <p className="text-lg font-semibold text-[#001f5b]">
          What is your current student status?
        </p>
        <div className="mt-2 flex items-center gap-2">
          <ToggleButton
            {...register("studentStatus", { required: true })}
            id="student-status-undergraduate"
            fieldName="studentStatus"
            value="undergraduate"
          >
            Undergraduate
          </ToggleButton>
          <ToggleButton
            {...register("studentStatus", { required: true })}
            id="student-status-graduate"
            fieldName="studentStatus"
            value="graduate"
          >
            Graduate
          </ToggleButton>
        </div>
        <FieldError error={errors.studentStatus} />
      </div>
      <div>
        <p className="text-lg font-semibold text-[#001f5b]">
          What is your UCF ID?
        </p>
        <p className="text-sm text-gray-500">
          This is your 7-digit student ID that <em>isn't</em> your NID.
        </p>
        <div className="mt-2">
          <Input
            {...register("ucfId", { required: true, min: 1000000 })}
            placeholder="1234567"
          />
        </div>
        <FieldError error={errors.ucfId} />
      </div>
      <div>
        <p className="text-lg font-semibold text-[#001f5b]">
          What is your current academic year?
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <ToggleButton
            {...register("academicYear", { required: true })}
            id="academic-year-freshman"
            fieldName="academicYear"
            value="freshman"
          >
            Freshman (1st Year)
          </ToggleButton>
          <ToggleButton
            {...register("academicYear", { required: true })}
            id="academic-year-sophomore"
            fieldName="academicYear"
            value="sophomore"
          >
            Sophomore (2nd Year)
          </ToggleButton>
          <ToggleButton
            {...register("academicYear", { required: true })}
            id="academic-year-junior"
            fieldName="academicYear"
            value="junior"
          >
            Junior (3rd Year)
          </ToggleButton>
          <ToggleButton
            {...register("academicYear", { required: true })}
            id="academic-year-senior"
            fieldName="academicYear"
            value="senior"
          >
            Senior (4th Year)
          </ToggleButton>
          <ToggleButton
            {...register("academicYear", { required: true })}
            id="academic-year-super-senior"
            fieldName="academicYear"
            value="super-senior"
          >
            Super Senior (5th+ Year)
          </ToggleButton>
          <ToggleButton
            {...register("academicYear", { required: true })}
            id="academic-year-other"
            fieldName="academicYear"
            value="other"
          >
            Other
          </ToggleButton>
        </div>
        <FieldError error={errors.academicYear} />
      </div>
      <div>
        <p className="text-lg font-semibold text-[#001f5b]">
          What is your major?
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <ToggleButton
            {...register("major", { required: true })}
            id="major-aerospace-engineering"
            fieldName="major"
            value="aerospace-engineering"
          >
            Aerospace Engineering
          </ToggleButton>
          <ToggleButton
            {...register("major", { required: true })}
            id="major-civil-engineering"
            fieldName="major"
            value="civil-engineering"
          >
            Civil Engineering
          </ToggleButton>
          <ToggleButton
            {...register("major", { required: true })}
            id="major-computer-engineering"
            fieldName="major"
            value="computer-engineering"
          >
            Computer Engineering
          </ToggleButton>
          <ToggleButton
            {...register("major", { required: true })}
            id="major-computer-science"
            fieldName="major"
            value="computer-science"
          >
            Computer Science
          </ToggleButton>
          <ToggleButton
            {...register("major", { required: true })}
            id="major-data-science"
            fieldName="major"
            value="data-science"
          >
            Data Science
          </ToggleButton>
          <ToggleButton
            {...register("major", { required: true })}
            id="major-electrical-engineering"
            fieldName="major"
            value="electrical-engineering"
          >
            Electrical Engineering
          </ToggleButton>
          <ToggleButton
            {...register("major", { required: true })}
            id="major-industrial-engineering"
            fieldName="major"
            value="industrial-engineering"
          >
            Industrial Engineering
          </ToggleButton>
          <ToggleButton
            {...register("major", { required: true })}
            id="major-mechanical-engineering"
            fieldName="major"
            value="mechanical-engineering"
          >
            Mechanical Engineering
          </ToggleButton>
          <ToggleButton
            {...register("major", { required: true })}
            id="major-photonics"
            fieldName="major"
            value="photonics"
          >
            Photonics
          </ToggleButton>
          <ToggleButton
            {...register("major", { required: true })}
            id="major-other"
            fieldName="major"
            value="other"
          >
            Other
          </ToggleButton>
        </div>
        <FieldError error={errors.major} />
      </div>
      <div>
        <p className="text-lg font-semibold text-[#001f5b]">
          What is your projected graduation year?
        </p>
        <div className="mt-2">
          <Input
            {...register("projectedGraduation", {
              required: true,
            })}
            placeholder="1995"
          />
        </div>
        <FieldError error={errors.projectedGraduation} />
      </div>
      <div>
        <p className="text-lg font-semibold text-[#001f5b]">
          Are you double majoring?
        </p>
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSecondMajor(true)}
            className={`cursor-pointer rounded-md border-2 border-yellow-500 px-3 py-2 text-[#001f5b] transition-colors hover:bg-yellow-500 focus:ring-2 focus:outline-none ${
              showSecondMajor ? "bg-yellow-500" : ""
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setShowSecondMajor(false)}
            className={`cursor-pointer rounded-md border-2 border-yellow-500 px-3 py-2 text-[#001f5b] transition-colors hover:bg-yellow-500 focus:ring-2 focus:outline-none ${
              showSecondMajor === false ? "bg-yellow-500" : ""
            }`}
          >
            No
          </button>
        </div>
      </div>
      {showSecondMajor && (
        <div>
          <p className="text-lg font-semibold text-[#001f5b]">
            What is your second major?
          </p>
          <div className="mt-2">
            <Input
              {...register("secondMajor", {
                required: showSecondMajor,
              })}
              placeholder="Enter your second major"
            />
          </div>
          <FieldError error={errors.secondMajor} />
        </div>
      )}
      <div>
        <p className="text-lg font-semibold text-[#001f5b]">
          Are you minoring in anything?
        </p>
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMinor(true)}
            className={`cursor-pointer rounded-md border-2 border-yellow-500 px-3 py-2 text-[#001f5b] transition-colors hover:bg-yellow-500 focus:ring-2 focus:outline-none ${
              showMinor ? "bg-yellow-500" : ""
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setShowMinor(false)}
            className={`cursor-pointer rounded-md border-2 border-yellow-500 px-3 py-2 text-[#001f5b] transition-colors hover:bg-yellow-500 focus:ring-2 focus:outline-none ${
              showMinor === false ? "bg-yellow-500" : ""
            }`}
          >
            No
          </button>
        </div>
      </div>
      {showMinor && (
        <div>
          <p className="text-lg font-semibold text-[#001f5b]">
            What is your minor?
          </p>
          <div className="mt-2">
            <Input
              {...register("minor", {
                required: showMinor,
              })}
              placeholder="Enter your minor"
            />
          </div>
          <FieldError error={errors.minor} />
        </div>
      )}
    </>
  );
}
