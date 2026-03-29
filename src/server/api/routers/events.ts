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
            startTime: z.date().optional(),
            endTime: z.date().optional(),
            image: z.string().url("Image must be a valid URL").optional(),
            points: z.number().int().default(0),
            latitude: z.number().optional(),   // new
            longitude: z.number().optional(),  // new
            hostName: z.string() // new 
        })
    ).mutation(async ({ ctx, input }) => {
    try {

        // Confirm the provided host exists AND is an admin.
        // first_name is not unique.... if multiple admins share a first name,
        // we reject so the UI can be updated to use a unique identifier.
        const hostCandidates = await ctx.db
            .select({
                uuid: members.uuid,
                ucf_id: members.ucf_id,
                first_name: members.first_name,
                last_name: members.last_name,
                position: members.position,
            })
            .from(members)
            .where(eq(members.first_name, input.hostName));

        const adminHosts = hostCandidates.filter((h) => h.position !== "Member");

        if (adminHosts.length === 0) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Selected host must be an admin user",
            });
        }

        if (adminHosts.length > 1) {
            throw new TRPCError({
                code: "CONFLICT",
                message:
                    "Multiple admin users share that first name. Please select a unique host (e.g., by UCF ID or UUID).",
            });
        }

        const host = adminHosts[0]!;

        // Use explicit coords if provided (dragged pin), otherwise geocode the string
        const { latitude, longitude } =
            input.latitude !== undefined && input.longitude !== undefined
            ? { latitude: input.latitude, longitude: input.longitude }
            : await AddressConvert(input.location);
        const { new_attendance_key } = await RandomString(input.title, input.points);

        const result = await ctx.db.transaction(async (tx) => {
            const inserted = await tx
                .insert(events)
                .values({
                    title: input.title,
                    description: input.description,
                    location: input.location,
                    start_time: input.startTime,
                    end_time: input.endTime,
                    image: input.image,
                    points: input.points,
                    latitude,
                    longitude,
                    attendance_key: new_attendance_key,
                    host_ucf_id: host.ucf_id,
                    host_name: `${host.first_name}`,
                })
                .returning({ id: events.id });

            // Give the attendance_key to only the host.
            await tx
                .update(members)
                .set({
                    attendance_key: sql`array_append(${members.attendance_key}, ${new_attendance_key})`,
                })
                .where(eq(members.uuid, host.uuid));

            return inserted[0] ?? null;
        });

        return result;
    } catch (error) {
        if (error instanceof TRPCError) throw error;
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

    getEventsWithHost: publicProcedure.query(async ({ ctx }) => {
        const rows = await ctx.db
        .select({
            id: events.id,
            title: events.title,
            start_time: events.start_time,
            host_name: members.first_name,
            host_ucf_id: members.ucf_id,
        }).from(events).innerJoin(members, eq(events.host_ucf_id, members.ucf_id))

        return rows
    }),

    // Add this query to your eventsRouter, alongside createEvent etc.
    // It proxies Nominatim through your server so the browser never touches it directly.

    searchLocations: publicProcedure
        .input(z.object({ query: z.string().min(1) }))
        .query(async ({ input }) => {
            const encoded = encodeURIComponent(input.query);
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=5`,
                {
                    headers: {
                        // Same User-Agent as AddressConvert — keeps your Nominatim identity consistent
                        "User-Agent": "shpe-website-2025/1.0",
                    },
                }
            );

            if (!res.ok) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to reach geocoding service",
                });
            }

            const data = await res.json() as Array<{
                place_id: number;
                display_name: string;
                lat: string;
                lon: string;
            }>;

            return data;
    }),

    // Input lat and long, and return display name that way people can drag and drop where they want an event

    reverseGeocode: protectedProcedure
    .input(z.object({ lat: z.number(), lon: z.number() }))
    .query(async ({ input }) => {
        const result = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${input.lat}&lon=${input.lon}&format=json`,
            { headers: { 'User-Agent': 'shpe-website-2025/1.0' } }
        );
        if (!result.ok)
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Reversed geocoding failed'})

        const data = await result.json() as { display_name: string };
        return { display_name: data.display_name };
    }),

    // updateEvent: protectedProcedure (Prototype)

    pushAttendance: protectedProcedure.input(
        z.object({
            eventId: z.number().int().positive("Event ID is required"),
        })
    ).mutation(async ({ ctx, input }) => {
        // Verify caller is admin
        const caller = await ctx.db
            .select({ position: members.position })
            .from(members)
            .where(eq(members.uuid, ctx.user.id));

        if (!caller[0] || caller[0].position === "Member") {
            throw new TRPCError({
                code: "FORBIDDEN",
                message: "Only admins can push attendance",
            });
        }

        // Fetch the event
        const event = await ctx.db
            .select()
            .from(events)
            .where(eq(events.id, input.eventId))
            .limit(1);

        if (event.length === 0 || !event[0]) {
            throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
        }

        const eventData = event[0];
        const eventKey = eventData.attendance_key;

        if (!eventKey || eventKey === "NO_STRING") {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "This event does not have a valid attendance key",
            });
        }

        // Find all members who have this event's key in their attendance_key array
        const eligibleMembers = await ctx.db
            .select({
                ucf_id: members.ucf_id,
                uuid: members.uuid,
                first_name: members.first_name,
                last_name: members.last_name,
            })
            .from(members)
            .where(sql`${eventKey} = ANY(${members.attendance_key})`);

        if (eligibleMembers.length === 0) {
            return { success: true, attendedCount: 0, message: "No eligible members found" };
        }

        // Filter out members who already checked in for this event
        const existingCheckins = await ctx.db
            .select({ member_id: history.member_id })
            .from(history)
            .where(eq(history.event_id, eventData.id));

        const alreadyCheckedIn = new Set(existingCheckins.map((h) => h.member_id));
        const newAttendees = eligibleMembers.filter((m) => !alreadyCheckedIn.has(m.ucf_id));

        if (newAttendees.length === 0) {
            return { success: true, attendedCount: 0, message: "All eligible members already checked in" };
        }

        // Grant attendance in a transaction
        await ctx.db.transaction(async (tx) => {
            // Insert history records for each new attendee
            await tx.insert(history).values(
                newAttendees.map((m) => ({
                    event_id: eventData.id,
                    member_id: m.ucf_id,
                    event_title: eventData.title!,
                    points_earned: eventData.points ?? 0,
                    attended_at: new Date(),
                }))
            );

            // Update points and event_counter for each attendee
            for (const m of newAttendees) {
                await tx
                    .update(members)
                    .set({
                        points: sql`${members.points} + ${eventData.points}`,
                        event_counter: sql`${members.event_counter} + 1`,
                    })
                    .where(eq(members.uuid, m.uuid));
            }

            // Update event attendance count
            await tx
                .update(events)
                .set({
                    attendance_count: sql`${events.attendance_count} + ${newAttendees.length}`,
                })
                .where(eq(events.id, eventData.id));
        });

        // Remove the attendance key from all members who had it
        await ctx.db
            .update(members)
            .set({
                attendance_key: sql`array_remove(${members.attendance_key}, ${eventKey})`,
            })
            .where(sql`${eventKey} = ANY(${members.attendance_key})`);

        return {
            success: true,
            attendedCount: newAttendees.length,
            message: `Attendance granted to ${newAttendees.length} member(s)`,
        };
    }),
})