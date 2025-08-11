import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";
import axios from "axios";

const JOTFORM_API_KEY = process.env.JOTFORM_API_KEY;
const JOTFORM_FORM_ID = process.env.JOTFORM_FORM_ID;

export const jotformRouter = createTRPCRouter({
  
  //get submissions from renewal of membership!
  getSubmissions: publicProcedure
    .input(z.object({ formId: z.string() }))
    .query(async ({ input }) => {
      const response = await axios.get(`https://api.jotform.com/form/${input.formId}/submissions`, {
        params: { apiKey: JOTFORM_API_KEY },
      });
      return response.data.content;
    }),

  //submit a form from website to jotform
  submitForm: publicProcedure
    .input(
      z.object({
        formId: JOTFORM_FORM_ID,
        submissionData: z.record(z.string(), z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const response = await axios.post(
        `https://api.jotform.com/form/${input.formId}/submissions`,
        new URLSearchParams(input.submissionData),
        {
          params: { apiKey: JOTFORM_API_KEY },
        }
      );
      return response.data;
    }),
});