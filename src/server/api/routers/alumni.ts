import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { alumni } from "~/server/db/schema";
import { and, eq, ilike, or, desc, asc, sql } from "drizzle-orm";

export const alumniRouter = createTRPCRouter({
    createAlumni: publicProcedure
        .input(
            z.object({
                first_name: z.string(),
                last_name: z.string(),
                image: z.string(),
                grad_year: z.string(),
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
    getAlumniByYear: publicProcedure
        .input(z.object({gradYear:z.string()}))
        .query(async({input, ctx}) => {
          if (input.gradYear.toString().length != 4){
            throw new Error("Please enter a valid 4-digit graduation year, e.g., 2025.")

          }
            const year = await ctx.db
                  .select()
                  .from(alumni)
                  .where(eq(alumni.grad_year,input.gradYear))

            return year;

        }),

    // get all alumni based on position
    getAlumniByPosition: publicProcedure
        .input(z.object({position: z.string()}))
        .query(async({input,ctx}) => {
            const positionList = await ctx.db
                  .select()
                  .from(alumni)
                  .where(eq(alumni.position, input.position))
            
            if (positionList.length == 0){
              throw new Error("There was no alumni found with that position.")
            }


            return positionList;

        }),
    
    getAlumni: publicProcedure
        .input(z.object({
            page: z.number().int().min(0).default(0),
            pageSize: z.number().int().min(1).max(100).default(10),
            query: z.string().optional(),
            sortBy: z.enum(["first_name", "last_name", "grad_year"]).optional(),
            sortDirection: z.enum(["asc", "desc"]).optional(),
        })
    )
    .query(async ({ input, ctx }) => {
        const { page, pageSize, query, sortBy, sortDirection } = input;

        const filters = [];

        if (query) {
            const pattern = `%${query}%`;

            filters.push(
                or(
                    ilike(alumni.first_name, pattern),
                    ilike(alumni.last_name, pattern),
                )
            );
        }

        const defaultSort = [
            sortDirection === "asc" ? asc(alumni.grad_year) : desc(alumni.grad_year),
            asc(alumni.last_name),
            asc(alumni.first_name),
            asc(alumni.id),
        ];

        const customSort =
            sortBy && sortDirection
            ? [
                sortDirection === "asc" ? asc(alumni[sortBy]) : desc(alumni[sortBy]),
                sortDirection === "asc" ? asc(alumni.grad_year) : desc(alumni.grad_year),
                sortDirection === "asc" ? asc(alumni.id) : desc(alumni.id),
            ] : defaultSort;

        const whereClause = filters.length > 0 ? and(...filters) : undefined;

        const alumniList = await ctx.db
            .select()
            .from(alumni)
            .where(whereClause)
            .orderBy(
                ...customSort,
            )
            .limit(pageSize)
            .offset(page * pageSize);

        const countResult = await ctx.db
            .select({ count: sql<number>`count(*)` })
            .from(alumni)
            .where(whereClause);

        const total = Number(countResult[0]?.count ?? 0);

        return {alumniList, total};
    }),
});