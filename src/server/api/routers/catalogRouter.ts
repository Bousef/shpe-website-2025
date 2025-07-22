import { legacyClient } from "~/lib/square/client";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { FileWrapper, type CreateCatalogImageRequest, type UpdateCatalogImageRequest } from "square/legacy";

export const catalogRouter = createTRPCRouter({
    createCatalogImage: publicProcedure.input(
        z.object({
            request: z.custom<CreateCatalogImageRequest>().optional(),
            imageFile: z.instanceof(FileWrapper).optional(),
        })
    ).query(async ({ input }) => {
        return await legacyClient.catalogApi.createCatalogImage(input.request, input.imageFile);
    }),

    updateCatalogImage: publicProcedure.input(
        z.object({
            imageId: z.string(),
            request: z.custom<UpdateCatalogImageRequest>().optional(),
            imageFile: z.instanceof(FileWrapper).optional(),
        })
    ).query(async ({ input }) => {
        return await legacyClient.catalogApi.updateCatalogImage(input.imageId, input.request, input.imageFile);
    }),

    catalogInfo: publicProcedure.query(async () => {
        return await legacyClient.catalogApi.catalogInfo();
    }),
    
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