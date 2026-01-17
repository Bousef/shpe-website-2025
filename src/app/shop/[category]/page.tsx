"use client";

import React, { useState, useEffect, type Usable, use } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../_components/NavBar";
import { supabase } from "../../../supabase-client";
import { type Product } from "../../_components/AddProductForm";

interface CategoryParams {
  category: string;
}
interface CategoryPageProps {
  params: Usable<CategoryParams>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = use(params);
  // Local state
  const [products, setProducts] = useState<Product[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch products when `category` changes
  useEffect(() => {
    void (async () => {
      const { data, error } = await supabase
        .from("shpe-website-2025_products")
        .select("id, name, description, image, price, stock, category, status")
        .eq("category", category)
        .order("name", { ascending: true });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      // Each `image` field is "url1;url2;…", so take only the first URL
      setProducts(
        (data ?? []).map(p => ({
          ...p,
          image: p.image?.split(";")[0] ?? "",
        }))
      );
    })();
  }, [category]);

  return (
    <div className="min-h-screen bg-white">
      {/* Top nav */}
      <Navbar />

      {/* Header row: Back link, title, cart */}
      <div className="flex items-center justify-between px-4 lg:px-48 mt-4">
        <Link href="/shop" className="text-blue-600 hover:underline">
          ← Back to categories
        </Link>
        <h1 className="text-5xl font-bold uppercase text-yellow-500">
          {category}
        </h1>
        <Link
          href="/cart"
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded"
        >
          🛒 View Cart
        </Link>
      </div>

      {/* Error message */}
      {errorMsg && (
        <p className="mt-4 text-center text-red-600">{errorMsg}</p>
      )}

      {/* Product grid */}
      <main className="px-4 py-10 lg:px-96">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/shop/${encodeURIComponent(category)}/${p.id}`}
              className="block"
            >
              {/* Thumbnail */}
              <div className="relative mb-2 aspect-[3/4] bg-gray-200">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product info */}
              <p className="text-lg font-semibold text-blue-900">
                {p.name}
              </p>
              <p className="text-blue-900">{p.description}</p>
              <p className="text-xl text-blue-900">
                ${p.price.toFixed(2)}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
