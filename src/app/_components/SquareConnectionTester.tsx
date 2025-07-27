/* Testing Purposes Only! Delete Later :P */

"use client";

import { api } from "~/trpc/react";

export default function SquareConnectionTester() {
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = api.catalog.listCatalog.useQuery({ types: "CATEGORY" });

  const {
    data: itemsData,
    isLoading: isLoadingItems,
    error: itemsError,
  } = api.catalog.listCatalog.useQuery({ types: "ITEM" });

  if (isLoadingCategories || isLoadingItems) return <p> Loading catalog...</p>;

  if (categoriesError || itemsError)
    return (
      <p className="text-red-600">
        Error: {categoriesError?.message || itemsError?.message || "Unknown error"}
      </p>
    );

  return (
    <div className="space-y-10 p-6 bg-gray-50 min-h-screen">
      <section>
        <h2 className="text-2xl font-bold mb-2"> Categories</h2>
        <p>Found {categoriesData?.result?.objects?.length ?? 0} categories</p>

        <div className="grid gap-3 mt-3">
          {categoriesData?.result?.objects?.map((cat) => (
            <div key={cat.id} className="bg-white p-3 rounded border shadow-sm">
              <p><strong>Name:</strong> {cat.categoryData?.name || "Unnamed"}</p>
              <p><strong>ID:</strong> {cat.id}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-2">Items</h2>
        <p>Found {itemsData?.result?.objects?.length ?? 0} items</p>

        <div className="grid gap-3 mt-3">
          {itemsData?.result?.objects?.map((item) => (
              <div key={item.id}>
                <p><strong>Name:</strong> {item.itemData?.name}</p>
                <p><strong>ID:</strong> {item.id}</p>

                {item.itemData?.variations?.map((variation) => (
                  <div key={variation.id} className="ml-4 mt-2 border-l pl-3">
                    <p><strong>Variation Name:</strong> {variation.itemVariationData?.name}</p>
                    <p><strong>Variation ID:</strong> {variation.id}</p>
                  </div>
                ))}
                
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}