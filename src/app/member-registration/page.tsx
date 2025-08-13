"use client";

import Navbar from "../_components/NavBar";
import { z } from "zod";
import { defineStepper } from "@stepperize/react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import GeneralFields from "./GeneralFields";
import DemographicFields from "./DemographicFields";
import EducationFields from "./EducationFields";
import ExperienceFields from "./ExperienceFields";
import { useRef } from "react";
import KnightConnectSection from "./KnightConnectSection";
import NationalMemberFields from "./NationalMemberFields";
import ResumeUploadFields from "./ResumeUploadFields";
import { submitToJotform } from "~/lib/submitToJotform";
import PaymentSection from "./PaymentSection";
import Link from "../_components/Link";

function ucfEmailValidator() {
  return z
    .email("Invalid email address")
    .refine((val) => val.endsWith("@ucf.edu"), {
      message: "Email must be a UCF email address",
    });
}

const phoneRegex = new RegExp(/^\+[1-9]\d{1,14}$/);

const generalSchema = z
  .object({
    memberStatus: z.enum(["new", "returning"]),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: ucfEmailValidator(),
    confirmEmail: ucfEmailValidator(),
    phoneNumber: z.string().regex(phoneRegex, "Invalid phone number"),
    dateOfBirth: z.preprocess(
      (val) => {
        if (typeof val === "string") {
          const parsed = new Date(val);
          if (!isNaN(parsed.getTime())) {
            return parsed;
          }
        }
        return val;
      },
      z.date().refine((val) => val.getTime() < Date.now(), {
        message: "Invalid date of birth",
      }),
    ),
    discord: z.string().min(1, "Discord username is required"),
  })
  .check((ctx) => {
    if (ctx.value.email !== ctx.value.confirmEmail) {
      ctx.issues.push({
        code: "custom",
        message: "Emails must match",
        path: ["confirmEmail"],
        input: ctx.value.confirmEmail,
      });
    }
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
    z
      .number()
      .min(1000000, "UCF ID must be at least 7 digits")
      .max(9999999, "UCF ID must be at most 7 digits"),
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
    z
      .number()
      .min(
        new Date().getFullYear(),
        "Projected graduation year must not be in the past",
      )
      .max(
        new Date().getFullYear() + 10,
        "Projected graduation year must be within the next 10 years",
      ),
  ),
  secondMajor: z.string().optional(),
  minor: z.string().optional(),
});
export type EducationSchema = z.infer<typeof educationSchema>;

export const internshipSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Location is required"),
  position: z.string().min(1, "Position is required"),
  type: z.string().min(1, "Type of internship is required"),
  modeOfWork: z.string().min(1, "Mode of work is required"),
});

const experienceSchema = z.object({
  internships: z.array(internshipSchema).optional(),
});
export type ExperienceSchema = z.infer<typeof experienceSchema>;

const nationalMemberSchema = z.object({
  invoiceNumber: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const parsed = parseInt(val, 10);
        if (!isNaN(parsed)) {
          return parsed;
        }
      }
      return val;
    },
    z
      .number()
      .min(1000000, "Invoice number is 7 digits long")
      .max(9999999, "Invoice number is 7 digits long"),
  ),
  memberId: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        const parsed = parseInt(val, 10);
        if (!isNaN(parsed)) {
          return parsed;
        }
      }
      return val;
    },
    z
      .number()
      .min(1000000, "Member ID is 7 digits long")
      .max(9999999, "Member ID is 7 digits long"),
  ),
});
export type NationalMemberSchema = z.infer<typeof nationalMemberSchema>;

const resumeUploadSchema = z.object({
  resume: z.preprocess(
    (val: File | FileList) => {
      if ("name" in val && "size" in val && "type" in val) {
        return val;
      } else return undefined;
    },
    z
      .file()
      .mime([
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ])
      .optional()
      .refine((file) => {
        if (!file) {
          return true;
        }
        const namePattern = /^[a-zA-Z]+_[a-zA-Z]+_Resume\.(pdf|doc|docx)$/;
        return namePattern.test(file.name);
      }, "Resume must be named in the format 'FirstName_LastName_Resume.pdf'"),
  ),
});
export type ResumeUploadSchema = z.infer<typeof resumeUploadSchema>;

