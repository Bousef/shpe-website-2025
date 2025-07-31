// src/app/shop/[category]/[itemId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import Navbar from "../../../_components/NavBar";
import { supabase } from "../../../../supabase-client";
import type { Product } from "../../../_components/AddProductForm";
import { boolean } from "drizzle-orm/gel-core";
import { api } from "~/trpc/react";

/**
 * ItemPage component
 * Fetches and displays details for a single product, including:
 * - Responsive image gallery (multiple images separated by ';')
 * - Product info (name, price, description)
 * - Dynamic size & quantity selectors based on stock
 * - Add to cart button
 */
export default function ItemPage() {
  const { category, itemId } = useParams()!;

  const [product, setProduct] = useState<Product | null>(null);
  const [galleryImage, setGalleryImage] = useState<string>("");
  const [thumbs, setThumbs] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [quantity, setQuantity] = useState<number>(1);

  const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
  const [sizeStock, setSizeStock] = useState<Record<string, number>>({});

  const addProduct = api.user.cart.addProduct.useMutation({
    onSuccess: () => {
      return; // Handle successful addition to cart
    },
  });

useEffect(() => {
  async function loadProduct() {
    const { data, error } = await supabase
      .from("shpe-website-2025_products")
      .select("id, name, description, category, image, price, stock, status")
      .eq("id", Number(itemId))
      .single();

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setProduct(data);

    // image is already "https://...;https://...;…"
    const rawUrls = data!.image
      .split(";")
      .map((s: string) => s.trim())
      .filter(Boolean);

    setThumbs(rawUrls);
    setGalleryImage(rawUrls[0] || "");
  }

  loadProduct();
}, [itemId]);

  const showSizes = (category === "Clothes");

  if (showSizes) {
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
        const stockMap: Record<string, number> = {};
        sizes.forEach((sz) => {
          stockMap[sz] = (data as any)[sz] ?? 0;
        });
        setSizeStock(stockMap);
        if ((stockMap[selectedSize] ?? 0) < 1) {
          const avail = sizes.find((sz) => (stockMap[sz] ?? 0) > 0);
          if (avail) setSelectedSize(avail);
        }
      }
      loadSizeStock();
    }, [product, itemId]);
  } 
    const stock = product?.stock ?? 0;
  

  if (errorMsg)
    return <p className="text-red-600 text-center mt-10">{errorMsg}</p>;
  if (!product)
    return <p className="text-center mt-10">Loading…</p>;

const productStock = product?.stock ?? 0;
const availableQty = showSizes ? (sizeStock[selectedSize] ?? 0) : productStock;

const qtyOptions = Array.from({ length: Math.max(availableQty, 1) }, (_, i) => i + 1);


  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex justify-end px-4 lg:px-48 mt-4">
  <Link
    href="/cart"
    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded shadow"
  >
    🛒 View Cart
  </Link>
</div>

      <main className="max-w-6xl mx-auto py-10 px-4 lg:px-0 flex flex-col lg:flex-row lg:space-x-8">
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

        <div className="mb-8 lg:mb-0 lg:w-2/3">
          <img
            src={galleryImage}
            alt={product.name}
            className="w-full h-auto object-cover shadow"
          />
        </div>

        <div className="flex flex-col lg:w-1/3">
          <Link
            href={`/shop/${encodeURIComponent(category as string)}`}
            className="mb-2 text-blue-600 hover:text-blue-800"
          >
            ← Back to {category}
          </Link>

          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold mb-1">${product.price.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mb-6">
            Pay in 4 interest-free payments of ${(
              product.price / 4
            ).toFixed(2)} with <span className="font-semibold">Afterpay</span>
          </p>

          {showSizes && (
            <div className="mb-6">
              <p className="font-medium mb-2">Size:</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((sz) => {
                  const stock = sizeStock[sz] || 0;
                  const disabled = stock < 1;
                  const selected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => !disabled && setSelectedSize(sz)}
                      disabled={disabled}
                      className={`w-10 h-10 border flex items-center justify-center ${disabled
                          ? "opacity-50 cursor-not-allowed"
                          : selected
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
          )}
          <div className="flex items-center gap-4 mb-6">
            <label htmlFor="qty" className="font-medium">
              Qty:
            </label>
            <select
              id="qty"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              disabled={availableQty < 1}
              className="border px-3 py-2"
            >
              {qtyOptions.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() =>
              {
                addProduct.mutate({
                  product_id: product.id,
                  quantity,
                });
                
                alert(`Added ${product.name} (size ${selectedSize} x${quantity}) to cart!`)
              }
            }
            disabled={availableQty < 1}
            className="bg-yellow-500 text-black font-semibold py-3 hover:bg-yellow-600 disabled:opacity-50"
          >
            {showSizes ? (availableQty > 0 ? "Add to Cart" : "Out of Stock") : (stock > 0 ? "Add to Cart" : "Out of Stock")}
          </button>
        </div>
      </main>
    </div>
  );
}
