// src/app/shop/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../_components/NavBar";
import { supabase } from "../../supabase-client";
import Image from "next/image";
import { api } from '~/trpc/react'

export type CategoryImage = {
  category: string;
  image: string; // semicolon-separated filenames
};

export default function Shop() {
  const [categories, setCategories] = useState<CategoryImage[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const {
    data: data,
    isLoading,
    error, // <---- will only exist if getCurrentMember throws an exception
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
    async function loadCategories() {
      const { data, error } = await supabase
        .from("shpe-website-2025_products")
        .select("category, image")
        .eq("status", "Active")
        .order("category", { ascending: true });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      // pick first image per category
      const map: Record<string, string> = {};
      (data ?? []).forEach((row: { category: string; image: string }) => {
        const { category, image } = row;
        if (!map[category]) {
          // image is already a semicolon-delimited list of URLs
          const firstUrl = image?.split(";")[0] ?? "";
          map[category] = firstUrl;
        }
      });

      const list = Object.entries(map)
        .map(([category, image]) => ({ category, image }))
        .sort((a, b) => a.category.localeCompare(b.category));

      setCategories(list);
    }

    void loadCategories();
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-100">
      <Navbar />
      <div className="flex justify-end px-4 lg:px-48 mt-4">
        {showEdit && (
          <Link
            href="/manage_inv"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded shadow mr-2">
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
          className={`grid gap-10  ${categories.length === 1
            ? "grid-cols-1 justify-center"
            : categories.length === 2
              ? "grid-cols-2 justify-center"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
        >
          {categories.map(({ category, image }) => (
            <Link
              key={category}
              href={`/shop/${encodeURIComponent(category)}`}
              className="block overflow-hidden text-center"
            >
              <div className="relative mb-4 aspect-[9/11] w-full max-w-[450px] lg:mb-8 mx-auto">
                <Image src={image} alt={category} fill className="object-cover" />
              </div>
              <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wider text-blue-900 uppercase">
                {category}
              </p>

            </Link>
          ))}
        </div>

      </main>
    </div>
  );
}
