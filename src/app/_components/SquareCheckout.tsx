"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";
import { v4 as uuidv4 } from "uuid";
import Script from "next/script";

interface SquareCheckoutPopupProps {
    itemName: string,
    amount: number; // in cents
    variationId: string;
    onClose: () => void;
}

export default function SquareCheckoutPopup({ itemName, amount, variationId, onClose }: SquareCheckoutPopupProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [card, setCard] = useState<any>(null);
    const [sourceId, setSourceId] = useState<string | null>(null);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });

    const createPayment = api.square.payments.createPayment.useMutation();
    const appId = process.env.NEXT_PUBLIC_SQUARE_APP_ID!;
    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!;

    const initCard = async () => {
        if (!(window as any).Square) {
            console.error("Square SDK not available");
            return;
        }

        try {
            const payments = await (window as any).Square.payments(appId, locationId);
            const card = await payments.card();
            await card.attach(cardRef.current);
            setCard(card);
        } catch (err) {
            console.error("Failed to initialize Square card:", err);
        }
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePayment = async () => {
        if (!card) return;

        const result = await card.tokenize();
        if (result.status === "OK") {
            const sourceId = result.token;
            setSourceId(sourceId);

            const paymentResult = await createPayment.mutateAsync({
                sourceId,
                idempotencyKey: uuidv4(),
                amountMoney: {
                    amount: BigInt(amount), // $50.00
                    currency: "USD",
                },
                note: `Order from ${form.firstName} ${form.lastName}`,
                buyerEmailAddress: form.email,
                buyerPhoneNumber: form.phone,
            });

            alert(`Payment complete! Confirmation: ${paymentResult.id}`);
        } else {
            console.error(result);
            alert("Card details invalid.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 backdrop-blur-sm flex justify-center items-center">
            <Script
                src="https://web.squarecdn.com/v1/square.js"
                strategy="afterInteractive"
                onLoad={initCard}
            />

            <div className="relative bg-white p-8 gap-4 rounded-xl shadow-lg w-full max-w-md sm:max-w-2xl md:max-w-4xl flex flex-col md:flex-row">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-4 text-gray-500 hover:text-red-500 text-3xl font-bold cursor-pointer"
                >
                    ×
                </button>

                {/* Left - Form */}
                <div className="flex-1">
                    <h2 className="text-xl font-bold mb-4">Your Details</h2>
                    <div className="flex gap-4 mb-2">
                        <input type="text" placeholder="First Name" className="flex-1 p-2 border border-gray-300 bg-gray-100 rounded"/>
                        <input type="text" placeholder="Last Name" className="flex-1 p-2 border border-gray-300 bg-gray-100 rounded"/>
                    </div>

                    <div className="flex gap-4">
                        <input type="email" placeholder="Email" className="flex-1 p-2 border border-gray-300 bg-gray-100 rounded"/>
                        <input type="tel" placeholder="Phone Number" className="flex-1 p-2 border border-gray-300 bg-gray-100 rounded"/>
                    </div>

                    <h2 className="text-xl font-bold mt-8 mb-4">Card Details</h2>
                    <div ref={cardRef} className="card-input border border-gray-300 bg-gray-100 rounded-md min-h-[120px] p-2" />

                    <button
                        onClick={handlePayment}
                        disabled={!card || createPayment.isPending}
                        className="mt-6 w-full bg-[var(--shpe-yellow)] hover:bg-black text-white py-3 rounded-md font-semibold cursor-pointer"
                    >
                        {createPayment.isPending ? "Processing..." : "Place Order"}
                    </button>
                </div>

                {/* Right - Order Summary */}
                <div className="w-full md:w-1/3 py-4 text-sm">
                    <div className="px-4 py-8 bg-gray-50 rounded-md">
                        <h3 className="summary font-semibold text-xl mb-3">Order Summary</h3>
                        <p className="mb-3"><strong>Item: </strong>{itemName}</p>
                        <div className="flex justify-between mb-1">
                            <span>Amount:</span>
                            <span>${(amount / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                            <span>Taxes:</span>
                            <span>$0.00</span>
                        </div>
                        <div className="flex justify-between font-bold mt-2 border-t pt-2">
                            <span>Total:</span>
                            <span>${(amount / 100).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
