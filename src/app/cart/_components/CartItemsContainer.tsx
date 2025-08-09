/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { orders } from "node_modules/square/api";
import { useState } from "react";
import { api } from "~/trpc/react";

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

export default function CartItemsContainer({ items: initialItems }: { items: CartItem[] }) {
    const [items, setItems] = useState(initialItems);

    const getImage = (uid: string) => {
      const {data, isLoading, error} = api.square.catalog.getImages.useQuery({objectId: uid, includeRelatedObjects: true});

      return data?.[0];
    }

    

    const {data: currentOrder, isLoading, error} = api.user.retrieveCurrentOrder.useQuery();

    // const updateItemQuantity = api.user.cart.updateItemQuantity.useMutation({
    //     onSuccess: () => {
    //         return;
    //     },
    // });

    // const removeItem = api.user.cart.removeItem.useMutation({
    //     onSuccess: () => {
    //         return;
    //     },
    // });

    // const updateQuantityAction = (id: number, qty: number) => {
    //     updateItemQuantity.mutate({ id, quantity: qty });
    // };

    // const removeItemAction = (id: number) => {
    //     removeItem.mutate({ id });
    // };

    if (currentOrder === null || currentOrder === undefined) {
        return <p className="text-gray-600">No items in your cart.</p>;
    }



    return <>
        
        <div className="space-y-6">
          {currentOrder.lineItems?.map((item) => {
            return (
            <div
              key={item.uid}
              className="flex items-center gap-4 border-b pb-4"
            >

              <img
                src={getImage(item.uid!)} // this should be a placeholder image 
                alt={item.name ?? ""}
                className="w-20 h-20 object-contain bg-gray-100 rounded"
              />

              <div className="flex-1">
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-gray-600">${(item.totalMoney?.amount ?? 0n) / 100n}</p>
                <div className="mt-2 flex items-center gap-2">
                  <label className="text-sm">Qty:</label>
                  <select
                    value={item.quantity}
                    // onChange={(e) => {
                    //   const newQuantity = parseInt(e.target.value);

                    //   item.quantity = newQuantity;

                    //   updateQuantityAction(item.id, newQuantity);
                    // }}
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
                // onClick={() => {
                //     setItems((prevItems) => prevItems.filter((item2) => item.id !== item2.id));
                //     removeItemAction(item.uid);
                // }}
                className="text-sm text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
            );
          })}

          <div className="text-right pt-4 border-t">
            <p className="text-lg font-semibold">
              Subtotal: ${(currentOrder?.totalMoney?.amount ?? 0n) / 100n}
            </p>
            <Link
            href ="/checkout"
            className="mt-4 bg-yellow-500 text-black font-bold px-6 py-2 rounded hover:bg-yellow-600">
              Checkout
            </Link>
          </div>
        </div>
      
    </>
}