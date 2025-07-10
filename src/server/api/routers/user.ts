import { createTRPCRouter, protectedProcedure } from "../trpc";
import { cartRouter } from "./cart";
import { members } from "~/server/db/schema";
import { eq } from "drizzle-orm";

/// Represents the currently signed-in user.
export const userRouter = createTRPCRouter({
  cart: cartRouter,

  getCurrentMember: protectedProcedure.query(async ({ ctx }) => {
    const member = await ctx.db
        .select()
        .from(members)
        .where(eq(members.uuid, ctx.user.id));


    return member[0];
  }),
});