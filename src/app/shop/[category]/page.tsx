// src/app/shop/[category]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../_components/NavBar";
import { getCatalog, getObjectURL } from "../../shop/actions/actions";
import type { Square } from "square";

interface ItemWithUrl {
  id: string;
  name: string;
  description?: string;
  url: string;
  price: string;
}

type LoadState = {
  loading: boolean;
  error: string | null;
  items: ItemWithUrl[];
};

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }): JSX.Element {
  const { category } = React.use(params);
  const [state, setState] = useState<LoadState>({ loading: true, error: null, items: [] });
  const slug = category.toLowerCase();

  useEffect(() => {
    let cancelled = false;
    async function loadItems(): Promise<void> {
      try {
        const catalog = await getCatalog();
        const categoryObj = catalog.find(
          (o): o is Square.CatalogObject & { categoryData: { name: string } } =>
            o.type === "CATEGORY" &&
            !!o.categoryData?.name &&
            o.categoryData.name.toLowerCase().replace(/\s+/g, "-") === slug
        );
        if (!categoryObj) {
          if (!cancelled) setState({ loading: false, error: null, items: [] });
          return;
        }

        const items: ItemWithUrl[] = [];
        for (const obj of catalog) {
          if (obj.type !== "ITEM" || !obj.itemData) continue;
          const item = obj.itemData;
          if (!item.categories?.some(c => c.id === categoryObj.id)) continue;

          // Inline variation lookup
          const variationData = item.variations?.[0]?.itemVariationData;
          if (!variationData) console.warn(`No variations for item ${obj.id}`);
          const cents = variationData?.priceMoney?.amount ?? 0n;
          const price = (Number(cents) / 100).toFixed(2);

          // Image URL or placeholder
          const imageId = item.imageIds?.[0];
          const url = imageId ? (await getObjectURL(imageId)) ?? '/placeholder.png' : '/placeholder.png';

          items.push({ id: obj.id, name: item.name, description: item.description, url, price });
        }
        if (!cancelled) setState({ loading: false, error: null, items });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        if (!cancelled) setState({ loading: false, error: message, items: [] });
      }
    }
    loadItems();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state.loading) {
    // Skeleton loader rows
    return (
      <div className="p-4">
        <p className="animate-pulse text-center">Loading products…</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="p-4 text-red-600 text-center">
        Error loading products: {state.error}
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="p-4 text-center">No items in &ldquo;{category}&rdquo;</div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <header className="flex justify-between items-center px-4 lg:px-48 mt-4">
        <Link href="/shop" className="text-blue-600 hover:underline">
          ← Back
        </Link>
        <h1 className="text-5xl font-bold uppercase text-yellow-500">{category}</h1>
        <Link
          href="/cart"
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded"
        >
          🛒 Cart
        </Link>
      </header>
      <main className="px-4 py-10 lg:px-96 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {state.items.map(({ id, name, description, url, price }) => (
          <Link key={id} href={`/shop/${category}/${id}`} className="block">
            <div className="relative mb-2 aspect-[3/4] bg-gray-200">
              <Image
                src={url}
                alt={name}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-lg font-semibold text-blue-900">{name}</p>
            {description && <p className="text-blue-900 mb-1">{description}</p>}
            <p className="text-xl text-blue-900">${price}</p>
          </Link>
        ))}
      </main>
    </div>
  );
}
