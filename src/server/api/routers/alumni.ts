import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { alumni } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";

export const AlumniRouter = createTRPCRouter({
    createAlumni: publicProcedure
        .input(
            z.object({
                first_name: z.string(),
                last_name: z.string(),
                image: z.string(),
                grad_year: z.number(),
                position: z.string(),
                linkedIn: z.string(),
            })
        )
        .mutation(async ({ input, ctx }) => {
            const existingAlumni = await ctx.db
            .select()
            .from(alumni)
            .where(and(
                eq(alumni.first_name, input.first_name),
                eq(alumni.last_name, input.last_name)
            ));

            if (existingAlumni.length > 0) {
                // Alumni already exists
                return null;
            }
            
            const newAlumni = (await ctx.db
                .insert(alumni)
                .values(input)
                .returning())[0];

            if (!newAlumni) {
                console.error("Tried to create an alumni, but database returned null. Check if the database is set up correctly.");
                return null;
            }

            return newAlumni;
        }),

    // get alumni by id
    getAlumniById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input, ctx }) => {
            const [record] = await ctx.db
                .select()
                .from(alumni)
                .where(eq(alumni.id, input.id))
            return record ?? null;
        }),

    // get all alumni based on year

    // get all alumni based on position
    
});