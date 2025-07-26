"use client";

import { useEffect, useState } from "react";
import { getCatalog, getObjectURL, wipeCatalog } from "./actions/actions";
import Navbar from "../_components/NavBar";
import Link from "next/link";
import { api } from "~/trpc/react";
import Image from "next/image";
import type { CatalogCategory, CatalogObject, CatalogObjectCategory } from "node_modules/square/api";

export type CategoryImage = {
  object: CatalogCategory;
  image: string; // semicolon-separated filenames
};

function isCategory(obj: CatalogObject): obj is CatalogObject & { categoryData: CatalogCategory } {
  return obj.type === "CATEGORY" && !!(obj as any).categoryData;
}

export default function ShopPage() {
  const [categories, setCategories] = useState<CategoryImage[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const {
    data,
    isLoading,
    error,
  } = api.user.getCurrentMember.useQuery();

  let showEdit = false;

  if (error) {
    console.log(error.message);
  }

  if (data?.position === "Treasurer") {
    showEdit = true;
  } else if (!data && !isLoading) {
    console.log("No user Found");
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const catalogObjects = await getCatalog();
        console.log("Fetched catalog:", catalogObjects);

        const onlyCategories = catalogObjects?.filter(
          (obj: any) => obj.type === "CATEGORY"
        );

const placeholderUrl = "https://vdujevvvreearypjztgb.supabase.co/storage/v1/object/public/product-images//2025-07-11T00-12-23-043Z-placeholder-store.png";

const categoryImages: CategoryImage[] = await Promise.all(
  onlyCategories
    .filter(isCategory) // narrow types safely
    .map(async (cat) => {
      const id = cat.categoryData.imageIds?.[0]; // using image_ids per spec
      if (!id) {
        console.warn("No imageId for category:", cat.id);
        return { object: cat.categoryData, image: placeholderUrl };
      }
      const url = await getObjectURL(id);
      if (!url) {
        console.warn("Could not fetch image for id:", id);
        return { object: cat.categoryData, image: placeholderUrl };
      }
      return { object: cat.categoryData, image: url };
    })
);

        setCategories(categoryImages);
      } catch (err) {
        console.error("Failed to load catalog:", err);
        setErrorMsg("Something went wrong loading categories.");
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-100">
      <Navbar />

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

      <main className="px-4 py-10 lg:px-48">
        <div className="flex items-center mb-8">
          <h1 className="flex-1 text-center text-5xl text-yellow-500 lg:text-6xl">
            CATEGORIES
          </h1>
        </div>

        {errorMsg && <p className="mb-4 text-center text-red-600">{errorMsg}</p>}

        <div
          className={`grid gap-10 ${
            categories.length === 1
              ? "grid-cols-1 justify-center"
              : categories.length === 2
              ? "grid-cols-2 justify-center"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {categories.map(({ object, image }) => {
            const categoryName = object.name ?? "Unnamed Category";
            return (
              <Link
                key={object.name}
                href={`/shop/${encodeURIComponent(categoryName)}`}
                className="block overflow-hidden text-center"
              >
                <div className="relative mb-4 aspect-[9/11] w-full max-w-[450px] lg:mb-8 mx-auto">
                  <Image src={image} alt={categoryName} fill className="object-cover" />
                </div>
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wider text-blue-900 uppercase">
                  {categoryName}
                </p>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
