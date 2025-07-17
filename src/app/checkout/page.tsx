"use client";

import { CreditCard, PaymentForm } from "react-square-web-payments-sdk"

export default async function Checkout() {
  const squareApplicationId = process.env.SQUARE_SANDBOX_APPLICATION_ID ?? "";
  const squareLocationId = process.env.SQUARE_LOCATION_ID ?? "";

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <PaymentForm
        applicationId={squareApplicationId}
        locationId={squareLocationId}
        cardTokenizeResponseReceived={async (token) => {
          console.log("Card Token:", token);
        }}
      >
        <CreditCard />
      </PaymentForm>
    </div>
  );
}