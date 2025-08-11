"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import CartItems from "./CartItems";

export default function CartItemsContainer() {

    // const getImage = (uid: string) => {
    //   const {data, isLoading, error} = api.square.catalog.getImages.useQuery({objectId: uid, includeRelatedObjects: true});

    //   return data?.[0];
    // }


    const {data: order, isLoading, isError, error} = api.user.retrieveCurrentOrder.useQuery();


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

    return <>
        <div className="space-y-6">
          { order === null || order === undefined ?
            <p className="text-gray-600">No items in your cart.</p> :
              isLoading ? <p>Loading order...</p> :
              isError ? <p className="text-red-600">Error loading order: {error.message}</p> :
            <CartItems order={order} />
          }

          <div className="text-right pt-4 border-t">
            <p className="text-lg font-semibold">
              Subtotal: ${(order?.totalMoney?.amount ?? 0n) / 100n}
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