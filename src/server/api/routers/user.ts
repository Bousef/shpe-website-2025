import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { cartRouter } from "./cart";
import { members } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { squareClient } from "~/lib/square/client";

/// Represents the currently signed-in user.
export const userRouter = createTRPCRouter({
  cart: cartRouter,
  
  retrieveCurrentOrder: publicProcedure

        .query(async({ctx}) => {
          if (!ctx.supabase) return null;

          const { data: { user } } = await ctx.supabase.auth.getUser();

          console.log("working?");

          if (!user) return null;
          
          const member = await ctx.db
          .select()
          .from(members)
          .where(eq(members.uuid, user.id));

          console.log("working 2?");

          const currentMember =  member[0] ?? null;
          
          console.log("currentMember: ", currentMember);

          const currentOrder = await squareClient.orders.search({
            locationIds: [process.env.SQUARE_LOCATION_ID!], 
            query:{
              filter:{
                stateFilter:{
                  states: ["OPEN" , "DRAFT"]
                },
                customerFilter:{
                  customerIds: [currentMember?.square_customer_id!]
                }
              },
              sort:{
                sortField: "CREATED_AT",
                sortOrder: "DESC"
              }
            },
            limit: 1
          })
          console.log("working 3?");
          if (currentOrder.errors && currentOrder.errors.length > 0) {
              throw Error(currentOrder.errors.reduce((acc, val) => acc + val.detail + "\n", ""));
          }

          if (currentOrder.orders === undefined) {
              throw Error("retrieveCurrentOrder returned an undefined orders.");
          }

          return currentOrder.orders[0] ?? null;
        }),

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
