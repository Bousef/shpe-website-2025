import z from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { squareClient } from "~/lib/square/client";
import { TRPCError } from "@trpc/server";

export const customersRouter = createTRPCRouter({
  createCustomer: publicProcedure
    .input(
      z.object({
        idempotencyKey: z.string(),
        givenName: z.string(),
        familyName: z.string(),
        emailAddress: z.email(),
        phoneNumber: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const res = await squareClient.customers.create(input);
      if (!res.customer || res.errors) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: res.errors?.map((e) => e.detail).join(", "),
        });
      }
      return res.customer;
    }),
});
