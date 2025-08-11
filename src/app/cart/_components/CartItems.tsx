/* eslint-disable @next/next/no-img-element */
import type { Order } from "node_modules/square/api";
import useEnrichedOrderItems from "~/hooks/useEnrichedOrderItems";
import { api } from "~/trpc/react";

export default function CartItems({ order, refetch }: { order: Order, refetch: () => void }) {
    const { items, isLoading, isError, error} = useEnrichedOrderItems(order);
    const updateOrder = api.square.orders.updateOrder.useMutation({
        onSuccess: () => {
            console.log("test");
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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError && error) {
        return <div>Error: {error.message}</div>;
    }

    if (!items) {
        return <div>No items in cart</div>;
    }

    return <div>
        {items.map((item) => {
            return (
                <div
                    key={item.uid}
                    className="flex items-center gap-4 border-b pb-4"
                >
                <img
                    src={item.imageUrl ?? ""} // this should be a placeholder image 
                    alt={item.name ?? ""}
                    className="w-20 h-20 object-contain bg-gray-100 rounded"
                />
                <div className="flex-1">
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-gray-600">${(item.totalMoney?.amount ?? 0n) / 100n}</p>
                <div className="mt-2 flex items-center gap-2">
                    <label className="text-sm">Qty:</label>
                    <select
                    defaultValue={item.quantity}
                    // onChange={(e) => {
                    //   const newQuantity = parseInt(e.target.value);

                    //   item.quantity = newQuantity;

                    //   updateQuantityAction(item.id, newQuantity);
                    // }}
                    className="border px-2 py-1"
                    >
                    {[...Array<number>(10)].map((_, i) => (
                        <option key={i + 1} defaultValue={i + 1}>
                        {i + 1}
                        </option>
                    ))}
                    </select>
                </div>
                </div>

                <button
                    onClick={() => {
                        if (!item.uid) return;

                        deleteItem(item.uid);
                    }}
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
    </div>
}