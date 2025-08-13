"use client";

import { useMemo } from "react";
import Navbar from "../_components/NavBar";
import Link from "next/link";
import Image from "next/image";
import { api } from "~/trpc/react";
import FooterSection from "../_components/FooterSection";

export default function ShopPage() {
  // 1) current member (for permission) - cached for 5 minutes
  const { data: member } = api.user.getCurrentMember.useQuery(undefined, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // 2) categories list - cached for 10 minutes with reduced refetching
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = api.square.catalog.listCatalog.useQuery(
    { types: "CATEGORY" },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

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

  // 6) batch get FIRST image url per category - cached and optimized
  const {
    data: categoryImagePairs = [],
    isLoading: isLoadingImages,
    error: imagesError,
  } = api.square.catalog.batchGetImages.useQuery(
    { objectIds: categoryIds, includeRelatedObjects: false },
    { 
      enabled: categoryIds.length > 0,
      staleTime: 15 * 60 * 1000, // 15 minutes (images change less frequently)
      refetchOnWindowFocus: false,
    }
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

  // 10) loading / error states with optimized loading
  if (isLoadingCategories || isLoadingImages) {
    return null; // Let loading.tsx handle this
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

  // 11) render with optimized critical rendering path
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

      {/* header - Optimized for LCP with immediate rendering */}
      <main className="px-4 py-10 lg:px-48">
        <div className="flex items-center mb-8" style={{ minHeight: '5rem' }}>
          <h1 
            className="flex-1 text-center text-yellow-500 lcp-heading"
            style={{
              fontSize: 'clamp(3rem, 5vw, 3.75rem)',
              lineHeight: '1.1',
              fontWeight: '900',
              visibility: 'visible',
              opacity: 1,
            }}
          >
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
                {/* Optimized image with proper loading and formats */}
                <Image
                  src={imageUrl || "/placeholder.png"}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={true} // Load above-the-fold images first
                  quality={85} // Slightly reduce quality for better performance
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyejmmMYTC0t1YcgNfzUauZmkjlneG6eMB14KGP49bO6jHf0qKKPQPjLo0AyZL0r9v/2Q=="
                />
              </div>
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wider text-blue-900 uppercase">
                {name}
              </p>
            </Link>
          ))}
        </div>
      </main>
      <FooterSection />
    </div>
  );
}
