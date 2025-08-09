import { squareClient } from "~/lib/square/client";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { object, z } from "zod";
import {
    type SearchCatalogObjectsRequest,
    type BatchUpsertCatalogObjectsRequest,
    type SearchCatalogItemsRequest,
    type UpdateItemModifierListsRequest,
    type UpdateItemTaxesRequest,
    type BatchDeleteCatalogObjectsRequest,
} from "node_modules/square/api";

import type { CreateImagesRequest, UpsertCatalogObjectRequest } from "node_modules/square/api/resources/catalog";


export const catalogRouter = createTRPCRouter({
    batchDeleteCatalogObjects: publicProcedure.input(
        z.object({
            body: z.custom<BatchDeleteCatalogObjectsRequest>(),
        })
    ).query(async ({ input }) => {
        return await squareClient.catalog.batchDelete(input.body);
    }),

    batchRetrieveCatalogObjects: publicProcedure.input(
        z.object({
            body: z.custom<BatchDeleteCatalogObjectsRequest>(),
        })
    ).query(async ({ input }) => {
        return await squareClient.catalog.batchGet(input.body);
    }),

    batchUpsertCatalogObjects: publicProcedure.input(
        z.object({
            body: z.custom<BatchUpsertCatalogObjectsRequest>(),
        })
    ).query(async ({ input }) => {
        return await squareClient.catalog.batchUpsert(input.body);
    }),

    createCatalogImage: publicProcedure
        .input(
            z.object({
                body: z.custom<CreateImagesRequest>(),
                requestOptions: z.record(z.string(), z.any()).optional()
            })
        )
        .mutation(async ({ input }) => {

            return await squareClient.catalog.images.create(input.body);
        }),

    //  About to jump off a cliff, who 's with me?
    //Meee, siuuuu
    // Siuuuuu
    //Fixed...I believed 
    // I believe!
    // I ... believe
    // siuuuuuuuu

    updateCatalogImage: publicProcedure.input(
        z.object({
            imageId: z.string(),
            idempotencyKey: z.string(),
            imageFile: z.instanceof(File),
        })
    ).mutation(async ({ input }) => {
        return await squareClient.catalog.images.update({
            imageId: input.imageId,
            request: {
                idempotencyKey: input.idempotencyKey,
            },
            imageFile: input.imageFile,
        });
    }),

    catalogInfo: publicProcedure.query(async () => {
        const response = await squareClient.catalog.info();
        return response;
    }),

    listCatalog: publicProcedure.input(
        z.object({
            types: z.string().optional(),
            cursor: z.string().optional(),
            catalogVersion: z.number().optional(),
        })
    ).query(async ({ input }) => {
        const response = await squareClient.catalog.list({
            types: input.types,
            cursor: input.cursor,
            catalogVersion: input.catalogVersion !== undefined
                ? BigInt(input.catalogVersion)
                : undefined,
        });
        return response;
    }),

    upsertCatalogObject: publicProcedure.input(
        z.object({
            body: z.custom<UpsertCatalogObjectRequest>(),
            requestOptions: z.record(z.string(), z.any()).optional(),
        })
    ).mutation(async ({ input }) => {
        return await squareClient.catalog.object.upsert(input.body, input.requestOptions);
    }),

    deleteCatalogObject: publicProcedure.input(
        z.object({ objectId: z.string() })
    ).mutation(async ({ input }) => {
        return await squareClient.catalog.object.delete({ objectId: input.objectId });
    }),

    RetrieveCatalogObject: publicProcedure.input(
        z.object({
            objectId: z.string(),
            includeRelatedObjects: z.boolean().optional(),
            catalogVersion: z.bigint().optional(),
            includeCaegoryPathToRoot: z.boolean().optional(),
        })
    ).query(async ({ input }) => {
        return await squareClient.catalog.object.get({
            objectId: input.objectId,
            includeRelatedObjects: input.includeRelatedObjects,
            catalogVersion: input.catalogVersion,
            includeCategoryPathToRoot: input.includeCaegoryPathToRoot,
        });
    }),

    getImages: publicProcedure
        .input(
            z.object({
                objectId: z.string(),
                includeRelatedObjects: z.boolean().optional(), // doesn’t change our logic, but allowed
            })
        )
        .query(async ({ input }) => {
            // 1) Get the object (we don’t actually need related objects for this)
            const resp = await squareClient.catalog.object.get({
                objectId: input.objectId,
                includeRelatedObjects: false,
            });

            const obj = resp.object;
            if (!obj) return []; // per your rule #3

            // 2) Pull imageIds from the object itself (no traversal)
            const type = obj.type;
            let imageIds: string[] = [];

            // The new SDK uses camelCase data keys (itemData, imageIds, etc.)
            if (type === "ITEM") {
                imageIds = obj.itemData?.imageIds ?? [];
            } else if (type === "ITEM_VARIATION") {
                imageIds = obj.itemVariationData?.imageIds ?? [];
            } else if (type === "CATEGORY") {
                imageIds = obj.categoryData?.imageIds ?? [];
            } else if ("imageIds" in (obj as any)) {
                // generic safety net for any other types that might expose imageIds
                imageIds = (obj as any).imageIds ?? [];
            }

            if (imageIds.length === 0) return []; // per your rule #3

            // 3) Resolve those IDs to CatalogImage objects, then map to URLs
            const batch = await squareClient.catalog.batchGet({
                objectIds: imageIds,
                includeRelatedObjects: false,
            });

            const imageObjects = batch.objects ?? [];
            const urls = imageObjects
                .filter(o => o.type === "IMAGE")
                .map(o => o.imageData?.url)
                .filter((u): u is string => Boolean(u));

            // 4) Return URLs (don’t throw on empty)
            return urls;
        }),

    searchCatalogObjects: publicProcedure.input(
        z.object({
            body: z.custom<SearchCatalogObjectsRequest>(),
            requestOptions: z.record(z.string(), z.any()).optional(),
        })
    ).query(async ({ input }) => {
        return await squareClient.catalog.search(input.body, input.requestOptions);
    }),

    //-- This endpoint is used to search for catalog items.
    searchCatalogItems: publicProcedure.input(
        z.object({
            body: z.custom<SearchCatalogItemsRequest>(),
        })
    ).query(async ({ input }) => {
        return await squareClient.catalog.searchItems(input.body);
    }),

    //-- This endpoint is used to update item modifier lists in the catalog.
    updateItemModifierLists: publicProcedure.input(
        z.object({
            body: z.custom<UpdateItemModifierListsRequest>(),
        })
    ).query(async ({ input }) => {
        return await squareClient.catalog.updateItemModifierLists(input.body);
    }
    ),

    //-- This endpoint is used to update item modifier lists in the catalog.
    updateItemTaxes: publicProcedure.input(
        z.object({
            body: z.custom<UpdateItemTaxesRequest>(),
        })
    ).query(async ({ input }) => {
        return await squareClient.catalog.updateItemTaxes(input.body);
    }),


});