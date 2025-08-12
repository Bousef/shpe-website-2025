"use client";

import React, { useState, useMemo } from "react";
import { api } from "~/trpc/react";
import type { UpsertCatalogObjectRequest } from "node_modules/square/api/resources/catalog";

type CreateItemFormProps = {
  onSave?: () => void;
};

type ItemForm = {
  name: string;
  description?: string;
  variationName?: string;
  variationPrice?: string;
  categoryId?: string;
};

export default function CreateItemForm({ onSave }: CreateItemFormProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const SIZE_KEYS = ["S", "M", "L", "XL", "XXL", "XXXL"] as const;
  type SizeKey = (typeof SIZE_KEYS)[number];

  const [sizeStocks, setSizeStocks] = useState<Record<SizeKey, number>>({
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
    XXXL: 0,
  });

  const [singleStock, setSingleStock] = useState<number>(0);

  const [form, setForm] = useState<ItemForm>({
    name: "",
    description: "",
    variationName: "",
    variationPrice: "",
    categoryId: "",
  });

  // tRPC mutations
  const upsertMutation = api.square.catalog.upsertCatalogObject.useMutation();
  const uploadImageMutation = api.square.catalog.createCatalogImage.useMutation();

  // Fetch categories
  const { data: categoriesData } = api.square.catalog.listCatalog.useQuery({ types: "CATEGORY" });
  const categories = useMemo(() => categoriesData ?? [], [categoriesData]);

  // Build id -> name map once
  const categoryNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const c of categories) {
      if (c.type === "CATEGORY" && c.id) {
        m.set(c.id, c.categoryData?.name ?? "");
      }
    }
    return m;
  }, [categories]);

  // Robust: check the selected categoryId's name
  const isClothes = useMemo(() => {
    const selectedName = categoryNameById.get(form.categoryId ?? "") ?? "";
    return selectedName === "Clothes";
  }, [categoryNameById, form.categoryId]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Store the file in state if you need to use it later for upload
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };


  function buildVariations(
  isClothes: boolean,
  variationName: string | undefined,
  variationPrice: string | undefined
) {
  const ts = Date.now();
  const priceInCents = Math.round(parseFloat(variationPrice ?? "0") * 100);
  const priceMoney = { amount: BigInt(priceInCents), currency: "USD" as const };

  const makeVariation = (vName: string) => ({
    id: `variation-${vName}-${ts}`,
    type: "ITEM_VARIATION" as const,
    itemVariationData: {
      name: vName,
      priceMoney,
    },
  });

  return isClothes
    ? SIZE_KEYS.map(sz => makeVariation(sz))
    : [makeVariation((variationName ?? "").trim() || "Default")];
}

  // replace your current handleSubmit with this
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setErrorMsg("");

  try {
    const { name, description, variationName, variationPrice, categoryId } = form;

    // minimal validation
    if (!name?.trim()) throw new Error("Please enter a name.");
    if (!categoryId) throw new Error("Please select a category.");
    if (!variationPrice || isNaN(Number(variationPrice))) {
      throw new Error("Enter a valid price.");
    }
    if (!isClothes && !variationName?.trim()) {
      throw new Error("Please enter a variation name.");
    }

    const ts = Date.now();

    // ✅ variations built to your requirements
    const variations = buildVariations(isClothes, variationName, variationPrice);

    const itemData: UpsertCatalogObjectRequest = {
      idempotencyKey: `item-${ts}`,
      object: {
        id: `item-${ts}`,
        type: "ITEM",
        itemData: {
          name,
          description,
          categoryId: categoryId!,
          variations,
        },
      },
    };

    const stockPayload = isClothes
      ? { type: "sizes", quantities: sizeStocks }
      : { type: "single", quantity: singleStock };

    await upsertMutation.mutateAsync(itemData);

    // TODO: use stockPayload with your inventory API after you have the created itemId
    // await api.inventory.createStock.mutateAsync({ itemId: createdItemId, stock: stockPayload });

    onSave?.();
  } catch (error: any) {
    console.error("Error saving item:", error);
    setErrorMsg(error?.message ?? "Failed to save item. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg p-4 border rounded shadow">
      <input
        name="name"
        placeholder="Item Name"
        value={form.name}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        rows={3}
      />

      <input
        name="variationName"
        placeholder="Variation Name"
        value={form.variationName}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      />

      <input
        name="variationPrice"
        placeholder="Variation Price"
        value={form.variationPrice}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      />

      <select
        name="categoryId"
        value={form.categoryId}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      >
        <option value="">Select Category</option>
        {categories
          .filter(c => c.type === "CATEGORY")
          .map(c => (
            <option key={c.id} value={c.id}>
              {c.categoryData?.name ?? ""}
            </option>
          ))}
      </select>

      {/* Stock inputs */}
      {isClothes ? (
        <div className="grid grid-cols-3 gap-4">
          {SIZE_KEYS.map(sz => (
            <div key={sz}>
              <label className="block mb-1">{sz} Stock</label>
              <input
                type="number"
                min={0}
                value={sizeStocks[sz]}
                onChange={e =>
                  setSizeStocks(prev => ({
                    ...prev,
                    [sz]: Number.isNaN(parseInt(e.target.value, 10))
                      ? 0
                      : parseInt(e.target.value, 10),
                  }))
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
          ))}
        </div>
      ) : (
        <div>
          <label className="block mb-1">Stock</label>
          <input
            type="number"
            min={0}
            value={singleStock}
            onChange={e =>
              setSingleStock(Number.isNaN(parseInt(e.target.value, 10))
                ? 0
                : parseInt(e.target.value, 10))
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>
      )}

      <div>
        <label className="block mb-1 font-medium">Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
      </div>

      {errorMsg && <p className="text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
