// src/app/shop/[category]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../_components/NavBar";
import AddProductForm, { type Product } from "../../_components/AddProductForm";
import { supabase } from "../../../supabase-client";

// Props for category page route
interface CategoryParams { category: string; }
interface CategoryPageProps { params: Promise<CategoryParams>; }

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

      <main className="max-w-4xl mx-auto py-10 px-4">
        {/* Header with category title and add button */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/shop" className="text-blue-600 hover:text-blue-800">
            ← Back to categories
          </Link>
          <h1 className="text-4xl font-bold">{category}</h1>
          <button
            onClick={() => setShowForm(true)}
            className="text-white bg-blue-600 hover:bg-blue-700 rounded-full w-10 h-10 flex items-center justify-center"
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
        {errorMsg && <p className="text-red-600 mb-4">{errorMsg}</p>}

        {/* Product grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/shop/${encodeURIComponent(category)}/${p.id}`}
              className="block border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="font-medium">{p.name}</p>
                <p className="text-gray-600 truncate">{p.description}</p>
                <p className="mt-2 font-semibold">${p.price.toFixed(2)}</p>
                <p className="text-sm">Stock: {p.stock}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
