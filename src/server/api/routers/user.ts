import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { cartRouter } from "./cart";
import { members } from "~/server/db/schema";
import { eq } from "drizzle-orm";

// Define admin roles centrally - these are the positions that grant admin access
const ADMIN_ROLES = [
  "President",
  "Internal Vice President",
  "Corporate Vice President",
  "Secretary",
  "Marketing Vice President",
  "Treasurer",
  "Technology Chair",
  "DevTeam",
] as const;

/// Represents the currently signed-in user.
export const userRouter = createTRPCRouter({
  cart: cartRouter,

  getCurrentMember: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.supabase) return null;

    const {
      data: { user },
    } = await ctx.supabase.auth.getUser();

    if (!user) return null;

    const member = await ctx.db
      .select()
      .from(members)
      .where(eq(members.uuid, user.id));

    const m = member[0] ?? null;
    if (!m) return null;

    const isAdmin = ADMIN_ROLES.includes(m.position as typeof ADMIN_ROLES[number]);
    return { ...m, isAdmin };
  }),

  // Secure server-side role check - position is fetched from DB, not client
  getRole: protectedProcedure.query(async ({ ctx }) => {
    const member = await ctx.db
      .select({ position: members.position })
      .from(members)
      .where(eq(members.uuid, ctx.user.id));

    const position = member[0]?.position ?? "Member";
    const isAdmin = ADMIN_ROLES.includes(position as typeof ADMIN_ROLES[number]);

    return {
      isAdmin,
      // Only return boolean, don't expose the actual role to client
    };
  }),

  // Protected admin-only procedure wrapper for checking admin status
  verifyAdmin: protectedProcedure.query(async ({ ctx }) => {
    const member = await ctx.db
      .select({ position: members.position })
      .from(members)
      .where(eq(members.uuid, ctx.user.id));

    const position = member[0]?.position;
    
    if (!position || !ADMIN_ROLES.includes(position as typeof ADMIN_ROLES[number])) {
      return { authorized: false };
    }

    return { authorized: true };
  }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    if (!ctx.supabase) return null;

    await ctx.supabase.auth.signOut();
    return { success: true };
  }),
});
