"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../_components/NavBar";
import AddProductForm, { type Product } from "../../_components/AddProductForm";
import { supabase } from "../../../supabase-client";
import Image from "next/image";

interface CategoryParams {
  category: string;
}
interface CategoryPageProps {
  params: { category: string };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;
  const [products, setProducts] = useState<Product[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from<Product>("shpe-website-2025_products")
        .select("id, name, description, image, price, stock, category")
        .eq("category", category)
        .order("name", { ascending: true });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      // map each product.image (semicolon-list) → public URL
      const withUrls = (data ?? []).map((p) => {
        const firstFile = p.image.split(";")[0] ?? "";
        const { data: urlData } = supabase
          .storage
          .from("product-images")
          .getPublicUrl(firstFile);
        return { ...p, image: urlData.publicUrl };
      });

      setProducts(withUrls);
    }

    loadProducts();
  }, [category]);

  const handleAdd = (newProd: Product) => {
    // convert its image too
    const firstFile = newProd.image.split(";")[0] ?? "";
    const { data: urlData } = supabase
      .storage
      .from("product-images")
      .getPublicUrl(firstFile);

    setProducts((prev) => [{ ...newProd, image: urlData.publicUrl }, ...prev]);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-100">
      <Navbar />

      <main className="px-4 py-10 lg:px-96">
        <div className="mb-8 flex flex-col items-center justify-between lg:flex-row lg:mb-20">
          <Link href="/shop" className="text-blue-600 hover:text-blue-800">
            ← Back to categories
          </Link>
          <h1 className="text-5xl font-medium text-yellow-500 uppercase lg:text-6xl">
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

        {showForm && (
          <AddProductForm defaultCategory={category} onAdd={handleAdd} onClose={() => setShowForm(false)} />
        )}

        {errorMsg && <p className="mb-4 text-red-600">{errorMsg}</p>}

        <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-32">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/shop/${encodeURIComponent(category)}/${p.id}`}
              className="block overflow-hidden"
            >
              <div className="relative mb-2 aspect-[3/4]">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="mb-2 text-blue-900">Limited edition</p>
              <p className="text-lg font-bold tracking-wider text-blue-900 uppercase">
                {p.name}
              </p>
              <p className="text-xl text-blue-900">${p.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
