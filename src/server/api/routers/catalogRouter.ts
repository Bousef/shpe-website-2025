import { legacyClient } from "~/lib/square/client";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const catalogRouter = createTRPCRouter({
    listCatalog: publicProcedure.input(
        z.object({
            cursor: z.string().optional(),
            types: z.string().optional(),
            catalogVersion: z.bigint().optional(),
        })
    ).query(async ({ input }) => {
        return await legacyClient.catalogApi.listCatalog(input.cursor, input.types, input.catalogVersion);
    }),
});