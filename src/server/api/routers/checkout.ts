import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { squareClient } from "~/lib/square/client";

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
                        customer_nodes_enabled: z.boolean().optional(),
                        policies: z.object({
                            uid: z.string().optional(),
                            title: z.string().optional(),
                            description: z.string().optional(),
                        }).optional(),
                        branding: z.object({
                            header_text: z.string().optional(),
                            button_color: z.string().min(7).max(7).optional(),
                            button_shape: z.enum(["SQUARE", "ROUNDED", "PILL"]).optional(),
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
                        updated_at: z.string().optional(),
                    })
                })
            ).mutation(async ({ input }) => {
                const response = await squareClient.checkout.updateLocationSettings({
                    locationId: input.locationId,
                    locationSettings: {}
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

});