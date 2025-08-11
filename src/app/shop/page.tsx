"use client";

import { useMemo } from "react";
import Navbar from "../_components/NavBar";
import Link from "next/link";
import Image from "next/image";
import { api } from "~/trpc/react";
// removed: skipToken, useEffect
// if you need types from Square, import them from the pkg root instead of a node_modules path
// import type { CatalogObject } from "square"; // example

export default function ShopPage() {
  // 1) current member (for permission)
  const { data: member } = api.user.getCurrentMember.useQuery();

  // 2) categories list
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = api.square.catalog.listCatalog.useQuery({ types: "CATEGORY" });

  // 3) raw categories array
  const rawCategories = useMemo(() => categoriesData ?? [], [categoriesData]);

  // 4) category names (parallel to rawCategories order)
  const categoryNames = useMemo<string[]>(
    () =>
      rawCategories
        .filter((o) => o.type === "CATEGORY")
        .map((c) => c.categoryData?.name ?? "Unnamed"),
    [rawCategories]
  );

  // 5) ids in the same order we’ll render
  const categoryIds = useMemo<string[]>(
    () =>
      (rawCategories ?? [])
        .map((c) => c.id)
        .filter((id): id is string => !!id && id.trim() !== ""),
    [rawCategories]
  );

  // 6) batch get FIRST image url per category (server should return array aligned to input order OR {objectId,url}[])
  // this version assumes you're returning [{ objectId, url }] as discussed
  const {
    data: categoryImagePairs = [],
    isLoading: isLoadingImages,
    error: imagesError,
  } = api.square.catalog.batchGetImages.useQuery(
    { objectIds: categoryIds, includeRelatedObjects: false },
    { enabled: categoryIds.length > 0 }
  );

  // 7) build id->url map so we never depend on array index ordering
  const imageByCategoryId = useMemo(() => {
    const map = new Map<string, string | null>();
    for (const { objectId, url } of categoryImagePairs) {
      map.set(objectId, url ?? null);
    }
    return map;
  }, [categoryImagePairs]);

  // 8) final data for render
  const categories = useMemo(
    () =>
      rawCategories.map((catObj, idx) => ({
        object: catObj,
        name: categoryNames[idx] ?? "Unnamed",
        imageUrl: imageByCategoryId.get(catObj.id ?? "") ?? "",
      })),
    [rawCategories, categoryNames, imageByCategoryId]
  );

  // 9) permission
  const showEdit = member?.position === "Treasurer";

  // 10) loading / error states (fixed variable names)
  if (isLoadingCategories || isLoadingImages) {
    return <div>Loading categories...</div>;
  }
  if (categoriesError) {
    return <div>Error loading categories: {categoriesError.message}</div>;
  }
  if (imagesError) {
    return <div>Error loading images: {imagesError.message}</div>;
  }
  if (categories.length === 0) {
    return <div>No categories found</div>;
  }

  // optional sanity check — you can keep or remove
  // if (!categories.every((c) => c.imageUrl)) {
  //   return <div>Some categories are missing images</div>;
  // }

  // 11) render
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-100">
      <Navbar />

      {/* top actions */}
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

      {/* header */}
      <main className="px-4 py-10 lg:px-48">
        <div className="flex items-center mb-8">
          <h1 className="flex-1 text-center text-5xl text-yellow-500 lg:text-6xl">
            CATEGORIES
          </h1>
        </div>

        {/* grid */}
        <div
          className={`grid gap-10 ${
            categories.length === 1
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
                {/* guard src to avoid runtime crash if empty */}
                <Image
                  src={imageUrl || "/placeholder.png"}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 450px"
                  // optionally add priority to fold images
                  // priority
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
