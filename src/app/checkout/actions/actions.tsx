"use server";

import { SquareClient, SquareEnvironment } from "square";

export async function createPaymentLink() {
  const client = new SquareClient({
    token: process.env.SQUARE_SANDBOX_ACCESS_TOKEN!,
    environment: SquareEnvironment.Sandbox,
  });

  const { paymentLink } = await client.checkout.paymentLinks.create({
    idempotencyKey: crypto.randomUUID(),
    quickPay: {
      name: "Actual Shirt",
      priceMoney: {
        amount: BigInt("2999"), // $29.99
        currency: "USD",
      },
      locationId: process.env.SQUARE_LOCATION_ID!,
    },
  });

  return paymentLink?.url;
}
