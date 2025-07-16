"use client"
import { useState } from "react";
import { api } from "~/trpc/react";
import { PencilIcon, TrashIcon, PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import AddProductForm, { type Product } from "../_components/AddProductForm";
import Navbar from "../_components/NavBar";

export default function InventoryManagement() {
    const { data: products, isLoading, refetch } = api.product.getAll.useQuery();
    const deleteProduct = api.product.delete.useMutation({ onSuccess: () => refetch() });
    const createProduct = api.product.create.useMutation({
        onSuccess: () => {
            refetch();
            setShowAdd(false);
        },
    });

    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [showAdd, setShowAdd] = useState(false);


    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    if (isLoading) return <p className="text-center mt-10">Loading products...</p>;
    if (!products) return <p className="text-center mt-10 text-red-600">Failed to load products.</p>;

    return (
        <>
            <Navbar />
            <div className="p-6 max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-blue-900">Inventory Management</h1>
                    <button
                        onClick={() => setShowAdd(prev => !prev)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        {showAdd ? (
                            <><XMarkIcon className="h-5 w-5" /> Cancel</>
                        ) : (
                            <><PlusCircleIcon className="h-5 w-5" /> Add Item</>
                        )}
                    </button>
                </div>

                {showAdd && (
                    <AddProductForm
                        onClose={() => setShowAdd(false)}
                    />
                )}

                <div className="overflow-x-auto">
                    <table className=" table-fixed min-w-full bg-white border border-gray-200 shadow">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="py-3 px-4 border-b">Image</th>
                                <th className="py-3 px-4 border-b">ID</th>
                                <th className="py-3 px-4 border-b">Name</th>
                                <th className="py-3 px-4 border-b">Category</th>
                                <th className="py-3 px-4 border-b">Price</th>
                                <th className="py-3 px-4 border-b">Stock</th>
                                <th className="py-3 px-4 border-b">Status</th>
                                <th className="py-3 px-4 border-b text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {products.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50 h-24">
                                    <td className="py-2 px-4 border-b text-sm">
                                        {product.image ? (
                                            <Image
                                                src={product.image}
                                                alt={product.name ? product.name : ""}
                                                width={50}
                                                height={50}
                                                className="rounded object-cover"
                                            />
                                        ) : (
                                            "No image"
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b text-sm text-center">{product.id}</td>
                                    <td className="py-2 px-4 border-b text-sm text-center">{product.name}</td>
                                    <td className="py-2 px-4 border-b text-sm text-center">{product.category}</td>
                                    <td className="py-2 px-4 border-b text-sm text-center">${product.price.toFixed(2)}</td>
                                    <td className="py-2 px-4 border-b text-sm text-center">{product.stock}</td>
                                    <td className="py-2 px-4 border-b text-sm text-center">{product.status}</td>
                                    <td className="py-2 px-4 border-b text-sm text-center">

                                        {/* Edit Button */}
                                        <button
                                            onClick={() => setSelectedProduct(product)}
                                            className="mr-3 text-blue-600 hover:underline hover:text-blue-400 hover:cursor-pointer"
                                            title="Edit"
                                        >
                                            <PencilIcon className="h-5 w-5 inline" />
                                        </button>

                                        {selectedProduct && (
                                            <AddProductForm
                                                product={selectedProduct}
                                                onAdd={(updatedProduct) => {
                                                    setSelectedProduct(null);
                                                    refetch();
                                                }}
                                                onClose={() => setSelectedProduct(null)}
                                            />
                                        )}


                                        {/* Delete Button */}
                                        <button
                                            onClick={() => deleteProduct.mutate(product.id)}
                                            className="text-red-600 hover:underline hover:text-red-400 hover:cursor-pointer"
                                            title="Delete"
                                        >
                                            <TrashIcon className="h-5 w-5 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}