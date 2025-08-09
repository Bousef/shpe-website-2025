import { squareClient } from "~/lib/square/client";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import {
    type SearchCatalogObjectsRequest,
    type BatchUpsertCatalogObjectsRequest,
    type SearchCatalogItemsRequest,
    type UpdateItemModifierListsRequest,
    type UpdateItemTaxesRequest,
    type BatchDeleteCatalogObjectsRequest,
} from "node_modules/square/api";

import type { CreateImagesRequest, DeleteObjectRequest, GetObjectRequest, ListCatalogRequest, UpdateImagesRequest, UpsertCatalogObjectRequest } from "node_modules/square/api/resources/catalog";

export const catalogRouter = createTRPCRouter({
    batchDeleteCatalogObjects: publicProcedure.input(
        z.custom<BatchDeleteCatalogObjectsRequest>(),
    ).mutation(async ({ input }) => {
        const response = await squareClient.catalog.batchDelete(input);

        if (response.errors && response.errors?.length > 0) {
            throw Error(response.errors.reduce((acc, val) => 
                acc + val.detail + "\n"
            , ""))
        }

        if (response.deletedObjectIds === undefined) {
            throw Error("batchDeleteCatalogObjects returned undefined deleted object IDs. This should not happen.");
        }

        if (response.deletedAt === undefined) {
            throw Error("batchDeleteCatalogObjects returned undefined deleted at variable. This should not happen.");
        }

        // reconstruct to remove errors variable from object
        return {
            deletedObjectIds: response.deletedObjectIds, 
            deletedAt: response.deletedAt,
        };
    }),

    batchRetrieveCatalogObjects: publicProcedure.input(
        z.custom<BatchDeleteCatalogObjectsRequest>(),
    ).mutation(async ({ input }) => {
        const response =  await squareClient.catalog.batchGet(input);

        if (response.errors && response.errors?.length > 0) {
            throw Error(response.errors.reduce((acc, val) => 
                acc + val.detail + "\n"
            , ""))
        }

        if (response.objects === undefined) {
            throw Error("batchRetrieveCatalogObjects returned undefined objects. This should not happen.");
        }

        if (response.relatedObjects === undefined) {
            throw Error("batchRetrieveCatalogObjects returned undefined related objects. This should not happen.");
        }

        // reconstruct to remove errors variable from object
        return {
            objects: response.objects, 
            relatedObjects: response.relatedObjects,
        };
    }),

    batchUpsertCatalogObjects: publicProcedure.input(
        z.custom<BatchUpsertCatalogObjectsRequest>(),
    ).mutation(async ({ input }) => {
        const response = await squareClient.catalog.batchUpsert(input);

        if (response.errors && response.errors?.length > 0) {
            throw Error(response.errors.reduce((acc, val) => 
                acc + val.detail + "\n"
            , ""))
        }

        if (response.objects === undefined) {
            throw Error("batchUpsertCatalogObjects returned undefined objects. This should not happen.");
        }

        if (response.idMappings === undefined) {
            throw Error("batchUpsertCatalogObjects returned undefined id mappings. This should not happen.");
        }

        if (response.updatedAt === undefined) {
            throw Error("batchUpsertCatalogObjects returned undefined updated at variable. This should not happen.");
        }

        // reconstruct to remove errors variable from object
        return {
            objects: response.objects, 
            idMappings: response.idMappings,
            updatedAt: response.updatedAt,
        };
    }),

    createCatalogImage: publicProcedure
        .input(
            z.custom<CreateImagesRequest>(),
        ).mutation(async ({ input }) => {
        const response = await squareClient.catalog.images.create(input);

        if (response.errors && response.errors?.length > 0) {
            throw Error(response.errors.reduce((acc, val) => 
                acc + val.detail + "\n"
            , ""))
        }

        if (response.image === undefined) {
            throw Error("createCatalogImage returned undefined image. This should not happen.");
        }

        return response.image;
    }),

    //  About to jump off a cliff, who 's with me?
    //Meee, siuuuu
    // Siuuuuu
    //Fixed...I believed 
    // I believe!
    // I ... believe
    // siuuuuuuuu
    
    updateCatalogImage: publicProcedure.input(
        z.custom<UpdateImagesRequest>()
    ).mutation(async ({ input }) => {
        const response = await squareClient.catalog.images.update(input);

        if (response.errors && response.errors?.length > 0) {
            throw Error(response.errors.reduce((acc, val) => 
                acc + val.detail + "\n"
            , ""))
        }

        if (response.image === undefined) {
            throw Error("createCatalogImage returned undefined image. This should not happen.");
        }

        return response.image;
    }),

    catalogInfo: publicProcedure.query(async () => {
        const response = await squareClient.catalog.info();

        if (response.errors && response.errors?.length > 0) {
            throw Error(response.errors.reduce((acc, val) => 
                acc + val.detail + "\n"
            , ""))
        }

        if (response.limits === undefined) {
            throw Error("catalogInfo returned undefined limits. This should not happen.");
        }

        if (response.standardUnitDescriptionGroup === undefined) {
            throw Error("catalogInfo returned undefined standard unit description group. This should not happen.");
        }

        // reconstruct to remove errors variable from object
        return {
            limits: response.limits,
            standardUnitDescriptionGroup: response.standardUnitDescriptionGroup,
        };
    }),

    listCatalog: publicProcedure.input(
        z.custom<ListCatalogRequest>().optional()
    ).query(async ({ input }) => {
            console.log('🔍 Debug Info:');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Has SQUARE_SANDBOX_ACCESS_TOKEN:', process.env.SQUARE_SANDBOX_ACCESS_TOKEN);
    console.log('Token length:', process.env.SQUARE_SANDBOX_ACCESS_TOKEN?.length);
    console.log('Token starts with:', process.env.SQUARE_SANDBOX_ACCESS_TOKEN?.substring(0, 10) + '...');
    console.log('Input:', input);

        const response = await squareClient.catalog.list(input);

        return response;
    }),

    upsertCatalogObject: publicProcedure.input(
        z.custom<UpsertCatalogObjectRequest>()
    ).mutation(async ({ input }) => {
        const response = await squareClient.catalog.object.upsert(input);

        if (response.errors && response.errors?.length > 0) {
            throw Error(response.errors.reduce((acc, val) => 
                acc + val.detail + "\n"
            , ""))
        }

        if (response.catalogObject === undefined) {
            throw Error("upsertCatalogObject returned undefined catalog object. This should not happen.");
        }

        if (response.idMappings === undefined) {
            throw Error("upsertCatalogObject returned undefined id mappings. This should not happen.");
        }

        // reconstruct to remove errors variable from object
        return {
            catalogObject: response.catalogObject,
            idMappings: response.idMappings,
        };
    }),

    deleteCatalogObject: publicProcedure.input(
        z.custom<DeleteObjectRequest>()
    ).mutation(async ({ input }) => {
        const response = await squareClient.catalog.object.delete({objectId: input.objectId});

        if (response.errors && response.errors?.length > 0) {
            throw Error(response.errors.reduce((acc, val) => 
                acc + val.detail + "\n"
            , ""))
        }

        if (response.deletedAt === undefined) {
            throw Error("deleteCatalogObject returned undefined deleted at. This should not happen.");
        }

        if (response.deletedObjectIds === undefined) {
            throw Error("deleteCatalogObject returned undefined deleted object ids. This should not happen.");
        }

        // reconstruct to remove errors variable from object
        return {
            deletedAt: response.deletedAt,
            deletedObjectIds: response.deletedObjectIds,
        };
    }),

    RetrieveCatalogObject: publicProcedure.input(
       z.custom<GetObjectRequest>()
    ).query(async ({ input }) => {
        const response = await squareClient.catalog.object.get(input);

        if (response.errors && response.errors?.length > 0) {
            throw Error(response.errors.reduce((acc, val) => 
                acc + val.detail + "\n"
            , ""))
        }

        if (response.object === undefined) {
            throw Error("RetrieveCatalogObject returned undefined deleted at. This should not happen.");
        }

        if (response.relatedObjects === undefined) {
            throw Error("RetrieveCatalogObject returned undefined deleted object ids. This should not happen.");
        }

        // reconstruct to remove errors variable from object
        return {
            object: response.object,
            relatedObjects: response.relatedObjects,
        };
    }),

    searchCatalogObjects: publicProcedure.input(
        z.custom<SearchCatalogObjectsRequest>()
    ).mutation(async ({ input }) => {
        const response = await squareClient.catalog.search(input);

        if (response.errors && response.errors?.length > 0) {
            throw Error(response.errors.reduce((acc, val) => 
                acc + val.detail + "\n"
            , ""))
        }

        if (response.cursor === undefined) {
            throw Error("searchCatalogObjects returned undefined cursor. This should not happen.");
        }

        if (response.latestTime === undefined) {
            throw Error("searchCatalogObjects returned undefined latest time. This should not happen.");
        }

        if (response.objects === undefined) {
            throw Error("searchCatalogObjects returned undefined objects. This should not happen.");
        }

        if (response.relatedObjects === undefined) {
            throw Error("searchCatalogObjects returned undefined related objects. This should not happen.");
        }

        // reconstruct to remove errors variable from object
        return {
            cursor: response.cursor,
            latestTime: response.latestTime,
            objects: response.objects,
            relatedObjects: response.relatedObjects,
        };
    }),

    //-- This endpoint is used to search for catalog items.
    searchCatalogItems: publicProcedure.input(
        z.custom<SearchCatalogItemsRequest>(),
    ).mutation(async ({ input }) => {
        const response = await squareClient.catalog.searchItems(input);

        if (response.errors && response.errors?.length > 0) {
            throw Error(response.errors.reduce((acc, val) => 
                acc + val.detail + "\n"
            , ""))
        }

        if (response.cursor === undefined) {
            throw Error("searchCatalogItems returned undefined cursor. This should not happen.");
        }

        if (response.items === undefined) {
            throw Error("searchCatalogItems returned undefined items. This should not happen.");
        }

        if (response.matchedVariationIds === undefined) {
            throw Error("searchCatalogItems returned undefined matched variation ids. This should not happen.");
        }
        // reconstruct to remove errors variable from object
        return {
            cursor: response.cursor,
            items: response.items,
            matchedVariationIds: response.matchedVariationIds,
        };
    }),

    //-- This endpoint is used to update item modifier lists in the catalog.
    updateItemModifierLists: publicProcedure.input(
        z.custom<UpdateItemModifierListsRequest>(),
    ).mutation(async ({ input }) => {
        const response = await squareClient.catalog.updateItemModifierLists(input);

        if (response.errors && response.errors?.length > 0) {
            throw Error(response.errors.reduce((acc, val) => 
                acc + val.detail + "\n"
            , ""))
        }

        if (response.updatedAt === undefined) {
            throw Error("updateItemModifierLists returned undefined updated at. This should not happen.");
        }

        return response.updatedAt;
    }
    ),

    //-- This endpoint is used to update item modifier lists in the catalog.
    updateItemTaxes: publicProcedure.input(
        z.custom<UpdateItemTaxesRequest>(),
    ).mutation(async ({ input }) => {
        const response = await squareClient.catalog.updateItemTaxes(input);

        if (response.errors && response.errors?.length > 0) {
            throw Error(response.errors.reduce((acc, val) => 
                acc + val.detail + "\n"
            , ""))
        }

        if (response.updatedAt === undefined) {
            throw Error("updateItemTaxes returned undefined updated at. This should not happen.");
        }

        return response.updatedAt;
    }),
});