"use client";

import Link from "next/link";
import { api } from "~/trpc/react";
import CartItems from "./CartItems";

export default function CartItemsContainer() {

    // const getImage = (uid: string) => {
    //   const {data, isLoading, error} = api.square.catalog.getImages.useQuery({objectId: uid, includeRelatedObjects: true});

    //   return data?.[0];
    // }


    const {data: order, isLoading, isError, error, refetch} = api.user.retrieveCurrentOrder.useQuery();


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

    return (
        <div className="space-y-6">
          {order === null || order === undefined ? (
            <div className="text-center py-16">
              <div className="card-glass rounded-xl p-8">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 7M13 13v6a1 1 0 01-1 1H8a1 1 0 01-1-1v-6m8 0V9a1 1 0 00-1-1H9a1 1 0 00-1 1v4.01" />
                  </svg>
                </div>
                <h2 className="text-xl font-medium text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-gray-600 mb-6">Add some items to your cart to get started.</p>
                <Link
                  href="/shop"
                  className="inline-flex items-center bg-gradient-to-r from-[#006FCE] to-[#E6451B] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          ) : isLoading ? (
            <div className="card-glass rounded-xl p-8">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="text-gray-600">Loading your cart...</p>
              </div>
            </div>
          ) : isError ? (
            <div className="card-glass rounded-xl p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-600 font-medium">Error loading cart</p>
                <p className="text-gray-600 text-sm mt-1">{error.message}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="card-glass rounded-xl p-6">
                <CartItems order={order} refetch={refetch} />
              </div>

              <div className="card-glass rounded-xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900">
                      ${Number((order?.totalMoney?.amount ?? 0n) / 100n).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order?.lineItems?.length || 0} item{(order?.lineItems?.length || 0) !== 1 ? 's' : ''} in cart
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/shop"
                      className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Continue Shopping
                    </Link>
                    <Link
                      href="/checkout"
                      className="inline-flex items-center justify-center bg-gradient-to-r from-[#006FCE] to-[#E6451B] text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg"
                    >
                      Proceed to Checkout
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
    );
}