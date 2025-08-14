"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import Navbar from "../../../_components/NavBar";
import { api } from "~/trpc/react";
import Image from "next/image";
import NextImage from "next/image";

export default function ItemPage() {
  // 1. Route params
  const params = useParams<{ category: string; itemId: string }>();
  const category = params.category;
  const itemId = params.itemId;

  // 2. UI state
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [galleryImage, setGalleryImage] = useState<string>("");

  const {
    data: imageData,
    isLoading: imageLoading,
    error: imageError, }
    = api.square.catalog.getImages.useQuery({ objectId: itemId, includeRelatedObjects: true });



  //const forcedImages: string[] = [];

  // 3. Current member (for customerId)
  const { data: member } = api.user.getCurrentMember.useQuery();

  // 4. Fetch item + related objects
  const {
    data: itemRes,
    isLoading: itemLoading,
    error: itemError,
  } = api.square.catalog.RetrieveCatalogObject.useQuery({
    objectId: itemId,
    includeRelatedObjects: true,
  });

  // 5. Extract ITEM object & variations
  const obj = itemRes?.object as
    | ({
      id: string;
      type: string;
      itemData?: {
        name?: string;
        variations?: Array<{
          id: string;
          type: string;
          itemVariationData?: unknown;
        }>;
      };
    })
    | undefined;
  const itemData = obj?.itemData;
  const variations =
    itemData?.variations?.filter((v) => v.type === "ITEM_VARIATION") ?? [];
  const variationIds = variations.map((v) => v.id);

  // 6. Fetch inventory counts
  const {
    data: invRes,
    isLoading: invLoading,
    error: invError,
  } = api.square.inventory.batchRetrieveInventoryCounts.useQuery({
    body: { catalogObjectIds: variationIds },
  });


  // 7. Build size/stock arrays
  const stocks: number[] =
    invRes?.result.counts?.map((c) => Number(c.quantity) || 0) ?? [];
  const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
  const sizeStockPairs = sizes.map((size, idx) => ({
    size,
    stock: stocks[idx] ?? 0,
  }));

  // 8. Handle images

  const placeholderImage = "/images/placeholderCatalog.jpg"; // Fallback image
  const allImages = imageData && imageData.length > 0 ? imageData : [placeholderImage];  //imageData && imageData.length > 0 ? imageData : [placeholderImage]
  //const firstImage = allImages[0];    //allImages[0] ?? ""

  // 9. Derived hooks & helpers (all unconditionally here)
  const stockBySize = useMemo(
    () =>
      sizeStockPairs.reduce<Record<string, number>>((acc, { size, stock }) => {
        acc[size] = stock;
        return acc;
      }, {}),
    [sizeStockPairs]
  );
  const showSizes = category.toLowerCase() === "clothes";
  const stock = stocks[0] ?? 0;
  const availableQty = showSizes
    ? selectedSize
      ? stockBySize[selectedSize] ?? 0
      : 0
    : stock;
  const qtyOptions = Array.from(
    { length: Math.min(availableQty, 10) },
    (_, i) => i + 1
  );
  const createDraftOrder = api.square.orders.createOrder.useMutation();
  const isSizeSelected = (size: string) => selectedSize === size;
  const getSizeButtonClass = (size: string, stock: number) => {
    if (stock < 1) return "opacity-50 cursor-not-allowed";
    return isSizeSelected(size)
      ? "bg-blue-900 text-white"
      : "hover:border-blue-900";
  };

  // 10. Price & product info
  const variationData = variations[0]?.itemVariationData as {
    priceMoney?: { amount?: bigint };
    [key: string]: unknown;
  } | undefined;
  const amountCents = variationData?.priceMoney?.amount ?? 0n;
  const price = Number(amountCents) / 100;
  const product = { id: obj?.id ?? "", name: itemData?.name ?? "" };
  const locId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? "";

  // 11. Side‐effect: set initial gallery image
  useEffect(() => {
    if (imageData && imageData.length > 0) {
      setGalleryImage(imageData[0] ?? "");
    }
  }, [imageData]);

  // 12. Early returns
  if (itemLoading || invLoading) return <div>Loading...</div>;
  if (itemError) return <div>Error: {itemError.message}</div>;
  if (invError) return <div>Error loading stock</div>;
  if (!obj || obj.type !== "ITEM") return <div>Not an item</div>;
  if (!variationData) return <div>No variations available</div>;
  if (imageData === undefined) {
    console.error(imageError);
    return <div>Error: No images found for this item.</div>;
  }
  // 13. Final render
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* View cart link */}
      <div className="flex justify-end px-4 lg:px-48 mt-4">
        <Link
          href="/cart"
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded shadow"
        >
          🛒 View Cart
        </Link>
      </div>

      <main className="max-w-6xl mx-auto py-10 px-4 lg:px-0 flex flex-col lg:flex-row lg:space-x-8">
        {/* Thumbnails */}
        <div className="hidden lg:flex flex-col gap-4 flex-shrink-0 w-24">
          {allImages.map((url, idx) => (
            <div
              key={idx}
              className={`relative w-20 h-20 border cursor-pointer ${galleryImage === url ? "ring-2 ring-blue-600" : ""
                }`}
              onClick={() => setGalleryImage(url)}
            >
              <Image
                src={url || placeholderImage}
                alt={`${itemData?.name} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover rounded"
              />
            </div>
          ))}
        </div>

        {/* Main image */}
        <div className="mb-8 lg:mb-0 lg:w-2/3">
          <NextImage
            src={galleryImage || placeholderImage}
            alt={itemData?.name ?? "Productt Image"}
            width={800}               // intrinsic width
            height={600}              // intrinsic height
            sizes="(min-width:1024px) 66vw, 100vw"
            className="w-full h-auto object-cover shadow rounded"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col lg:w-1/3">
          <Link
            href={`/shop/${encodeURIComponent(category)}`}
            className="mb-2 text-blue-600 hover:text-blue-800"
          >
            ← Back to {category}
          </Link>

          <h1 className="text-3xl font-bold mb-4">{itemData?.name}</h1>
          <p className="text-2xl font-semibold mb-1">${price.toFixed(2)}</p>
          <p className="text-sm text-gray-600 mb-6">
            Pay in 4 interest-free payments of ${price.toFixed(2)} with{" "}
            <span className="font-semibold">Afterpay</span>
          </p>

          {/* Size selector */}
          {showSizes && (
            <div className="mb-6">
              <p className="font-medium mb-2">Size:</p>
              <div className="flex flex-wrap gap-2">
                {sizeStockPairs.map(({ size, stock }) => {
                  const disabled = stock < 1;
                  return (
                    <button
                      key={size}
                      onClick={() => !disabled && setSelectedSize(size)}
                      disabled={disabled}
                      className={` w-10 h-10 border flex items-center justify-center
                        ${getSizeButtonClass(size, stock)}
                              rounded cursor-pointer`}
                    >
                      {size} {disabled ? "(OOS)" : `(${stock})`}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity selector */}
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

          {/* Add to Cart (draft order) */}
          <button
            onClick={() => {
              createDraftOrder.mutate({
                idempotency_Key: crypto.randomUUID(),
                order: {
                  locationId: locId,
                  customerId: member?.square_customer_id,
                  lineItems: [
                    {
                      catalogObjectId: product.id,
                      quantity: quantity.toString(),
                      basePriceMoney: {
                        amount: BigInt(Math.round(price * 100)),
                        currency: "USD",
                      },
                    },
                  ],
                },
              });
              alert(
                `Added ${product.name} (size ${selectedSize} x${quantity}) to cart!`
              );
            }}
            disabled={availableQty < 1}
            className="bg-yellow-500 text-black font-semibold py-3 hover:bg-yellow-600 disabled:opacity-50"
          >
            {showSizes
              ? availableQty > 0
                ? "Add to Cart"
                : "Out of Stock"
              : stock > 0
                ? "Add to Cart"
                : "Out of Stock"}
          </button>
        </div>
      </main>
    </div>
  );
}
