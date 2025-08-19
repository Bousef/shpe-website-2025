"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";
import { v4 as uuidv4 } from "uuid";
import Script from "next/script";
import { GiPartyPopper } from "react-icons/gi";

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
    const [formErrors, setFormErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    });
    const [paymentSuccess, setPaymentSuccess] = useState<{
        confirmationNumber: string;
        orderId?: string;
    } | null>(null);

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

    function formatPhoneNumber(value: string): string {
        const digits = value.replace(/\D/g, "").substring(0, 10); // remove non-digits, max 10
        const parts = [];

        if (digits.length > 0) parts.push("(" + digits.slice(0, 3));
        if (digits.length >= 4) parts.push(") " + digits.slice(3, 6));
        if (digits.length >= 7) parts.push("-" + digits.slice(6));

        return parts.join("");
    }

    const validateField = (name: string, value: string): string => {
        switch (name) {
            case "firstName":
                return value.trim() === "" ? "First name is required." : "";
            case "lastName":
                return value.trim() === "" ? "Last name is required." : "";
            case "email":
                return value.trim() === ""
                    ? "Email is required."
                    : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                    ? ""
                    : "Invalid email format.";
            case "phone":
                const phoneDigits = value.replace(/\D/g, "");
                return phoneDigits.length === 0
                    ? "Phone number is required."
                    : phoneDigits.length !== 10
                    ? "Phone number must be exactly 10 digits."
                    : "";
            default:
                return "";
        }
    }

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        let newValue = value;
        if (name === "phone") {
            newValue = formatPhoneNumber(value);
        }

        const updatedForm = { ...form, [name]: newValue };
        const updatedErrors = { ...formErrors, [name]: validateField(name, newValue) };

        setForm(updatedForm);

        console.log(form.phone)
        setFormErrors(updatedErrors);
    };

    const handlePayment = async () => {
        const errors = {
            firstName: validateField("firstName", form.firstName),
            lastName: validateField("lastName", form.lastName),
            email: validateField("email", form.email),
            phone: validateField("phone", form.phone),
        };
        setFormErrors(errors);

        const isValid = Object.values(errors).every((e) => e === "");
        if (!isValid || !card) return;

        const result = await card.tokenize();
        if (result.status === "OK") {
            const sourceId = result.token;
            setSourceId(sourceId);

            const paymentResult = await createPayment.mutateAsync({
                sourceId,
                idempotencyKey: uuidv4(),
                amountMoney: {
                    amount: BigInt(amount),
                    currency: "USD",
                },
                note: `Order from ${form.firstName} ${form.lastName}`,
                buyerEmailAddress: form.email,
                buyerPhoneNumber: "+1" + form.phone.replace(/\D/g, ""),
            });

            setPaymentSuccess({
                confirmationNumber: paymentResult.id || "N/A",
                orderId: paymentResult.orderId,
            });
        } else {
            console.error(result);
            alert("Card details invalid.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 backdrop-blur-sm flex justify-center items-center">
            <Script
                src="https://sandbox.web.squarecdn.com/v1/square.js"
                strategy="afterInteractive"
                onLoad={initCard}
            />

            <div className={`relative bg-white p-8 gap-4 rounded-xl shadow-lg w-full ${paymentSuccess ? "max-w-lg" : "sm:max-w-2xl md:max-w-4xl"} flex flex-col ${paymentSuccess ? "" : "md:flex-row"}`}>
                <button
                    onClick={onClose}
                    className="absolute top-2 right-4 text-gray-500 hover:text-red-500 text-3xl font-bold cursor-pointer"
                >
                    ×
                </button>
                
                {paymentSuccess ? (
                    <div className="w-full flex flex-col items-center justify-center p-4">
                        {/* CONFIRMATION SCREEN */}
                        <GiPartyPopper className="text-8xl text-[var(--shpe-blue)] mb-5" />
                        <h2 className="text-3xl font-bold mb-4 text-[var(--shpe-yellow)]">Thank You For Your Support!</h2>

                        <p className="mb-2"><strong>Confirmation #:</strong> <span className="font-mono">{paymentSuccess.confirmationNumber}</span></p>
                        {paymentSuccess.orderId && (
                            <p className="mb-2"><strong>Order ID:</strong> <span className="font-mono">{paymentSuccess.orderId}</span></p>
                        )}

                        <div className="bg-gray-100 rounded p-5 mb-4 text-left inline-block text-sm w-full max-w-md">
                            <p className="mb-2"><strong>Name:</strong> {form.firstName} {form.lastName}</p>
                            <p className="mb-2"><strong>Email:</strong> {form.email}</p>
                            <p className="mb-2"><strong>Phone:</strong> {form.phone}</p>
                            <p className="mb-2"><strong>Item:</strong> {itemName}</p>
                            <p className="mb-2"><strong>Total:</strong> ${(amount / 100).toFixed(2)}</p>
                        </div>
                        <p className="mb-4 text-lg font-bold">
                            Thank you for your {itemName.toLowerCase().includes("sponsorship") ? "sponsorship" : "donation"}!
                        </p>
                    </div>
                ) : (
                    <>
                        {/* CHECKOUT FORM */}
                        {/* Left - User-fill Form */}
                        <div className="flex-1 p-2">
                            <h2 className="text-xl font-bold mb-2">Your Details</h2>
                            <div className="flex gap-4 mb-3">
                                <div className="flex-1">
                                    <input
                                        name="firstName"
                                        type="text" 
                                        placeholder="First Name" 
                                        required
                                        className={`w-full p-2 border rounded ${
                                            formErrors.firstName ? "border-red-500" : "border-gray-300"
                                        } bg-gray-100`}
                                        value={form.firstName}
                                        onChange={handleFormChange}
                                    />
                                    {formErrors.firstName && <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>}
                                </div>
                                <div className="flex-1">
                                    <input
                                        name="lastName"
                                        type="text" 
                                        placeholder="Last Name" 
                                        required
                                        className={`w-full p-2 border rounded ${
                                            formErrors.lastName ? "border-red-500" : "border-gray-300"
                                        } bg-gray-100`}
                                        value={form.lastName}
                                        onChange={handleFormChange}
                                    />
                                    {formErrors.lastName && <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>}
                                </div>
                            </div>

                            <div className="mb-3">
                                <input 
                                    name="email"
                                    type="email" 
                                    placeholder="Email" 
                                    required
                                    className={`w-full p-2 border rounded ${
                                        formErrors.email ? "border-red-500" : "border-gray-300"
                                    } bg-gray-100`}
                                    value={form.email}
                                    onChange={handleFormChange}
                                />
                                {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                            </div>
                            <div className="mb-3">
                                <input 
                                    name="phone" 
                                    type="text"
                                    placeholder="Phone Number" 
                                    required
                                    className={`w-full p-2 border rounded ${
                                        formErrors.phone ? "border-red-500" : "border-gray-300"
                                    } bg-gray-100`}
                                    value={form.phone}
                                    onChange={handleFormChange}
                                />
                                {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                            </div>

                            <h2 className="text-xl font-bold mt-6 mb-2">Card Details</h2>
                            <div ref={cardRef} className="card-input border border-gray-300 bg-gray-100 rounded-md min-h-[120px] p-1" />

                            <button
                                onClick={handlePayment}
                                disabled={!card || createPayment.isPending}
                                className="mt-6 w-full bg-[var(--shpe-yellow)] hover:bg-black text-lg text-white py-3 rounded-md font-semibold cursor-pointer"
                            >
                                {createPayment.isPending ? "Processing..." : "Place Order"}
                            </button>
                        </div>

                        {/* Right - Order Summary */}
                        <div className="w-full md:w-1/3 py-4 text-sm">
                            <div className="p-6 bg-gray-50 rounded-md">
                                <h3 className="font-bold text-xl mb-3">Order Summary</h3>
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
                    </>
                )}
            </div>
        </div>
    );
}
