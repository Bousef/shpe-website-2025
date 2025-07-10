"use client";

import React, { useState } from "react";
import { supabase } from "../../supabase-client";

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;   // semicolon-delimited string of file names
  price: number;
  stock: number;
  category: string;
  status: "Active" | "Inactive"; // added status field
}

interface AddProductFormProps {
  defaultCategory?: string;
  onAdd?: (product: Product) => void;
  onClose?: () => void;
}

export default function AddProductForm({
  defaultCategory = "Accessories",
  onAdd,
  onClose,
}: AddProductFormProps) {
  /* ——— form state (no showForm here!) ——— */
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: defaultCategory,
    price: 0,
    stock: 0,
  });
  const [priceInput, setPriceInput] = useState("0");
  const [priceError, setPriceError] = useState("");
  const [stockInput, setStockInput] = useState("0");
  const [stockError, setStockError] = useState("");
  const [sizes, setSizes] = useState<Record<string, number>>({
    S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0,
  });
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isClothes = newProduct.category === "Clothes";

  /* ——— handlers ——— */
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
    setNewProduct({ name: "", description: "", category: defaultCategory, price: 0, stock: 0 });
    setPriceInput("0");
    setPriceError("");
    setStockInput("0");
    setStockError("");
    setSizes({ S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0 });
    setImageFiles([null]);
    setErrorMsg("");
  };

  /* ——— submit ——— */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // validation omitted for brevity…
    // ...

    // filter out nulls
    const files = imageFiles.filter((f): f is File => !!f);
    if (!files.length) {
      setErrorMsg("Upload at least one image");
      return;
    }

    setLoading(true);
    try {
// upload each, gather PUBLIC URLs
const storedUrls: string[] = [];

for (const file of files) {
  const stamp    = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `${stamp}-${file.name.replace(/\s+/g, "")}`;

  // 1) upload
  const { error: uploadErr } = await supabase
    .storage
    .from("product-images")
    .upload(fileName, file);
  if (uploadErr) throw uploadErr;

  // 2) get the public URL
  const { data } = supabase
    .storage
    .from("product-images")
    .getPublicUrl(fileName);
  // no `error` property here, so just grab data.publicUrl
  if (!data?.publicUrl) {
    throw new Error("Failed to generate public URL");
  }
  storedUrls.push(data.publicUrl);
}

const imageField = storedUrls.join(";");


      // insert product
      const { data: prod, error: prodErr } = await supabase
        .from("shpe-website-2025_products")
        .insert({
          ...newProduct,
          name: newProduct.name ?? "",
          image: imageField,
          stock: isClothes ? 0 : newProduct.stock,
          status: "Active", 
        })
        .select()
        .single();
      if (prodErr || !prod) throw prodErr || new Error("Insert failed");

      // if clothes, insert sizes
      if (isClothes) {
        const { error: szErr } = await supabase
          .from("shpe-website-2025_clothes_sizes")
          .insert({ id: prod.id, ...sizes });
        if (szErr) throw szErr;
      }

      onAdd?.(prod);
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
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-6 bg-white rounded shadow max-w-lg"
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

        <div className="mb-4">
          <label className="block mb-1 font-medium">Images</label>
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
              required={idx === 0}
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
            {loading ? 'Saving…' : 'Save Product'}
          </button>
        </div>
      </form>

    </>
  );
}
