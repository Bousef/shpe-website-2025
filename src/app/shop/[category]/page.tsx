// src/app/shop/[category]/page.tsx
"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../_components/NavBar";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { skipToken } from "@tanstack/react-query";

export default function CategoryPage() {
  /**
 * 1. Read the `category` slug from the URL parameters
 */
  const { category } = useParams<{ category: string }>();

  /**
 * 2. Fetch all ITEM catalog objects from Square
 */
  const {
    data: itemsData,
    isLoading: itemsLoading,
    error: itemsError,
  } = api.square.catalog.listCatalog.useQuery({ types: "ITEM" });

  /**
 * 3. Fetch all CATEGORY catalog objects from Square
 */
  const {
    data: categoriesData,
  } = api.square.catalog.listCatalog.useQuery({ types: "CATEGORY" });

  /**
 * 4. Identify the matching category object by its `name` field
 */
  const matchedCategory = categoriesData?.find(
    (c) => c.type === "CATEGORY" && c.categoryData?.name === category
  );

  const categoryId = matchedCategory?.id;

  /**
 * 5. Normalize items array, defaulting to empty if data is unavailable
 */
  const rawItems = useMemo(
    () => itemsData ?? [],
    [itemsData]
  );

  /**
 * 6. Filter items whose `categoryId` matches the selected category
 */
  const itemsList = useMemo(() => {
    return rawItems.filter((item) => {
      if (item.type !== "ITEM") return false;
      const categories = item.itemData?.categories;
      if (!categories || categories.length === 0) return false;
      return categories[0]?.id === categoryId;
    });
  }, [rawItems, categoryId]);

  /**
 * 7. Extract primary image IDs for each item
 */

  const itemImageIds = useMemo((): string[] => {
    const imageIds = itemsList.map((item) => {
      if (item.type === "ITEM" && item.itemData && Array.isArray(item.itemData.imageIds)) {
        return item.itemData.imageIds[0] ?? "";
      }
      return "";
    });
    
    console.log("Extracted image IDs:", imageIds);
    return imageIds;
  }, [itemsList]);

  /**
 * 8. Conditionally fetch image objects: skip if there are no valid IDs
 */
  const imagesQueryInput = useMemo(() => {
    const validImageIds = itemImageIds.filter((id) => id && id.trim() !== "");
    return validImageIds.length > 0
      ? { body: { objectIds: validImageIds } }
      : skipToken;
  }, [itemImageIds]);

  const {
    mutate: batchRetrieveCatalogObjects,
    data: imagesData,
    isPending: imagesLoading,
    error: imagesError,
  } = api.square.catalog.batchRetrieveCatalogObjects.useMutation();
  
  useEffect(() => {
    console.log("Image fetch effect triggered:", {
      itemsLoading,
      imagesQueryInput: imagesQueryInput !== skipToken ? imagesQueryInput : "skipToken",
      objectIdsLength: imagesQueryInput !== skipToken ? imagesQueryInput.body.objectIds.length : 0
    });
    
    if (!itemsLoading && imagesQueryInput !== skipToken && imagesQueryInput.body.objectIds.length > 0) {
      console.log("Calling batchRetrieveCatalogObjects with:", imagesQueryInput.body);
      batchRetrieveCatalogObjects(imagesQueryInput.body);
    }
  }, [batchRetrieveCatalogObjects, imagesQueryInput, itemsLoading]);

  /**
 * 9. Normalize image objects array
 */
  const rawImages = useMemo(
    () => imagesData?.objects ?? [],
    [imagesData]
  );

  /**
 * 10. Combine item and image data into a render-friendly format
 */

  const items = useMemo(() => {
    return itemsList.map((item) => {
      if (item.type !== "ITEM" || !item.itemData) {
        // Fallback for unexpected types
        return {
          id: item.id,
          name: "Unnamed Item",
          description: "",
          url: "",
          price: "0.00",
        };
      }
      const id = item.id;
      const name = item.itemData.name ?? "Unnamed Item";
      const description = item.itemData.description ?? "";
      const imageId = item.itemData.imageIds?.[0];
      
      console.log("Looking for image with ID:", imageId);
      console.log("Available images:", rawImages.map(img => ({ id: img.id, type: img.type })));
      
      const imageObj = rawImages.find((img) => img.id === imageId);
      console.log("Found image object:", imageObj);
      
      let url = "";
      if (imageObj && imageObj.type === "IMAGE") {
        // Check if imageData exists and has url
        if ("imageData" in imageObj && imageObj.imageData) {
          if (typeof imageObj.imageData === "object" && imageObj.imageData !== null && "url" in imageObj.imageData) {
            url = (imageObj.imageData as { url?: string }).url ?? "";
          }
        }
      }
      
      console.log("Final image URL for", name, ":", url);

      let priceCents = 0n;
      const firstVariation = item.itemData.variations?.[0];
      if (
        firstVariation &&
        firstVariation.type === "ITEM_VARIATION" &&
        firstVariation.itemVariationData &&
        typeof firstVariation.itemVariationData.priceMoney?.amount === "bigint"
      ) {
        priceCents = firstVariation.itemVariationData.priceMoney.amount;
      }
      const price = Number(priceCents) / 100;

      return { id, name, description, url, price: price.toFixed(2) };
    });
  }, [itemsList, rawImages]);

  /**
 * 11. Early returns for loading and error states
 */
  if (itemsLoading || imagesLoading) {
    return <div>Loading…</div>;
  }
  if (itemsError) {
    return <div>Error loading items: {itemsError.message}</div>;
  }
  if (imagesError) {
    return <div>Error loading images: {imagesError.message}</div>;
  }

  if (!categoryId) {
    return <div>Invalid category</div>;
  }
  if (items.length === 0) {
    return <div>No items found in this category</div>;
  }

  /**
 * 12. Render the category page: header and item grid
 */
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <header className="flex justify-between items-center px-4 lg:px-48 mt-4">
        <Link href="/shop" className="text-blue-600 hover:underline">
          ← Back
        </Link>
        <h1 className="text-5xl font-bold uppercase text-yellow-500">
          {category}
        </h1>
        <Link
          href="/cart"
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded"
        >
          🛒 Cart
        </Link>
      </header>
      <main className="px-4 py-10 lg:px-96 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ id, name, description, url, price }) => {

          const placeholderImage = "/images/placeholderCatalog.jpg";

          console.log("item: ", { id, name, description, url, price });
          return (
            <Link key={id} href={`/shop/${category}/${id}`} className="block">
              <div className="relative mb-2 aspect-[3/4] bg-gray-200">

                {/*url && <Image src={url} alt={name} fill className="object-cover" />*/}

                <Image
                  src={url || placeholderImage}
                  alt={name}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-lg font-semibold text-blue-900">{name}</p>
              {description && <p className="text-blue-900 mb-1">{description}</p>}
              <p className="text-xl text-blue-900">${price}</p>
            </Link>
          );
        })}
      </main>
    </div>
  );
}
