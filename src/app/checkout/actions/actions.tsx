"use server";
import { SquareClient, SquareEnvironment } from "square";

type PaymentRequest = {
  token: string;
  amount: number;  // in cents
  buyerEmail?: string;
};

export async function createPayment({ token, amount, buyerEmail }: PaymentRequest) {
  const client = new SquareClient({
    token: process.env.SQUARE_SANDBOX_ACCESS_TOKEN!,
    environment: SquareEnvironment.Sandbox,
    version: "2025-07-16",
  });

  const response = await client.payments.create({
    sourceId: token,
    idempotencyKey: crypto.randomUUID(),
    amountMoney: {
      amount: BigInt(amount),  // amount in cents
      currency: "USD",
    },
    autocomplete: true,
    locationId: process.env.SQUARE_LOCATION_ID!,
    buyerEmailAddress: buyerEmail,  // for receipt link generation
  });

  const payment = response.payment;

  return payment;
}
