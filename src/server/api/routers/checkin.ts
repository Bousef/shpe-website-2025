import { createTRPCRouter, protectedProcedure } from "../trpc";
import { history, events, members } from "~/server/db/schema";
import { eq, and, sql } from "drizzle-orm";
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

        // fetch the event #1
        const event = await ctx.db
            .select()
            .from(events)
            .where(eq(events.title, input.title))
            .limit(1); // Ensure only one event is fetched

        if (event.length === 0) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Event not found, try a different event' });
        }

        // fetch member #2
        const member = await ctx.db
        .select()
        .from(members)
        .where(eq(members.ucf_id, input.ucf_id))

        if (member.length === 0){
            throw new TRPCError ({ code: 'NOT_FOUND', message: 'Member not found, try a different ucf_id'});
        }

        const checkIfMemberCheckedIn = await ctx.db
            .select()
            .from(history)
            .where(
                and(
                    eq(history.member_id, input.ucf_id), // Corrected column name
                    eq(history.event_title, input.title) // Ensure event_title matches input.title
                )
            )
        
        if(checkIfMemberCheckedIn.length > 0){
            throw new TRPCError ({ code: 'FORBIDDEN', message: 'You are already checked in ;)!'})
        }
        
        const eventLat = event[0]?.latitude;
        const eventLon = event[0]?.longitude;
        const radius = event[0]?.radius_meters;

        if (typeof eventLat !== "number" || typeof eventLon !== "number") {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Event latitude or longitude is missing or invalid.' });
        }

        const distance = HarversineDistance(
            input.latitude, input.longitude,
            eventLat, eventLon,
        )

        if (typeof radius !== "number") {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Event radius is missing or invalid.' });
        }

        if(distance > radius){
            throw new TRPCError ({ code: 'FORBIDDEN', message: 'You are not at the event yet, get there to take attendance!'});
        }

        // STEP 5 — Transaction: insert history + update member
        await ctx.db.transaction(async (tx) => {
            await tx
                .insert(history)
                .values({
                    event_id: event[0]!.id,
                    member_id:    input.ucf_id,
                    event_title:  input.title,
                    points_earned: event[0]!.points ?? 0,
                    attended_at:  new Date(),
            });

            await tx
                .update(members)
                .set({
                    points:        sql`${members.points} + ${event[0]!.points ?? 0}`,
                    event_counter: sql`${members.event_counter} + 1`,
            })
                .where(eq(members.ucf_id, input.ucf_id));
        });

        // STEP 6 — Return success
        return {
            success:      true,
            pointsEarned: event[0]!.points,
            message:      'You have successfully checked in!',
        };
    }),
});