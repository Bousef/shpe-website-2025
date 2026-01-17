"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase-client";

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  category: string;
  status: "Active" | "Inactive";
}

interface AddProductFormProps {
  product?: Product; // <-- new prop
  defaultCategory?: string;
  onAdd?: (product: Product) => void;
  onClose?: () => void;
}

export default function AddProductForm({
  product,
  defaultCategory = "Accessories",
  onAdd,
  onClose,
}: AddProductFormProps) {
  const isEditing = !!product;
  const existingImages = isEditing && product?.image
    ? product.image.split(";").filter(Boolean)
    : [];

  const [newProduct, setNewProduct] = useState({
    name: product?.name || "",
    description: product?.description || "",
    category: product?.category || defaultCategory,
    price: product?.price || 0,
    stock: product?.stock || 0,
    status: product?.status || "Active",
  });


  const [priceInput, setPriceInput] = useState(product?.price.toString() || "0");
  const [priceError, setPriceError] = useState("");
  const [stockInput, setStockInput] = useState(product?.stock.toString() || "0");
  const [stockError, setStockError] = useState("");

  const [sizes, setSizes] = useState<Record<string, number>>({
    S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0,
  });

  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isClothes = newProduct.category === "Clothes";

  // Load sizes if editing clothes
  useEffect(() => {
    if (isEditing && isClothes) {
      supabase
        .from("shpe-website-2025_clothes_sizes")
        .select("*")
        .eq("id", product!.id)
        .single()
        .then(({ data, error }) => {
          if (data) {
            const { id, ...sizeData } = data;
            setSizes(sizeData);
          }
        });
    }
  }, [isEditing, isClothes]);

  const handleSizeChange = (size: string, val: string) => {
    setSizes(prev => ({ ...prev, [size]: parseInt(val, 10) || 0 }));
  };
  const handlePriceChange = (val: string) => {
    if (/^\d*(\.\d*)?$/.test(val)) {
      setPriceInput(val);
      setPriceError("");
      setNewProduct(p => ({ ...p, price: parseFloat(val) || 0 }));
    } else {
      setPriceError("Only numbers and a single decimal allowed");
    }
  };
  const handleStockChange = (val: string) => {
    if (/^\d*$/.test(val)) {
      setStockInput(val);
      setStockError("");
      setNewProduct(p => ({ ...p, stock: parseInt(val, 10) || 0 }));
    } else {
      setStockError("Only whole numbers allowed");
    }
  };
  const resetForm = () => {
    setNewProduct({
      name: product?.name || "",
      description: product?.description || "",
      category: product?.category || defaultCategory,
      price: product?.price || 0,
      stock: product?.stock || 0,
      status: product?.status || "Active",
    });
    setPriceInput(product?.price?.toString() || "0");
    setPriceError("");
    setStockInput(product?.stock?.toString() || "0");
    setStockError("");
    setSizes({ S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0 });
    setImageFiles([null]);
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const files = imageFiles.filter((f): f is File => !!f);
    const storedUrls: string[] = [];

    try {
      setLoading(true);

      if (files.length) {
        for (const file of files) {
          const stamp = new Date().toISOString().replace(/[:.]/g, "-");
          const fileName = `${stamp}-${file.name.replace(/\s+/g, "")}`;

          const { error: uploadErr } = await supabase.storage.from("product-images").upload(fileName, file);
          if (uploadErr) throw uploadErr;

          const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
          if (!data?.publicUrl) throw new Error("Failed to generate public URL");

          storedUrls.push(data.publicUrl);
        }
      }

      const imageField = [...existingImages, ...storedUrls].join(";");

      const payload = {
        ...newProduct,
        name: newProduct.name ?? "",
        image: imageField,
        stock: isClothes ? 0 : newProduct.stock,
        status: newProduct.status,
      };

      let result;
      if (isEditing) {
        const { data, error } = await supabase
          .from("shpe-website-2025_products")
          .update(payload)
          .eq("id", product!.id)
          .select()
          .single();
        if (error || !data) throw error || new Error("Update failed");
        result = data;
      } else {
        const { data, error } = await supabase
          .from("shpe-website-2025_products")
          .insert(payload)
          .select()
          .single();
        if (error || !data) throw error || new Error("Insert failed");
        result = data;
      }

      if (isClothes) {
        const { error: sizeError } = await supabase
          .from("shpe-website-2025_clothes_sizes")
          .upsert({ id: result.id, ...sizes }); // upsert handles both insert/update
        if (sizeError) throw sizeError;
      }

      onAdd?.(result);
      resetForm();
      onClose?.();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>

      <form
        onSubmit={handleSubmit}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-h-[90vh] w-[90vw] max-w-lg overflow-y-auto p-4 sm:p-6 bg-white rounded shadow"
      >
        <div className="mb-4">
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            value={newProduct.name}
            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={newProduct.description}
            onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
            className="w-full border rounded px-3 py-2"
            rows={3}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Category</label>
          <select
            value={newProduct.category}
            onChange={e => setNewProduct({ ...newProduct, category: e.target.value, stock: 0 })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="Accessories">Accessories</option>
            <option value="Clothes">Clothes</option>
          </select>
        </div>

        {/* Stock or Sizes */}
        {isClothes ? (
          <div className="grid grid-cols-3 gap-4 mb-4">
            {Object.keys(sizes).map(size => (
              <div key={size}>
                <label className="block mb-1 capitalize">{size.toUpperCase()} Stock</label>
                <input
                  type="text"
                  min={0}
                  value={sizes[size]}
                  onChange={e => handleSizeChange(size, e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-4">
            <label className="block mb-1 font-medium">Stock</label>
            <input
              type="text"
              value={stockInput}
              onChange={e => handleStockChange(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
            {stockError && <p className="text-red-600 mt-1">{stockError}</p>}
          </div>
        )}

        {/* Price */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Price</label>
          <input
            type="text"
            inputMode="decimal"
            value={priceInput}
            onChange={e => handlePriceChange(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
          {priceError && <p className="text-red-600 mt-1">{priceError}</p>}
        </div>

        {/* Status */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Status</label>
          <select
            value={newProduct.status}
            onChange={e => setNewProduct({ ...newProduct, status: e.target.value as "Active" | "Inactive" })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Images */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Images</label>

          {/* Existing image previews */}
          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {existingImages.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Existing image ${idx + 1}`}
                  className="w-20 h-20 object-cover border rounded"
                />
              ))}
            </div>
          )}

          {/* Image file inputs */}
          {imageFiles.map((file, idx) => (
            <input
              key={idx}
              type="file"
              accept="image/*"
              onChange={e => {
                const newFile = e.target.files?.[0] || null;
                setImageFiles(files => {
                  const copy = [...files];
                  copy[idx] = newFile;
                  return copy;
                });
              }}
              className="w-full mb-2"
              required={!isEditing && idx === 0} // required only on first field for create
            />
          ))}
          <button
            type="button"
            onClick={() => setImageFiles(files => [...files, null])}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add another image
          </button>
        </div>

        {errorMsg && <p className="text-red-600 mb-4">{errorMsg}</p>}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => { resetForm(); onClose?.(); }}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving…" : isEditing ? "Update Product" : "Save Product"}
          </button>
        </div>
      </form>
    </>
  );
}
