"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "../_components/NavBar";
import CreateCatalogObjectForm from "../shop/_components/CreateItemForm";

import {
  getCatalog,              // returns the whole catalog array
} from "../shop/actions/actions";

import {
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

/* --------------- helper: map ITEM -> row with img ---------------- */
type ProductRow = {
  id: string;
  name: string;
  categoryId?: string;
  categoryName?: string;
  price: number;
  imageUrl?: string;
};

const mapItem = (
  obj: any,
  categories: Record<string, string>,
  images: Record<string, string>
): ProductRow => {
  const priceCents =
    obj.itemData?.variations?.[0]?.itemVariationData?.priceMoney?.amount ?? 0;

  const catId = obj.itemData?.categoryId ?? obj.itemData?.category_id;
  const firstImgId = obj.itemData?.imageIds?.[0];
  return {
    id: obj.id,
    name: obj.itemData?.name ?? "",
    categoryId: catId,
    categoryName: categories[catId],
    price: Number(priceCents) / 100,
    imageUrl: firstImgId ? images[firstImgId] : undefined,
  };
};

/* ---------------------------- component --------------------------- */
export default function InventoryManagement() {
  const queryClient = useQueryClient();

  const { data: rows, isLoading } = useQuery({
    queryKey: ["catalog"],
    queryFn: async () => {
      const catalog = await getCatalog();

      /* 1️⃣  build fast look‑ups */
      const categoryMap = Object.fromEntries(
        catalog
          .filter((o: any) => o.type === "CATEGORY")
          .map((c: any) => [c.id, c.categoryData?.name ?? ""])
      );

      const imageMap = Object.fromEntries(
        catalog
          .filter((o: any) => o.type === "IMAGE")
          .map((img: any) => [img.id, img.imageData?.url ?? ""])
      );

      /* 2️⃣  convert items into table rows */
      return catalog
        .filter((o: any) => o.type === "ITEM")
        .map((it: any) => mapItem(it, categoryMap, imageMap));
    },
  });

  const [showAdd, setShowAdd] = useState(false);

  if (isLoading) return <p className="text-center mt-10">Loading…</p>;
  if (!rows)      return <p className="text-center mt-10 text-red-600">Failed.</p>;

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-blue-900">Inventory</h1>
          <button
            onClick={() => setShowAdd((p) => !p)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {showAdd ? (
              <>
                <XMarkIcon className="h-5 w-5" /> Cancel
              </>
            ) : (
              <>
                <PlusCircleIcon className="h-5 w-5" /> Add Item
              </>
            )}
          </button>
        </div>

        {showAdd && (
          <CreateCatalogObjectForm
            onSave={() => {
              queryClient.invalidateQueries({ queryKey: ["catalog"] });
              setShowAdd(false);
            }}
          />
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow table-fixed">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 border-b">Image</th>
                <th className="py-3 px-4 border-b">ID</th>
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Category</th>
                <th className="py-3 px-4 border-b">Price</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 h-20">
                  <td className="px-4 border-b">
                    {p.imageUrl ? (
                      <Image
                        src={p.imageUrl}
                        alt={p.name}
                        width={50}
                        height={50}
                        className="object-cover rounded"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 border-b text-sm">{p.id}</td>
                  <td className="px-4 border-b text-sm">{p.name}</td>
                  <td className="px-4 border-b text-sm">
                    {p.categoryName ?? p.categoryId ?? "—"}
                  </td>
                  <td className="px-4 border-b text-sm">${p.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}