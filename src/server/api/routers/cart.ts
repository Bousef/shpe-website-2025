import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { cart } from "~/server/db/schema";

export const cartRouter = createTRPCRouter({
  addProduct: protectedProcedure.input(
      z.object({
        member_id: z.number(),
        product_id: z.number(),
        quantity: z.number().min(1).max(1000).default(1),
      })
    ).mutation(async ({ input, ctx }) => {
        const { db } = ctx;

        const product = await db.insert(cart).values({
          member_id: input.member_id,
          product_id: input.product_id,
          quantity: input.quantity,
        }).returning();

        return product;
    }),
});