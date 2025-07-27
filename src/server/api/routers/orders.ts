import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { legacyClient, squareClient } from "~/lib/square/client";
import { SortOrder, type OrderLineItem, type OrderLineItemDiscount } from "node_modules/square/api";
import { randomUUID } from "crypto";
import { type BatchRetrieveOrdersRequest, type CreateOrderRequest, type UpdateOrderRequest } from "square/legacy";
import { request } from "http";

export const ordersRouter = createTRPCRouter ({

    // get orders for a specific member/customer
    getOrdersForMember: publicProcedure
        .input(z.object({ 
            customerId: z.string(),
            locationId: z.string().optional(),
            cursor: z.string().optional(), // for pagination
        }))
        .query(async ({ input }) => {
            if (!input.customerId) {
                console.warn("No customer ID provided, skipping Square order fetch.");
                return [];
            }
            try {
                const response = await squareClient.orders.search({
                    locationIds: [process.env.SQUARE_LOCATION_ID!],
                    query: {
                        filter: {
                            customerFilter: {
                                customerIds: [input.customerId],
                            },
                        },
                        sort: {
                            sortField: "CREATED_AT",
                            sortOrder: "DESC",
                        },
                    },
                    cursor: input.cursor, // fetch next page if provided
                    limit: 50,
                });
                
                const orders =  response.orders ?? [];

                // map orders to include payment info (tenders)
                const enrichedOrders = orders.map((order) => ({
                    id: order.id,
                    createdAt: order.createdAt,
                    totalMoney: order.totalMoney,
                    customerId: order.customerId,
                    state: order.state,
                    taxes: order.taxes,
                    lineItems: order.lineItems,
                    tenders: order.tenders?.map((tender) => ({
                        type: tender.type,
                        paymentId: tender.paymentId,
                        amountMoney: tender.amountMoney,
                        cardDetails: tender.cardDetails,
                        cashDetails: tender.cashDetails,
                        status: tender.cardDetails?.status,
                    })) ?? [],
                }));

                return {
                    orders: enrichedOrders,
                    cursor: response.cursor ?? null, // send next cursor for frontend to paginate
                };
            } catch (err) {
                console.error("Error searching orders:", err);
                throw new Error("Could not fetch orders from Square.");
            }
        }),

    // TESTING PURPOSES: create test order
    createTestOrder: publicProcedure
        .mutation(async ({ input }) => {      
            try {
                // create a test customer
                // const customerRes = await squareClient.customers.create({
                //     givenName: "test",
                //     familyName: "user",
                //     emailAddress: `testuser@example.com`,
                //     phoneNumber: "386-334-8553",
                //     referenceId: "test-ref-id",
                //     note: "this is a test customer",
                // });
                // const customerId = customerRes.customer?.id;
                // if (!customerId) throw new Error("Failed to create test customer");

                const customerId = "RT43CR60R77BQ1T0N46SYCW65M";

                // create a test order
                const orderRes = await squareClient.orders.create({
                    idempotencyKey: randomUUID(), // ensures new order everytime
                    order: {
                        referenceId: "my-order-002",
                        locationId: process.env.SQUARE_LOCATION_ID!,
                        customerId,
                        taxes: [
                            {
                                type: "ADDITIVE",
                                percentage: "6.5",
                                scope: "ORDER",
                                name: "State Tax",
                            },
                        ],
                        lineItems: [
                            {
                                name: "Test Product",
                                quantity: "1",
                                basePriceMoney: {
                                    amount: BigInt("1500"), // $15.00
                                    currency: "USD",
                                },
                            },
                            {
                                name: "Coffee",
                                quantity: "2",
                                basePriceMoney: { amount: BigInt(350), currency: "USD" },
                            },
                            {
                                name: "Bagel",
                                quantity: "1",
                                basePriceMoney: { amount: BigInt(250), currency: "USD" },
                            },
                            {
                                name: "T-Shirt",
                                quantity: "2",
                                basePriceMoney: { amount: BigInt(2500), currency: "USD" },
                            },                         
                        ],
                    },
                });

                const order = orderRes.order;

                return {
                    customerId,
                    orderId: order?.id,
                    createdAt: order?.createdAt,
                    totalMoney: order?.totalMoney,
                };
            } catch (err) {
                console.error("Error creating test order:", err);
                throw new Error("Could not create test order.");
            }
        }),

    createOrder: publicProcedure
        .input(
            z.object({
                body: z.custom<CreateOrderRequest>(),
                requestOptions: z.any().optional()
            })
        ).mutation(async({input})=>{
            return await legacyClient.ordersApi.createOrder(
                input.body,
                input.requestOptions
            );
        }),
    
    batchRetrieveOrders: publicProcedure
        .input(
            z.object({
                body: z.custom<BatchRetrieveOrdersRequest>(),
                requestOptions: z.any().optional()
            }))
        .query(async ({input}) =>{
            return await legacyClient.ordersApi.batchRetrieveOrders(
                input.body,
                input.requestOptions
            );
        }),

    calculateOrder: publicProcedure
        .input(
            z.object({
                locationId: z.string(),
                lineItems: z.array(z.object({ 
                    name: z.string(),
                    quantity: z.string(),
                    basePriceMoney: z.object({
                        amount: z.bigint(),
                        currency: z.string(),
                    }).optional(),
                })),
                discounts: z.array(z.object({ 
                    name: z.string(),
                    percentage: z.string(),
                    scope: z.string(),
                })).optional(),
            })
        ).query(async ({ input }) => {
            const response = await squareClient.orders.calculate({
                order: {
                    locationId: input.locationId, 
                    lineItems: input.lineItems as OrderLineItem[] | null, 
                    discounts: input.discounts as OrderLineItemDiscount[] | null,
                }
            });

            // in case of an error, we accumulate all errors into one string and throw them
            // this should probably be handled better...
            if (response.errors && response.errors?.length > 0) {
                throw Error(response.errors.reduce((acc, val) => 
                    acc + val.detail + "\n"
                , ""))
            }

            if (response.order === undefined) {
                throw Error("caculateOrder returned an undefined order. This should not happen.");
            }

            return response.order;
        }),

    cloneOrder: publicProcedure
        .input(
            z.object({
                orderId: z.string(),
                version: z.number(),
                idempotencyKey: z.string(),
            })
        ).query(async ({ input }) => {
            const response = await squareClient.orders.clone({
                ...input
            });

            // in case of an error, we accumulate all errors into one string and throw them
            // this should probably be handled better...
            if (response.errors && response.errors?.length > 0) {
                throw Error(response.errors.reduce((acc, val) => 
                    acc + val.detail + "\n"
                , ""))
            }

            if (response.order === undefined) {
                throw Error("cloneOrder returned an undefined order. This should not happen.");
            }

            return response.order;
        }),

        
    updateOrders: publicProcedure
        .input(
            z.object({
                orderId: z.string(),
                body: z.custom<UpdateOrderRequest>(),
                requestOptions: z.any().optional()
            })
        ).mutation(async ({input}) => {
            const { orderId, body, requestOptions } = input;
            return await legacyClient.ordersApi.updateOrder(
                orderId,
                body,
                requestOptions
            );
        }),

    retrieveOrder: publicProcedure
        .input(
            z.object({
                orderId: z.string(),
                requestOptions: z.any().optional()
            })
        ).query(async ({input}) => {
            const { orderId, requestOptions } = input;
            return await legacyClient.ordersApi.retrieveOrder(
                orderId,
                requestOptions
            );
        }),
    

    
});
