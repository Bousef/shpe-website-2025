import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { squareClient } from "~/lib/square/client";
import type {
  Address,
  CashPaymentDetails,
  Currency,
  CustomerDetails,
  ExternalPaymentDetails,
  OfflinePaymentDetails,
  Payment,
} from "node_modules/square/api";

export const paymentsRouter = createTRPCRouter({
  listPayments: publicProcedure
    .input(
      z.object({
        beginTime: z.string().optional(),
        endTime: z.string().optional(),
        sortOrder: z.enum(["ASC", "DESC"]).default("DESC"),
        cursor: z.string().optional(),
        locationId: z.string().optional(),
        total: z.bigint().optional(),
        last4: z.string().optional(),
        cardBrand: z.string().optional(),
        limit: z.number().max(100).default(100),
        isOfflinePayment: z.boolean().optional(),
        offlineBeginTime: z.string().optional(),
        offlineEndTime: z.string().optional(),
        updatedAtBeginTime: z.string().optional(),
        updatedAtEndTime: z.string().optional(),
        sortField: z
          .enum(["CREATED_AT", "OFFLINE_CREATED_AT", "UPDATED_AT"])
          .default("CREATED_AT"),
      }),
    )
    .query(async ({ input }) => {
      const response = await squareClient.payments.list({
        beginTime: input.beginTime,
        endTime: input.endTime,
        sortOrder: input.sortOrder,
        cursor: input.cursor,
        locationId: input.locationId,
        total: input.total,
        last4: input.last4,
        cardBrand: input.cardBrand,
        limit: input.limit,
        isOfflinePayment: input.isOfflinePayment,
        offlineBeginTime: input.offlineBeginTime,
        offlineEndTime: input.offlineEndTime,
        updatedAtBeginTime: input.updatedAtBeginTime,
        updatedAtEndTime: input.updatedAtEndTime,
        sortField: input.sortField,
      });

      return response;
    }),

  createPayment: publicProcedure
    .input(
      z.object({
        sourceId: z.string().min(1),
        idempotencyKey: z.string().min(1).max(45),
        amountMoney: z
          .object({
            amount: z.bigint().min(0n),
            currency: z.custom<Currency>(),
          })
          .optional(),
        tipMoney: z
          .object({
            amount: z.bigint().min(0n),
            currency: z.custom<Currency>(),
          })
          .optional(),
        appFeeMoney: z
          .object({
            amount: z.bigint().min(0n),
            currency: z.custom<Currency>(),
          })
          .optional(),
        delayDuration: z.string().optional(),
        delayAction: z.enum(["CANCEL", "COMPLETE"]).default("CANCEL"),
        orderId: z.string().optional(),
        customerId: z.string().optional(),
        locationId: z.string().optional(),
        teamMemberId: z.string().optional(),
        referenceId: z.string().max(40).optional(),
        verificationToken: z.string().optional(),
        acceptPartialAuthorization: z.boolean().default(false),
        buyerEmailAddress: z.string().max(255).optional(),
        buyerPhoneNumber: z.string().optional(),
        billingAddress: z.custom<Address>().optional(),
        shippingAddress: z.custom<Address>().optional(),
        note: z.string().max(500).optional(),
        statementDescriptionIdentifier: z.string().max(20).optional(),
        cashDetails: z.custom<CashPaymentDetails>().optional(),
        externalDetails: z.custom<ExternalPaymentDetails>().optional(),
        customerDetails: z.custom<CustomerDetails>().optional(),
        offlinePaymentDetails: z.custom<OfflinePaymentDetails>().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const response = await squareClient.payments.create({
        sourceId: input.sourceId,
        idempotencyKey: input.idempotencyKey,
        amountMoney: input.amountMoney,
        tipMoney: input.tipMoney,
        appFeeMoney: input.appFeeMoney,
        delayDuration: input.delayDuration,
        delayAction: input.delayAction,
        orderId: input.orderId,
        customerId: input.customerId,
        locationId: input.locationId,
        teamMemberId: input.teamMemberId,
        referenceId: input.referenceId,
        verificationToken: input.verificationToken,
        acceptPartialAuthorization: input.acceptPartialAuthorization,
        buyerEmailAddress: input.buyerEmailAddress,
        buyerPhoneNumber: input.buyerPhoneNumber,
        billingAddress: input.billingAddress,
        shippingAddress: input.shippingAddress,
        note: input.note,
        statementDescriptionIdentifier: input.statementDescriptionIdentifier,
        cashDetails: input.cashDetails,
        externalDetails: input.externalDetails,
        customerDetails: input.customerDetails,
        offlinePaymentDetails: input.offlinePaymentDetails,
      });

      // in case of an error, we accumulate all errors into one string and throw them
      // this should probably be handled better...
      if (response.errors && response.errors?.length > 0) {
        throw Error(
          response.errors.reduce((acc, val) => acc + val.detail + "\n", ""),
        );
      }

      if (response.payment === undefined) {
        throw Error(
          "createPayment returned an undefined payment. This should not happen.",
        );
      }

      return response.payment;
    }),

  cancelPaymentByIdempotencyKey: publicProcedure
    .input(
      z.object({
        idempotencyKey: z.string().min(1).max(45),
      }),
    )
    .mutation(async ({ input }) => {
      const response = await squareClient.payments.cancelByIdempotencyKey({
        idempotencyKey: input.idempotencyKey,
      });

      // in case of an error, we accumulate all errors into one string and throw them
      // this should probably be handled better...
      if (response.errors && response.errors?.length > 0) {
        throw Error(
          response.errors.reduce((acc, val) => acc + val.detail + "\n", ""),
        );
      }

      return response;
    }),

  getPayment: publicProcedure
    .input(
      z.object({
        paymentId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const response = await squareClient.payments.get({
        paymentId: input.paymentId,
      });

      // in case of an error, we accumulate all errors into one string and throw them
      // this should probably be handled better...
      if (response.errors && response.errors?.length > 0) {
        throw Error(
          response.errors.reduce((acc, val) => acc + val.detail + "\n", ""),
        );
      }

      if (response.payment === undefined) {
        throw Error(
          "getPayment returned an undefined payment. This should not happen.",
        );
      }

      return response.payment;
    }),

  updatePayment: publicProcedure
    .input(
      z.object({
        paymentId: z.string(),
        payment: z.custom<Payment>(),
        idempotencyKey: z.string().min(1).max(45),
      }),
    )
    .mutation(async ({ input }) => {
      const response = await squareClient.payments.update({
        paymentId: input.paymentId,
        payment: input.payment,
        idempotencyKey: input.idempotencyKey,
      });

      // in case of an error, we accumulate all errors into one string and throw them
      // this should probably be handled better...
      if (response.errors && response.errors?.length > 0) {
        throw Error(
          response.errors.reduce((acc, val) => acc + val.detail + "\n", ""),
        );
      }

      if (response.payment === undefined) {
        throw Error(
          "updatePayment returned an undefined payment. This should not happen.",
        );
      }

      return response.payment;
    }),

  cancelPayment: publicProcedure
    .input(
      z.object({
        paymentId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const response = await squareClient.payments.cancel({
        paymentId: input.paymentId,
      });

      // in case of an error, we accumulate all errors into one string and throw them
      // this should probably be handled better...
      if (response.errors && response.errors?.length > 0) {
        throw Error(
          response.errors.reduce((acc, val) => acc + val.detail + "\n", ""),
        );
      }

      if (response.payment === undefined) {
        throw Error(
          "cancelPayment returned an undefined payment. This should not happen.",
        );
      }

      return response.payment;
    }),

  completePayment: publicProcedure
    .input(
      z.object({
        paymentId: z.string(),
        versionToken: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const response = await squareClient.payments.complete({
        paymentId: input.paymentId,
        versionToken: input.versionToken,
      });

      // in case of an error, we accumulate all errors into one string and throw them
      // this should probably be handled better...
      if (response.errors && response.errors?.length > 0) {
        throw Error(
          response.errors.reduce((acc, val) => acc + val.detail + "\n", ""),
        );
      }

      if (response.payment === undefined) {
        throw Error(
          "completePayment returned an undefined payment. This should not happen.",
        );
      }

      return response.payment;
    }),
});
