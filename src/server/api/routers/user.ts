import { createTRPCRouter, publicProcedure } from "../trpc";
import { cartRouter } from "./cart";
import { members } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { squareClient } from "~/lib/square/client";
import { z } from "zod";
import type { Currency } from "node_modules/square/api";

/// Represents the currently signed-in user.
export const userRouter = createTRPCRouter({
  cart: cartRouter,
  
  retrieveCurrentOrder: publicProcedure
        .query(async({ctx}) => {
          if (!ctx.supabase) return null;

          const { data: { user } } = await ctx.supabase.auth.getUser();

          if (!user) return null;

          const member = await ctx.db
            .select()
            .from(members)
            .where(eq(members.uuid, user.id));

          const currentMember =  member[0] ?? null;

          if (!currentMember?.square_customer_id) return null;
          
          console.log("currentMember: ", currentMember);

          const currentOrder = await squareClient.orders.search({
            locationIds: [process.env.SQUARE_SANDBOX_LOCATION_ID!], 
            query:{
              filter:{
                stateFilter:{
                  states: ["DRAFT"] // Only get draft orders for cart/checkout
                },
                customerFilter:{
                  customerIds: [currentMember?.square_customer_id]
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

          // Return null if no orders found (this is normal when cart is empty)
          if (!currentOrder.orders || currentOrder.orders.length === 0) {
              return null;
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

  addToCart: publicProcedure
    .input(z.object({
      catalogObjectId: z.string(),
      quantity: z.string(),
      basePriceMoney: z.object({
        amount: z.bigint(),
        currency: z.enum(["USD", "CAD", "EUR", "GBP", "JPY", "AUD"]).default("USD"),
      }),
      selectedSize: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.supabase) throw new Error("Authentication required");

      const { data: { user } } = await ctx.supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const member = await ctx.db
        .select()
        .from(members)
        .where(eq(members.uuid, user.id));

      const currentMember = member[0] ?? null;
      if (!currentMember?.square_customer_id) {
        throw new Error("Customer ID not found");
      }

      const locationId = process.env.SQUARE_SANDBOX_LOCATION_ID!;

      // Check for existing draft order
      const existingOrderResponse = await squareClient.orders.search({
        locationIds: [locationId],
        query: {
          filter: {
            stateFilter: {
              states: ["DRAFT"] // Only look for draft orders for cart functionality
            },
            customerFilter: {
              customerIds: [currentMember.square_customer_id]
            }
          },
          sort: {
            sortField: "CREATED_AT",
            sortOrder: "DESC"
          }
        },
        limit: 1
      });

      if (existingOrderResponse.errors && existingOrderResponse.errors.length > 0) {
        throw new Error(existingOrderResponse.errors.reduce((acc, val) => acc + val.detail + "\n", ""));
      }

      const existingOrder = existingOrderResponse.orders?.[0];

      if (existingOrder && existingOrder.id) {
        // Update existing order
        const existingLineItems = existingOrder.lineItems || [];
        
        // Check if item already exists in cart
        const existingItemIndex = existingLineItems.findIndex(
          item => item.catalogObjectId === input.catalogObjectId
        );

        let updatedLineItems;
        if (existingItemIndex >= 0) {
          // Item exists, update quantity
          updatedLineItems = [...existingLineItems];
          const existingItem = updatedLineItems[existingItemIndex]!;
          const newQuantity = parseInt(existingItem.quantity || "0") + parseInt(input.quantity);
          updatedLineItems[existingItemIndex] = {
            ...existingItem,
            quantity: newQuantity.toString(),
          };
        } else {
          // Item doesn't exist, add new line item
          updatedLineItems = [
            ...existingLineItems,
            {
              catalogObjectId: input.catalogObjectId,
              quantity: input.quantity,
              basePriceMoney: {
                amount: input.basePriceMoney.amount,
                currency: input.basePriceMoney.currency as Currency,
              },
            }
          ];
        }

        const updateResponse = await squareClient.orders.update({
          orderId: existingOrder.id,
          order: {
            ...existingOrder,
            lineItems: updatedLineItems,
          },
        });

        if (updateResponse.errors && updateResponse.errors.length > 0) {
          throw new Error(updateResponse.errors.reduce((acc, val) => acc + val.detail + "\n", ""));
        }

        return updateResponse.order;
      } else {
        // Create new draft order
        const createResponse = await squareClient.orders.create({
          idempotencyKey: crypto.randomUUID(),
          order: {
            locationId,
            customerId: currentMember.square_customer_id,
            state: "DRAFT",
            lineItems: [
              {
                catalogObjectId: input.catalogObjectId,
                quantity: input.quantity,
                basePriceMoney: {
                  amount: input.basePriceMoney.amount,
                  currency: input.basePriceMoney.currency as Currency,
                },
              }
            ],
          },
        });

        if (createResponse.errors && createResponse.errors.length > 0) {
          throw new Error(createResponse.errors.reduce((acc, val) => acc + val.detail + "\n", ""));
        }

        return createResponse.order;
      }
    }),



});
