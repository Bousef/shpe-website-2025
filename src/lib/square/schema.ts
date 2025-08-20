import { z } from "zod";
import { Currency } from "node_modules/square/api";

// Money object schema
export const moneySchema = z.object({
  amount: z.bigint().optional(),
  currency: z.enum(Currency).optional(),
});

// Order state enum
const orderStateSchema = z.enum([
  "OPEN",
  "COMPLETED",
  "CANCELED",
  "DRAFT",
  "PENDING",
]);

// Order line item modifier schema
const orderLineItemModifierSchema = z.object({
  uid: z.string().optional(),
  catalogObjectId: z.string().optional(),
  catalogVersion: z.bigint().optional(),
  name: z.string().optional(),
  quantity: z.string().optional(),
  basePriceMoney: moneySchema.optional(),
  totalPriceMoney: moneySchema.optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});

// Order line item applied tax schema
const orderLineItemAppliedTaxSchema = z.object({
  uid: z.string().optional(),
  taxUid: z.string(),
  appliedMoney: moneySchema.optional(),
});

// Order line item applied discount schema
const orderLineItemAppliedDiscountSchema = z.object({
  uid: z.string().optional(),
  discountUid: z.string(),
  appliedMoney: moneySchema.optional(),
});

// Order line item schema
const orderLineItemSchema = z.object({
  uid: z.string().optional(),
  name: z.string().optional(),
  quantity: z.string(),
  itemType: z.enum(["ITEM", "CUSTOM_AMOUNT", "GIFT_CARD"]).optional(),
  basePriceMoney: moneySchema.optional(),
  grossSalesMoney: moneySchema.optional(),
  totalTaxMoney: moneySchema.optional(),
  totalDiscountMoney: moneySchema.optional(),
  totalMoney: moneySchema.optional(),
  variationTotalPriceMoney: moneySchema.optional(),
  note: z.string().optional(),
  catalogObjectId: z.string().optional(),
  catalogVersion: z.bigint().optional(),
  variationName: z.string().optional(),
  modifiers: z.array(orderLineItemModifierSchema).optional(),
  appliedTaxes: z.array(orderLineItemAppliedTaxSchema).optional(),
  appliedDiscounts: z.array(orderLineItemAppliedDiscountSchema).optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});

// Order tax schema
const orderTaxSchema = z.object({
  uid: z.string().optional(),
  catalogObjectId: z.string().optional(),
  catalogVersion: z.bigint().optional(),
  name: z.string().optional(),
  type: z.enum(["INCLUSIVE", "ADDITIVE"]).optional(),
  percentage: z.string().optional(),
  appliedMoney: moneySchema.optional(),
  scope: z.enum(["ORDER", "LINE_ITEM"]).optional(),
});

// Order discount schema
const orderDiscountSchema = z.object({
  uid: z.string().optional(),
  catalogObjectId: z.string().optional(),
  catalogVersion: z.bigint().optional(),
  name: z.string().optional(),
  type: z
    .enum([
      "FIXED_PERCENTAGE",
      "FIXED_AMOUNT",
      "VARIABLE_PERCENTAGE",
      "VARIABLE_AMOUNT",
    ])
    .optional(),
  percentage: z.string().optional(),
  amountMoney: moneySchema.optional(),
  appliedMoney: moneySchema.optional(),
  scope: z.enum(["ORDER", "LINE_ITEM"]).optional(),
});

// Order service charge schema
const orderServiceChargeSchema = z.object({
  uid: z.string().optional(),
  name: z.string().optional(),
  catalogObjectId: z.string().optional(),
  catalogVersion: z.bigint().optional(),
  percentage: z.string().optional(),
  amountMoney: moneySchema.optional(),
  appliedMoney: moneySchema.optional(),
  totalMoney: moneySchema.optional(),
  totalTaxMoney: moneySchema.optional(),
  calculationPhase: z.enum(["SUBTOTAL_PHASE", "TOTAL_PHASE"]).optional(),
  taxable: z.boolean().optional(),
  appliedTaxes: z.array(orderLineItemAppliedTaxSchema).optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  type: z.enum(["AUTO_GRATUITY", "CUSTOM"]).optional(),
  treatmentType: z
    .enum(["LINE_ITEM_TREATMENT", "APPORTIONED_TREATMENT"])
    .optional(),
  scope: z.enum(["ORDER"]).optional(),
});

