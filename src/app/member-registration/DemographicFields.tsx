"use client";

import { useFormContext } from "react-hook-form";
import Input from "../_components/Input";
import { type DemographicSchema } from "./page";
import FieldError from "./FieldError";
import ToggleButton from "./ToggleButton";
import CountrySelect from "../_components/CountrySelect";

export default function DemographicFields() {
  const {
    register,
    formState: { errors },
  } = useFormContext<DemographicSchema>();

  return (
    <>
      <div>
        <p className="text-lg font-semibold text-[#001f5b]">
          What is your gender?
        </p>
        <div className="mt-2 flex items-center gap-2">
          <ToggleButton
            {...register("gender", { required: true })}
            id="gender-male"
            fieldName="gender"
            value="male"
          >
            Male
          </ToggleButton>
          <ToggleButton
            {...register("gender", { required: true })}
            id="gender-female"
            fieldName="gender"
            value="female"
          >
            Female
          </ToggleButton>
          <ToggleButton
            {...register("gender", { required: true })}
            id="gender-nonbinary"
            fieldName="gender"
            value="nonbinary"
          >
            Non-binary
          </ToggleButton>
          <ToggleButton
            {...register("gender", { required: true })}
            id="gender-other"
            fieldName="gender"
            value="other"
          >
            Other
          </ToggleButton>
        </div>
        <FieldError error={errors.gender} />
      </div>
      <div>
        <p className="text-lg font-semibold text-[#001f5b]">
          What is your race?
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <ToggleButton
            {...register("race", { required: true })}
            id="race-american-indian"
            fieldName="race"
            value="american-indian"
          >
            American Indian or Alaska Native
          </ToggleButton>
          <ToggleButton
            {...register("race", { required: true })}
            id="race-asian"
            fieldName="race"
            value="asian"
          >
            Asian
          </ToggleButton>
          <ToggleButton
            {...register("race", { required: true })}
            id="race-black"
            fieldName="race"
            value="black"
          >
            Black or African American
          </ToggleButton>
          <ToggleButton
            {...register("race", { required: true })}
            id="race-native-hawaiian"
            fieldName="race"
            value="native-hawaiian"
          >
            Native Hawaiian or Other Pacific Islander
          </ToggleButton>
          <ToggleButton
            {...register("race", { required: true })}
            id="race-white"
            fieldName="race"
            value="native-white"
          >
            White
          </ToggleButton>
          <ToggleButton
            {...register("race", { required: true })}
            id="race-other"
            fieldName="race"
            value="other"
          >
            Other
          </ToggleButton>
        </div>
        <FieldError error={errors.race} />
      </div>
      <div>
        <p className="text-lg font-semibold text-[#001f5b]">
          What is your ethnicity?
        </p>
        <div className="mt-2 flex items-center gap-2">
          <ToggleButton
            {...register("ethnicity", { required: true })}
            id="ethnicity-hispanic"
            fieldName="ethnicity"
            value="hispanic"
          >
            Hispanic or Latinx
          </ToggleButton>
          <ToggleButton
            {...register("ethnicity", { required: true })}
            id="ethnicity-non-hispanic"
            fieldName="ethnicity"
            value="non-hispanic"
          >
            Non-Hispanic or Latinx
          </ToggleButton>
          <ToggleButton
            {...register("ethnicity", { required: true })}
            id="ethnicity-other"
            fieldName="ethnicity"
            value="other"
          >
            Other
          </ToggleButton>
        </div>
        <FieldError error={errors.ethnicity} />
      </div>
      <div>
        <p className="text-lg font-semibold text-[#001f5b]">
          What is your country of origin?
        </p>
        <div className="mt-2 max-w-1/2">
          <CountrySelect {...register("country", { required: true })} />
        </div>
        <FieldError error={errors.country} />
      </div>
      <div>
        <p className="text-lg font-semibold text-[#001f5b]">
          What is your legal status in the United States?
        </p>
        <div className="mt-2 flex items-center gap-2">
          <ToggleButton
            {...register("legalStatus", { required: true })}
            id="legal-status-citizen"
            fieldName="legalStatus"
            value="citizen"
          >
            U.S. Citizen
          </ToggleButton>
          <ToggleButton
            {...register("legalStatus", { required: true })}
            id="legal-status-legal-resident"
            fieldName="legalStatus"
            value="legal-resident"
          >
            Legal resident (Green Card)
          </ToggleButton>
          <ToggleButton
            {...register("legalStatus", { required: true })}
            id="legal-status-f1-visa"
            fieldName="legalStatus"
            value="f1-visa"
          >
            F-1 Visa
          </ToggleButton>
          <ToggleButton
            {...register("legalStatus", { required: true })}
            id="legal-status-j1-visa"
            fieldName="legalStatus"
            value="j1-visa"
          >
            J-1 Visa
          </ToggleButton>
          <ToggleButton
            {...register("legalStatus", { required: true })}
            id="legal-status-other"
            fieldName="legalStatus"
            value="other"
          >
            Other
          </ToggleButton>
        </div>
        <FieldError error={errors.legalStatus} />
      </div>
    </>
  );
}
