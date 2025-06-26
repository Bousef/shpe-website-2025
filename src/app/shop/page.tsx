// src/app/shop/page.tsx
"use client";

import Navbar from "../_components/NavBar";
import AddProductForm, { Product } from "../_components/AddProductForm";
import { supabase } from "../../supabase-client";
import { useState, useEffect } from "react";

export type CategoryImage = { category: string; image: string };

export default function Shop() {
  const [categories, setCategories] = useState<CategoryImage[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch one image per category
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("shpe-website-2025_products")
        .select("category, image")
        .order("category", { ascending: true });
      if (error) setErrorMsg(error.message);
      else {
        const map: Record<string, string> = {};
        (data ?? []).forEach((item) => {
          if (!map[item.category]) map[item.category] = item.image;
        });
        setCategories(
          Object.entries(map)
            .map(([category, image]) => ({ category, image }))
            .sort((a, b) => a.category.localeCompare(b.category))
        );
      }
    })();
  }, []);

  // Fetch all products when a category is selected
  useEffect(() => {
    if (!selectedCategory) return;
    (async () => {
      const { data, error } = await supabase
        .from<Product>("shpe-website-2025_products")
        .select("id, name, description, category, image, price, stock")
        .eq("category", selectedCategory);
      if (error) setErrorMsg(error.message);
      else setProducts(data ?? []);
    })();
  }, [selectedCategory]);

  // Handle new product add: refresh categories
  const handleAddCategory = (p: Product) => {
    setCategories((prev) => {
      if (prev.some((c) => c.category === p.category)) return prev;
      return [...prev, { category: p.category, image: p.image }].sort((a, b) =>
        a.category.localeCompare(b.category)
      );
    });
  };

  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-100 relative">
        <Navbar />
        <main className="max-w-4xl mx-auto py-10">
          <button
            onClick={() => setSelectedCategory(null)}
            className="mb-4 text-blue-600"
          >
            ← Back to categories
          </button>
          <h1 className="text-4xl font-bold mb-6">{selectedCategory}</h1>
          {errorMsg && <p className="text-red-600 mb-4">{errorMsg}</p>}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="border rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-gray-600">{p.description}</p>
                  <p className="mt-2 font-semibold">${(p.price ?? 0).toFixed(2)}</p>
                  <p className="text-sm">Stock: {p.stock ?? 0}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-100 relative">
      <Navbar />
      {/* + Button */}
      <button
        onClick={() => setShowForm((v) => !v)}
        className="fixed top-4 right-4 bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg text-3xl leading-none flex items-center justify-center hover:bg-blue-700"
        aria-label="Add Product"
      >
        +
      </button>
      <main className="max-w-4xl mx-auto py-10">
        <h1 className="text-blue-800 text-5xl text-center mb-8">CATEGORIES</h1>
        {/* Add Product Form */}
        {showForm && (
          <AddProductForm
            onAdd={(p) => {
              handleAddCategory(p);
              setShowForm(false);
            }}
            onClose={() => setShowForm(false)}
          />
        )}
        {errorMsg && <p className="text-red-600 mb-4 text-center">{errorMsg}</p>}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((ci) => (
            <div
              key={ci.category}
              className="text-center cursor-pointer"
              onClick={() => setSelectedCategory(ci.category)}
            >
              <img
                src={ci.image}
                alt={ci.category}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
              <p className="mt-2 text-lg font-medium text-gray-700">{ci.category}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
