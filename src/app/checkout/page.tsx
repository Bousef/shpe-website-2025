"use client";

import { createPaymentLink } from "./actions/actions";

export default function CheckoutPage() {
  const handleClick = async () => {
    const url = await createPaymentLink();
    if (url) window.location.href = url;
    else alert("Failed to create payment link.");
  };

  return (
    <main className="p-10 text-center">
      <h1 className="text-2xl font-bold mb-6">Nice SHPE shirt</h1>
      <button
        onClick={handleClick}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Pay $29.99
      </button>
    </main>
  );
}