// Order fulfillment recipient schema
const orderFulfillmentRecipientSchema = z.object({
  customerId: z.string().optional(),
  displayName: z.string().optional(),
  emailAddress: z.string().optional(),
  phoneNumber: z.string().optional(),
  address: z
    .object({
      addressLine1: z.string().optional(),
      addressLine2: z.string().optional(),
      addressLine3: z.string().optional(),
      locality: z.string().optional(),
      sublocality: z.string().optional(),
      sublocality2: z.string().optional(),
      sublocality3: z.string().optional(),
      administrativeDistrictLevel1: z.string().optional(),
      administrativeDistrictLevel2: z.string().optional(),
      administrativeDistrictLevel3: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
    })
    .optional(),
});

// Order fulfillment pickup details schema
const orderFulfillmentPickupDetailsSchema = z.object({
  recipient: orderFulfillmentRecipientSchema.optional(),
  expiresAt: z.string().optional(),
  autoCompleteDuration: z.string().optional(),
  scheduleType: z.enum(["SCHEDULED", "ASAP"]).optional(),
  pickupAt: z.string().optional(),
  pickupWindowDuration: z.string().optional(),
  prepTimeDuration: z.string().optional(),
  note: z.string().optional(),
  placedAt: z.string().optional(),
  acceptedAt: z.string().optional(),
  rejectedAt: z.string().optional(),
  readyAt: z.string().optional(),
  expiredAt: z.string().optional(),
  pickedUpAt: z.string().optional(),
  canceledAt: z.string().optional(),
  cancelReason: z.string().optional(),
  isCurbsidePickup: z.boolean().optional(),
  curbsidePickupDetails: z
    .object({
      curbsideDetails: z.string().optional(),
      buyerArrivedAt: z.string().optional(),
    })
    .optional(),
});

// Order fulfillment shipment details schema
const orderFulfillmentShipmentDetailsSchema = z.object({
  recipient: orderFulfillmentRecipientSchema.optional(),
  carrier: z.string().optional(),
  shippingNote: z.string().optional(),
  shippingType: z.string().optional(),
  trackingNumber: z.string().optional(),
  trackingUrl: z.string().optional(),
  placedAt: z.string().optional(),
  inProgressAt: z.string().optional(),
  packagedAt: z.string().optional(),
  expectedShippedAt: z.string().optional(),
  shippedAt: z.string().optional(),
  canceledAt: z.string().optional(),
  cancelReason: z.string().optional(),
  failedAt: z.string().optional(),
  failureReason: z.string().optional(),
});

// Order fulfillment schema
const orderFulfillmentSchema = z.object({
  uid: z.string().optional(),
  type: z.enum(["PICKUP", "SHIPMENT", "DELIVERY"]).optional(),
  state: z
    .enum([
      "PROPOSED",
      "RESERVED",
      "PREPARED",
      "COMPLETED",
      "CANCELED",
      "FAILED",
    ])
    .optional(),
  lineItemApplication: z.enum(["ALL", "ENTRY_LIST"]).optional(),
  entries: z
    .array(
      z.object({
        uid: z.string().optional(),
        lineItemUid: z.string(),
        quantity: z.string(),
        metadata: z.record(z.string(), z.string()).optional(),
      }),
    )
    .optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  pickupDetails: orderFulfillmentPickupDetailsSchema.optional(),
  shipmentDetails: orderFulfillmentShipmentDetailsSchema.optional(),
});

