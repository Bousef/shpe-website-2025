import { inventoryApi } from "../../../lib/square/client";
import { object, z } from "zod";
import { type BatchRetrieveInventoryCountsRequest } from "square/legacy";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const inventoryRouter = createTRPCRouter({

    retrieveInventoryCount: publicProcedure
        .input(
            z.object({ objectId: z.string() })
        ).query(async ({ input }) => {
            return await inventoryApi.retrieveInventoryCount(input.objectId);
        }),

    batchRetrieveInventoryCounts: publicProcedure
        .input(
            z.object({
                 body: z.custom<BatchRetrieveInventoryCountsRequest>(),
            })
        )
        .query(async ({ input }) => {
            // Calls POST /v2/inventory/counts/batch-retrieve
            return await inventoryApi.batchRetrieveInventoryCounts(input.body);
        }),
        
});