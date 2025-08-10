"use client";

import { useEffect, useMemo } from "react";
import Navbar from "../_components/NavBar";
import Link from "next/link";
import Image from "next/image";
import { api } from "~/trpc/react";
import { skipToken } from "@tanstack/react-query";
import type { CatalogObject } from "node_modules/square/api";

export default function ShopPage() {
  // 1. Fetch current member (for permissioning)
  const { data: member } = api.user.getCurrentMember.useQuery();

  // 2. Fetch all CATEGORY catalog objects
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = api.square.catalog.listCatalog.useQuery({ types: "CATEGORY" });

   useEffect(() => {
    if (categoriesData) {
      console.log("✅ Categories fetched:", categoriesData);
    }
  }, [categoriesData]);

  // 3. Extract raw category objects array
  const rawCategories = useMemo(
    () => categoriesData ?? [],
    [categoriesData]
  );
  


  // 4. Gather the first imageId from each category for lookup
  const categoryImageIds = useMemo<string[]>(
    () =>
      rawCategories
        .filter((c): c is Extract<CatalogObject, { type: "CATEGORY" }> => c.type === "CATEGORY")
        .map((c) => c.categoryData?.imageIds?.[0] ?? ""),
    [rawCategories]
  );

  const imagesQueryInput = useMemo(() =>
    categoryImageIds.length > 0 && categoryImageIds.every((id) => id !== "")
      ? { body: { objectIds: categoryImageIds } }
      : skipToken
  , [categoryImageIds]);

  // 5. Batch-fetch those Image catalog objects
  const { mutate: batchRetrieveCatalogObjects, data: imagesData, isError, error, isPending } = api.square.catalog.batchRetrieveCatalogObjects.useMutation();

  useEffect(() => {
    if (imagesQueryInput !== skipToken) {
      batchRetrieveCatalogObjects(imagesQueryInput.body);
    }
  }, [imagesQueryInput, batchRetrieveCatalogObjects]);

  // 6. Extract the raw image objects array
  const rawImages = useMemo(
    () => imagesData?.objects ?? [],
    [imagesData]
  );


  // 7. Derive parallel arrays of names & URLs
  const categoryNames = useMemo<string[]>(
    () =>
      rawCategories
        .filter((o): o is Extract<CatalogObject, { type: "CATEGORY" }> => o.type === "CATEGORY")
        .map((c) => c.categoryData?.name ?? "Unnamed"),
    [rawCategories]
  );
  
const categoryImageUrls = useMemo<string[]>(
  () =>
    rawImages
      .filter(
        (o): o is Extract<CatalogObject, { type: "IMAGE" }> =>
          o.type === "IMAGE"
      )
      .map((img) => img.imageData?.url ?? ""),
  [rawImages]
);
  // 8. Zip into a single array for rendering
  const categories = useMemo(
    () =>
      rawCategories.map((catObj, idx) => ({
        object: catObj,
        name: categoryNames[idx]!,
        imageUrl: categoryImageUrls[idx]!,
      })),
    [rawCategories, categoryNames, categoryImageUrls]
  );

  // 9. Permission: show “Manage Inventory” only to Treasurers
  const showEdit = member?.position === "Treasurer";

  // 10. Early returns for loading / errors / missing data
  if (isLoadingCategories || isPending) {
    return <div>Loading categories...</div>;
  }
  if (categoriesError) {
    return <div>Error loading categories: {categoriesError.message}</div>;
  }
  if (isError) {
    return <div>Error loading images: {error.message}</div>;
  }
  if (categories.length === 0) {
    return <div>No categories found</div>;
  }
  // (optional) quick sanity check
  if (!categories.every((c) => c.imageUrl)) {
    return <div>Some categories are missing images</div>;
  }

  // 11. Main render
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-100">
      <Navbar />

      {/* Top actions */}
      <div className="flex justify-end px-4 lg:px-48 mt-4">
        {showEdit && (
          <Link
            href="/manage_inv"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded shadow mr-2"
          >
            Manage Inventory
          </Link>
        )}
        <Link
          href="/cart"
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded shadow"
        >
          🛒 View Cart
        </Link>
      </div>

      {/* Header */}
      <main className="px-4 py-10 lg:px-48">
        <div className="flex items-center mb-8">
          <h1 className="flex-1 text-center text-5xl text-yellow-500 lg:text-6xl">
            CATEGORIES
          </h1>
        </div>

        {/* Category grid */}
        <div
          className={`grid gap-10 ${categories.length === 1
              ? "grid-cols-1 justify-center"
              : categories.length === 2
                ? "grid-cols-2 justify-center"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
        >
          {categories.map(({ object, name, imageUrl }) => (
            <Link
              key={object.id}
              href={`/shop/${encodeURIComponent(name)}`}
              className="block overflow-hidden text-center"
            >
              <div className="relative mb-4 aspect-[9/11] w-full max-w-[450px] lg:mb-8 mx-auto">
                <Image
                  src={imageUrl}
                  alt={name}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wider text-blue-900 uppercase">
                {name}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
