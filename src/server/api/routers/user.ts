import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { cartRouter } from "./cart";
import { members } from "~/server/db/schema";
import { eq } from "drizzle-orm";

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

    return member[0] ?? null;
  }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    if (!ctx.supabase) return null;

    await ctx.supabase.auth.signOut();
    return { success: true };
  }),
});
