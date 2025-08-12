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

import type { BatchGetCatalogObjectsRequest, CreateImagesRequest, DeleteObjectRequest, GetObjectRequest, ListCatalogRequest, UpdateImagesRequest, UpsertCatalogObjectRequest } from "node_modules/square/api/resources/catalog";

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
        z.custom<BatchGetCatalogObjectsRequest>(),
    ).mutation(async ({ input }) => {
        const response =  await squareClient.catalog.batchGet(input);

        if (response.errors && response.errors?.length > 0) {
            throw Error(response.errors.reduce((acc, val) => 
                acc + val.detail + "\n"
            , ""))
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
        const response = await squareClient.catalog.object.delete(input);

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
            } else if ("imageIds" in (obj)) {
                // generic safety net for any other types that might expose imageIds
                imageIds = obj.imageIds as string[] ?? [];
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
batchGetImages: publicProcedure
  .input(
    z.object({
      objectIds: z.array(z.string()).min(1),
      includeRelatedObjects: z.boolean().optional(),
    })
  )
  .query(async ({ input }) => {
    const { objectIds } = input;

    // 1) Fetch all requested objects
    const resp = await squareClient.catalog.batchGet({
      objectIds,
      includeRelatedObjects: false,
    });
    const objects = resp.objects ?? [];
    if (objects.length === 0) {
      return objectIds.map(objectId => ({ objectId, url: null }));
    }

    // Build a quick lookup so we can preserve the input order
    const objById = new Map(objects.map(o => [o.id, o]));

    // 2) For each objectId in input order, get the first imageId
    const firstImageIdByObjectId = new Map<string, string | null>();
    const imageIds: string[] = [];

    for (const id of objectIds) {
      const obj = objById.get(id);
      if (!obj) {
        firstImageIdByObjectId.set(id, null);
        continue;
      }

      const type = obj.type;
      let firstImageId: string | undefined;
      let relatedObjectId: string | undefined;

      if (type === "ITEM") {
        firstImageId = obj.itemData?.imageIds?.[0];
      } else if (type === "ITEM_VARIATION") {
        firstImageId = obj.itemVariationData?.imageIds?.[0];
      } else if (type === "CATEGORY") {
        firstImageId = obj.categoryData?.imageIds?.[0];
      } else if ("imageIds" in (obj as any)) {
        firstImageId = (obj as any).imageIds?.[0];
      }

      relatedObjectId = obj.id; // ✅ fixed from `relatedObjectId:` to assignment

      firstImageIdByObjectId.set(id, firstImageId ?? null);
      if (firstImageId) {
        imageIds.push(firstImageId);
      }
    }

    if (imageIds.length === 0) {
      return objectIds.map(objectId => ({ objectId, url: null }));
    }

    // 3) Resolve unique image IDs to URLs
    const uniqueImageIds = [...new Set(imageIds)];
    const imgBatch = await squareClient.catalog.batchGet({
      objectIds: uniqueImageIds,
      includeRelatedObjects: false,
    });

    const urlByImageId = new Map<string, string>();
    for (const o of imgBatch.objects ?? []) {
      if (o.type === "IMAGE" && o.id && o.imageData?.url) {
        urlByImageId.set(o.id, o.imageData.url);
      }
    }

    // 4) Return array in the same order as input
    return objectIds.map(objectId => {
      const imgId = firstImageIdByObjectId.get(objectId);
      const url = imgId ? urlByImageId.get(imgId) ?? null : null;
      return { objectId, url };
    });
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