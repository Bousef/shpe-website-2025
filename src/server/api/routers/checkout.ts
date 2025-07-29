import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { squareClient } from "~/lib/square/client";
import { min } from "drizzle-orm";

export const checkoutRouter = createTRPCRouter({
        retrieveLocationSettings: publicProcedure
            .input(
                z.object({
                    locationId: z.string(),
                })
            ).query(async ({ input }) => {
                const response = await squareClient.checkout.retrieveLocationSettings({
                    locationId: input.locationId
                });
    
                // in case of an error, we accumulate all errors into one string and throw them
                // this should probably be handled better...
                if (response.errors && response.errors?.length > 0) {
                    throw Error(response.errors.reduce((acc, val) => 
                        acc + val.detail + "\n"
                    , ""))
                }
    
                if (response.locationSettings === undefined) {
                    throw Error("retrieveLocationSettings returned an undefined locationSettings. This should not happen.");
                }

                return response.locationSettings;
            }),

        updateLocationSettings: publicProcedure
            .input(
                z.object({
                    locationId: z.string(),
                    locationSettings: z.object({
                        locationId: z.string().optional(),
                        customerNodesEnabled: z.boolean().optional(),
                        policies: z.array(z.object({
                            uid: z.string().optional(),
                            title: z.string().max(50).optional(),
                            description: z.string().max(4096).optional(),
                        })).max(2).optional(),
                        branding: z.object({
                            headerType: z.enum(["BUSINESS_NAME", "FRAMED_LOGO", "FULL_WIDTH_LOGO"]).optional(),
                            buttonColor: z.string().min(7).max(7).optional(),
                            buttonShape: z.enum(["SQUARED", "ROUNDED", "PILL"]).optional(),
                        }),
                        tipping: z.object({
                            percentages: z.array(z.number().min(3)).optional(),
                            smart_tipping_enabled: z.boolean().optional(),
                            default_percentage: z.number().optional(),
                            smart_tips: z.array(z.object({
                                amount: z.number().optional(),
                                currency: z.string().optional(),
                            })).optional(),
                            default_smart_tip: z.object({
                                amount: z.number().optional(),
                                currency: z.string().optional(),
                            }).optional(),
                        }).optional(),
                        coupons: z.object({
                            enabled: z.boolean().optional(),
                        }).optional(),
                        updatedAt: z.string().optional(),
                    })
                })
            ).mutation(async ({ input }) => {
                const response = await squareClient.checkout.updateLocationSettings({
                    locationId: input.locationId,
                    locationSettings: input.locationSettings
                });
    
                // in case of an error, we accumulate all errors into one string and throw them
                // this should probably be handled better...
                if (response.errors && response.errors?.length > 0) {
                    throw Error(response.errors.reduce((acc, val) => 
                        acc + val.detail + "\n"
                    , ""))
                }
    
                if (response.locationSettings === undefined) {
                    throw Error("retrieveLocationSettings returned an undefined locationSettings. This should not happen.");
                }

                return response.locationSettings;
            }),

        retrieveMerchantSettings: publicProcedure.query(async () => {
                const response = await squareClient.checkout.retrieveMerchantSettings();
    
                // in case of an error, we accumulate all errors into one string and throw them
                // this should probably be handled better...
                if (response.errors && response.errors?.length > 0) {
                    throw Error(response.errors.reduce((acc, val) => 
                        acc + val.detail + "\n"
                    , ""))
                }
    
                if (response.merchantSettings === undefined) {
                    throw Error("retrieveMerchantSettings returned an undefined merchantSettings. This should not happen.");
                }

                return response.merchantSettings;
            }),
        
        updateMerchantSettings: publicProcedure
            .input(z.object({
                merchant_settings: z.object({
                    payment_methods: z.object({
                        apple_pay: z.object({
                            enabled: z.boolean().optional(),
                        }),
                        google_pay: z.object({
                            enabled: z.boolean().optional(),
                        }),
                        cash_app: z.object({
                            enabled: z.boolean().optional(),
                        }),
                        afterpay_clearpay: z.object({
                            order_eligibility_range: z.object({
                                min: z.object({
                                    amount: z.number().min(0).optional(),
                                    currency: z.string().optional(),
                                }),
                                max: z.object({
                                    amount: z.number().min(0).optional(),
                                    currency: z.string().optional(),
                                }),
                            }).optional(),
                            item_eligibility_range: z.object({
                                min: z.object({
                                    amount: z.number().min(0).optional(),
                                    currency: z.string().optional(),
                                }),
                                max: z.object({
                                    amount: z.number().min(0).optional(),
                                    currency: z.string().optional(),
                                }),
                            }).optional(),
                            enabled: z.boolean().optional(),
                        }),
                    }).optional(),
                    updatedAt: z.string().optional(),
                })
            
            })).query(async ({ input }) => {
                const response = await squareClient.checkout.updateMerchantSettings({
                    merchantSettings: input.merchant_settings
                });

                // in case of an error, we accumulate all errors into one string and throw them
                // this should probably be handled better...
                if (response.errors && response.errors?.length > 0) {
                    throw Error(response.errors.reduce((acc, val) => 
                        acc + val.detail + "\n"
                    , ""))
                }
    
                if (response.merchantSettings === undefined) {
                    throw Error("retrieveMerchantSettings returned an undefined merchantSettings. This should not happen.");
                }

                return response.merchantSettings;
            }),
});