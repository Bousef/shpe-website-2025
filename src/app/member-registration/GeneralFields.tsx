"use client";

import { useFormContext } from "react-hook-form";
import Input from "../_components/Input";
import { type GeneralSchema } from "./page";
import FieldError from "./FieldError";

export default function GeneralFields() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<GeneralSchema>();
  const memberStatus = watch("memberStatus");
  return (
    <>
      <div>
        <p className="text-lg font-semibold text-[#001f5b]">
          What is your current status at SHPE UCF?
        </p>
        <div className="mt-2 flex items-center gap-4">
          <input
            type="radio"
            className="hidden"
            {...register("memberStatus", { required: true })}
            id="member-status-new"
            value="new"
          />
          <label
            htmlFor="member-status-new"
            className={`cursor-pointer rounded-md border-2 border-yellow-500 px-3 py-2 text-[#001f5b] focus:ring-2 focus:outline-none ${
              memberStatus === "new" ? "bg-yellow-500" : ""
            }`}
          >
            New Member
          </label>
          <input
            type="radio"
            className="hidden"
            {...register("memberStatus", { required: true })}
            id="member-status-recurring"
            value="recurring"
          />
          <label
            htmlFor="member-status-recurring"
            className={`cursor-pointer rounded-md border-2 border-yellow-500 px-3 py-2 text-[#001f5b] focus:ring-2 focus:outline-none ${
              memberStatus === "recurring" ? "bg-yellow-500" : ""
            }`}
          >
            Recurring Member
          </label>
        </div>
        <FieldError error={errors.memberStatus} />
      </div>
      <div>
        <p className="text-lg font-semibold text-[#001f5b]">
          What is your first and last name?
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1">
            <Input
              type="text"
              {...register("firstName", { required: true })}
              placeholder="First Name"
            />
            <FieldError error={errors.firstName} />
          </div>
          <div className="flex-1">
            <Input
              type="text"
              {...register("lastName", { required: true })}
              placeholder="Last Name"
            />
            <FieldError error={errors.lastName} />
          </div>
        </div>
      </div>
      <div>
        <p className="text-lg font-semibold text-[#001f5b]">
          What is your UCF email address?
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1">
            <Input
              type="email"
              {...register("email", { required: true })}
              placeholder="ex: nid@ucf.edu"
            />
            <FieldError error={errors.email} />
          </div>
          <div className="flex-1">
            <Input
              type="email"
              {...register("confirmEmail", { required: true })}
              placeholder="Confirm Email"
            />
            <FieldError error={errors.confirmEmail} />
          </div>
        </div>
      </div>
      <div>
        <p className="text-lg font-semibold text-[#001f5b]">
          What is your phone number?
        </p>
        <div className="mt-2 max-w-1/2">
          <Input
            type="tel"
            {...register("phoneNumber", { required: true })}
            placeholder="(123)-456-7890"
          />
          <FieldError error={errors.phoneNumber} />
        </div>
      </div>
      <div>
        <p className="text-lg font-semibold text-[#001f5b]">
          What is your date of birth?
        </p>
        <div className="mt-2 max-w-1/2">
          <Input type="date" {...register("dateOfBirth", { required: true })} />
          <FieldError error={errors.dateOfBirth} />
        </div>
      </div>
      <div>
        <p className="text-lg font-semibold text-[#001f5b]">
          What is your Discord username?
        </p>
        <div className="mt-2 max-w-1/2">
          <Input
            type="text"
            placeholder="shpeucfmember"
            {...register("discord", { required: true })}
          />
          <FieldError error={errors.discord} />
        </div>
      </div>
    </>
  );
}
