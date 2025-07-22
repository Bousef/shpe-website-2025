"use client";

import Image from "next/image";
import Link from "../_components/Link";
import Input from "../_components/Input";
import FieldError from "./FieldError";
import { useFormContext } from "react-hook-form";
import type { NationalMemberSchema } from "./page";

export default function NationalMemberFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<NationalMemberSchema>();

  return (
    <>
      <div className="mb-8 h-px bg-gray-300" />
      <div className="space-y-4">
        <p>
          To become nationally recognized and an official SHPE UCF member you
          <strong> MUST </strong> go to the SHPE website by clicking on the link{" "}
          <strong>"Register on SHPE National"</strong> below. Please make sure
          to register for <strong>Region 7</strong>. There, create an account or
          log in with your previous SHPEConnect credentials and pay the national
          dues. Failure to do so will prevent you from getting the benefits of
          being a SHPE-paid member including attending the SHPE National
          Conference, participating in MentorSHPE, taking advantage of exclusive
          scholarships, and attending any SHPE UCF event.
        </p>
        <p>
          <strong>
            DON'T FORGET TO RETURN TO THIS FORM AND CONTINUE IN ORDER TO SUBMIT!
          </strong>
        </p>
        <p>
          <Link href="https://www.shpeconnect.org/eweb/DynamicPage.aspx?WebCode=LoginRequired&expires=yes&Site=shpe">
            Register on SHPE National
          </Link>
        </p>
        <p>
          If you have any questions on how to do so, please email{" "}
          <Link href="mailto:secretary@shpeucf.com">secretary@shpeucf.com</Link>{" "}
          or stop by MSC during our office hours in the Student Union.
        </p>
        <p>
          If you experience any errors during the Nationals registration, try
          using incognito mode to register.
        </p>
        <div className="space-y-2">
          <div>
            <p className="text-lg font-semibold text-[#001f5b]">
              What is your invoice number?
            </p>
            <div className="mt-2 max-w-1/2">
              <Input
                type="text"
                {...register("invoiceNumber")}
                placeholder="Invoice Number"
              />
              <FieldError error={errors.invoiceNumber} />
            </div>
          </div>
          <div>
            <p className="text-lg font-semibold text-[#001f5b]">
              What is your member ID?
            </p>
            <div className="mt-2 max-w-1/2">
              <Input
                type="text"
                {...register("memberId")}
                placeholder="Member ID"
              />
              <FieldError error={errors.memberId} />
            </div>
          </div>
        </div>
        <div className="relative aspect-video">
          <Image
            src="/images/national-membership-guide.png"
            alt="How to find your membership number"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </>
  );
}
