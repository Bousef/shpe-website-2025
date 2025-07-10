import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { products, clothes_sizes } from "~/server/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";

const statusEnum = z.union([z.literal("Active"), z.literal("Inactive")]);

export const productRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const productsData = await ctx.db.select().from(products);

    // For clothes, attach clothing stock info
    const results = await Promise.all(
      productsData.map(async (product) => {
        if (product.category === "Clothes") {
          const sizes = await ctx.db
            .select()
            .from(clothes_sizes)
            .where(eq(clothes_sizes.id, product.id));

          return { ...product, sizes: sizes[0] };
        }
        return product;
      })
    );

    return results;
  }),

  getById: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    const product = await ctx.db.select().from(products).where(eq(products.id, input));
    if (!product[0]) return null;

    if (product[0].category === "Clothes") {
      const sizes = await ctx.db
        .select()
        .from(clothes_sizes)
        .where(eq(clothes_sizes.id, product[0].id));

      return { ...product[0], sizes: sizes[0] };
    }

    return product[0];
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        price: z.number(),
        stock: z.number(),
        image: z.string(),
        category: z.string(),
        status: statusEnum,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.insert(products).values(input).returning();
      return result[0];
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        price: z.number(),
        stock: z.number(),
        image: z.string().optional(),
        category: z.string(),
        status: statusEnum,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...rest } = input;
      const result = await ctx.db.update(products).set(rest).where(eq(products.id, id)).returning();
      return result[0];
    }),

  delete: protectedProcedure.input(z.number()).mutation(async ({ ctx, input }) => {
    // First delete from clothes_sizes if applicable
    await ctx.db.delete(clothes_sizes).where(eq(clothes_sizes.id, input));

    // Then delete the main product
    const result = await ctx.db.delete(products).where(eq(products.id, input)).returning();
    return result[0];
  }),
});