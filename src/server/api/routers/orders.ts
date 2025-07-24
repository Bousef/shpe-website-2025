import z from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { orderSchema } from "~/lib/square/schema";
import { squareClient } from "~/lib/square/client";
import { env } from "~/env";
import { TRPCError } from "@trpc/server";

export const ordersRouter = createTRPCRouter({
  createOrder: publicProcedure
    .input(
      z.object({
        idempotencyKey: z.string().max(192),
        order: orderSchema.pick({ customerId: true, lineItems: true }),
      }),
    )
    .mutation(async ({ input }) => {
      const res = await squareClient.orders.create({
        ...input,
        order: { ...input.order, locationId: env.SQUARE_LOCATION_ID },
      });
      if (!res.order || res.errors) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: res.errors?.map((e) => e.detail).join(", "),
        });
      }

      return res.order;
    }),
});
