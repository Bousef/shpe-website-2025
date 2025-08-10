"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Navbar from "../_components/NavBar";
import { api } from "~/trpc/react";
import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import CreateItemForm from "../_components/CreateItemForms";
import type { CatalogCategory } from "node_modules/square/api";

export default function InventoryManagement() {
  // 1. Toggle state for showing the "Add Item" form
  const [showAdd, setShowAdd] = useState(false);

  // 2. Query client for invalidating catalog queries after creation
  const queryClient = useQueryClient();

  // 3. Fetch all items from Square Catalog
  const { data: itemsRes, isLoading: itemsLoading } = api.square.catalog.listCatalog.useQuery({ types: "ITEM" });
  const rawItems = useMemo(() => itemsRes ?? [], [itemsRes]);

  // 4. Extract and filter image IDs
  const itemImageIds = useMemo(() => {
      return rawItems
        .map((item) => {
          if (!("itemData" in item) || !item.itemData) return "";

          return item.itemData.imageIds?.[0] ?? "";
        })
        .filter((id : string) => id)
  }, [rawItems]);

  // 5. Fetch all categories in one go
  const { data: categoriesRes } = api.square.catalog.listCatalog.useQuery({ types: "CATEGORY" });
  const rawCategories = useMemo(() => categoriesRes ?? [], [categoriesRes]);

  // 6. Build category lookup map
  const categoryLookup = useMemo(() => {
    return rawCategories.reduce<Record<string, string>>((map, obj ) => {
      const id = obj.id;
      const name = (obj as CatalogCategory).name ?? "";
      if (id) map[id] = name;
      return map;
    }, {});
  }, [rawCategories]);

  // 7. Conditionally fetch image objects if IDs are available
  const { mutate: batchRetrieveCatalogObjects, data } = api.square.catalog.batchRetrieveCatalogObjects.useMutation();

  useEffect(() => {
    if (!itemsLoading) {
         batchRetrieveCatalogObjects({
        objectIds: itemImageIds
      });
    }
   
  }, [batchRetrieveCatalogObjects, itemImageIds, itemsLoading]);

  const rawImages = useMemo(() => 
    data?.objects ?? [], 
    [data?.objects]
  );

  // 8. Combine item, image, category, and price data for table display
  const items = useMemo(
    () =>
      rawItems.map((item) => {
        if (!("itemData" in item)) {
          console.error(`Item data not found for ID: ${item.id}`);
          return null;
        }

        const id = item.id;
        const name = item.itemData?.name ?? "Unnamed Item";
        const description = item.itemData?.description ?? "";
        const categoryId = item.itemData?.categories?.[0]?.id ?? "";
        const category = categoryLookup[categoryId] ?? "";

        const imageId = item.itemData?.imageIds?.[0] ?? "";
        const imageObj = rawImages.find((rawImage) => rawImage.id === imageId);

        if (!imageObj) {
          console.log(`Image not found for ID: ${imageId}`);
          return null;
        }

        if (!("imageData" in imageObj)) {
          console.log(`Image data not found for ID: ${imageId}`);
          return null;
        }

        const url = imageObj?.imageData?.url ?? "";

        if (!item.itemData?.variations?.[0] || !("itemVariationData" in item.itemData.variations[0])) {
          console.error(`Item variation data not found for ID: ${item.id}`);
          return null;
        }

        if (item.itemData?.variations?.[0]?.itemVariationData && !("priceMoney" in item.itemData?.variations?.[0]?.itemVariationData)) {
          console.error(`Item variation data not found for ID: ${item.id}`);
          return null;
        }

        const priceCents =
          item.itemData?.variations?.[0]?.itemVariationData?.priceMoney?.amount ?? 0n;
        const price = (Number(priceCents) / 100).toFixed(2);

        return { id, name, description, category, url, price };
      }),
    [rawItems, rawImages, categoryLookup]
  );

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header with toggle button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-blue-900">Inventory</h1>
          <button
            onClick={() => setShowAdd((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {showAdd ? (
              <><XMarkIcon className="h-5 w-5" /> Cancel</>
            ) : (
              <><PlusCircleIcon className="h-5 w-5" /> Add Item</>
            )}
          </button>
        </div>

        {/* Add Item Form */}
        {showAdd && (
          <CreateItemForm
            onSave={() => {
              void queryClient.invalidateQueries({ queryKey: ["catalog"] });
              setShowAdd(false);
            }}
          />
        )}

        {/* Inventory Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow table-fixed">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 border-b">Image</th>
                <th className="py-3 px-4 border-b">ID</th>
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Category</th>
                <th className="py-3 px-4 border-b">Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                if (!item) return null;

                return (
                  <tr key={item.id} className="hover:bg-gray-50 h-20">
                    <td className="px-4 border-b">
                      {item.url ? (
                        <Image
                        src={item.url}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="object-cover rounded"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 border-b text-sm">{item.id}</td>
                  <td className="px-4 border-b text-sm">{item.name}</td>
                  <td className="px-4 border-b text-sm">{item.category}</td>
                  <td className="px-4 border-b text-sm">${item.price}</td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}