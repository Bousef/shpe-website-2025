// src/app/_components/AddProductForm.tsx
"use client";

import { useState } from "react";
import { supabase } from "../../supabase-client";

export type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string;
  price: number | null;
  stock: number | null;
};
export type NewProduct = {
  name: string;
  description: string;
  category: string;
  image: string;
  price: number;
  stock: number;
};

interface AddProductFormProps {
  onAdd: (product: Product) => void;
  onClose: () => void;
}

export default function AddProductForm({ onAdd, onClose }: AddProductFormProps) {
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: "",
    description: "",
    category: "",
    image: "",
    price: 0,
    stock: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    let imageUrl = "";
    if (imageFile) {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      const dateStamp = [
        now.getFullYear(),
        pad(now.getMonth() + 1),
        pad(now.getDate()),
      ].join("") + "-" + [
        pad(now.getHours()),
        pad(now.getMinutes()),
        pad(now.getSeconds()),
      ].join("");
      const fileName = `${dateStamp}-${imageFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, imageFile, { cacheControl: "3600", upsert: false });
      if (uploadError) {
        setLoading(false);
        setErrorMsg(`Upload error: ${uploadError.message}`);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }

    const payload = { ...newProduct, image: imageUrl };
    const { data, error } = await supabase
      .from("shpe-website-2025_products")
      .insert(payload)
      .single();

    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else if (data) {
      onAdd(data as Product);
      setNewProduct({ name: "", description: "", category: "", image: "", price: 0, stock: 0 });
      setImageFile(null);
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
      {/* Name */}
      <div className="mb-4">
        <label htmlFor="name" className="block mb-1 font-medium">Name</label>
        <input
          id="name"
          type="text"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      {/* Description */}
      <div className="mb-4">
        <label htmlFor="description" className="block mb-1 font-medium">Description</label>
        <textarea
          id="description"
          value={newProduct.description}
          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          className="w-full border rounded px-3 py-2"
          rows={3}
          required
        />
      </div>
      {/* Category */}
      <div className="mb-4">
        <label htmlFor="category" className="block mb-1 font-medium">Category</label>
        <input
          id="category"
          type="text"
          value={newProduct.category}
          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      {/* Image Upload */}
      <div className="mb-4">
        <label htmlFor="imageFile" className="block mb-1 font-medium">Product Image</label>
        <input
          id="imageFile"
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="w-full"
          required
        />
      </div>
      {/* Price */}
      <div className="mb-4">
        <label htmlFor="price" className="block mb-1 font-medium">Price</label>
        <input
          id="price"
          type="number"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
          className="w-full border rounded px-3 py-2"
          step="0.01"
          required
        />
      </div>
      {/* Stock */}
      <div className="mb-6">
        <label htmlFor="stock" className="block mb-1 font-medium">Stock</label>
        <input
          id="stock"
          type="number"
          value={newProduct.stock}
          onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      {errorMsg && <p className="text-red-600 mb-4">{errorMsg}</p>}
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Adding…" : "Add Product"}
        </button>
      </div>
    </form>
  );
}

