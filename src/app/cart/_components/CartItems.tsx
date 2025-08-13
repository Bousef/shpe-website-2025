import type { Order } from "node_modules/square/api";
import Image from "next/image";
import useEnrichedOrderItems from "~/hooks/useEnrichedOrderItems";
import { api } from "~/trpc/react";

export default function CartItems({ order, refetch }: { order: Order, refetch: () => void }) {
    const { items, isLoading, isError, error} = useEnrichedOrderItems(order);
    const updateOrder = api.square.orders.updateOrder.useMutation({
        onSuccess: () => {
            console.log("Order updated successfully");
            // Trigger a rerender on success
            refetch();
        }
    });

    const deleteItem = (itemId: string) => {
        console.log("Old fields: ", order.lineItems);
        const updatedOrder = order.lineItems?.filter(item => item.uid !== itemId);
        console.log(updatedOrder);
        console.log("order:", order);

        if (!order.id) return;

        updateOrder.mutate({
            orderId: order.id,
            order: {
                ...order,
                lineItems: updatedOrder,
            },
            fieldsToClear: [
                `line_items[${itemId}]`,
            ]
        });
    }

    const updateItemQuantity = (itemId: string, quantity: number) => {
        console.log("Old fields: ", order.lineItems);
        const updatedOrder = order.lineItems?.map(item => {
            if (item.uid === itemId) {
                return {
                    ...item,
                    quantity: quantity.toString(),
                };
            }
            return item;
        });

        if (!order.id) return;

        updateOrder.mutate({
            orderId: order.id,
            order: {
                ...order,
                lineItems: updatedOrder,
            },
        });
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading items...</span>
            </div>
        );
    }

    if (isError && error) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p className="text-red-600 font-medium">Error loading items</p>
                <p className="text-gray-600 text-sm mt-1">{error.message}</p>
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <p className="text-gray-600">No items in your cart</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {updateOrder.isPending && (
                <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Updating cart...
                </div>
            )}
            
            {items.map((item, index) => {
                return (
                    <div
                        key={item.uid}
                        className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 py-6 transition-all duration-200 ${index !== items.length - 1 ? 'border-b border-gray-200' : ''} ${updateOrder.isPending ? 'opacity-70 pointer-events-none' : ''}`}
                    >
                        <div className="flex-shrink-0">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                                <Image
                                    src={item.imageUrl || "/assets/logo.svg"}
                                    alt={item.name ?? ""}
                                    width={96}
                                    height={96}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                            <p className="text-xl font-bold text-gray-900 mb-2 sm:mb-0">
                                ${Number((item.basePriceMoney?.amount ?? 0n) / 100n).toFixed(2)}
                            </p>
                            
                            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-gray-700">Qty:</label>
                                    <select 
                                        defaultValue={item.quantity}
                                        disabled={updateOrder.isPending}
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-w-[80px] disabled:opacity-50 disabled:cursor-not-allowed"
                                        onChange={(e) => {
                                            const newQuantity = parseInt(e.target.value);
                                            if (!item.uid) return;
                                            updateItemQuantity(item.uid, newQuantity);
                                        }}
                                    >
                                        {[...Array<number>(10)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    onClick={() => {
                                        if (!item.uid) return;
                                        deleteItem(item.uid);
                                    }}
                                    disabled={updateOrder.isPending}
                                    className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Remove
                                </button>
                            </div>
                        </div>

                        <div className="flex-shrink-0 text-left sm:text-right w-full sm:w-auto">
                            <p className="text-lg font-bold text-gray-900">
                                ${(Number((item.basePriceMoney?.amount ?? 0n) / 100n) * parseInt(item.quantity || "1")).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                ${Number((item.basePriceMoney?.amount ?? 0n) / 100n).toFixed(2)} each
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}