/* eslint-disable @next/next/no-img-element */
"use client"

import { Afterpay, ApplePay, CashAppPay, CreditCard, Divider, GooglePay, PaymentForm } from "react-square-web-payments-sdk";
import Navbar from "~/app/_components/NavBar";
import useEnrichedOrderItems from "~/hooks/useEnrichedOrderItems";
import { api } from "~/trpc/react";
import { useState } from "react";

export default function CheckoutPage() {
  const utils = api.useUtils();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { data: order } = api.user.retrieveCurrentOrder.useQuery();

  // move this inside component along with order summary to prevent conditionally rendering this hook
  const { items, isLoading: isLoadingItems } = useEnrichedOrderItems(order!);

  const { data: member } = api.user.getCurrentMember.useQuery();
  const createPayment = api.square.payments.createPayment.useMutation();
  const payOrder = api.square.orders.payOrder.useMutation();
  const updateOrder = api.square.orders.updateOrder.useMutation();
  const batchChangeInventory = api.square.inventory.batchChangeInventory.useMutation();
  const createNewOrder = api.square.orders.createOrder.useMutation();

  // Complete checkout process: payment + inventory reduction + order completion
  const completeCheckout = async (token: { token: string }) => {
    if (!order?.id) {
      throw new Error("No order found");
    }

    try {
      // Step 1: Update order state from DRAFT to OPEN (required for payment)
      await updateOrder.mutateAsync({
        orderId: order.id,
        order: {
          ...order,
          state: "OPEN",
        },
      });

      // Step 2: Create payment linked to the order
      const paymentResponse = await createPayment.mutateAsync({
        sourceId: token.token,
        idempotencyKey: crypto.randomUUID(),
        amountMoney: { amount: BigInt(amountCents), currency: "USD" },
        buyerEmailAddress: member?.email,
        orderId: order.id, // Link payment to order
      });

      // Step 3: Pay the order (marks it as completed in Square)
      await payOrder.mutateAsync({
        orderId: order.id,
        idempotencyKey: crypto.randomUUID(),
        paymentIds: [paymentResponse.id!],
      });

      // Step 4: Reduce inventory for each item
      const inventoryChanges = order.lineItems?.map((item) => ({
        type: "ADJUSTMENT" as const,
        adjustment: {
          catalogObjectId: item.catalogObjectId!,
          locationId: locationId,
          quantity: item.quantity!, // Positive quantity for the adjustment
          fromState: "IN_STOCK" as const,
          toState: "SOLD" as const,
          occurredAt: new Date().toISOString(),
        },
      })) || [];

      if (inventoryChanges.length > 0) {
        await batchChangeInventory.mutateAsync({
          body: {
            idempotencyKey: crypto.randomUUID(),
            changes: inventoryChanges,
          },
        });
      }

      // Step 5: Create a new empty draft order for future purchases (clears the cart)
      if (member?.square_customer_id) {
        await createNewOrder.mutateAsync({
          idempotency_Key: crypto.randomUUID(),
          order: {
            locationId: locationId,
            customerId: member.square_customer_id,
            state: "DRAFT",
            lineItems: [], // Empty cart for future purchases
          },
        });
      }

      // Step 6: Invalidate queries to refresh the UI with new order data
      await utils.user.retrieveCurrentOrder.invalidate();

      return paymentResponse;
    } catch (error) {
      console.error("Checkout failed:", error);
      throw error;
    }
  };

  // SQUARE ENV
  const appId = process.env.NEXT_PUBLIC_SQUARE_SANDBOX_APPLICATION_ID ?? "";
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? "";
  if (!appId || !locationId) throw new Error("Square IDs missing.");

  // Totals
  const subtotal = Number((order?.totalMoney?.amount ?? 0n) / 100n);
  const amountCents = order?.totalMoney?.amount ?? 0n;
  const amountStr = (subtotal.toFixed(2)).toString();

  const createPaymentRequest = () => ({
      countryCode: "US",
      currencyCode: "USD",
      total: { amount: amountStr, label: "Total" },
      requestBillingContact: true,
      requestShippingContact: false,
  });

  const billingContact = {
      givenName: member?.first_name ?? "",
      familyName: member?.last_name ?? "",
      email: member?.email ?? "",
      countryCode: "US",
  };

  return (
  <div className="min-h-screen flex flex-col bg-gradient-brand">
    <Navbar />

    {/* Payment Processing Overlay */}
    {isProcessingPayment && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white/90 p-8 rounded-xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-900">Processing payment...</p>
          <p className="text-sm text-gray-600 mt-2">Please wait while we complete your order</p>
        </div>
      </div>
    )}

    <main className="flex-grow w-full px-4 py-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => history.back()}
          className="mb-6 flex items-center text-sm text-white/80 hover:text-white"
        >
          ← Back
        </button>

        <h1 className="mb-8 text-3xl font-semibold text-white">Checkout</h1>

        {!order || !order.lineItems || order.lineItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="rounded-xl bg-white/90 border border-white/20 backdrop-blur-sm p-8">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
              <button
                onClick={() => window.location.href = "/shop"}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* LEFT */}
          <section className="space-y-8">
            {/* Contact */}
            <div className="rounded-xl bg-white/90 border border-white/20 backdrop-blur-sm p-6">
              <h2 className="mb-4 text-lg font-medium text-gray-900">Contact</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Phone number"
                  defaultValue=""
                />
                <input
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm sm:col-span-2"
                  placeholder="Email address for receipt"
                  defaultValue={member?.email ?? ""}
                />
                <input
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="First name"
                  defaultValue={member?.first_name ?? ""}
                />
                <input
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Last name"
                  defaultValue={member?.last_name ?? ""}
                />
              </div>
              <p className="mt-3 text-xs text-gray-500">
                By providing your contact info, you may receive updates from Square.
              </p>
            </div>

            {/* Payment */}
            <div className="rounded-xl bg-white/90 border border-white/20 backdrop-blur-sm p-6">
              <h2 className="mb-4 text-lg font-medium text-gray-900">Payment</h2>
              <p className="mb-4 text-xs text-gray-500">
                All transactions are secure and encrypted.
              </p>

              {amountCents > 0 ? (
                <PaymentForm
                  key={amountCents}
                  applicationId={appId}
                  locationId={locationId}
                  createPaymentRequest={createPaymentRequest}
                  createVerificationDetails={() => ({
                    amount: amountStr,
                    currencyCode: "USD",
                    intent: "CHARGE",
                    billingContact,
                  })}
                  cardTokenizeResponseReceived={async (token, _buyer) => {
                    if ("errors" in token) {
                      console.error("Failed to tokenize card:", token.errors);
                      alert("Failed to process card. Please check your card details and try again.");
                      return;
                    }

                    setIsProcessingPayment(true);
                    try {
                      await completeCheckout(token as { token: string });
                      alert("Payment successful! Your order has been completed, inventory updated, and your cart is ready for new purchases. Check your email for the receipt.");
                      
                      // Small delay to ensure all async operations complete
                      setTimeout(() => {
                        window.location.href = "/shop";
                      }, 1000);
                    } catch (err) {
                      console.error(err);
                      alert(`Payment failed: ${err instanceof Error ? err.message : "Please try again."}`);
                      setIsProcessingPayment(false);
                    }
                  }}
                >
                  <div className="space-y-5 mt-6">
                    {/* Credit Card */}
                    <section className="card-glass rounded-xl p-5">
                      <h3 className="mb-3 text-sm font-semibold text-gray-800">Credit card</h3>
                      <CreditCard
                        buttonProps={{
                          className:
                            "btn-gradient-brand w-full rounded-full py-3 text-white font-semibold shadow-md hover:opacity-90 disabled:opacity-50",
                        }}
                      />
                    </section>

                    {/* Digital Wallets row */}
                    <div className="grid grid-cols-2 gap-4">
                      <CashAppPay />
                      <Afterpay buttonType="checkout_with_afterpay" />
                    </div>
                    <Divider />

                    {/* Wallets row */}
                    <div className="grid grid-cols-2 gap-4">
                      <GooglePay buttonType="long" buttonSizeMode="fill" />
                      <ApplePay /> 
                    </div>
                  </div>
                </PaymentForm>

              ) : (
                <p className="text-sm text-gray-500">Add items to your cart to pay.</p>
              )}
            </div>
          </section>

          {/* RIGHT: Summary */}
          <aside className="space-y-6">
            <div className="rounded-xl bg-white/90 border border-white/20 backdrop-blur-sm p-6">
              <h2 className="mb-4 text-lg font-medium text-gray-900">Order summary ({order?.lineItems?.length ?? 0})</h2>

              <div className="mt-4 space-y-3">
                {!items ? (
                  <p className="text-sm text-gray-500">No items in cart</p>
                ) : isLoadingItems ? (
                  <p className="text-sm text-gray-500">Loading…</p>
                ) : (
                  items.map((item) => (
                    <div key={item.uid} className="flex items-start gap-4">
                      {item.imageUrl && item.imageUrl.trim() !== "" ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name ?? ""}
                          className="h-12 w-12 rounded object-contain bg-gray-100"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
                          <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-800">
                        ${Number((item.basePriceMoney?.amount ?? 0n) / 100n).toFixed(2)}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${amountStr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes</span>
                  <span>${Number(order?.totalTaxMoney?.amount ?? 0n).toFixed(2)}</span>
                </div>
                <hr className="my-2 border-gray-200" />
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>Order total</span>
                  <span>${amountStr}</span>
                </div>
              </div>
              </div>
            </aside>
      </div>
      )}
      </div>
    </main>
    </div>
  );
}
