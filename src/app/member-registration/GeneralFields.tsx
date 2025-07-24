"use client";

import { Controller, useFormContext } from "react-hook-form";
import Input from "../_components/Input";
import { type GeneralSchema } from "./page";
import FieldError from "./FieldError";
import ToggleButton from "./ToggleButton";
import { usePhoneInput } from "react-international-phone";

export default function GeneralFields() {
  const {
    register,
    formState: { errors },
    control,
    setValue,
  } = useFormContext<GeneralSchema>();
  const { inputRef, inputValue, handlePhoneValueChange } = usePhoneInput({
    defaultCountry: "us",
    onChange: ({ phone: phoneNumber }) => setValue("phoneNumber", phoneNumber),
  });

  return (
    <>
      <div>
        <p className="text-lg font-semibold text-[#001f5b]">
          What is your current status at SHPE UCF?
        </p>
        <div className="mt-2 flex items-center gap-4">
          <ToggleButton
            {...register("memberStatus", { required: true })}
            id="member-status-new"
            fieldName="memberStatus"
            value="new"
          >
            New Member
          </ToggleButton>
          <ToggleButton
            {...register("memberStatus", { required: true })}
            id="member-status-returning"
            fieldName="memberStatus"
            value="returning"
          >
            Returning Member
          </ToggleButton>
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
          <Controller
            name="phoneNumber"
            control={control}
            render={({
              field: {
                value: _value,
                onChange: _onChange,
                ref: _ref,
                ...field
              },
            }) => (
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={handlePhoneValueChange}
                {...field}
              />
            )}
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
