// src/app/shop/[category]/page.tsx
"use client";

import React, { useMemo } from "react";
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
  const matchedCategory = categoriesData?.result.objects?.find(
    (c) => c.categoryData?.name === category
  );
  const categoryId = matchedCategory?.id;

  /**
   * 5. Normalize items array, defaulting to empty if data is unavailable
   */
  const rawItems = useMemo(
    () => itemsData?.result.objects ?? [],
    [itemsData]
  );

  /**
   * 6. Filter items whose `categoryId` matches the selected category
   */
  const itemsList = useMemo(
    () =>
      rawItems.filter((item) =>
        item.itemData?.categories?.[0]?.id === categoryId
      ),
    [rawItems, categoryId]
  );

  /**
   * 7. Extract primary image IDs for each item
   */
  const itemImageIds = useMemo(
    () => itemsList.map((item) => item.itemData?.imageIds?.[0] ?? ""),
    [itemsList]
  );

  /**
   * 8. Conditionally fetch image objects: skip if there are no valid IDs
   */
  const imagesQueryInput =
    itemImageIds.every((id) => id) // ensure non-empty strings
      ? { body: { objectIds: itemImageIds } }
      : skipToken;

  const {
    data: imagesData,
    isLoading: imagesLoading,
    error: imagesError,
  } = api.square.catalog.batchRetrieveCatalogObjects.useQuery(
    imagesQueryInput
  );

  /**
   * 9. Normalize image objects array
   */
  const rawImages = useMemo(
    () => imagesData?.result.objects ?? [],
    [imagesData]
  );

  /**
   * 10. Combine item and image data into a render-friendly format
   */
  const items = useMemo(() => {
    return itemsList.map((item) => {
      const id = item.id;
      const name = item.itemData?.name ?? "Unnamed Item";
      const description = item.itemData?.description;
      const imageId = item.itemData?.imageIds?.[0];
      const imageObj = rawImages.find((img) => img.id === imageId);
      const url = imageObj?.imageData?.url ?? "";

      const priceCents =
        item.itemData?.variations?.[0]?.itemVariationData?.priceMoney
          ?.amount ??
        0n;
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
        {items.map(({ id, name, description, url, price }) => (
          <Link key={id} href={`/shop/${category}/${id}`} className="block">
            <div className="relative mb-2 aspect-[3/4] bg-gray-200">
              <Image src={url} alt={name} fill className="object-cover" />
            </div>
            <p className="text-lg font-semibold text-blue-900">{name}</p>
            {description && <p className="text-blue-900 mb-1">{description}</p>}
            <p className="text-xl text-blue-900">${price}</p>
          </Link>
        ))}
      </main>
    </div>
  );
}
