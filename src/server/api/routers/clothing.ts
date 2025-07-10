import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { clothes_sizes } from "~/server/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

// Sizes are stored in CAPS: S, M, L, XL, XXL, XXXL
const sizeSchema = z.object({
  id: z.number(),
  S: z.number().min(0).optional(),
  M: z.number().min(0).optional(),
  L: z.number().min(0).optional(),
  XL: z.number().min(0).optional(),
  XXL: z.number().min(0).optional(),
  XXXL: z.number().min(0).optional(),
});

export const clothingRouter = createTRPCRouter({
  /** Get size row for a product */
  getSizes: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const result = await ctx.db.select().from(clothes_sizes).where(eq(clothes_sizes.id, input));
    return result[0] ?? null;
  }),

  /** Insert size row when creating a clothing product */
  createSizes: protectedProcedure.input(sizeSchema).mutation(async ({ ctx, input }) => {
    const result = await ctx.db.insert(clothes_sizes).values(input).returning();
    return result[0];
  }),

  /** Update sizes for an existing product */
  updateSizes: protectedProcedure.input(sizeSchema).mutation(async ({ ctx, input }) => {
    const { id, ...sizes } = input;
    const result = await ctx.db
      .update(clothes_sizes)
      .set(sizes)
      .where(eq(clothes_sizes.id, id))
      .returning();
    return result[0];
  }),

  /** Delete size row (used in product.delete) */
  deleteSizes: protectedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    const result = await ctx.db.delete(clothes_sizes).where(eq(clothes_sizes.id, input)).returning();
    return result[0];
  }),
});