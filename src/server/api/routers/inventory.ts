import { squareClient } from "../../../lib/square/client";
import { object, z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import type {
    BatchChangeInventoryRequest,
    BatchGetInventoryCountsRequest,
    GetInventoryRequest
} from "node_modules/square/api";

export const inventoryRouter = createTRPCRouter({

    batchRetrieveInventoryCounts: publicProcedure
        .input(
            z.object({
                body: z.custom<BatchGetInventoryCountsRequest>(),
            })
        )
        .query(async ({ input }) => {
            return await squareClient.inventory.batchGetCounts(input.body);
        }),

    retrieveInventoryCount: publicProcedure
        .input(
            z.object({
                body: z.custom<GetInventoryRequest>(),
            })
        )
        .query(async ({ input }) => {
            return await squareClient.inventory.get(input.body);
        }),

    batchChangeInventory: publicProcedure
        .input(
            z.object({
                body: z.custom<BatchChangeInventoryRequest>(),
            })
        )
        .mutation(async ({ input }) => {
            // Calls POST /v2/inventory/counts/batch-change
            return await squareClient.inventory.batchCreateChanges(input.body);
        })
});