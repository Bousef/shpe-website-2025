import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { cart, products } from "~/server/db/schema";
import { eq, sql } from "drizzle-orm";

export const cartRouter = createTRPCRouter({
  addProduct: protectedProcedure.input(
      z.object({
        product_id: z.number(),
        quantity: z.number().min(1).max(1000).default(1),
      })
    ).mutation(async ({ input, ctx }) => {
        const { db } = ctx;

        const product = await db.insert(cart).values({
          member_uuid: ctx.user.id,
          product_id: input.product_id,
          quantity: input.quantity,
        }).onConflictDoUpdate({
          target: [cart.member_uuid, cart.product_id],
          set: {
            quantity: sql`${cart.quantity} + ${input.quantity}`,
          },
        }).returning();

        return product;
    }),

    getItems: protectedProcedure.query(async ({ ctx }) => {
        const { db } = ctx;

        const items = await db.select({
            id:   products.id,
            name:        products.name,
            category:    products.category,
            image:       products.image,
            description: products.description,
            price:       products.price,
            quantity:    cart.quantity,
            createdAt:   cart.created_at,
        }).from(cart).innerJoin(
            products,
            eq(cart.product_id, products.id)
      );

      return items;
    }),
});