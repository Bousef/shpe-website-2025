import { NextResponse } from "next/server"
import { db } from "~/server/db"
import { photos } from "~/server/db/schema"
import { events } from "~/server/db/schema"
import { supabaseAdmin } from "~/supabase-admin"
import { gt, lt, eq, asc, inArray } from "drizzle-orm"


export async function GET(request: Request) {

    // Verify CRON_SECRET header
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    // Find next upcoming event
    const next_event = await db
        .select()
        .from(events)
        .where(gt(events.start_time, new Date()))
        .orderBy(asc(events.start_time))
        .limit(1)

    // Cutoff = 24hrs before next event's start_time
    if (!next_event[0]?.start_time) {
        return NextResponse.json({ message: "No upcoming events found" }, { status: 200 })
    }

    const cutoff = new Date(next_event[0].start_time.getTime() - 24 * 60 * 60 * 1000)

    // Query expired photos via join
    const expired_photos = await db.select().from(photos)
        .innerJoin(events, eq(photos.eventId, events.id))
        .where(lt(events.end_time, cutoff))

    // In case no one took dang pictures, let's not trigger cleaning process
    if (expired_photos.length === 0) {
        return NextResponse.json({ message: "No expired photos to clean up" }, { status: 200 })
    }

    // Extract storagePaths
        const paths = expired_photos.map(p => p.photos.storagePath)

    // Delete from Storage
        await supabaseAdmin.storage.from("events_images").remove(paths)

    // Delete from DB
        const expiredIds = expired_photos.map(p => p.photos.id)
        await db.delete(photos).where(inArray(photos.id, expiredIds))

    return NextResponse.json({ message: "All pictures deleted and storage empty"}, { status: 200})
}
