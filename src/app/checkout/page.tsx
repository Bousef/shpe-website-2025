/* eslint-disable @next/next/no-img-element */
"use client"

import { Afterpay, ApplePay, CashAppPay, CreditCard, Divider, GooglePay, PaymentForm } from "react-square-web-payments-sdk";
import Navbar from "~/app/_components/NavBar";
import useEnrichedOrderItems from "~/hooks/useEnrichedOrderItems";
import { api } from "~/trpc/react";

export default function CheckoutPage() {
  const { data: order } = api.user.retrieveCurrentOrder.useQuery();

  // move this inside component along with order summary to prevent conditionally rendering this hook
  const { items, isLoading: isLoadingItems } = useEnrichedOrderItems(order!);

  const { data: member } = api.user.getCurrentMember.useQuery();
  const createPayment = api.square.payments.createPayment.useMutation();

  // SQUARE ENV
  const appId = process.env.NEXT_PUBLIC_SQUARE_SANDBOX_APPLICATION_ID ?? "";
  const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID ?? "";
  if (!appId || !locationId) throw new Error("Square IDs missing.");

  // Totals
  const subtotal = (order?.totalMoney?.amount ?? 0n) / 100n;
  const amountCents = order?.totalMoney?.amount ?? 0n;
  const amountStr = subtotal.toString();

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

    <main className="flex-grow w-full px-4 py-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => history.back()}
          className="mb-6 flex items-center text-sm text-white/80 hover:text-white"
        >
          ← Back
        </button>

        <h1 className="mb-8 text-3xl font-semibold text-white">Checkout</h1>

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
                    if ("token" in token) {
                      console.error("Failed to tokenize card");
                      return;
                    }

                    try {
                      await createPayment.mutateAsync({
                        // token defaults to any on my ts so I have to be explicit here
                        sourceId: (token as { token: string }).token,
                        idempotencyKey: crypto.randomUUID(),
                        // why do i have to convert to unknown first...
                        
                        amountMoney: { amount: BigInt(amountCents), currency: "USD" },
                        buyerEmailAddress: member?.email,
                      });
                      alert("Payment successful! Check your email for the receipt.");
                    } catch (err) {
                      console.error(err);
                      alert("Payment failed. Please try again.");
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
                      (
                        <img
                          src={item.imageUrl ?? ""}
                          alt={item.name ?? ""}
                          className="h-12 w-12 rounded object-contain bg-gray-100"
                        />
                      )
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-800">
                        ${(item.totalMoney?.amount ?? 0n * BigInt(item.quantity)) / 100n}
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
                  <span>$0.00</span>
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
        </div>
      </main>
    </div>
  );
}
