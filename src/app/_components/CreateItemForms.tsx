// src/_components/CreateItemForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { skipToken } from "@tanstack/react-query";

/**
 * Props for CreateItemForm component
 * @param onSave Optional callback to invoke after successful save
 */
interface CreateItemFormProps {
  onSave?: () => void;
}

/**
 * FormState covers both category and item creation modes
 */
type FormState =
  | { mode: "CATEGORY"; name: string }
  | {
      mode: "ITEM";
      name: string;
      description: string;
      variationName: string;
      variationPrice: string;
      categoryId: string;
    };

/**
 * CreateItemForm handles creating new catalog items or categories,
 * including image upload and dynamic size inputs for "Clothes" category.
 */
export default function CreateItemForm({ onSave }: CreateItemFormProps) {
  /**
   * 1. Component state: form fields, file upload, sizes, loading & errors
   */
  const [form, setForm] = useState<FormState>({ mode: "CATEGORY", name: "" });
  const [file, setFile] = useState<File | null>(null);
  const [sizes, setSizes] = useState<Record<string, number>>({ S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0 });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  /**
   * 2. Fetch existing categories to populate dropdown
   */
  const { data: categoriesData } = api.square.catalog.listCatalog.useQuery({ types: "CATEGORY" });
  const categories = categoriesData?.result.objects ?? [];

  /**
   * 3. Determine "Clothes" category ID for conditional size inputs
   */
  const clothesCat = categories.find(c => c.categoryData?.name === "Clothes");
  const clothesId = clothesCat?.id;

  /**
   * 4. Handle input changes for form fields
   */
  const handleChange = <T extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
    e: React.ChangeEvent<T>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value } as FormState));
  };

  /**
   * 5. Handle file selection
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  /**
   * 6. Basic validation before submission
   */
  const validate = () => {
    if (!file) return "Please select an image.";
    if (form.mode === "CATEGORY") {
      if (!form.name.trim()) return "Category name is required.";
    } else {
      const item = form;
      if (!item.name.trim()) return "Item name is required.";
      if (!item.description.trim()) return "Description is required.";
      if (isNaN(Number(item.variationPrice))) return "Valid variation price is required.";
      if (!item.categoryId) return "Category must be selected.";
      if (item.categoryId === clothesId) {
        for (const [sz, qty] of Object.entries(sizes)) {
          if (qty < 0) return `Stock for ${sz} cannot be negative.`;
        }
      }
    }
    return null;
  };

  /**
   * 7. Handle form submission: create via TRPC actions
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const err = validate();
    if (err) {
      setErrorMsg(err);
      return;
    }
    setLoading(true);
    try {
      if (form.mode === "CATEGORY") {
        await api.square.catalog.createCategoryWithImage.mutateAsync({ name: form.name }, file!);
      } else {
        const item = form;
        await api.square.catalog.createItemWithImage.mutateAsync({
          name: item.name,
          description: item.description,
          variationName: item.variationName,
          variationPrice: item.variationPrice,
          categoryId: item.categoryId,
          sizes,
        }, file!);
      }
      
      onSave?.();
      setForm({ mode: "CATEGORY", name: "" });
      setFile(null);
      setSizes({ S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0 });
    } catch (error: any) {
      setErrorMsg(error.message ?? "Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 8. Render form UI with conditional fields and validation messages
   */
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg p-4 border rounded shadow">
      {/* Mode selector */}
      <div>
        <label className="block mb-1 font-medium">Mode</label>
        <select name="mode" value={form.mode} onChange={handleChange} className="w-full border rounded px-3 py-2">
          <option value="CATEGORY">Category</option>
          <option value="ITEM">Item</option>
        </select>
      </div>

      {/* Common name field */}
      <input name="name" placeholder={form.mode === "CATEGORY" ? "Category Name" : "Item Name"} value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />

      {/* Item-specific fields */}
      {form.mode === "ITEM" && (
        <>
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} />
          <input name="variationName" placeholder="Variation Name" value={form.variationName} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          <input name="variationPrice" placeholder="Variation Price" value={form.variationPrice} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          <select name="categoryId" value={form.categoryId} onChange={handleChange} className="w-full border rounded px-3 py-2">
            <option value="">Select Category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.categoryData?.name ?? c.id}</option>)}
          </select>

          {/* Sizes only for Clothes category */}
          {form.categoryId === clothesId && (
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(sizes).map(([sz, qty]) => (
                <div key={sz}>
                  <label className="block mb-1">{sz} Stock</label>
                  <input type="number" min={0} value={qty} onChange={e => setSizes(prev => ({ ...prev, [sz]: parseInt(e.target.value, 10) || 0 }))} className="w-full border rounded px-3 py-2" />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Image upload */}
      <div>
        <label className="block mb-1 font-medium">Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
      </div>

      {/* Error message */}
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}

      {/* Submit button */}
      <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
        {loading ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
