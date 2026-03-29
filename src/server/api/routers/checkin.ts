import { createTRPCRouter, protectedProcedure } from "../trpc";
import { events, members } from "~/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import HarversineDistance from "~/lib/haversine";

export const checkinRouter = createTRPCRouter({

    checkin: protectedProcedure
    .input(
        z.object({
            ucf_id: z.number().int().positive("UCF ID is required"),
            title: z.string().min(1, "Event name is required"),
            latitude: z.number(),
            longitude: z.number(),
        })
    ).mutation(async ({ ctx, input }) => {

        // fetch the event
        const event = await ctx.db
            .select()
            .from(events)
            .where(eq(events.title, input.title))
            .limit(1);

        if (event.length === 0 || !event[0]) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found, try a different event' });
        }

        // fetch member
        const member = await ctx.db
            .select()
            .from(members)
            .where(eq(members.ucf_id, input.ucf_id));

        if (member.length === 0 || !member[0]) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Member not found, try a different ucf_id' });
        }

        const eventKey = event[0].attendance_key;

        if (!eventKey || eventKey === "NO_STRING") {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'This event does not have a valid attendance key' });
        }

        // Check if member already has this key (already checked in)
        const memberKeys: string[] = member[0].attendance_key ?? [];
        if (memberKeys.includes(eventKey)) {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'You are already checked in ;)!' });
        }

        // Validate location
        const eventLat = event[0].latitude;
        const eventLon = event[0].longitude;
        const radius = event[0].radius_meters;

        if (typeof eventLat !== "number" || typeof eventLon !== "number") {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Event latitude or longitude is missing or invalid.' });
        }

        if (typeof radius !== "number") {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Event radius is missing or invalid.' });
        }

        const distance = HarversineDistance(
            input.latitude, input.longitude,
            eventLat, eventLon,
        );

        if (distance > radius) {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'You are not at the event yet, get there to take attendance!' });
        }

        // Member is in range — append the event's attendance key to their array
        if(member[0].position === "Member"){
            await ctx.db
            .update(members)
            .set({
                attendance_key: sql`array_append(${members.attendance_key}, ${eventKey})`,
            })
            .where(eq(members.ucf_id, input.ucf_id));
        }

        return {
            success: true,
            message: 'You are checked in! Attendance will be granted when the host pushes it.',
        };
    }),
});