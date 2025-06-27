// src/app/shop/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import Navbar from "../_components/NavBar";
import { supabase } from "../../supabase-client";

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

      <main className="max-w-4xl mx-auto py-10">
        {/* Page header */}
        <h1 className="text-blue-800 text-5xl text-center mb-8">
          CATEGORIES
        </h1>

        {/* Display error message if present */}
        {errorMsg && (
          <p className="text-red-600 mb-4 text-center">{errorMsg}</p>
        )}

        {/* Category grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(({ category, image }) => (
            <Link
              key={category}
              href={`/shop/${encodeURIComponent(category)}`}
              className="block text-center rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
            >
              {/* Category image */}
              <img
                src={image}
                alt={category}
                className="w-full h-64 object-cover"
              />

              {/* Category label */}
              <p className="mt-2 text-lg font-medium text-gray-700">
                {category}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
