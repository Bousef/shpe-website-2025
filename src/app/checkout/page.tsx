"use client";

import React, { useState } from "react";
import Image from "next/image";
//  
import { SquareClient } from "square";


type CheckoutItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type Address = {
  fullName: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal: string;
  country: string;
};

export default function Checkout() {
  /* ----------------------- cart ----------------------- */
  const [items, setItems] = useState<CheckoutItem[]>([
    {
      id: "1",
      name: "Supreme Tee",
      image: "/placeholder.jpg",
      price: 25,
      quantity: 2,
    },
    {
      id: "2",
      name: "Bucket Hat",
      image: "/placeholder.jpg",
      price: 18,
      quantity: 1,
    },
  ]);

  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);

  const increment = (id: string) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, quantity: it.quantity + 1 } : it,
      ),
    );

  const decrement = (id: string) =>
    setItems((prev) =>
      prev.flatMap((it) =>
        it.id === id
          ? it.quantity > 1
            ? [{ ...it, quantity: it.quantity - 1 }]
            : []
          : [it],
      ),
    );

  /* -------------------- address form ------------------ */
  const [addr, setAddr] = useState<Address>({
    fullName: "",
    email: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal: "",
    country: "",
  });

  const handleAddr = (key: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddr({ ...addr, [key]: e.target.value });

  /* -------------------- payment stub ------------------ */
  const handlePayNow = () => {
    const required = [
      "fullName",
      "email",
      "line1",
      "city",
      "state",
      "postal",
      "country",
    ] as (keyof Address)[];
    const missing = required.filter((k) => !addr[k].trim());

    if (items.length === 0) {
      alert("Your cart is empty.");
    } else if (missing.length) {
      alert("Please fill in all required address fields.");
    } else {
      alert(
        `Pretend we charge the card here.\n\nOrder total: $${total.toFixed(
          2,
        )}\nShipping to: ${addr.fullName}, ${addr.line1}, ${addr.city}`,
      );
      // TODO: Send to real payment gateway / backend.
      
    }
  };
  
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-10">
      <h1 className="text-3xl font-bold">Checkout</h1>

      {/* ---------- Cart ---------- */}
      {items.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <section>
            <h2 className="mb-4 text-xl font-semibold">Your items</h2>
            <ul className="space-y-6">
              {items.map((it) => (
                <li key={it.id} className="flex items-center gap-4">
                  <Image
                    src={it.image}
                    alt={it.name}
                    width={80}
                    height={80}
                    className="rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{it.name}</p>
                    <p className="text-sm text-gray-500">
                      ${it.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrement(it.id)}
                      className="h-8 w-8 rounded border"
                    >
                      −
                    </button>
                    <span className="w-8 text-center">{it.quantity}</span>
                    <button
                      onClick={() => increment(it.id)}
                      className="h-8 w-8 rounded border"
                    >
                      +
                    </button>
                  </div>
                  <p className="w-16 text-right font-medium">
                    ${(it.price * it.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </section>

          {/* ---------- Address ---------- */}
          <section>
            <h2 className="mb-4 text-xl font-semibold">Shipping address</h2>
            <div className="space-y-4">
              {/* contact */}
              <input
                className="w-full rounded border px-3 py-2"
                placeholder="Full name *"
                value={addr.fullName}
                onChange={handleAddr("fullName")}
              />
              <div className="flex gap-4">
                <input
                  className="flex-1 rounded border px-3 py-2"
                  placeholder="Email *"
                  type="email"
                  value={addr.email}
                  onChange={handleAddr("email")}
                />
                <input
                  className="flex-1 rounded border px-3 py-2"
                  placeholder="Phone"
                  type="tel"
                  value={addr.phone}
                  onChange={handleAddr("phone")}
                />
              </div>

              {/* address lines */}
              <input
                className="w-full rounded border px-3 py-2"
                placeholder="Address line 1 *"
                value={addr.line1}
                onChange={handleAddr("line1")}
              />
              <input
                className="w-full rounded border px-3 py-2"
                placeholder="Address line 2"
                value={addr.line2}
                onChange={handleAddr("line2")}
              />

              {/* city / state / postal */}
              <div className="flex gap-4">
                <input
                  className="flex-1 rounded border px-3 py-2"
                  placeholder="City *"
                  value={addr.city}
                  onChange={handleAddr("city")}
                />
                <input
                  className="flex-1 rounded border px-3 py-2"
                  placeholder="State / Province *"
                  value={addr.state}
                  onChange={handleAddr("state")}
                />
                <input
                  className="flex-1 rounded border px-3 py-2"
                  placeholder="Postal code *"
                  value={addr.postal}
                  onChange={handleAddr("postal")}
                />
              </div>

              {/* country */}
              <input
                className="w-full rounded border px-3 py-2"
                placeholder="Country *"
                value={addr.country}
                onChange={handleAddr("country")}
              />
            </div>
          </section>

          {/* ---------- Pay ---------- */}
          <button
            onClick={handlePayNow}
            className="w-full rounded bg-blue-900 py-3 font-medium text-white hover:bg-blue-800"
          >
            Pay now
          </button>
        </>
      )}
    </div>
  );
}
