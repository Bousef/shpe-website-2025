"use client";

import Navbar from "../_components/NavBar";
import { z } from "zod";
import { defineStepper } from "@stepperize/react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import GeneralFields from "./GeneralFields";
import DemographicFields from "./DemographicFields";
import EducationFields from "./EducationFields";

const generalSchema = z.object({
  memberStatus: z.enum(["new", "returning"]),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  confirmEmail: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  discord: z.string().min(1, "Discord username is required"),
});
export type GeneralSchema = z.infer<typeof generalSchema>;

const demographicSchema = z.object({
  gender: z.string().min(1, "Gender is required"),
  race: z.string().min(1, "Race is required"),
  ethnicity: z.string().min(1, "Ethnicity is required"),
  country: z.string().min(1, "Country is required"),
  legalStatus: z.string().min(1, "Legal status is required"),
});
export type DemographicSchema = z.infer<typeof demographicSchema>;

const educationSchema = z.object({
  studentStatus: z.enum(["undergraduate", "graduate"]),
  ucfId: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const parsed = parseInt(val, 10);
        if (!isNaN(parsed)) {
          return parsed;
        }
      }
      return val;
    },
    z.number().min(1000000, "UCF ID must be at least 7 digits"),
  ),
  academicYear: z.string().min(1, "Academic year is required"),
  major: z.string().min(1, "Major is required"),
  projectedGraduation: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const parsed = parseInt(val, 10);
        if (!isNaN(parsed)) {
          return parsed;
        }
      }
      return val;
    },
    z.number().min(2025, "Projected graduation year must be valid"),
  ),
  secondMajor: z.string().optional(),
  minor: z.string().optional(),
});
export type EducationSchema = z.infer<typeof educationSchema>;

const internshipSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Location is required"),
  position: z.string().min(1, "Position is required"),
  type: z.string().min(1, "Type of internship is required"),
  modeOfWork: z.string().min(1, "Mode of work is required"),
});

const internshipExperienceSchema = z.object({
  internships: z.array(internshipSchema).optional(),
});

const { useStepper, steps, utils } = defineStepper(
  { id: "general", title: "General", schema: generalSchema },
  { id: "demographic", title: "Demographic", schema: demographicSchema },
  { id: "education", title: "Education", schema: educationSchema },
  { id: "experience", title: "Experience", schema: internshipExperienceSchema },
);

export default function MemberRegistrationPage() {
  const stepper = useStepper();
  const form = useForm({
    mode: "onTouched",
    resolver: zodResolver(stepper.current.schema),
  });

  return (
    <>
      <Navbar />
      <main className="mx-auto my-10 max-w-3xl">
        <h1 className="mb-8 text-center text-5xl text-yellow-500 lg:text-6xl">
          MEMBER REGISTRATION
        </h1>
        <div className="mb-8 space-y-4">
          <p>
            Are you ready to unlock your potential, connect with passionate
            professionals, and make a lasting impact? The Society of Hispanic
            Professional Engineers at UCF invites you to be part of something
            great!
          </p>
          <p>
            By filling out this form, you're taking the first step towards
            joining a passionate network of leaders, innovators, and
            change-makers. Our members are dedicated to academic excellence,
            professional growth, and community empowerment.
          </p>
          <p>
            Got questions or need a hand? Our team is here to help! Drop us an
            email at{" "}
            <a href="mailto:secretary@shpeucf.com">secretary@shpeucf.com</a> or
            swing by during our office hours. Stay updated on dates and times
            through our{" "}
            <a href="https://www.instagram.com/shpeucf/">Instagram</a>,{" "}
            <a href="https://discord.com/channels/768494873866665984/768654225575772172">
              Discord
            </a>
            , and{" "}
            <a href="https://www.linkedin.com/company/shpe-ucf/posts/?feedView=all">
              LinkedIn.
            </a>
          </p>
          <p>Welcome to SHPE UCF: En la Florida Central, ¡Juntos sin parar!</p>
        </div>
        <FormProvider {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(
              stepper.isLast ? stepper.reset : stepper.next,
            )}
          >
            {stepper.switch({
              general: () => <GeneralFields />,
              demographic: () => <DemographicFields />,
              education: () => <EducationFields />,
            })}
            <div className="float-right flex items-center gap-2">
              <button
                type="button"
                onClick={stepper.prev}
                disabled={stepper.isFirst}
                className="cursor-pointer rounded-md border-2 border-gray-300 px-4 py-2 text-[#001f5b] hover:bg-yellow-500 disabled:cursor-not-allowed disabled:border-none disabled:bg-gray-300 disabled:text-[#001f5b]/40"
              >
                Back
              </button>
              <button
                type="submit"
                className="cursor-pointer rounded-md bg-yellow-500 px-4 py-2 text-[#001f5b] disabled:cursor-not-allowed"
              >
                {stepper.isLast ? "Submit" : "Next"}
              </button>
            </div>
          </form>
        </FormProvider>
      </main>
    </>
  );
}
