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


  // 3. Current member (for customerId)
  const { data: member } = api.user.getCurrentMember.useQuery();

  // Add to cart mutation
  const addToCart = api.user.addToCart.useMutation({
    onSuccess: () => {
      alert(`Added ${itemData?.name} (size ${selectedSize} x${quantity}) to cart!`);
    },
    onError: (error) => {
      if (error.message.includes("not authenticated") || error.message.includes("Authentication required")) {
        alert("Please log in to add items to your cart");
        // Redirect to login page
        window.location.href = "/login";
      } else {
        alert(`Error adding to cart: ${error.message}`);
      }
    },
  });

  // 4. Fetch item + related objects
  const {
    data: itemRes,
    isLoading: itemLoading,
    error: itemError,
  } = api.square.catalog.retrieveCatalogObject.useQuery({
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
        description?: string;
        descriptionHtml?: string;
        descriptionPlaintext?: string;
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


  // 7. Build size/stock arrays - extract sizes from actual variations
  console.log("Inventory response:", invRes);
  console.log("Variations:", variations);
  
  // Extract sizes from variations
  const variationSizeMap = variations.map((variation, index) => {
    const variationData = variation.itemVariationData as any;
    const sizeName = variationData?.name || `Size ${index + 1}`;
    return {
      size: sizeName,
      variationId: variation.id,
      index,
    };
  });

  // Handle different possible response structures from Square API
  let stocks: number[] = [];
  if (invRes) {
    if (Array.isArray(invRes)) {
      // If response is directly an array of inventory counts
       stocks = invRes.map((count: any) => Number(count.quantity) || 0);
    } else if ((invRes as any)?.counts && Array.isArray((invRes as any).counts)) {
      // If response has a counts property
      stocks = (invRes as any).counts.map((count: any) => Number(count.quantity) || 0);
    } else {
      console.warn("Unexpected inventory response structure:", invRes);
    }
  }

  const sizeStockPairs = variationSizeMap.map(({ size, variationId }, idx) => ({
    size,
    variationId,
    stock: stocks[idx] ?? 0,
  }));

  const allImages = imageData ?? [];
  const firstImage = allImages[0] ?? ""; // Keep as empty string, handle fallback in rendering

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
  const getVariationData = () => {
    if (!showSizes) {
      return variations[0]?.itemVariationData as {
        priceMoney?: { amount?: bigint };
        [key: string]: unknown;
      } | undefined;
    }
    
    if (!selectedSize) {
      return variations[0]?.itemVariationData as {
        priceMoney?: { amount?: bigint };
        [key: string]: unknown;
      } | undefined;
    }
    
    // Find the variation that matches the selected size
    const selectedVariationIndex = sizeStockPairs.findIndex(pair => pair.size === selectedSize);
    const targetVariation = variations[selectedVariationIndex >= 0 ? selectedVariationIndex : 0];
    return targetVariation?.itemVariationData as {
      priceMoney?: { amount?: bigint };
      [key: string]: unknown;
    } | undefined;
  };

  const variationData = getVariationData();
  const amountCents = variationData?.priceMoney?.amount ?? 0n;
  const price = Number(amountCents) / 100;
  const product = { id: obj?.id ?? "", name: itemData?.name ?? "" };
  const locId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? "";

  // Helper function to get the correct variation ID based on selected size
  const getVariationId = () => {
    if (!showSizes) {
      // For non-clothing items, use the first (and likely only) variation
      return variations[0]?.id ?? product.id;
    }
    
    if (!selectedSize) {
      return null; // No size selected yet
    }
    
    // Find the variation that matches the selected size
    const selectedPair = sizeStockPairs.find(pair => pair.size === selectedSize);
    return selectedPair?.variationId ?? null;
  };

  // 11. Side‐effect: set initial gallery image
  useEffect(() => {
    if (firstImage && firstImage.trim() !== "" && !galleryImage) {
      setGalleryImage(firstImage);
    }
  }, [firstImage, galleryImage]);

  // 12. Auto-select first available size for clothing items
  useEffect(() => {
    if (showSizes && !selectedSize && sizeStockPairs.length > 0) {
      const firstAvailableSize = sizeStockPairs.find(({ stock }) => stock > 0);
      if (firstAvailableSize) {
        setSelectedSize(firstAvailableSize.size);
      }
    }
  }, [showSizes, selectedSize, sizeStockPairs]);

  // 13. Early returns
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
        {/* Mobile thumbnails - horizontal scroll */}
        <div className="lg:hidden mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allImages.filter(url => url && url.trim() !== "").map((url, idx) => (
              <div
                key={idx}
                className={`relative flex-shrink-0 w-16 h-16 border cursor-pointer ${
                  galleryImage === url ? "ring-2 ring-blue-600" : ""
                }`}
                onClick={() => setGalleryImage(url)}
              >
                <Image
                  src={url}
                  alt={`${itemData?.name} thumbnail ${idx + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover rounded"
                  quality={60}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop thumbnails */}
        <div className="hidden lg:flex flex-col gap-4 flex-shrink-0 w-24">
          {allImages.filter(url => url && url.trim() !== "").map((url, idx) => (
            <div
              key={idx}
              className={`relative w-20 h-20 border cursor-pointer ${galleryImage === url ? "ring-2 ring-blue-600" : ""
                }`}
              onClick={() => setGalleryImage(url)}
            >
              <Image
                src={url}
                alt={`${itemData?.name} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover rounded"
                quality={60}              // Lower quality for thumbnails
                loading="lazy"            // Lazy load thumbnails
              />
            </div>
          ))}
        </div>

        {/* Main image */}
        <div className="mb-8 lg:mb-0 lg:w-2/3">
          <div className="relative w-full max-h-screen overflow-hidden">
            <NextImage
              src={galleryImage && galleryImage.trim() !== "" ? galleryImage : "/assets/logo.svg"}
              alt={itemData?.name || "Product image"}
              width={1200}              // Increased for better quality on larger screens
              height={900}              // Maintain 4:3 aspect ratio
              sizes="(min-width: 1024px) 60vw, (min-width: 768px) 80vw, 95vw"
              className="w-full h-auto max-h-screen object-contain shadow rounded"
              priority={true}           // Load main image with priority
              quality={85}              // Optimize quality vs file size
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col lg:w-1/3 lg:pl-8">
          <Link
            href={`/shop/${encodeURIComponent(category)}`}
            className="inline-flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {category}
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3 text-gray-900 leading-tight">{itemData?.name}</h1>
            
            {/* Item description */}
            {(itemData?.description || itemData?.descriptionHtml || itemData?.descriptionPlaintext) && (
              <div className="mb-4">
                {itemData?.descriptionHtml ? (
                  <div 
                    className="text-gray-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: itemData.descriptionHtml }}
                  />
                ) : (
                  <p className="text-gray-600 leading-relaxed">
                    {itemData?.description || itemData?.descriptionPlaintext}
                  </p>
                )}
              </div>
            )}
            
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">${price.toFixed(2)}</span>
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-700 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Pay in 4 interest-free payments of <span className="font-semibold">${(price / 4).toFixed(2)}</span> with{" "}
                <span className="font-bold text-purple-600">Afterpay</span>
              </p>
            </div>
          </div>

          {/* Size selector */}
          {showSizes && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Size</h3>
                {selectedSize && (
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                    {selectedSize} selected
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {sizeStockPairs.map(({ size, stock }) => {
                  const disabled = stock < 1;
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => !disabled && setSelectedSize(size)}
                      disabled={disabled}
                      className={`
                        relative h-12 border-2 rounded-lg font-semibold text-sm
                        transition-all duration-200 transform hover:scale-105
                        flex items-center justify-center
                        ${
                          disabled
                            ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed hover:scale-100'
                            : isSelected
                            ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                        }
                      `}
                    >
                      <span className="relative z-10">{size}</span>
                      {disabled && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-px bg-gray-400 transform rotate-12"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {!selectedSize && (
                <p className="text-sm text-gray-500 mt-2 italic">
                  Please select a size to continue
                </p>
              )}
            </div>
          )}

          {/* Quantity selector */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quantity</h3>
            <div className="flex items-center gap-4">
              <select
                id="qty"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                disabled={availableQty < 1}
                className="
                  border-2 border-gray-300 rounded-lg px-4 py-3 text-gray-700 
                  font-medium bg-white focus:border-blue-500 focus:ring-2 
                  focus:ring-blue-500/20 focus:outline-none transition-all duration-200
                  disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200
                  min-w-[80px]
                "
              >
                {qtyOptions.map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <div className="text-sm text-gray-500">
                {availableQty > 0 ? (
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    {availableQty} in stock
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    Out of stock
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="space-y-4">
            <button
              onClick={() => {
                // Check if user is logged in first
                if (!member) {
                  window.location.href = "/login";
                  return;
                }
                
                if (showSizes && !selectedSize) {
                  alert("Please select a size");
                  return;
                }
                
                const variationId = getVariationId();
                if (!variationId) {
                  alert("Unable to determine item variation. Please try again.");
                  return;
                }
                
                addToCart.mutate({
                  catalogObjectId: variationId,
                  quantity: quantity.toString(),
                  basePriceMoney: {
                    amount: BigInt(Math.round(price * 100)),
                    currency: "USD",
                  },
                  selectedSize: selectedSize || undefined,
                });
              }}
              disabled={availableQty < 1 || addToCart.isPending}
              className={`
                w-full py-4 px-6 rounded-xl font-bold text-lg
                transition-all duration-300 transform hover:scale-[1.02]
                shadow-lg hover:shadow-xl
                flex items-center justify-center gap-2
                ${
                  availableQty < 1 || addToCart.isPending
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:scale-100'
                    : !member
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25'
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black shadow-yellow-500/25'
                }
              `}
            >
              {addToCart.isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding to Cart...
                </>
              ) : !member ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login to Add to Cart
                </>
              ) : availableQty > 0 ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l-2.5 5m0 0h5.5M7 13l5.5 5" />
                  </svg>
                  Add to Cart
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Out of Stock
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