export type SubmitSchema = z.infer<
  typeof generalSchema &
    typeof demographicSchema &
    typeof educationSchema &
    typeof experienceSchema &
    typeof nationalMemberSchema &
    typeof resumeUploadSchema
>;

const paymentSchema = z.object({ paymentId: z.string("Payment is required") });
export type PaymentSchema = z.infer<typeof paymentSchema>;

const { useStepper } = defineStepper(
  { id: "general", title: "General", schema: generalSchema },
  { id: "demographic", title: "Demographic", schema: demographicSchema },
  { id: "education", title: "Education", schema: educationSchema },
  { id: "experience", title: "Experience", schema: experienceSchema },
  { id: "knight-connect", title: "Knight Connect", schema: z.object({}) },
  {
    id: "national-member",
    title: "National Member",
    schema: nationalMemberSchema,
  },
  {
    id: "resume-upload",
    title: "Resume Upload",
    schema: resumeUploadSchema,
  },
  {
    id: "payment",
    title: "Payment",
    schema: paymentSchema,
  },
);

export default function MemberRegistrationPage() {
  const internshipPortalRef = useRef<HTMLDivElement>(null);
  const stepper = useStepper();
  const form = useForm({
    mode: "onTouched",
    resolver: zodResolver(stepper.current.schema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  async function submitTestData() {
    form.setValue("firstName", "John");
    form.setValue("lastName", "Doe");
    form.setValue("email", "johndoe@ucf.edu");
    form.setValue("confirmEmail", "johndoe@ucf.edu");
    form.setValue("phoneNumber", "1234567890");
    form.setValue("dateOfBirth", new Date("2000-01-01"));
    form.setValue("discord", "johndoe#1234");
    form.setValue("memberStatus", "new");
    form.setValue("race", "White");
    form.setValue("ucfId", 1234567);
    form.setValue("academicYear", "Senior");
    form.setValue("major", "Computer Science");
    form.setValue("projectedGraduation", new Date().getFullYear() + 1);
    form.setValue("studentStatus", "undergraduate");
    form.setValue("gender", "male");
    form.setValue("country", "USA");
    form.setValue("legalStatus", "citizen");
    form.setValue("ethnicity", "Non-Hispanic");
    form.setValue("memberId", 1234567);
    form.setValue("invoiceNumber", 1234567);

    form.handleSubmit(async () => await submitToJotform(form.getValues()))();
  }

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
            <Link href="mailto:secretary@shpeucf.com">
              secretary@shpeucf.com
            </Link>{" "}
            or swing by during our office hours. Stay updated on dates and times
            through our{" "}
            <Link href="https://www.instagram.com/shpeucf/">Instagram</Link>,{" "}
            <Link href="https://discord.com/channels/768494873866665984/768654225575772172">
              Discord
            </Link>
            , and{" "}
            <Link href="https://www.linkedin.com/company/shpe-ucf/posts/?feedView=all">
              LinkedIn.
            </Link>
          </p>
          <p>Welcome to SHPE UCF: En la Florida Central, ¡Juntos sin parar!</p>
        </div>
        <div ref={internshipPortalRef}></div>
        <button onClick={submitTestData}>submit test data</button>
        <FormProvider {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(async () => {
              if (stepper.isLast) {
                await submitToJotform(form.getValues());
              } else {
                stepper.next();
              }
            })}
          >
            {stepper.switch({
              general: () => <GeneralFields />,
              demographic: () => <DemographicFields />,
              education: () => <EducationFields />,
              experience: () => <ExperienceFields />,
              "knight-connect": () => <KnightConnectSection />,
              "national-member": () => <NationalMemberFields />,
              "resume-upload": () => <ResumeUploadFields />,
              payment: () => <PaymentSection />,
            })}
            <div className="float-right flex items-center gap-2">
              <button
                type="button"
                onClick={stepper.prev}
                disabled={stepper.isFirst}
                className="cursor-pointer rounded-md border-2 border-gray-300 px-4 py-2 text-[#001f5b] transition-colors hover:bg-yellow-500 disabled:cursor-not-allowed disabled:border-none disabled:bg-gray-300 disabled:text-[#001f5b]/40"
              >
                Back
              </button>
              <button
                type="submit"
                className="cursor-pointer rounded-md border-2 border-yellow-500 bg-yellow-500 px-4 py-2 text-[#001f5b] transition-colors hover:bg-yellow-600 disabled:cursor-not-allowed"
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
