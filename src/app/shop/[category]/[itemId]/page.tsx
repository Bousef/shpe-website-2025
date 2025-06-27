// src/app/shop/[category]/[itemId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import Navbar from "../../../_components/NavBar";
import { supabase } from "../../../../supabase-client";
import type { Product } from "../../../_components/AddProductForm";

/**
 * ItemPage component
 * Fetches and displays details for a single product, including:
 * - Responsive image gallery (multiple images separated by ';')
 * - Product info (name, price, description)
 * - Dynamic size & quantity selectors based on stock
 * - Add to cart button
 */
export default function ItemPage() {
  // Grab URL params: category and itemId
  const { category, itemId } = useParams()!;

  // Component state
  const [product, setProduct] = useState<Product | null>(null);
  const [galleryImage, setGalleryImage] = useState<string>("");
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [quantity, setQuantity] = useState<number>(1);

  // Available sizes: must match columns in clothes_sizes table
  const sizes = ["S", "M", "L", "XL", "XXL"];

  // Map of size to stock count
  const [sizeStock, setSizeStock] = useState<Record<string, number>>({});

  // Fetch product data whenever itemId changes
  useEffect(() => {
    async function loadProduct() {
      const { data, error } = await supabase
        .from<Product>("shpe-website-2025_products")
        .select("id, name, description, category, image, price, stock")
        .eq("id", Number(itemId))
        .single();

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      setProduct(data);

      // Parse image URLs separated by ';'
      const images = data!.image
        .split(";")
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      // Initialize gallery and thumbnails
      setThumbs(images);
      setGalleryImage(images[0] || "");
    }

    loadProduct();
  }, [itemId]);

  // Fetch size-specific stock once product is loaded
  useEffect(() => {
    if (!product) return;

    async function loadSizeStock() {
      const { data, error } = await supabase
        .from("shpe-website-2025_clothes_sizes")
        .select(sizes.join(", "))
        .eq("id", Number(itemId))
        .single();

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      // Build map of stock per size
      const stockMap: Record<string, number> = {};
      sizes.forEach((sz) => {
        stockMap[sz] = (data as any)[sz] ?? 0;
      });
      setSizeStock(stockMap);

      // Set default selectedSize to first available if current out
      if (stockMap[selectedSize] < 1) {
        const available = sizes.find((sz) => stockMap[sz] > 0);
        if (available) setSelectedSize(available);
      }
    }

    loadSizeStock();
  }, [product, itemId]);

  // Show error or loading states
  if (errorMsg) return <p className="text-red-600 text-center mt-10">{errorMsg}</p>;
  if (!product) return <p className="text-center mt-10">Loading…</p>;

  // Determine max quantity based on selected size
  const maxQty = sizeStock[selectedSize] || 0;
  const qtyOptions = Array.from({ length: Math.max(maxQty, 1) }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-100">
      <Navbar />

      <main className="max-w-6xl mx-auto py-10 px-4 lg:px-0 flex flex-col lg:flex-row lg:space-x-8">
        {/* Thumbnail column (hidden on small screens) */}
        <div className="hidden lg:flex flex-col gap-4 flex-shrink-0 w-24">
          {thumbs.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`${product.name} thumbnail ${idx + 1}`}
              className="w-20 h-20 object-cover border cursor-pointer"
              onClick={() => setGalleryImage(src)}
            />
          ))}
        </div>

        {/* Main image area */}
        <div className="mb-8 lg:mb-0 lg:w-2/3">
          <img
            src={galleryImage}
            alt={product.name}
            className="w-full h-auto object-cover shadow"
          />
        </div>

        {/* Info panel: product details, selectors, add-to-cart */}
        <div className="flex flex-col lg:w-1/3">
          {/* Back link to category page */}
          <Link
            href={`/shop/${encodeURIComponent(category)}`}
            className="mb-2 text-blue-600 hover:text-blue-800"
          >
            ← Back to {category}
          </Link>

          {/* Product title & pricing */}
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold mb-1">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Pay in 4 interest-free payments of ${(product.price / 4).toFixed(2)} with <span className="font-semibold">Afterpay</span>
          </p>

          {/* Size selector (stock hidden from user) */}
          <div className="mb-6">
            <p className="font-medium mb-2">Size:</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((sz) => {
                const stock = sizeStock[sz] || 0;
                const isDisabled = stock < 1;
                const isSelected = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    onClick={() => !isDisabled && setSelectedSize(sz)}
                    disabled={isDisabled}
                    className={`w-10 h-10 border flex items-center justify-center ${
                      isDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : isSelected
                        ? "bg-blue-900 text-white"
                        : "hover:border-blue-900"
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity selector based on size stock */}
          <div className="flex items-center gap-4 mb-6">
            <label htmlFor="qty" className="font-medium">Qty:</label>
            <select
              id="qty"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              disabled={maxQty < 1}
              className="border px-3 py-2"
            >
              {qtyOptions.map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={() =>
              alert(`Added ${product.name} (size ${selectedSize} x${quantity}) to cart!`)
            }
            disabled={maxQty < 1}
            className="bg-yellow-500 text-black font-semibold py-3 hover:bg-yellow-600 disabled:opacity-50"
          >
            {maxQty > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </main>
    </div>
  );
}
