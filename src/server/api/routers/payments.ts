import z from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { squareClient } from "~/lib/square/client";
import { TRPCError } from "@trpc/server";
import { moneySchema } from "~/lib/square/schema";

export const paymentsRouter = createTRPCRouter({
  createPayment: publicProcedure
    .input(
      z.object({
        idempotencyKey: z.string().min(1).max(45),
        sourceId: z.string().min(1),
        amountMoney: moneySchema.optional(),
        orderId: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const res = await squareClient.payments.create(input);
      if (!res.payment || res.errors) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: res.errors?.map((e) => e.detail).join(", "),
        });
      }

      return res.payment;
    }),
});
