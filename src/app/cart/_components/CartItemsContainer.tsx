/* eslint-disable @next/next/no-img-element */
"use client";

type CartItem = {
    id: number;
    name: string | null;
    category: string;
    image: string | null;
    description: string | null;
    price: number;
    quantity: number;
    createdAt: Date | null;
};

export default function CartItemsContainer({ items }: { items: CartItem[] }) {
     const updateQuantity = (id: number, qty: number) => {
       return;
    };

    const removeItem = (id: number) => {
        return;
    };

    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return <>
        {items.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b pb-4"
            >
              <img
                src={item.image ?? ""} // this should be a placeholder image 
                alt={item.name ?? ""}
                className="w-20 h-20 object-contain bg-gray-100 rounded"
              />

              <div className="flex-1">
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <label className="text-sm">Qty:</label>
                  <select
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value))
                    }
                    className="border px-2 py-1"
                  >
                    {[...Array<number>(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="text-right pt-4 border-t">
            <p className="text-lg font-semibold">
              Subtotal: ${subtotal.toFixed(2)}
            </p>
            <button className="mt-4 bg-yellow-500 text-black font-bold px-6 py-2 rounded hover:bg-yellow-600">
              Checkout
            </button>
          </div>
        </div>
      )}
    </>
}