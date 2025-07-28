"use client";

import { useEffect, useState } from "react";
import { ArrowRightCircle } from "lucide-react";

const ITEM_ID = "2VJ3PNTMTHIVOROECMOCNO2X"; // Outreach item ID (use the correct one)
const VARIATION_IDS = {
  5: "CPXFJDES4OYCMFKZOOSOQDWO",
  10: "FJDUGVMTPINEK57HYFRNP6TH",
  25: "WUM7PW2UNFKY4MUB7PNX2N6T",
  custom: "UDIYKBBBCP2QDBH5TCSRJJNB",
};

export default function OutreachPage() {
  const [customAmount, setCustomAmount] = useState("");
  const [itemInfo, setItemInfo] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(`/api/square/get-item?id=${ITEM_ID}`);
        if (!res.ok) throw new Error(`Status: ${res.status}`);
        const data = await res.json();

        const object = data.object?.itemData;
        setItemInfo({
          name: object?.name ?? "SHPE JR. OUTREACH PROGRAM",
        });
      } catch (err) {
        console.error("Failed to fetch item info:", err);
        setItemInfo({ name: "SHPE JR. OUTREACH PROGRAM" });
      }
    };

    fetchItem();
  }, []);

  return (
    <main className="min-h-screen bg-white py-12 px-4 flex justify-center">
      <div className="max-w-3xl w-full rounded-3xl shadow-xl p-8">
        <h1 className="text-4xl sm:text-5xl font-semibold text-center text-[var(--shpe-yellow)] mb-6 drop-shadow-md">
          {itemInfo?.name || "SHPE JR. OUTREACH PROGRAM"}
        </h1>

        <p className="text-lg text-black text-center leading-relaxed mb-8">
          The Society of Hispanic Professional Engineers at UCF is involved directly with our local community with our outreach program - the SHPE Jr. Program. It is a STEM based initiative set forward to inspire local high school students to achieve their highest potential and pursue post-secondary education. Members from SHPE UCF volunteer their time to meet with these students and offer their experience, put on technical workshops, and mentoring. Parents and students benefit from college prep workshops designed to educate them on the process of applying to college and looking for financial aid. Through UCF SHPE Jr, students receive the benefits of working first hand with UCF students and receiving valuable insight in learning how to better prepare themselves to take on new challenges and optimizing their own college experience. Your donation will assist us with materials that will further our reach and involvement with our community. Thank you for your donation!
        </p>

        <div className="flex justify-center gap-4 mb-8">
          {[5, 10, 25].map((amount) => (
            <button
              key={amount}
              className="px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-black hover:text-white transition shadow-md border border-black"
              onClick={() => setCustomAmount(amount.toString())}
            >
              ${amount.toFixed(2)}
            </button>
          ))}
        </div>

        <form
          method="POST"
          action="/api/square/process-payment"
          className="space-y-4"
        >
          <input type="hidden" name="variationId" value={VARIATION_IDS.custom} />
          <input
            type="number"
            step="0.01"
            min="1"
            name="amount"
            placeholder="Custom amount"
            className="w-full text-center py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
          />
          <input
            type="text"
            name="name"
            placeholder="Full name"
            required
            className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            required
            className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
          />
          <input
            type="text"
            name="cardNumber"
            placeholder="Card number"
            required
            className="w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
          />
          <div className="flex gap-4">
            <input
              type="text"
              name="cvc"
              placeholder="CVC"
              required
              className="w-1/3 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
            <input
              type="text"
              name="zip"
              placeholder="ZIP Code"
              required
              className="w-2/3 py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-[var(--shpe-yellow)] text-white font-bold px-8 py-4 rounded-full shadow-lg hover:bg-black hover:text-white transition text-xl w-full flex items-center justify-center gap-2"
          >
            Donate <ArrowRightCircle className="w-5 h-5" />
          </button>
        </form>
      </div>
    </main>
  );
}

