/* Testing Purposes Only! Delete Later :P */

"use client";

import { api } from "~/trpc/react";

export default function SquareConnectionTester() {
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = api.square.catalog.listCatalog.useQuery({ types: "CATEGORY" });

  const {
    data: itemsData,
    isLoading: isLoadingItems,
    error: itemsError,
  } = api.square.catalog.listCatalog.useQuery({ types: "ITEM" });

  if (isLoadingCategories || isLoadingItems) return <p> Loading catalog...</p>;

  if (categoriesError || itemsError)
    return (
      <p className="text-red-600">
        Error: {(categoriesError?.message ?? itemsError?.message) ?? "Unknown error"}
      </p>
    );

  return (
    <div className="space-y-10 p-6 bg-gray-50 min-h-screen">
      <section>
        <h2 className="text-2xl font-bold mb-2"> Categories</h2>
        <p>Found {categoriesData?.length ?? 0} categories</p>

        <div className="grid gap-3 mt-3">
          {categoriesData?.map((cat) => (
            <div key={cat.id} className="bg-white p-3 rounded border shadow-sm">
              <p><strong>Name:</strong> {("categoryData" in cat && cat.categoryData?.name) ?? "Unnamed"}</p>
              <p><strong>ID:</strong> {cat.id}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-2">Items</h2>
        <p>Found {itemsData?.length ?? 0} items</p>

        <div className="grid gap-3 mt-3">
          {itemsData?.map((item) => (
              <div key={item.id}>
                <p><strong>Name:</strong> {"itemData" in item && item.itemData?.name}</p>
                <p><strong>ID:</strong> {item.id}</p>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}