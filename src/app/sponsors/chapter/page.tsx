"use client";

import { useEffect, useState } from "react";
import { ArrowRightCircle } from "lucide-react";
import { api } from "~/trpc/react";
import Navbar from "~/app/_components/NavBar";
import SquareCheckoutPopup from "~/app/_components/SquareCheckout";

const ITEM_ID = "RXJH5DVHSI7IFB3W2LYFIE3P"; // chapter item ID 

export default function ChapterPage() {
    const [customAmount, setCustomAmount] = useState("");
    const [variationMap, setVariationMap] = useState<Record<string, string>>({});
    const [selectedVariationId, setSelectedVariationId] = useState<string | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const {
        data: itemObject,
        isLoading: isLoadingItem,
        error: itemError,
    } = api.square.catalog.retrieveCatalogObject.useQuery({
        objectId: ITEM_ID,
        includeRelatedObjects: true,
    });

    useEffect(() => {
        if (!itemObject) return;

        const variations = itemObject?.result?.object?.itemData?.variations;
        if (!variations) {
            console.log("No variations found directly inside itemData.");
            return;
        }

        const map: Record<string, string> = {};
        variations?.forEach((variation) => {
            const name = variation.itemVariationData?.name?.trim();
            const id = variation.id;
            if (name && id) {
                map[name] = id;
            }
        });
        setVariationMap(map);
    }, [itemObject]);

    const handleSubmit = () => {
        if (!customAmount || isNaN(Number(customAmount)) || Number(customAmount) <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        const variationName = ["5", "10", "25"].includes(customAmount)
            ? `$${Number(customAmount).toFixed(2)} donation`
            : "Custom Amount";

        const variationId = variationMap[variationName];

        if (!variationId) {
            alert("Variation ID not found. Please try again.");
            return;
        } 

        setSelectedVariationId(variationId);
        setShowPaymentModal(true);
    };

    return (
        <div>
            <Navbar />
             <main className="min-h-screen bg-white py-12 px-4 flex justify-center">
                <div className="max-w-3xl w-full rounded-3xl shadow-xl p-15">
                    <h1 className="text-4xl sm:text-5xl font-semibold text-center text-[var(--shpe-yellow)] mb-6 drop-shadow-md">
                        {itemObject?.result.object?.itemData?.name || ""}
                    </h1>

                    <p className="text-md leading-normal mb-8">
                        As a nonprofit organization, we look to provide additional resources and assistance to our local community. 
                        We believe that it is important to use our talents to help those in need. 
                        From your donation, we can create more opportunities and assistance for our members and chapter. 
                        Regardless of the amount, thank you for providing aid.
                    </p>

                    <div className="text-sm text-gray-600 mt-4 mb-8">
                        <h2 className="font-semibold">Variation IDs:</h2>
                        <ul>
                            {Object.entries(variationMap).map(([name, id]) => (
                                <li key={id}>{name}: {id}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex justify-center gap-4 mb-8">
                        {[5, 10, 25].map((amount) => (
                            <button
                                key={amount}
                                className={`px-6 py-3 rounded-full font-semibold shadow-md border transition cursor-pointer
                                    ${customAmount === amount.toString()
                                        ? "bg-black text-white border-black"
                                        : "bg-white text-black hover:bg-gray-800 hover:text-white"}
                                `}
                                onClick={() => {
                                    setCustomAmount(amount.toString());
                                    setSelectedVariationId(variationMap[`$${amount.toFixed(2)}`] ?? null);
                                }}
                            >
                                ${amount.toFixed(2)}
                            </button>
                        ))}
                        {/* CUSTOM AMOUNT BUTTON */}
                        <button
                            className={`px-6 py-3 rounded-full font-semibold shadow-md border transition cursor-pointer col-span-3 sm:col-span-1
                                ${!["5", "10", "25"].includes(customAmount)
                                    ? "bg-black text-white border-black"
                                    : "bg-white text-black border-black hover:bg-gray-800 hover:text-white"}
                            `}
                            onClick={() => {
                                setCustomAmount("");
                                setSelectedVariationId(variationMap["Custom Amount"] ?? null);
                            }}
                        >
                            Custom
                        </button>
                    </div>
            
                    <div className="relative w-full mb-4">
                        <input
                            type="text"
                            inputMode="decimal"
                            name="amount"
                            placeholder="$0.00"
                            className="w-full text-lg text-center py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                            value={customAmount ? `$${customAmount}` : ""}
                            onChange={(e) => {
                                let value = e.target.value.replace(/[^0-9.]/g, ""); // remove $ and letters

                                // allow only up to 2 decimal places
                                if (value.includes(".")) {
                                    const [_, cents] = value.split(".");
                                    if (cents && cents?.length > 2) return;
                                }

                                setCustomAmount(value);
                                setSelectedVariationId(variationMap["Custom Amount"] ?? null);
                            }}
                        />
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-[var(--shpe-yellow)] text-white font-bold px-20 py-4 rounded-full shadow-lg hover:bg-black hover:text-white transition text-xl flex items-center gap-2 cursor-pointer"
                            onClick={handleSubmit}
                        >
                            Donate <ArrowRightCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </main>

            {showPaymentModal && selectedVariationId && (
                <SquareCheckoutPopup
                    itemName={itemObject?.result.object?.itemData?.name ?? "SHPE CHAPTER CONTRIBUTION"}
                    amount={Math.round(Number(customAmount) * 100)} // convert to cents
                    variationId={selectedVariationId}
                    onClose={() => setShowPaymentModal(false)}
                />
            )}
        </div>
    );
}
