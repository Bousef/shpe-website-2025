import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { events, history, members } from "~/server/db/schema";
import { z } from "zod";
import { eq, ne, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import AddressConvert from "~/lib/AddressToCoord";
import RandomString from "~/lib/randomString";

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
        const { latitude, longitude } = await AddressConvert(input.location);
        const { new_attendance_key } = await RandomString(input.title, input.points);
        const eventId = await ctx.db.insert(events)
        .values({
            title: input.title,
            description: input.description,
            location: input.location,
            start_time: input.start_time,
            end_time: input.end_time,
            image: input.image,
            points: input.points,
            latitude,
            longitude,
            attendance_key: new_attendance_key,
        });

        // Update attendance_key for all non-Member users
        await ctx.db
            .update(members)
            .set({ attendance_key: sql`array_append(${members.attendance_key}, ${new_attendance_key})`})
            .where(ne(members.position, "Member"));

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