"use client";

import { api } from "~/trpc/react";
import { useEffect, useMemo, useState } from "react";
import { InventoryChangeType, type CatalogObject } from "node_modules/square/api";

type Variation = {
    id: string;
    name: string;
    price: string;
    sku?: string;
    quantity: string,
    version?: bigint;
};

type EditItemFormProps = {
    itemId: string | "";
    onClose: () => void;
    isModal?: boolean; // Add this prop to control modal behavior
};

export default function EditItemForm({ itemId, onClose, isModal = true }: EditItemFormProps) {
    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;

    
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [imageIds, setImageIds] = useState<string[]>([]);
    const [variationsList, setVariationsList] = useState<CatalogObject.ItemVariation[]>([]);
    const [variationsMap, setVariationsMap] = useState<Variation[]>([]);

    // trpc mutations
    const updateItem = api.square.catalog.upsertCatalogObject.useMutation({
        onSuccess: () => {
            onClose();
        },
    });
    const updateInventory = api.square.inventory.batchChangeInventory.useMutation();

    // fetch categories
    const { data: categoriesData } = api.square.catalog.listCatalog.useQuery({ types: "CATEGORY" });
    const rawCategories = useMemo(() => {
        return categoriesData ?? [];
    }, [categoriesData]);
    const categoryLookup = useMemo(() => {
        return rawCategories.reduce<Record<string, string>>((map, obj) => {
            const id = obj.id;
            const name = obj.type === "CATEGORY" ? obj.categoryData?.name ?? "" : "";
            if (id) map[id] = name;
            return map;
        }, {});
    }, [rawCategories]);
    
    // fetch item data from square with itemId
    const { data: retrievedItem, isLoading } = api.square.catalog.retrieveCatalogObject.useQuery({
        objectId: itemId ?? "",
    });

    const varIds = retrievedItem?.object.type === "ITEM"
        ? (retrievedItem.object.itemData?.variations || [])
            .filter((v) => v.type === "ITEM_VARIATION")
            .map((v) => v.id)
        : [];

    // fetch inventory counts for the item's variations
    const {
        data: inventoryData,
    } = api.square.inventory.batchRetrieveInventoryCounts.useQuery(
        { body: { catalogObjectIds: varIds } },
        { enabled: !!varIds.length } // only run when we have variation IDs
    );

    // populate form with retrieved data
    useEffect(() => {
        if (retrievedItem && retrievedItem?.object?.type === "ITEM") {
            setName(retrievedItem.object.itemData?.name || "");
            setDescription(retrievedItem.object.itemData?.description || "");
            setCategoryId(retrievedItem.object.itemData?.categories?.[0]?.id ?? retrievedItem.object.itemData?.categoryId ?? "");

            const variations = (retrievedItem.object.itemData?.variations)?.filter(v => v.type === "ITEM_VARIATION") || [];
            setVariationsList(variations);

            const mappedVariations = variations?.map((v) => {
                const inv = inventoryData?.find(
                    (c) => c.catalogObjectId === v.id
                );        
                return {
                    id: v.id || "",
                    name: v.itemVariationData?.name || "",
                    price: v.itemVariationData?.priceMoney?.amount
                        ? (Number(v.itemVariationData.priceMoney.amount) / 100).toString()
                        : "0",
                    sku: v.itemVariationData?.sku || "",
                    quantity: inv?.quantity || "",
                    version: v.version,
                }
            }) || [];
            setVariationsMap(mappedVariations);

            setImageIds(retrievedItem.object.itemData?.imageIds || []);
        }
    }, [retrievedItem]);

    const addVariation = () => {
        setVariationsMap(prev => [...prev, { id: "", name: "", price: "", sku: "", quantity: "" }]);
    };

    const removeVariation = (index: number) => {
        setVariationsMap(prev => prev.filter((_, i) => i !== index));
    };

    const updateVariation = (idx: number, field: keyof Variation, value: string) => {
        setVariationsMap(prev => {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], [field]: value } as Variation;
            return copy;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!retrievedItem?.object) {
            console.error("Cannot update item: item data not loaded yet.");
            return;
        }

        updateItem.mutate({
            idempotencyKey: `item-${Date.now()}`,
            object: {
                id: retrievedItem.object.id!,
                type: "ITEM",
                version: retrievedItem.object.version,
                itemData: {
                    name,
                    description,
                    variations: variationsMap.map((v, idx) => ({
                        id: v.id || `#variation-${Date.now()}-${idx}`,
                        type: "ITEM_VARIATION",
                        version: v.version || undefined,
                        itemVariationData: {
                            name: v.name || "",
                            priceMoney: {
                                amount: BigInt(Math.round(parseFloat(v.price || "0") * 100)), // Convert to cents and to bigint
                                currency: "USD",
                            },
                            sku: v.sku || "",
                            //trackInventory: true,
                        },
                    })),
                    // Use the new categories array format instead of deprecated categoryId
                    ...(categoryId && categoryId.trim() !== "" ? { 
                        categories: [{ 
                            id: categoryId 
                        }] 
                    } : {}),
                    imageIds: imageIds,
                },
            }
        });

        // check if type is ITEM before checking if there's variations
        // if (upsertResponse.catalogObject.type === "ITEM") {
        // const variationsList = (upsertResponse.catalogObject.itemData?.variations)?.filter(v => v.type === "ITEM_VARIATION") || [];
        const now = new Date().toISOString();
        const inventoryChanges = variationsList.map((v, idx) => ({
            type: InventoryChangeType.PhysicalCount,
            physicalCount: {
            catalogObjectId: v.id,
            quantity: variationsMap[idx]?.quantity || "0",
            locationId: locationId,
            state: "IN_STOCK" as const,
            occurredAt: now,
            },
        }));

        // update inventory since square defaults to 0
        await updateInventory.mutateAsync({
            body: {
            idempotencyKey: `inv-${Date.now()}`,
            changes: inventoryChanges,
            }
        })
        
    };

    if (!itemId) return null;
    if (isLoading) return <div>Loading...</div>;

    const formContent = (
        <div className={`relative bg-white p-8 gap-4 rounded-xl shadow-lg w-full ${isModal ? 'sm:max-w-2xl md:max-w-3xl' : ''} flex flex-col`}>
            <h2 className="text-xl font-bold">EDIT ITEM</h2>

            <form onSubmit={handleSubmit}>
                    <label className="block mb-2">
                        <strong>Item Name</strong>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        />
                    </label>

                    <label className="block mb-2">
                        <strong>Description</strong>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            rows={3}
                        />
                    </label>

                    <label className="block font-bold">Variations</label>
                    {variationsMap.map((variation, idx) => (
                        <div key={variation.id || idx} className="flex gap-2 items-center mb-2">
                            <input
                                type="text"
                                placeholder="Variation name"
                                value={variation.name}
                                onChange={(e) => updateVariation(idx, "name", e.target.value)}
                                className="w-full border rounded px-3 py-1 mb-1"
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                value={variation.price}
                                onChange={(e) => updateVariation(idx, "price", e.target.value)}
                                className="w-full border rounded px-3 py-1 mb-1"
                            />
                            <input
                                type="text"
                                placeholder="SKU"
                                value={variation.sku}
                                onChange={(e) => updateVariation(idx, "sku", e.target.value)}
                                className="w-full border rounded px-3 py-1 mb-1"
                            />
                            <input
                                type="text"
                                placeholder="Qty"
                                value={variation.quantity}
                                onChange={(e) => updateVariation(idx, "quantity", e.target.value)}
                                className="w-full border rounded px-3 py-1 mb-1"
                            />
                            <button 
                                type="button" 
                                onClick={() => removeVariation(idx)}
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
                        Add Variation
                    </button>

                    <label className="block mb-2">
                        <strong>Category</strong>
                        <select
                            name="categoryId"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        >
                            <option value="">Select Category</option>
                            {rawCategories
                                .filter(c => c.type === "CATEGORY")
                                .map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.categoryData?.name ?? "Unnamed"}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="flex justify-end mt-4 gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-3 py-1 rounded border border-gray-300 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updateItem.isPending}
                            className="px-3 py-1 rounded bg-blue-500 text-white cursor-pointer"
                        >
                            {updateItem.isPending ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
    );

    return isModal ? (
        <div className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center">
            {formContent}
        </div>
    ) : (
        formContent
    );
}