// Order return schema
const orderReturnSchema = z.object({
  uid: z.string().optional(),
  sourceOrderUid: z.string().optional(),
  returnLineItems: z
    .array(
      z.object({
        uid: z.string().optional(),
        sourceLineItemUid: z.string().optional(),
        name: z.string().optional(),
        quantity: z.string(),
        quantityUnit: z
          .object({
            measurementUnit: z
              .object({
                customUnit: z
                  .object({
                    name: z.string(),
                    abbreviation: z.string(),
                  })
                  .optional(),
                areaUnit: z.string().optional(),
                lengthUnit: z.string().optional(),
                volumeUnit: z.string().optional(),
                weightUnit: z.string().optional(),
                genericUnit: z.string().optional(),
                timeUnit: z.string().optional(),
                type: z.string().optional(),
              })
              .optional(),
            precision: z.number().optional(),
            catalogObjectId: z.string().optional(),
            catalogVersion: z.bigint().optional(),
          })
          .optional(),
        note: z.string().optional(),
        catalogObjectId: z.string().optional(),
        catalogVersion: z.bigint().optional(),
        variationName: z.string().optional(),
        itemType: z.enum(["ITEM", "CUSTOM_AMOUNT", "GIFT_CARD"]).optional(),
        returnModifiers: z.array(orderLineItemModifierSchema).optional(),
        appliedTaxes: z.array(orderLineItemAppliedTaxSchema).optional(),
        appliedDiscounts: z
          .array(orderLineItemAppliedDiscountSchema)
          .optional(),
        basePriceMoney: moneySchema.optional(),
        variationTotalPriceMoney: moneySchema.optional(),
        grossReturnMoney: moneySchema.optional(),
        totalTaxMoney: moneySchema.optional(),
        totalDiscountMoney: moneySchema.optional(),
        totalMoney: moneySchema.optional(),
        appliedServiceCharges: z
          .array(
            z.object({
              uid: z.string().optional(),
              serviceChargeUid: z.string(),
              appliedMoney: moneySchema.optional(),
            }),
          )
          .optional(),
        totalServiceChargeMoney: moneySchema.optional(),
      }),
    )
    .optional(),
  returnServiceCharges: z.array(orderServiceChargeSchema).optional(),
  returnTaxes: z.array(orderTaxSchema).optional(),
  returnDiscounts: z.array(orderDiscountSchema).optional(),
  roundingAdjustment: z
    .object({
      uid: z.string().optional(),
      name: z.string().optional(),
      amountMoney: moneySchema.optional(),
    })
    .optional(),
  returnAmounts: z
    .object({
      totalMoney: moneySchema.optional(),
      taxMoney: moneySchema.optional(),
      discountMoney: moneySchema.optional(),
      tipMoney: moneySchema.optional(),
      serviceChargeMoney: moneySchema.optional(),
    })
    .optional(),
});

// Pricing options schema
const pricingOptionsSchema = z.object({
  autoApplyDiscounts: z.boolean().optional(),
  autoApplyTaxes: z.boolean().optional(),
});

// Reward schema
const orderRewardSchema = z.object({
  id: z.string(),
  rewardTierId: z.string(),
});

