"use client";

import React, { useState, useEffect, use, type Usable } from "react";
import Link from "next/link";
import Navbar from "../../_components/NavBar";
import AddProductForm, { type Product } from "../../_components/AddProductForm";
import { supabase } from "../../../supabase-client";
import Image from "next/image";

interface CategoryParams {
  category: string;
}
interface CategoryPageProps {
  params: Usable<CategoryParams>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = use(params);
  const [products, setProducts] = useState<Product[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("shpe-website-2025_products")
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
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="px-4 py-10 lg:px-96">
        <div className="mb-8 flex flex-col items-center justify-between lg:flex-row lg:mb-20">
          <Link href="/shop" className="text-blue-600 hover:text-blue-800">
            ← Back to categories
          </Link>
          <h1 className="text-5xl font-medium text-yellow-500 uppercase lg:text-6xl">
            {decodeURIComponent(category ?? "")}
          </h1>
          <div className="ml-4">
            <AddProductForm onAdd={handleAdd} />
          </div>
        </div>

        {errorMsg && <p className="mb-4 text-red-600">{errorMsg}</p>}

        <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-32">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/shop/${encodeURIComponent(category)}/${p.id}`}
              className="block overflow-hidden"
            >
              <div className="relative mb-2 aspect-[3/4] bg-[#d9d9d9]">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-fill"
                />
              </div>
              <p className="mb-2 text-blue-900">{p.description}</p>
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
