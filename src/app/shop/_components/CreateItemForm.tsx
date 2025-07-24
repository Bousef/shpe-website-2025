"use client";

import React, { useEffect, useState } from "react";
import {
    insertItemWithImage,
    insertCategoryWithImage, // ← create this on the server
    getCatalog,
} from "../actions/actions";

/* -------------------------------------------------- *
 *  types
 * -------------------------------------------------- */
type NewCategory = {
    type: "CATEGORY";
    name: string;
};

type NewItem = {
    type: "ITEM";
    name: string;
    description: string;
    variationName: string;
    variationPrice: string;
    categoryId: string;
};

type FormState =
    | ({ mode: "CATEGORY" } & NewCategory)
    | ({ mode: "ITEM" } & NewItem);

type CreateCatalogObjectFormProps = {
    onSave?: () => void;             // ➊ new prop
};

export default function CreateCatalogObjectForm({
    onSave,                           // ➋ receive it
}: CreateCatalogObjectFormProps) {

    /* -------------- initial state ------------------ */
    const [form, setForm] = useState<FormState>({
        mode: "CATEGORY",
        type: "CATEGORY",
        name: "",
    });

    const [categories, setCategories] = useState<any[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const [sizes, setSizes] = useState<Record<string, number>>({
        S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0,
    });

    const clothesId = categories.find(
        (c) => c.categoryData?.name === "Clothes"
    )?.id;

    /* -------------- load categories ---------------- */
    useEffect(() => {
        (async () => {
            const catalog = await getCatalog();
            setCategories(catalog.filter((o: any) => o.type === "CATEGORY"));
        })();
    }, []);

    /* -------------- helpers ------------------------ */
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value } as FormState));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target.files?.[0] || null);
    };

    /* -------------- submit ------------------------- */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (!file) return alert("Please choose an image.");

        try {
            setLoading(true);

            if (form.mode === "CATEGORY") {
                /* ------- create category -------- */
                await insertCategoryWithImage(
                    { name: form.name },
                    file
                );
            } else {
                /* ------- create item ------------ */
                const {
                    name,
                    description,
                    variationName,
                    variationPrice,
                    categoryId,
                } = form;

                if (!categoryId) throw new Error("Choose a category for the item.");

                await insertItemWithImage(
                    {
                        name,
                        description,
                        variationName,
                        variationPrice,
                        categoryId,
                        sizes,
                    },
                    file
                );

            }

            alert("Catalog object saved!");

            onSave?.();

            // reset simple fields
            setForm({ mode: "CATEGORY", type: "CATEGORY", name: "" });
            setFile(null);
        } catch (err: any) {
            setErrorMsg(err.message || "Failed to save.");
        } finally {
            setLoading(false);
        }
    };

    /* -------------- render ------------------------- */
    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 max-w-lg p-4 border rounded shadow"
        >
            {/* MODE selector */}
            <div>
                <label className="block mb-1 font-medium">Create</label>
                <select
                    name="mode"
                    value={form.mode}
                    onChange={(e) =>
                        setForm(
                            e.target.value === "CATEGORY"
                                ? { mode: "CATEGORY", type: "CATEGORY", name: "" }
                                : {
                                    mode: "ITEM",
                                    type: "ITEM",
                                    name: "",
                                    description: "",
                                    variationName: "",
                                    variationPrice: "",
                                    categoryId: "",
                                }
                        )
                    }
                    className="w-full border rounded px-3 py-2"
                >
                    <option value="CATEGORY">Category</option>
                    <option value="ITEM">Item</option>
                </select>
            </div>

            {/* ---------- CATEGORY fields ---------- */}


            {/* fallback fields for non‑clothes items */}
            {form.mode === "ITEM" && form.categoryId !== "Clothes" && (
                <>
                    <input
                        name="variationPrice"
                        type="number"
                        placeholder="Price (USD)"
                        value={form.variationPrice}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </>
            )}


            {/* ---------- ITEM fields ---------- */}
            {form.mode === "ITEM" && (
                <>
                    <input
                        name="name"
                        placeholder="Item Name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        rows={3}
                    />

                    <select
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                        required
                    >
                        <option value="">Choose category</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.categoryData?.name ?? c.id}
                            </option>
                        ))}
                    </select>

                    {/* size & price block (only for Clothes) */}
                    {form.mode === "ITEM" && form.categoryId === clothesId && (
                        <>
                            <div className="grid grid-cols-3 gap-4">
                                {Object.keys(sizes).map((sz) => (
                                    <div key={sz}>
                                        <label className="block mb-1">{sz} Stock</label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={sizes[sz]}
                                            onChange={(e) =>
                                                setSizes((p) => ({ ...p, [sz]: parseInt(e.target.value, 10) || 0 }))
                                            }
                                            className="w-full border rounded px-3 py-2"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                </>
            )}

            {/* image upload */}
            <div>
                <label className="block mb-1 font-medium">Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full"
                    required
                />
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
