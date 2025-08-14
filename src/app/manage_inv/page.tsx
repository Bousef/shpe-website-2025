"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Navbar from "../_components/NavBar";
import EditItemForm from "../_components/EditItemForm";
import { api } from "~/trpc/react";
import { PlusCircleIcon, XMarkIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import CreateItemForm from "../_components/CreateItemForms";

export default function InventoryManagement() {
  const [showAdd, setShowAdd] = useState(false);
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<null | { id: string; name: string }>(null);

  // 1) Items
  const { data: itemsRes } = api.square.catalog.listCatalog.useQuery({ types: "ITEM" });
  const rawItems = useMemo(() => itemsRes ?? [], [itemsRes]);

  useEffect(() => {
    console.log("Raw items fetched:", rawItems);
  }, [rawItems]);
  
  // 2) Categories
  const { data: categoriesRes } = api.square.catalog.listCatalog.useQuery({ types: "CATEGORY" });
  const rawCategories = useMemo(() => categoriesRes ?? [], [categoriesRes]);

  // 3) Category lookup
  const categoryLookup = useMemo(() => {
    return rawCategories.reduce<Record<string, string>>((map, obj) => {
      const id = obj.id;
      const name = obj.type === "CATEGORY" ? obj.categoryData?.name ?? "" : "";
      if (id) map[id] = name;
      return map;
    }, {});
  }, [rawCategories]);

  // 4) Collect itemIds (for image lookup)
  const itemIds = useMemo<string[]>(
    () =>
      rawItems
        .map((it: any) => it.id as string | undefined)
        .filter((id): id is string => !!id && id.trim() !== ""),
    [rawItems]
  );

  // 5) Batch fetch the FIRST image URL for each item (server returns a flat array aligned to input order)
  const {
    data: itemImageUrls = [], // string[]
    isLoading: isLoadingImages,
    error: imagesError,
  } = api.square.catalog.batchGetImages.useQuery(
    { objectIds: itemIds, includeRelatedObjects: false },
    { enabled: itemIds.length > 0 }
  );

  const imageByItemId = useMemo(() => {
    const map = new Map<string, string | null>();
    for (const { objectId, url } of itemImageUrls) {
      map.set(objectId, url ?? null);
    }
    return map;
  }, [itemImageUrls]);

  // 7) Final table data
  const items = useMemo(
    () => {
      console.log("Processing items. Raw items:", rawItems);
      console.log("Category lookup:", categoryLookup);
      
      return rawItems.map((item: any) => {
        const id = item.id as string;
        const name = item.itemData?.name ?? "Unnamed Item";
        const description = item.itemData?.description ?? "";
        
        // Check all possible places where category could be stored
        console.log("Item structure for", name, ":", {
          categoryId: item.itemData?.categoryId,
          categories: item.itemData?.categories,
          fullItemData: item.itemData
        });
        
        // Try the new categories array first, fallback to deprecated categoryId
        const categoryId = item.itemData?.categories?.[0]?.id ?? item.itemData?.categoryId ?? "";
        const category = categoryLookup[categoryId] ?? "";
        const url = imageByItemId.get(id) ?? "";

        const priceCents =
          item.itemData?.variations?.[0]?.itemVariationData?.priceMoney?.amount ?? 0n;
        const price = (Number(priceCents) / 100).toFixed(2);

        return { id, name, description, category, url, price };
      });
    },
    [rawItems, categoryLookup, imageByItemId]
  );

  const deleteMutation = api.square.catalog.deleteCatalogObject.useMutation({
    onSuccess: async () => {
      const idx = items.findIndex(item => item.id === deletingId);
      items.splice(idx, 1);
    },
  });

  const handleEdit = (id: string, name: string) => {
    setEditingItem({ id, name });
  };

  const handleCloseEditForm = () => {
    setEditingItem(null);
  };

  const handleDelete = async (id: string, name: string) => {
    const ok = window.confirm(`Delete "${name}"? This cannot be undone.`);
    if (!ok) return;
    try {
      setDeletingId(id);
      // If your router expects a different key than objectId, change it here.
      await deleteMutation.mutateAsync({ objectId: id } as any);
    } catch (err: any) {
      window.alert(err?.message ?? "Failed to delete item.");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoadingImages) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header with toggle button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-blue-900">Inventory</h1>
          <button
            onClick={() => setShowAdd((prev) => !prev)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
          >
            {showAdd ? (
              <><XMarkIcon className="h-5 w-5" /> Cancel</>
            ) : (
              <><PlusCircleIcon className="h-5 w-5" /> Add Item</>
            )}
          </button>
        </div>

        {/* Add Item Form */}
        <div className="mb-10">
          {showAdd && (
            <CreateItemForm
              onSave={() => {
                void queryClient.invalidateQueries({ queryKey: ["catalog"] });
                setShowAdd(false);
              }}
            />
          )}
        </div>

        {/* Inventory Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow table-fixed">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="py-3 px-4 border-b">Image</th>
                <th className="py-3 px-4 border-b">ID</th>
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Category</th>
                <th className="py-3 px-4 border-b">Price</th>
                <th className="py-3 px-4 border-b w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                if (!item) return null;

                const isDeleting = deletingId === item.id;

                return (
                  <tr key={item.id} className="hover:bg-gray-50 h-20">
                    <td className="px-4 border-b">
                      {item.url ? (
                        <Image
                          src={item.url}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="object-cover rounded"
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 border-b text-sm">{item.id}</td>
                    <td className="px-4 border-b text-sm">{item.name}</td>
                    <td className="px-4 border-b text-sm">{item.category}</td>
                    <td className="px-4 border-b text-sm">${item.price}</td>
                    <td className="px-4 border-b text-sm">
                      <button
                        onClick={() => handleEdit(item.id, item.name)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-green-200 text-green-600 hover:bg-green-50 disabled:opacity-50 cursor-pointer"
                        title="Edit item"
                      >
                        <PencilIcon className="h-4 w-4" />
                        {isDeleting ? "Editing..." : "Edit"}
                      </button>
                    </td>
                    <td className="px-4 border-b text-sm">
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        disabled={isDeleting}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                        title="Delete item"
                      >
                        <TrashIcon className="h-4 w-4" />
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {editingItem && (
          <EditItemForm
            itemId={editingItem.id}
            onClose={handleCloseEditForm}
          />
        )}
      </div>
    </>
  );
}