// app/shop/[category]/[itemId]/page.tsx
"use client";

import Navbar from "../../../_components/NavBar";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "../../../../supabase-client";
import type { Product } from "../../../_components/AddProductForm";

export default function ItemPage() {
  const { category, itemId } = useParams()!;
  const [product, setProduct] = useState<Product | null>(null);
  const [galleryImage, setGalleryImage] = useState("");
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
  const thumbs = product ? [product.image, product.image, product.image] : [];

  useEffect(() => {
    supabase
      .from<Product>("shpe-website-2025_products")
      .select("id,name,description,category,image,price,stock")
      .eq("id", Number(itemId))
      .single()
      .then(({ data, error }) => {
        if (error) return setError(error.message);
        setProduct(data!);
        setGalleryImage(data!.image);
      });
  }, [itemId]);

  if (error)
    return <p className="text-red-600 text-center mt-10">{error}</p>;
  if (!product)
    return <p className="text-center mt-10">Loading…</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-100">
      <Navbar />

      <main className="max-w-6xl mx-auto py-10 px-4 lg:px-0 flex flex-col lg:flex-row lg:space-x-8">
        {/* ─── Thumbnails ───────────────────────────── */}
        <div className="hidden lg:flex flex-col gap-4 flex-shrink-0 w-24">
          {thumbs.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${product.name} thumb ${i + 1}`}
              className="w-20 h-20 object-cover border cursor-pointer"
              onClick={() => setGalleryImage(src)}
            />
          ))}
        </div>

        {/* ─── Main Image (now 2/3 width) ───────────── */}
        <div className="mb-8 lg:mb-0 lg:w-2/3">
          <img
            src={galleryImage}
            alt={product.name}
            className="w-full h-auto object-cover shadow"
          />
        </div>

        {/* ─── Info Panel (1/3 width) ──────────────── */}
        <div className="flex flex-col lg:w-1/3">
          <Link
            href="/shop"
            className="mb-2 text-blue-600 hover:text-blue-800"
          >
            ← Back to categories
          </Link>

          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold mb-1">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Pay in 4 interest-free payments of $
            {(product.price / 4).toFixed(2)} with{" "}
            <span className="font-semibold">Afterpay</span>
          </p>

          {/* Size selector */}
          <div className="mb-6">
            <p className="font-medium mb-2">Size:</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((sz) => {
                const disabled = sz === "L"; // example sold-out
                const selected = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    onClick={() => !disabled && setSelectedSize(sz)}
                    disabled={disabled}
                    className={
                      `w-10 h-10 border flex items-center justify-center ` +
                      (disabled
                        ? "opacity-50 line-through cursor-not-allowed"
                        : selected
                        ? "bg-blue-900 text-white"
                        : "hover:border-blue-900")
                    }
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4 mb-6">
            <label htmlFor="qty" className="font-medium">
              Qty:
            </label>
            <select
              id="qty"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border px-3 py-2"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() =>
              alert(
                `Added ${product.name} (x${quantity}, size ${selectedSize}) to cart!`
              )
            }
            disabled={product.stock === 0}
            className="bg-yellow-500 text-black font-semibold py-3 hover:bg-yellow-600 disabled:opacity-50"
          >
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </main>
    </div>
  );
}
