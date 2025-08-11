"use client";

import { useMutation } from "@tanstack/react-query";
import type { Card as SquareCard } from "node_modules/square/api";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { env } from "~/env";
import { api } from "~/trpc/react";
import type { GeneralSchema, PaymentSchema } from "./page";
import FieldError from "./FieldError";

type TokenizeResponse = {
  token: string;
  status: "OK" | "Unknown";
  errors?: { detail: string }[];
};

type Card = SquareCard & {
  attach: (selector: string) => Promise<void>;
  tokenize: () => Promise<TokenizeResponse>;
};

declare global {
  interface Window {
    Square: {
      payments: (
        applicationId: string,
        locationId?: string,
      ) => {
        card: () => Promise<Card>;
      };
    };
  }
}

export default function PaymentSection() {
  const {
    setValue,
    formState: { errors },
  } = useFormContext<PaymentSchema>();
  const squareInitialized = useRef(false);
  const { getValues } = useFormContext<GeneralSchema>();
  const [card, setCard] = useState<Card>();
  const { mutateAsync: createCustomer } =
    api.square.customers.createCustomer.useMutation();
  const { mutateAsync: createOrder } =
    api.square.orders.createOrder.useMutation();
  const { mutateAsync: createPayment } =
    api.square.payments.createPayment.useMutation();
  const paymentMutation = useMutation({
    mutationKey: ["square-payment"],
    mutationFn: async () => {
      if (!card) throw new Error("Card not initialized");
      const { token } = await card.tokenize();
      const customerData = getValues();
      const customer = await createCustomer({
        idempotencyKey: crypto.randomUUID(),
        givenName: customerData.firstName,
        familyName: customerData.lastName,
        emailAddress: customerData.email,
        phoneNumber: customerData.phoneNumber,
      });
      const order = await createOrder({
        idempotencyKey: crypto.randomUUID(),
        order: {
          customerId: customer.id,
          lineItems: [
            {
              catalogObjectId: env.NEXT_PUBLIC_SHPE_MEMBERSHIP_ITEM_ID,
              quantity: "1",
            },
          ],
        },
      });
      const payment = await createPayment({
        idempotencyKey: crypto.randomUUID(),
        sourceId: token,
        amountMoney: { amount: 1000n, currency: "USD" },
        orderId: order.id,
      });
      if (!payment.id) throw new Error("Payment ID is missing");
      setValue("paymentId", payment.id);
    },
  });

  useEffect(() => {
    async function initializeSquarePayment() {
      squareInitialized.current = true;
      const payments = window.Square.payments(
        env.NEXT_PUBLIC_SQUARE_APPLICATION_ID,
      );
      const card = await payments.card();
      setCard(card);
      await card.attach("#card");
    }

    if (
      typeof window !== "undefined" &&
      window.Square &&
      !squareInitialized.current
    ) {
      void initializeSquarePayment();
    }
  }, []);

  return (
    <>
      <div id="card"></div>
      <FieldError error={errors.paymentId} />
      <button
        type="button"
        onClick={() => paymentMutation.mutate()}
        disabled={!card || paymentMutation.isPending}
      >
        pay
      </button>
      {paymentMutation.isPending && <p>Processing payment...</p>}
      {paymentMutation.isError && (
        <p>Error processing payment: {paymentMutation.error.message}</p>
      )}
      {paymentMutation.isSuccess && <p>Payment successful!</p>}
    </>
  );
}
