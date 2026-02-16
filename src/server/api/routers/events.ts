import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { events } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const eventsRouter = createTRPCRouter({

    createEvent: protectedProcedure.input(
        z.object({
            title: z.string().min(1, "Event name cannot be empty"),
            description: z.string().min(1, "Description cannot be empty"),
            location: z.string().min(1, "Location cannot be empty"),
            start_time: z.date().optional(),
            end_time: z.date().optional(),
            image: z.string().url("Image must be a valid URL").optional(),
            points: z.number().int().default(0),
        })
    ).mutation(async ({ ctx, input }) => {
    try {
        const eventId = await ctx.db.insert(events)
        .values({
            title: input.title,
            description: input.description,
            location: input.location,
            start_time: input.start_time,
            end_time: input.end_time,
            image: input.image,
            points: input.points,
        });

        return eventId;
    } catch (error) {
        console.error("Failed to create event:", error);
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error instanceof Error ? error.message : "Failed to create event",
        });
    }
    }),

    getEvents: publicProcedure.query(async ({ ctx }) => {
        const allEvents = await ctx.db.select().from(events);
        return allEvents;
    }),

    // updateEvent: protectedProcedure (Prototype)
})