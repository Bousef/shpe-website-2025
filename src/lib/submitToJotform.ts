import type { SubmitSchema } from "~/app/member-registration/page";

export async function submitToJotform(data: SubmitSchema) {
  const formData = new FormData();

  // Name
  formData.append("submission[4][first]", data.firstName);
  formData.append("submission[4][last]", data.lastName);

  // Email
  formData.append("submission[10]", data.email);

  // Phone - if you want to split area & phone, you'll need to parse
  formData.append("submission[63][full]", data.phoneNumber);

  // Date of Birth
  const dob = new Date(data.dateOfBirth);
  formData.append("submission[64][month]", String(dob.getMonth() + 1));
  formData.append("submission[64][day]", String(dob.getDate()));
  formData.append("submission[64][year]", String(dob.getFullYear()));

  // Academic Info
  formData.append("submission[32]", data.academicYear);
  formData.append("submission[33]", data.legalStatus);
  formData.append("submission[82]", String(data.ucfId));
  formData.append("submission[70]", data.major);
  if (data.secondMajor) formData.append("submission[71]", data.secondMajor);
  if (data.minor) formData.append("submission[72]", data.minor);

  // Membership & Demographics
  formData.append("submission[73]", data.memberStatus);
  formData.append("submission[74]", data.race);
  formData.append("submission[75]", data.ethnicity);
  formData.append("submission[76]", data.gender);
  formData.append("submission[78]", String(data.projectedGraduation));

  // Internship Experience
  const hasInternships = data.internships && data.internships.length > 0;
  formData.append("submission[80]", hasInternships ? "Yes" : "No");
  if (hasInternships) {
    data.internships!.forEach((internship, index) => {
      if (index === 0) {
        formData.append("submission[101]", internship.companyName);
        formData.append("submission[104]", internship.location);
        formData.append("submission[105]", internship.position);
        formData.append("submission[108]", internship.modeOfWork);
        formData.append("submission[110]", internship.type);
      } else if (index === 1) {
        formData.append("submission[111]", internship.companyName);
        formData.append("submission[112]", internship.location);
        formData.append("submission[113]", internship.position);
        formData.append("submission[114]", internship.modeOfWork);
        formData.append("submission[115]", internship.type);
      }
    });
  }

  // Misc
  formData.append("submission[90]", data.discord);
  formData.append("submission[87]", data.country);
  formData.append("submission[42]", String(data.invoiceNumber));
  formData.append("submission[43]", String(data.memberId));

  // Resume upload (if applicable)
  if (data.resume) {
    formData.append("submission[58]", data.resume); // replace with actual Jotform file upload ID
  }

  // Submit
  const res = await fetch(
    `https://api.jotform.com/form/${process.env.NEXT_PUBLIC_JOTFORM_FORM_ID!}/submissions?apiKey=${process.env.NEXT_PUBLIC_JOTFORM_API_KEY!}`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!res.ok) {
    throw new Error(`Jotform submission failed: ${res.statusText}`);
  }

  return await res.json();
}
