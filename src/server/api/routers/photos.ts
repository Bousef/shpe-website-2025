// photos.ts router

// --- IMPORTS YOU'LL NEED ---
import { publicProcedure, protectedProcedure, createTRPCRouter } from "src/server/api/trpc";
import { db } from "src/server/db";
import { photos, members, history } from "src/server/db/schema";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { supabaseAdmin } from "~/supabase-admin";

// --- ROUTER ---

export const photosRouter = createTRPCRouter({

  // --- MUTATION: uploadPhoto ---
  // Use protectedProcedure (user must be logged in)
  // Input: z.object with eventId (number) and storagePath (string)
  // Drizzle hint: db.insert(photos).values({ ...yourData })
  // Step 1: Verify the user attended the event
    // Drizzle hint: db.select().from(history).where(and(eq(field, value), eq(field, value)))
  // Step 2: If no record found in history → throw TRPCError NOT_FOUND or UNAUTHORIZED
  // Step 3: Insert into photos table with eventId, userId, storagePath
  // Step 4: Return the new record

// --------------------------------------------------------------------------------------
  
    uploadPhoto: protectedProcedure.input(
        z.object({
            eventId: z.number(),
            storagePath: z.string()
        })
    ).mutation(async({ctx, input}) => {

        const member = await ctx.db
            .select()
            .from(members)
            .where(eq(members.uuid, ctx.user.id))
            .limit(1)
        
        if(!member[0]) throw new TRPCError({code: "UNAUTHORIZED", message: "You are not logged in!"})

        const is_attended = await ctx.db
            .select()
            .from(history)
            .where(and(
                eq(history.member_id, member[0].ucf_id), 
                eq(history.event_id, input.eventId)
            ))
        
        if(!is_attended[0]) throw new TRPCError({code: "NOT_FOUND", message: "Not attended yet"})
        
        const insert_new_photo = await ctx.db
            .insert(photos)
            .values({
                eventId: input.eventId,
                userId: member[0].ucf_id,
                storagePath: input.storagePath
            }).returning();
                
        return insert_new_photo;
    }),

// ---------------------------------------------------------------------------------------

    // --- QUERY: getEventPhotos ---

    // Use protectedProcedure
    // Input: z.object with eventId (number)
    // Step 1: Verify the user attended this event (same check as above)
    // Step 2: Query all photos where eventId matches
        // Drizzle hint: db.select().from(photos).where(eq(photos.eventId, input.eventId))
    // Step 3: For each photo, generate a signed URL from Supabase Storage
        // Supabase hint: supabase.storage.from("event-photos").createSignedUrl(storagePath, expiresInSeconds)
    // Step 4: Return photos with their signed URLs attache

// ---------------------------------------------------------------------------------------

    getEventPhotos: protectedProcedure.input(
        z.object({
            eventId: z.number()
        })
    ).query(async ({ctx, input}) => {

        const member = await ctx.db
            .select()
            .from(members)
            .where(eq(members.uuid, ctx.user.id))
            .limit(1)
        
        if(!member[0]) throw new TRPCError({code: "UNAUTHORIZED"})

        const is_attended = await ctx.db
            .select()
            .from(history)
            .where(and(
                eq(history.member_id, member[0].ucf_id), 
                eq(history.event_id, input.eventId)
            ))
        
        if(!is_attended[0]) throw new TRPCError({code: "NOT_FOUND"})

        const photo_list = await ctx.db
            .select()
            .from(photos)
            .where(eq(photos.eventId, input.eventId))
        
        const photos_with_urls = await Promise.all(
            photo_list.map(async (photo) => {
                const { data, error } = await supabaseAdmin.storage
                    .from("events_images")
                    .createSignedUrl(photo.storagePath, 3600,);

                return { ...photo, signedUrl: data?.signedUrl }
            })
        )

        return photos_with_urls;
        
    }),

// ----------------------------------------------------------------------------------

    // --- MUTATION: deletePhoto --- Prototype => Never Built
    // Use protectedProcedure
  // Input: z.object with photoId (string uuid)
  // Step 1: Fetch the photo record to get storagePath and userId
    // Drizzle hint: db.select().from(photos).where(eq(photos.id, input.photoId))
  // Step 2: Verify the requesting user owns this photo (userId must match)
  // Step 3: Delete from Supabase Storage first
    // Supabase hint: supabase.storage.from("event-photos").remove([storagePath])
  // Step 4: Delete the DB row
    // Drizzle hint: db.delete(photos).where(eq(photos.id, input.photoId))
  // Step 5: Return success confirmation

// -----------------------------------------------------------------------------------

    /*deletePhoto: protectedProcedure.input(
        z.object({
            photoId: z.string()
        })
    ).mutation(async ({ ctx, input }) => {

        const fetch_photo = await ctx.db
            .select()
            .from(photos)
            .where(eq(photos.id, input.photoId));
        
    }),*/

// ----------------------------------------------------------------------------

    // downloadPhotos: protectedProcedure -> Prototype

})