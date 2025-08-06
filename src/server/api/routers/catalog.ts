import { legacyClient } from "~/lib/square/client";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { object, z } from "zod";
import { FileWrapper,
     type SearchCatalogObjectsRequest, 
     type BatchDeleteCatalogObjectsRequest, 
     type BatchRetrieveCatalogObjectsRequest, 
     type BatchUpsertCatalogObjectsRequest, 
     type CreateCatalogImageRequest, 
     type UpdateCatalogImageRequest, 
     type UpsertCatalogObjectRequest, 
     type SearchCatalogItemsRequest, 
     type UpdateItemModifierListsRequest, 
     type UpdateItemTaxesRequest } from "square/legacy";
import { catalogApi } from "../../../lib/square/client";
import { RetrieveJobResponse } from "node_modules/square/serialization";

export const catalogRouter = createTRPCRouter({
    batchDeleteCatalogObjects: publicProcedure.input(
        z.object({
            body: z.custom<BatchDeleteCatalogObjectsRequest>(),
        })
    ).query(async ({ input }) => {
        return await legacyClient.catalogApi.batchDeleteCatalogObjects(input.body);
    }),

    batchRetrieveCatalogObjects: publicProcedure.input(
        z.object({
            body: z.custom<BatchRetrieveCatalogObjectsRequest>(),
        })
    ).query(async ({ input }) => {
        return await legacyClient.catalogApi.batchRetrieveCatalogObjects(input.body);
    }),

    batchUpsertCatalogObjects: publicProcedure.input(
        z.object({
            body: z.custom<BatchUpsertCatalogObjectsRequest>(),
        })
    ).query(async ({ input }) => {
        return await legacyClient.catalogApi.batchUpsertCatalogObjects(input.body);
    }),

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


    upsertCatalogObject: publicProcedure.input(
        z.object({
            body: z.custom<UpsertCatalogObjectRequest>(),
            requestOptions: z.any().optional(),
        })
    ).mutation(async({input}) =>{
        return await legacyClient.catalogApi.upsertCatalogObject(input.body, input.requestOptions);
    }),

    deleteCatalogObject: publicProcedure.input(
        z.object({ objectId: z.string() })
    ).mutation(async ({ input }) => {
        return await legacyClient.catalogApi.deleteCatalogObject(input.objectId);
    }),

    RetrieveCatalogObject: publicProcedure.input(
        z.object({
            objectId: z.string(),   
            includeRelatedObjects: z.boolean().optional(),
            catalogVersion: z.bigint().optional(),
            includeCaegoryPathToRoot: z.boolean().optional(),
        })
    ).query(async ({ input }) => {
        return await catalogApi.retrieveCatalogObject(input.objectId, input.includeRelatedObjects, input.catalogVersion, input.includeCaegoryPathToRoot);
    }),

    searchCatalogObjects: publicProcedure.input(
        z.object({
            body: z.custom<SearchCatalogObjectsRequest>(),
            requestOptions: z.any().optional(),
        })
    ).query(async ({ input }) => {
        return await legacyClient.catalogApi.searchCatalogObjects(input.body, input.requestOptions);
    }),
    


    //-- This endpoint is used to search for catalog items.
    searchCatalogItems: publicProcedure.input(
        z.object({
            body: z.custom<SearchCatalogItemsRequest>(),
        })
    ).query(async ({ input }) => {
        return await legacyClient.catalogApi.searchCatalogItems(input.body);
    }),

    //-- This endpoint is used to update item modifier lists in the catalog.
    updateItemModifierLists: publicProcedure.input(
        z.object({
            body: z.custom<UpdateItemModifierListsRequest>(), 
        })
    ).query(async ({ input }) => {
        return await legacyClient.catalogApi.updateItemModifierLists(input.body);
    }
    ),

    //-- This endpoint is used to update item modifier lists in the catalog.
    updateItemTaxes: publicProcedure.input(
        z.object({
            body: z.custom<UpdateItemTaxesRequest>(),   
        })
    ).query(async ({ input }) => {
        return await legacyClient.catalogApi.updateItemTaxes(input.body);
    }),
 
     
});