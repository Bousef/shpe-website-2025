"use client";

import { useState } from "react";
import { supabase } from "../../supabase-client";

export type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string; // semicolon-separated file names
  price: number;
  stock: number;
};

export default function AddProductForm({ onAdd }: { onAdd?: (product: Product) => void }) {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "Accessories",
    price: 0,
    stock: 0,
  });
  const [priceInput, setPriceInput] = useState<string>(newProduct.price.toString());
  const [priceError, setPriceError] = useState<string>("");
  const [stockInput, setStockInput] = useState<string>(newProduct.stock.toString());
  const [stockError, setStockError] = useState<string>("");
  const [sizes, setSizes] = useState<Record<string, number>>({ S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0 });
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showForm, setShowForm] = useState(false);

  const isClothes = newProduct.category === "Clothes";

  const handleSizeChange = (size: string, val: string) => {
    setSizes(prev => ({ ...prev, [size]: parseInt(val, 10) || 0 }));
  };

  const handlePriceChange = (val: string) => {
    if (/^\d*(\.\d*)?$/.test(val)) {
      setPriceInput(val);
      setNewProduct(prev => ({ ...prev, price: parseFloat(val) || 0 }));
      setPriceError("");
    } else {
      setPriceError("Please enter only numbers and a single decimal point.");
    }
  };

  const handleStockChange = (val: string) => {
    if (/^\d*$/.test(val)) {
      setStockInput(val);
      setNewProduct(prev => ({ ...prev, stock: parseInt(val, 10) || 0 }));
      setStockError("");
    } else {
      setStockError("Please enter only whole numbers for stock.");
    }
  };

  const resetForm = () => {
    setNewProduct({ name: "", description: "", category: "Accessories", price: 0, stock: 0 });
    setPriceInput("0");
    setPriceError("");
    setStockInput("0");
    setStockError("");
    setSizes({ s: 0, m: 0, l: 0, xl: 0, xxl: 0, xxxl: 0 });
    setImageFiles([null]);
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (priceError || stockError) {
      setErrorMsg("Please fix errors before submitting.");
      return;
    }
    if (!newProduct.name.trim() || !newProduct.description.trim()) {
      setErrorMsg("Name and description are required.");
      return;
    }
    if (newProduct.price <= 0) {
      setErrorMsg("Price must be greater than zero.");
      return;
    }
    if (!isClothes && newProduct.stock < 0) {
      setErrorMsg("Stock must be zero or more.");
      return;
    }
    if (isClothes && Object.values(sizes).every(qty => qty === 0)) {
      setErrorMsg("Please enter stock for at least one size.");
      return;
    }

    const filesToUpload = imageFiles.filter((f): f is File => f !== null);
    if (filesToUpload.length === 0) {
      setErrorMsg("Please upload at least one image.");
      return;
    }

    setLoading(true);
    try {
      const storedNames: string[] = [];
      for (const file of filesToUpload) {
        const stamp = new Date().toISOString().replace(/[:.]/g, "-");
        const fileName = `${stamp}-${file.name}`;
        const { error: uploadErr } = await supabase
          .storage
          .from("product-images")
          .upload(fileName, file);
        if (uploadErr) throw new Error(uploadErr.message);
        storedNames.push(fileName);
      }
      const imageField = storedNames.join(";");

      const { data: prod, error: prodErr } = await supabase
        .from<Product>("shpe-website-2025_products")
        .insert({
          ...newProduct,
          image: imageField,
          stock: isClothes ? 0 : newProduct.stock,
          price: newProduct.price,
        })
        .select()
        .single();
      if (prodErr || !prod) throw new Error(prodErr?.message || "Insert failed");

      if (isClothes) {
        const { error: sizesErr } = await supabase
          .from("shpe-website-2025_clothes_sizes")
          .insert({ id: prod.id, ...sizes });
        if (sizesErr) throw new Error(sizesErr.message);
      }

      onAdd?.(prod);
      resetForm();
      setShowForm(false);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowForm(prev => !prev)}
        className="bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg text-3xl flex items-center justify-center hover:bg-blue-700"
        aria-label={showForm ? 'Close Form' : 'Add Product'}
      >
        {showForm ? '×' : '+'}
      </button>

      {showForm && (
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
              onClick={() => { resetForm(); setShowForm(false); }}
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
      )}
    </>
  );
}
