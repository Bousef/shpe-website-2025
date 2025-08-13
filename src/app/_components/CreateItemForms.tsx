"use client";

import React, { useState, useMemo } from "react";
import { api } from "~/trpc/react";
import type { UpsertCatalogObjectRequest, CreateImagesRequest } from "node_modules/square/api/resources/catalog";
import type { BatchChangeInventoryRequest, CatalogObject, CatalogItem, InventoryChange, InventoryState, } from "node_modules/square/api";

type CreateItemFormProps = {
  onSave?: () => void;
};

type Variation = {
  name: string;
  price: string;
  sku?: string;
};

type ItemForm = {
  name: string;
  description?: string;
  variations: Variation[];
  categoryId?: string;
  locationId: string;            // <— required by Inventory API
};

export default function CreateItemForm({ onSave }: CreateItemFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState<ItemForm>({
    name: "",
    description: "",
    variations: [{ name: "", price: "", sku: "" }],
    categoryId: "",
    locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || "",
  });

  // tRPC mutations
  const upsertMutation = api.square.catalog.upsertCatalogObject.useMutation();
  const uploadImageMutation = api.square.catalog.createCatalogImage.useMutation();

  // Fetch categories
  const { data: categoriesData } = api.square.catalog.listCatalog.useQuery({ types: "CATEGORY" });
  const categories = useMemo(() => categoriesData ?? [], [categoriesData]);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };


  // replace your current handleSubmit with this
  const handleVariationChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as keyof Variation; // keys: "name" | "price" | "sku"
    const value = e.target.value || ""; // ensure value is always a string, not undefined

    setForm(prev => {
      const updatedVariations = [...prev.variations];

      // copy existing variation but override the specific property with a string value
      updatedVariations[index] = { 
        ...updatedVariations[index], 
        [name]: value 
      } as Variation; // assert as Variation to satisfy TS

      return { ...prev, variations: updatedVariations };
    });
  };

  const addVariation = () => {
    setForm(prev => ({
      ...prev,
      variations: [...prev.variations, { name: "", price: "", sku: "" }]
    }));
  };

  const removeVariation = (index: number) => {
    setForm(prev => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const img = e.target.files?.[0] ?? null; // ensure File or null only
      setImageFile(img);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:image/...;base64, prefix
        const base64 = result.split(',')[1] || '';
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { name, description, variations, categoryId } = form;

      //  Create timestamp
      const ts = Date.now();

      //  Create item data
      const itemData: UpsertCatalogObjectRequest = {
        idempotencyKey: `item-${ts}`,
        object: {
          id: `#item-${Date.now()}`, // temporary id which square will replace with a real one once item is created
          type: "ITEM",
          itemData: {
            name,
            description,
            variations: variations.map((v, idx) => ({
              id: `#variation-${Date.now()}-${idx}`, // unique temporary id per variation
              type: "ITEM_VARIATION",
              itemVariationData: {
                name: v.name,
                priceMoney: {
                  amount: BigInt(Math.round(parseFloat(v.price || "0") * 100)), // Convert to cents and to bigint
                  currency: "USD",
                },
                sku: v.sku || undefined,
              },
            })),
            categoryId: categoryId,
          },
        },
      };

      // upsert/create the item
      const upsertResponse = await upsertMutation.mutateAsync(itemData);

      const createdItemId = upsertResponse.catalogObject.id;
      if (!createdItemId) throw new Error("Item ID not found in upsert response.");

      // upload image if file selected
      if (imageFile) {
        const imageBase64 = await fileToBase64(imageFile);
        await uploadImageMutation.mutateAsync({
          imageBase64,
          request: {
            idempotencyKey: `image-${Date.now()}`,
            objectId: createdItemId,
            image: {
              type: "IMAGE",
              id: `#image-${Date.now()}`,
              imageData: {
                caption: `Image for ${form.name}`,
              },
            },
          },
        });
      }



      onSave?.();
    } catch (error: any) {
      console.error("Error saving item:", error);
      setErrorMsg(error?.message ?? "Failed to save item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow">
      <div>
        <label className="block mb-1 font-bold">ADD ITEM</label>

        <input
          name="name"
          placeholder="Item Name"
          value={form.name}
          onChange={handleInputChange}
          className="w-full border rounded px-3 py-2 mb-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleInputChange}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />

        {/* ITEM VARIATIONS */}
        <div>
          <h3 className="font-bold my-2">Variations</h3>
          {form.variations.map((variation, index) => (
            <div key={index} className="flex gap-2 items-center mb-2">
              <input
                type="text"
                name="name"
                placeholder="Variation Name"
                value={variation.name}
                onChange={e => handleVariationChange(index, e)}
                className="border rounded px-2 py-1"
              />
              <input
                type="text"
                name="price"
                placeholder="Variation Price"
                value={variation.price}
                onChange={e => handleVariationChange(index, e)}
                className="border rounded px-2 py-1"
              />
              <input
                type="text"
                name="sku"
                placeholder="SKU"
                value={variation.sku}
                onChange={e => handleVariationChange(index, e)}
                className="border rounded px-2 py-1"
              />
              <button
                type="button"
                onClick={() => removeVariation(index)}
                className="bg-red-500 text-white px-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addVariation}
            className="bg-blue-500 text-white px-3 py-1 rounded mb-2"
          >
            + Add Variation
          </button>
        </div>

        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleInputChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select Category</option>
          {categories
            .filter(c => c.type === "CATEGORY")
            .map(c => (
            <option key={c.id} value={c.id}>{c.categoryData?.name ?? "Unnamed"}</option>
          ))}
        </select>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block mb-1 font-medium">Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
      </div>

      {errorMsg && <p className="text-red-600">{errorMsg}</p>}

      {/* SAVE ITEM BUTTON */}
      <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
        {loading ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
