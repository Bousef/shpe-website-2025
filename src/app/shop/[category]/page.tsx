// src/app/shop/[category]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../_components/NavBar";
import AddProductForm, { type Product } from "../../_components/AddProductForm";
import { supabase } from "../../../supabase-client";
import Image from "next/image";

// Props for category page route
interface CategoryParams {
  category: string;
}
interface CategoryPageProps {
  params: Promise<CategoryParams>;
}

/**
 * CategoryPage component
 * - Displays products in a category
 * - Allows adding a new product to this category via '+' button
 */
export default function CategoryPage({ params }: CategoryPageProps) {
  // Unwrap dynamic category param
  const { category } = React.use(params);

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);

  // Fetch products when category changes
  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from<Product>("shpe-website-2025_products")
        .select("id, name, description, image, price, stock, category")
        .eq("category", category)
        .order("name", { ascending: true });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setProducts(data ?? []);
      }
    }
    loadProducts();
  }, [category]);

  // Handler for new product addition
  const handleAdd = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-100">
      <Navbar />

      <main className="px-4 py-10 lg:px-96">
        {/* Header with category title and add button */}
        <div className="mb-8 flex flex-col items-center justify-between lg:mb-20 lg:flex-row">
          <Link href="/shop" className="text-blue-600 hover:text-blue-800">
            ← Back to categories
          </Link>
          <h1 className="text-5xl font-medium tracking-wider text-yellow-500 uppercase lg:text-6xl">
            {category}
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
            aria-label="Add Product"
          >
            +
          </button>
        </div>

        {/* Add Product Form modal */}
        {showForm && (
          <AddProductForm
            defaultCategory={category}
            onAdd={handleAdd}
            onClose={() => setShowForm(false)}
          />
        )}

        {/* Error message */}
        {errorMsg && <p className="mb-4 text-red-600">{errorMsg}</p>}

        {/* Product grid */}
        <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-32">
          {products.map((p) => (
            <Link
              key={category}
              href={`/shop/${encodeURIComponent(category)}/${p.id}`}
              className="block overflow-hidden"
            >
              <div className="relative mb-2 aspect-[3/4]">
                <Image
                  src={p.image}
                  alt={p.category}
                  className="object-cover"
                  fill
                />
              </div>

              <div>
                <p className="mb-2 text-blue-900">Limited edition</p>
                <p className="text-lg font-bold tracking-wider text-blue-900 uppercase">
                  {p.name}
                </p>
                <p className="text-xl text-blue-900">$ {p.price?.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
