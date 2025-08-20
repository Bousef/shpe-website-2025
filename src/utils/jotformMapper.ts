import { dataTagSymbol } from "@tanstack/react-query";

export function mapToJotFormFields(data: Record<string, any>): Record<string, string> {
    const jotformFields: Record<string, string> = {
        //general information
        name: `${data.firstName} ${data.lastName}`,
        email10: data.email,
        phoneNumber63: data.phoneNumber,
        dateOf64: data.dateOfBirth?.toISOString().split("T")[0],
        discordUsername: data.discord,
        memberStatus73: data.memberStatus === "new" ? "New Member" : "Recurring Member",
        referencefull: data.referenceFullName,
    
        //demographics
        gender: data.gender,
        race: data.race,
        nationality: data.ethnicity,
        typeA: data.country,
        legalStatus: data.legalStatus,
    
        //education
        studentStatus: data.studentStatus === "undergraduate" ? "Undergraduate" : "Graduate",
        "7digitUcf": String(data.ucfId),
        academicYear: data.academicYear,
        major: data.major,
        secondMajor: data.secondMajor || "",
        minor: data.minor || "",
        projectedGraduation: String(data.projectedGraduation),
    
        //national membership
        invoice: String(data.invoiceNumber),
        memberId: String(data.memberId),
      };
    
      // prior internship? Yes/No
        // Prior internship experience (yes/no)
    jotformFields["priorInternshipcoop"] = data.hasInternship ? "Yes" : "No";

    if (data.hasInternship && Array.isArray(data.internships)) {
        data.internships.forEach((internship, index) => {
        if (index === 0) {
            jotformFields["internshipcoopExperience"] = internship.description ?? "";
            jotformFields["internshipcoopExperience101"] = internship.companyName ?? "";
            jotformFields["internshipcoopExperience104"] = internship.location ?? "";
            jotformFields["internshipcoopExperience105"] = internship.position ?? "";
            jotformFields["internshipcoopExperience110"] = internship.type ?? "";
            jotformFields["internshipcoopExperience108"] = internship.mode ?? "";
        } else if (index === 1) {
            jotformFields["internshipcoopExperience111"] = internship.companyName ?? "";
            jotformFields["internshipcoopExperience112"] = internship.location ?? "";
            jotformFields["internshipcoopExperience113"] = internship.position ?? "";
            jotformFields["internshipcoopExperience114"] = internship.type ?? "";
            jotformFields["internshipcoopExperience115"] = internship.mode ?? "";
        }
        });
    }
    

    if (data.resume instanceof File) {
    jotformFields["resumeUpload"] = data.resume.name; 
    }

    if (data.squarePayment) {
        jotformFields["square_paymentId"] = data.squarePayment.id;
        jotformFields["square_amount"] = String(data.squarePayment.amount);
        jotformFields["square_itemNames"] = data.squarePayment.itemNames.join(", ");
    }


    return jotformFields;
  }