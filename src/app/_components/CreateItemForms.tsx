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
  // state for handling image files
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileValidationMessage, setFileValidationMessage] = useState<string>("");
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
  const categories = useMemo(() => {
    const cats = categoriesData ?? [];
    console.log("Available categories:", cats);
    return cats;
  }, [categoriesData]);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log("Form field changed:", name, "=", value);
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
      const newFiles = Array.from(e.target.files);
      
      // Validate files immediately - Square API only accepts JPEG, PNG, GIF
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      const validFiles = newFiles.filter(file => allowedTypes.includes(file.type));
      const oversizedFiles = validFiles.filter(file => file.size > 10 * 1024 * 1024);
      const goodFiles = validFiles.filter(file => file.size <= 10 * 1024 * 1024);
      
      // Filter out duplicates based on file name and size
      const uniqueFiles = goodFiles.filter(newFile => 
        !imageFiles.some(existingFile => 
          existingFile.name === newFile.name && existingFile.size === newFile.size
        )
      );
      
      // Build validation message
      let messages: string[] = [];
      const invalidTypeCount = newFiles.length - validFiles.length;
      const duplicateCount = goodFiles.length - uniqueFiles.length;
      
      if (invalidTypeCount > 0) {
        messages.push(`${invalidTypeCount} file(s) rejected: Invalid type (only JPEG, PNG, GIF allowed)`);
      }
      if (oversizedFiles.length > 0) {
        messages.push(`${oversizedFiles.length} file(s) rejected: Too large (max 10MB)`);
      }
      if (duplicateCount > 0) {
        messages.push(`${duplicateCount} file(s) skipped: Already selected`);
      }
      if (uniqueFiles.length > 0) {
        messages.push(`✅ ${uniqueFiles.length} file(s) added successfully`);
      }
      
      if (messages.length > 0) {
        setFileValidationMessage(messages.join(' • '));
        setTimeout(() => setFileValidationMessage(""), 4000);
      }
      
      setImageFiles(prev => [...prev, ...uniqueFiles]);
      // Clear the input so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const validFiles = droppedFiles.filter(file => allowedTypes.includes(file.type));
    const oversizedFiles = validFiles.filter(file => file.size > 10 * 1024 * 1024);
    const goodFiles = validFiles.filter(file => file.size <= 10 * 1024 * 1024);
    
    // Filter out duplicates based on file name and size
    const uniqueFiles = goodFiles.filter(newFile => 
      !imageFiles.some(existingFile => 
        existingFile.name === newFile.name && existingFile.size === newFile.size
      )
    );
    
    // Build validation message
    let messages: string[] = [];
    const invalidTypeCount = droppedFiles.length - validFiles.length;
    const duplicateCount = goodFiles.length - uniqueFiles.length;
    
    if (invalidTypeCount > 0) {
      messages.push(`${invalidTypeCount} file(s) rejected: Invalid type (only JPEG, PNG, GIF allowed)`);
    }
    if (oversizedFiles.length > 0) {
      messages.push(`${oversizedFiles.length} file(s) rejected: Too large (max 10MB)`);
    }
    if (duplicateCount > 0) {
      messages.push(`${duplicateCount} file(s) skipped: Already selected`);
    }
    if (uniqueFiles.length > 0) {
      messages.push(`✅ ${uniqueFiles.length} file(s) added successfully`);
    }
    
    if (messages.length > 0) {
      setFileValidationMessage(messages.join(' • '));
      setTimeout(() => setFileValidationMessage(""), 4000);
    }
    
    if (uniqueFiles.length > 0) {
      setImageFiles(prev => [...prev, ...uniqueFiles]);
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
      // Validate image files before submission
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      const invalidFiles = imageFiles.filter(file => !allowedTypes.includes(file.type));
      
      if (invalidFiles.length > 0) {
        throw new Error(`Invalid file types detected: ${invalidFiles.map(f => f.name).join(', ')}. Only JPEG, PNG, and GIF images are allowed.`);
      }

      // Check file sizes (10MB limit)
      const oversizedFiles = imageFiles.filter(file => file.size > 10 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        throw new Error(`Files too large: ${oversizedFiles.map(f => f.name).join(', ')}. Maximum size is 10MB per file.`);
      }

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
            // Use the new categories array format instead of deprecated categoryId
            ...(categoryId && categoryId.trim() !== "" ? { 
              categories: [{ 
                id: categoryId 
              }] 
            } : {}),
          },
        },
      };

      console.log("Creating item with data:", itemData);
      console.log("Selected categoryId:", categoryId);

      // upsert/create the item
      const upsertResponse = await upsertMutation.mutateAsync(itemData);
      
      const createdItemId = upsertResponse.catalogObject.id;
      if (!createdItemId) throw new Error("Item ID not found in upsert response.");

      // upload images if files selected
      if (imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          if (file) {
            const imageBase64 = await fileToBase64(file);
            await uploadImageMutation.mutateAsync({
              imageBase64,
              request: {
                idempotencyKey: `image-${Date.now()}-${i}`,
                objectId: createdItemId,
                image: {
                  type: "IMAGE",
                  id: `#image-${Date.now()}-${i}`,
                  imageData: {
                    caption: `Image ${i + 1} for ${form.name}`,
                  },
                },
              },
            });
          }
        }
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
        <label className="block mb-3 text-lg font-semibold text-gray-700">Product Images</label>
        
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-2">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="text-gray-600">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-blue-600 font-medium hover:text-blue-500">Add more files</span>
                <span className="text-gray-500"> or drag and drop images here</span>
              </label>
            </div>
            <p className="text-xs text-gray-500">JPEG, PNG, GIF up to 10MB each • Files will be added to your selection</p>
          </div>
          <input 
            id="file-upload"
            type="file" 
            accept="image/jpeg,image/jpg,image/png,image/gif" 
            multiple 
            onChange={handleFileChange} 
            className="hidden" 
          />
        </div>

        {/* File Validation Message */}
        {fileValidationMessage && (
          <div className={`mt-3 p-3 rounded-lg text-sm ${
            fileValidationMessage.includes('✅') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-orange-50 text-orange-700 border border-orange-200'
          }`}>
            {fileValidationMessage}
          </div>
        )}

        {imageFiles.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">
                Selected Images ({imageFiles.length})
              </h4>
              <button
                type="button"
                onClick={() => setImageFiles([])}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear all
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 max-h-40 overflow-y-auto">
              {imageFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 relative">
                      <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      {/* Valid file indicator */}
                      <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border border-white">
                        <svg className="h-2 w-2 text-white m-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                        {file.name.length > 30 ? `${file.name.substring(0, 30)}...` : file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newFiles = imageFiles.filter((_, i) => i !== index);
                      setImageFiles(newFiles);
                    }}
                    className="flex-shrink-0 ml-4 p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {errorMsg && <p className="text-red-600">{errorMsg}</p>}

      {/* SAVE ITEM BUTTON */}
      <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
        {loading ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
