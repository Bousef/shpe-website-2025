import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { cartRouter } from "./cart";
import { members } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "node_modules/@trpc/server/dist/unstable-core-do-not-import/error/TRPCError";

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

  // Mutation to update member's profile information
  updateCurrentMember: protectedProcedure
  .input(
    z.object({
      field: z.enum(["first_name", "last_name", "position", "email", "ucf_id"]),
      value: z.string().min(1, "Value cannot be empty"),
    })
  )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      // Update the specified field for the current user
      const allowedFields: Record<string, string> = {
        first_name: "first_name",
        last_name: "last_name",
        position: "position",
        email: "email",
        ucf_id: "ucf_id",
      }

      const column = allowedFields[input.field];
      
      if (!column) {
        throw new TRPCError({ 
          code: "BAD_REQUEST", 
          message: "Invalid field" 
        });
      }

      try {
        await ctx.db
          .update(members)
          .set({ [column]: input.value })
          .where(eq(members.uuid, userId));
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update profile",
        });
      }

      return { success: true };
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
