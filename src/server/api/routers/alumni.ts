import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { alumni, positionEnumValues, type Position } from "~/server/db/schema";
import { and, eq, desc, asc, sql } from "drizzle-orm";
import { tokenize } from "~/lib/search-parser/tokenizer";
import { parseSearchQuery } from "~/lib/search-parser/parser";

export const alumniRouter = createTRPCRouter({
    createAlumni: publicProcedure
        .input(
            z.object({
                first_name: z.string(),
                last_name: z.string(),
                image: z.string(),
                grad_year: z.string(),
                position: z.enum(positionEnumValues).default("Member"),
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
        .input(z.object({position: z.enum(positionEnumValues)}))
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
            sortBy: z.enum(["first_name", "last_name", "grad_year", ...positionEnumValues]).optional().default("grad_year"),
            sortDirection: z.enum(["asc", "desc"]).optional().default("asc"),
        })
    )
    .query(async ({ input, ctx }) => {
        const { page, pageSize, query, sortBy, sortDirection } = input;

        tokenize(query ?? "").forEach(token => {
            console.log("Token:", token);
        });

        const nodes = parseSearchQuery(query ?? "", [alumni.first_name, alumni.last_name], { year: alumni.grad_year });

        nodes.forEach(node => {
            console.log("Parsed Node:", node);
        });

        const filters = nodes
            .map(node => node.toSQL());

        const whereClause =
            filters.length === 0 ? undefined :
            filters.length === 1 ? filters[0] :
            and(...filters);

        const customSort = [];


        

        console.log("Sorting by:", sortBy, "Direction:", sortDirection);

        if (sortBy === "first_name" || sortBy === "last_name" || sortBy === "grad_year") {
            customSort.push(
                sortDirection === "asc" ? asc(alumni[sortBy]) : desc(alumni[sortBy]),
            );
        } else if (positionEnumValues.includes(sortBy)) {
            console.log("Sorting by position:", sortBy);
            customSort.push(
                desc(sql`${alumni.position} = ${sortBy}`),
                sortDirection === "asc" ? desc(alumni.position) : asc(alumni.position),
            );
        } else {
            console.warn("Unknown sortBy value:", sortBy);
        }

        customSort.push(
            sortDirection === "asc" ? asc(alumni.grad_year) : desc(alumni.grad_year),
            sortDirection === "asc" ? asc(alumni.first_name) : desc(alumni.first_name),
            sortDirection === "asc" ? asc(alumni.last_name) : desc(alumni.last_name),
            sortDirection === "asc" ? asc(alumni.id) : desc(alumni.id),
        );

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