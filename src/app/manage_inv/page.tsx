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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header with toggle button */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-blue-900 mb-2">Inventory Management</h1>
              <p className="text-gray-600">Manage your store items, categories, and pricing</p>
            </div>
            <button
              onClick={() => setShowAdd((prev) => !prev)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {showAdd ? (
                <><XMarkIcon className="h-5 w-5" /> Cancel</>
              ) : (
                <><PlusCircleIcon className="h-5 w-5" /> Add New Item</>
              )}
            </button>
          </div>

          {/* Add Item Form */}
          {showAdd && (
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Item</h2>
                <CreateItemForm
                  onSave={() => {
                    void queryClient.invalidateQueries({ queryKey: ["catalog"] });
                    setShowAdd(false);
                  }}
                />
              </div>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{items.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{Object.keys(categoryLookup).length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${items.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900">Items ({items.length})</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
                          <p className="text-gray-500 mb-4">Get started by adding your first item to the inventory.</p>
                          <button
                            onClick={() => setShowAdd(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <PlusCircleIcon className="w-4 h-4 mr-2" />
                            Add Item
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => {
                      if (!item) return null;

                      const isDeleting = deletingId === item.id;

                      return (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex-shrink-0 h-16 w-16">
                              {item.url ? (
                                <Image
                                  src={item.url}
                                  alt={item.name}
                                  width={64}
                                  height={64}
                                  className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                                />
                              ) : (
                                <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center border border-gray-200">
                                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <div className="text-sm font-medium text-gray-900 mb-1">{item.name}</div>
                              <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded truncate max-w-xs">
                                {item.id}
                              </div>
                              {item.description && (
                                <div className="text-xs text-gray-600 mt-1 truncate max-w-xs">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {item.category || "Uncategorized"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">${item.price}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleEdit(item.id, item.name)}
                                disabled={isDeleting}
                                className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Edit item"
                              >
                                <PencilIcon className="h-4 w-4 mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item.id, item.name)}
                                disabled={isDeleting}
                                className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete item"
                              >
                                <TrashIcon className="h-4 w-4 mr-1" />
                                {isDeleting ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Item Modal */}
          {editingItem && (
            <div className="fixed inset-0 bg-blur bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Edit Item</h2>
                    <button
                      onClick={handleCloseEditForm}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  <EditItemForm
                    itemId={editingItem.id}
                    onClose={handleCloseEditForm}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}