// Main Order schema
export const orderSchema = z.object({
  id: z.string().optional(),
  locationId: z.string(),
  referenceId: z.string().optional(),
  source: z
    .object({
      name: z.string().optional(),
    })
    .optional(),
  customerId: z.string().optional(),
  lineItems: z.array(orderLineItemSchema).optional(),
  taxes: z.array(orderTaxSchema).optional(),
  discounts: z.array(orderDiscountSchema).optional(),
  serviceCharges: z.array(orderServiceChargeSchema).optional(),
  fulfillments: z.array(orderFulfillmentSchema).optional(),
  returns: z.array(orderReturnSchema).optional(),
  returnAmounts: z
    .object({
      totalMoney: moneySchema.optional(),
      taxMoney: moneySchema.optional(),
      discountMoney: moneySchema.optional(),
      tipMoney: moneySchema.optional(),
      serviceChargeMoney: moneySchema.optional(),
    })
    .optional(),
  netAmounts: z
    .object({
      totalMoney: moneySchema.optional(),
      taxMoney: moneySchema.optional(),
      discountMoney: moneySchema.optional(),
      tipMoney: moneySchema.optional(),
      serviceChargeMoney: moneySchema.optional(),
    })
    .optional(),
  roundingAdjustment: z
    .object({
      uid: z.string().optional(),
      name: z.string().optional(),
      amountMoney: moneySchema.optional(),
    })
    .optional(),
  tenders: z
    .array(
      z.object({
        id: z.string().optional(),
        locationId: z.string().optional(),
        transactionId: z.string().optional(),
        createdAt: z.string().optional(),
        note: z.string().optional(),
        amountMoney: moneySchema,
        tipMoney: moneySchema.optional(),
        processingFeeMoney: moneySchema.optional(),
        customerId: z.string().optional(),
        type: z.enum([
          "CARD",
          "CASH",
          "THIRD_PARTY_CARD",
          "SQUARE_GIFT_CARD",
          "NO_SALE",
          "WALLET",
          "OTHER",
        ]),
        cardDetails: z
          .object({
            status: z.string().optional(),
            card: z
              .object({
                id: z.string().optional(),
                cardBrand: z.string().optional(),
                last4: z.string().optional(),
                expMonth: z.number().optional(),
                expYear: z.number().optional(),
                cardholderName: z.string().optional(),
                billingAddress: z
                  .object({
                    addressLine1: z.string().optional(),
                    addressLine2: z.string().optional(),
                    locality: z.string().optional(),
                    administrativeDistrictLevel1: z.string().optional(),
                    postalCode: z.string().optional(),
                    country: z.string().optional(),
                  })
                  .optional(),
                fingerprint: z.string().optional(),
                customerId: z.string().optional(),
                merchantId: z.string().optional(),
                referenceId: z.string().optional(),
                enabled: z.boolean().optional(),
                cardType: z.string().optional(),
                prepaidType: z.string().optional(),
                bin: z.string().optional(),
              })
              .optional(),
            entryMethod: z.string().optional(),
          })
          .optional(),
        cashDetails: z
          .object({
            buyerTenderedMoney: moneySchema.optional(),
            changeBackMoney: moneySchema.optional(),
          })
          .optional(),
        additionalRecipients: z
          .array(
            z.object({
              locationId: z.string(),
              description: z.string().optional(),
              amountMoney: moneySchema,
              receivableId: z.string().optional(),
            }),
          )
          .optional(),
        paymentId: z.string().optional(),
      }),
    )
    .optional(),
  refunds: z
    .array(
      z.object({
        id: z.string(),
        locationId: z.string(),
        transactionId: z.string().optional(),
        tenderId: z.string(),
        createdAt: z.string().optional(),
        reason: z.string(),
        amountMoney: moneySchema,
        status: z.enum(["PENDING", "APPROVED", "REJECTED", "FAILED"]),
        processingFeeMoney: moneySchema.optional(),
        additionalRecipients: z
          .array(
            z.object({
              locationId: z.string(),
              description: z.string().optional(),
              amountMoney: moneySchema,
              receivableId: z.string().optional(),
            }),
          )
          .optional(),
      }),
    )
    .optional(),
  rewards: z.array(orderRewardSchema).optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  closedAt: z.string().optional(),
  state: orderStateSchema.optional(),
  version: z.number().optional(),
  totalMoney: moneySchema.optional(),
  totalTaxMoney: moneySchema.optional(),
  totalDiscountMoney: moneySchema.optional(),
  totalTipMoney: moneySchema.optional(),
  totalServiceChargeMoney: moneySchema.optional(),
  ticketName: z.string().optional(),
  pricingOptions: pricingOptionsSchema.optional(),
});

export type SquareOrder = z.infer<typeof orderSchema>;
