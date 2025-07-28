"use client";

import { useEffect, useState } from "react";
import { ArrowRightCircle } from "lucide-react";

const ITEM_ID = "RXJH5DVHSI7IFB3W2LYFIE3P";
const VARIATION_IDS = {
  5: "LZMBJ5YTBGQJDCFOILK6F33I",
  10: "R2RVPKSNOMADFPJSQ54S6NMU",
  25: "KHYBKYFJJPIABII4T2VEBSQH",
  custom: "QLINLX5GXWSUBEA2MKOSU435",
};

export default function ChapterPage() {
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
          name: object?.name ?? "Chapter Contribution",
        });
      } catch (err) {
        console.error("Failed to fetch item info:", err);
        setItemInfo({ name: "Chapter Contribution" });
      }
    };

    fetchItem();
  }, []);

  return (
    <main className="min-h-screen bg-white py-12 px-4 flex justify-center">
      <div className="max-w-3xl w-full rounded-3xl shadow-xl p-8">
        <h1 className="text-4xl sm:text-5xl font-semibold text-center text-[var(--shpe-yellow)] mb-6 drop-shadow-md">
          {itemInfo?.name || "Chapter Contribution"}
        </h1>

        <p className="text-lg text-black text-center leading-relaxed mb-8">
          As a nonprofit organization, we look to provide additional resources and assistance to our local community. We believe that it is important to use our talents to help those in need. From your donation, we can create more opportunities and assistance for our members and chapter. Regardless of the amount, thank you for providing aid.
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
            placeholder="Custom Amount"
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
