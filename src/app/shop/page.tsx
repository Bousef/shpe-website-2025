// src/app/shop/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import Navbar from "../_components/NavBar";
import { supabase } from "../../supabase-client";
import Image from "next/image";

// Represents a category image mapping for display
export type CategoryImage = {
  category: string;
  image: string;
};

/**
 * Shop page component
 * Displays all product categories with a representative image
 */
export default function Shop() {
  // State: list of category-image pairs
  const [categories, setCategories] = useState<CategoryImage[]>([]);
  // State: error message (if any) during data fetch
  const [errorMsg, setErrorMsg] = useState<string>("");

  /**
   * Loads one image per category from Supabase
   */
  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from("shpe-website-2025_products")
        .select("category, image")
        .order("category", { ascending: true });

      if (error) {
        // Capture and display load error
        setErrorMsg(error.message);
        return;
      }

      // Build a map to ensure unique categories
      const map: Record<string, string> = {};
      (data ?? []).forEach(({ category, image }) => {
        if (!map[category]) {
          map[category] = image;
        }
      });

      // Convert map entries back to array and sort by category name
      const list = Object.entries(map)
        .map(([category, image]) => ({ category, image }))
        .sort((a, b) => a.category.localeCompare(b.category));

      setCategories(list);
    }

    loadCategories();
  }, []); // Empty dependency array => runs once on mount

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-100">
      {/* Navigation bar */}
      <Navbar />

      <main className="px-4 py-10 lg:px-48">
        {/* Page header */}
        <h1 className="mb-8 text-center text-5xl text-yellow-500 lg:mb-20 lg:text-6xl">
          CATEGORIES
        </h1>

        {/* Display error message if present */}
        {errorMsg && (
          <p className="mb-4 text-center text-red-600">{errorMsg}</p>
        )}

        {/* Category grid */}
        <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-32">
          {categories.map(({ category, image }) => (
            <Link
              key={category}
              href={`/shop/${encodeURIComponent(category)}`}
              className="block overflow-hidden text-center"
            >
              <div className="relative mb-4 aspect-[3/4] lg:mb-8">
                {/* Category image */}
                <Image
                  src={image}
                  alt={category}
                  className="object-cover"
                  fill
                />
              </div>

              {/* Category label */}
              <p className="text-5xl font-bold tracking-wider text-blue-900 uppercase">
                {category}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
