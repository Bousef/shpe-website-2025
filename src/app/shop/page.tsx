// src/app/shop/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../_components/NavBar";
import AddProductForm, { type Product } from "../_components/AddProductForm";
import { supabase } from "../../supabase-client";
import Image from "next/image";

export type CategoryImage = {
  category: string;
  image: string; // semicolon-separated filenames
};

export default function Shop() {
  const [categories, setCategories] = useState<CategoryImage[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from("shpe-website-2025_products")
        .select("category, image")
        .order("category", { ascending: true });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      // pick first image per category
      const map: Record<string, string> = {};
(data ?? []).forEach(({ category, image }) => {
  if (!map[category]) {
    // grab the first filename
    const fileName = image.split(";")[0] ?? "";
    // turn it into a public URL
    const { data: urlData } = supabase
      .storage
      .from("product-images")
      .getPublicUrl(fileName);
    map[category] = urlData.publicUrl;    // now a full https://… URL
  }
});
      const list = Object.entries(map)
        .map(([category, image]) => ({ category, image }))
        .sort((a, b) => a.category.localeCompare(b.category));

      setCategories(list);
    }

    loadCategories();
  }, []);

// Handler when new product is added
const handleAdd = (product: Product) => {
  setCategories(prev => {
    if (prev.some(c => c.category === product.category)) return prev;

    // grab the first image (or "" if somehow missing)
    const firstImage = product.image.split(";")[0] ?? "";

    // Append new category with a guaranteed string image
    return [...prev, { category: product.category, image: firstImage }]
      .sort((a, b) => a.category.localeCompare(b.category));
  });
};


  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-100">
      <Navbar />
      <div className="flex justify-end px-4 lg:px-48 mt-4">
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
          <div className="ml-4">
            <AddProductForm onAdd={handleAdd} />
          </div>
        </div>

        {errorMsg && <p className="mb-4 text-center text-red-600">{errorMsg}</p>}

        <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-32">
          {categories.map(({ category, image }) => (
            <Link
              key={category}
              href={`/shop/${encodeURIComponent(category)}`}
              className="block overflow-hidden text-center"
            >
              <div className="relative mb-4 aspect-[3/4] lg:mb-8">
                <Image src={image} alt={category} fill className="object-cover" />
              </div>
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
