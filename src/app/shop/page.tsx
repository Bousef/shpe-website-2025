"use client";

import Navbar from "../_components/NavBar";
import { supabase } from "../../supabase-client";
import { useState, useEffect } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  image: string;
  price: number | null;
  stock: number | null;
};

type NewProduct = {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
};

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: "",
    description: "",
    category: "",
    price: 0,
    stock: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("shpe-website-2025_products")
        .select("id, name, description, category, image, price, stock")
        .order("id", { ascending: false });
      if (error) setErrorMsg(error.message);
      else setProducts((data ?? []) as Product[]);
    })();
  }, []);

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
        .from("product.images")
        .upload(fileName, imageFile, { cacheControl: "3600", upsert: false });
      if (uploadError) {
        setLoading(false);
        setErrorMsg(`Upload error: ${uploadError.message}`);
        return;
      }
      const { data: urlData } = supabase.storage
        .from("product.images")
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
      setProducts((prev) => [data as Product, ...prev]);
      setNewProduct({ name: "", description: "", category: "", price: 0, stock: 0 });
      setImageFile(null);
      setShowForm(false); // hide form on success
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-100 relative">
      <Navbar />

      {/* + Button */}
      <button
        onClick={() => setShowForm((v) => !v)}
        className="fixed top-4 right-4 bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg text-3xl leading-none flex items-center justify-center hover:bg-blue-700"
        aria-label="Add Product"
      >
        +
      </button>

      <main className="max-w-3xl mx-auto py-10">
        <h1 className="text-5xl text-blue-800 text-center mb-8">CATEGORIES</h1>

        {/* Conditionally render the form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 p-6 bg-white rounded shadow"
          >
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            {/* Name */}
            <div className="mb-4">
              <label htmlFor="name" className="block mb-1 font-medium">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="Product name"
                required
              />
            </div>
            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block mb-1 font-medium">
                Description
              </label>
              <textarea
                id="description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                rows={3}
                placeholder="Product description"
                required
              />
            </div>
            {/* Category */}
            <div className="mb-4">
              <label htmlFor="category" className="block mb-1 font-medium">
                Category
              </label>
              <input
                id="category"
                type="text"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="Category"
                required
              />
            </div>
            {/* Image Upload */}
            <div className="mb-4">
              <label htmlFor="imageFile" className="block mb-1 font-medium">
                Product Image
              </label>
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
              <label htmlFor="price" className="block mb-1 font-medium">
                Price
              </label>
              <input
                id="price"
                type="number"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })
                }
                className="w-full border rounded px-3 py-2"
                step="0.01"
                required
              />
            </div>
            {/* Stock */}
            <div className="mb-6">
              <label htmlFor="stock" className="block mb-1 font-medium">
                Stock
              </label>
              <input
                id="stock"
                type="number"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })
                }
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            {errorMsg && <p className="text-red-600 mb-4">{errorMsg}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Adding…" : "Add Product"}
            </button>
          </form>
        )}

        {/* Existing Products */}
        <section className="bg-white rounded shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Existing Products</h2>
          {products.length === 0 ? (
            <p className="text-gray-600">No products yet.</p>
          ) : (
            <ul className="space-y-4">
              {products.map((p) => (
                <li
                  key={p.id}
                  className="border rounded-lg p-4 flex items-center space-x-4"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-lg">{p.name}</p>
                    <p className="text-gray-700">{p.description}</p>
                    <p className="text-sm text-gray-500">
                      Category: {p.category}
                    </p>
                    <p className="mt-1 font-semibold">
                      ${(p.price ?? 0).toFixed(2)}
                    </p>
                    <p className="text-sm">
                      In stock: {p.stock != null ? p.stock : 0}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
