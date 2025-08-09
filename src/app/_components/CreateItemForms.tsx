// src/_components/CreateItemForm.tsx
"use client";

import React, { useState, useMemo } from "react";
import type { CatalogCategory } from "square/legacy";
import { api } from "~/trpc/react";
import type { CreateImagesRequest, UpsertCatalogObjectRequest } from "node_modules/square/api/resources/catalog";


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
  const [sizes, setSizes] = useState({
    XS: 0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
  });
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

  // Clothes category ID
  type Category = { id: string; categoryData?: { name?: string } };

  const clothesCat = categories.find((c) => (c as CatalogCategory).name === "Clothes");
  const clothesId = clothesCat?.id;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { name, description, variationName, variationPrice, categoryId } = form;


      const itemData: UpsertCatalogObjectRequest = {
        idempotencyKey: `item-${Date.now()}`,
        object: {
          id: `item-${Date.now()}`,
          type: "ITEM",
          itemData: {
            name,
            description,
            variations: [{
              id: `variation-${Date.now()}`,
              type: "ITEM_VARIATION",
              itemVariationData: {
                name: variationName,
                priceMoney: {
                  amount: BigInt(Math.round(parseFloat(variationPrice || "0") * 100)), // Convert to cents and to bigint
                  currency: "USD",
                },
              },
            }],
            categoryId: categoryId,
          },
        }
      };

      // Upsert the item
      await upsertMutation.mutateAsync({ body: itemData });

      // create image if file selected
      

      // Create inventory entries for sizes if category is Clothes
      // api inventory
      

      onSave?.();
    } catch (error) {
      console.error("Error saving item:", error);
      setErrorMsg("Failed to save item. Please try again.");
    } finally {
      setLoading(false);
    }
  };





  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg p-4 border rounded shadow">
      <div>
        <label className="block mb-1 font-medium">Mode</label>
        <select name="mode" onChange={handleChange} className="w-full border rounded px-3 py-2">
          <option value="CATEGORY">Category</option>
          <option value="ITEM">Item</option>
        </select>
      </div>

      <input
        name="name"
        placeholder="Item Name"
        value={form.name}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
      />

      <>
        <textarea
          name="description"
          placeholder="Description"
          value={(form as ItemForm).description}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
        <input
          name="variationName"
          placeholder="Variation Name"
          value={(form as ItemForm).variationName}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="variationPrice"
          placeholder="Variation Price"
          value={(form as ItemForm).variationPrice}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
        <select
          name="categoryId"
          value={(form as ItemForm).categoryId}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{(c as CatalogCategory).name ?? c.id}</option>
          ))}
        </select>
        {(form as ItemForm).categoryId === clothesId && (
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(sizes).map(([sz, qty]) => (
              <div key={sz}>
                <label className="block mb-1">{sz} Stock</label>
                <input
                  type="number"
                  min={0}
                  value={qty}
                  onChange={e => setSizes(prev => ({ ...prev, [sz]: parseInt(e.target.value, 10) || 0 }))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            ))}
          </div>
        )}
      </>


      <div>
        <label className="block mb-1 font-medium">Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
      </div>

      {errorMsg && <p className="text-red-600">{errorMsg}</p>}

      <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
        {loading ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
